import type { Howl } from "howler";

/* Background music. Put the track in public/audio/ and list it here —
   Opus/WebM first, MP3 as the fallback, e.g. ["/audio/theme.webm", "/audio/theme.mp3"].
   The navbar toggle stays hidden while this is empty. */
export const MUSIC_SRC: string[] = [];

export const SOUND_EVENT = "hackieee:sound";

const STORAGE_KEY = "hackieee-sound";
const VOLUME = 0.4;
const FADE_MS = 900;

let on = false;
let howler: typeof import("howler") | null = null;
let howlerLoading: Promise<unknown> | null = null;
let music: Howl | null = null;
let musicId: number | undefined;
/* A play() is in flight. howler queues calls made meanwhile and, with HTML5
   audio, can strand them — so everything waits for the "play" event instead. */
let starting = false;

export const isSoundOn = () => on;

const emit = () => window.dispatchEvent(new Event(SOUND_EVENT));

/* howler stays out of the first bundle. It is fetched once the page is idle,
   so a click on the toggle can create the Howl inside the gesture — importing
   it alone creates no AudioContext. */
const loadHowler = () =>
  (howlerLoading ??= import("howler").then((mod) => {
    howler = mod;
  }));

function createMusic({ Howl }: typeof import("howler")) {
  const howl = new Howl({
    src: MUSIC_SRC,
    html5: true, // stream instead of decoding the whole track into memory
    loop: true,
    volume: 0,
    preload: false, // nothing is downloaded until someone opts in
  });
  howl.on("play", () => {
    starting = false;
    sync();
  });
  howl.on("fade", sync);
  // Autoplay was blocked (e.g. a remembered "on" after reload): retry on the first interaction.
  howl.on("playerror", () => {
    starting = false;
    howl.once("unlock", sync);
  });
  howl.on("loaderror", (_id, err) => {
    console.warn("[sound] could not load music:", err);
    starting = false;
    on = false;
    emit();
  });
  return howl;
}

/* Steers the music toward what it should be doing: playing at VOLUME while
   the toggle is on and the tab is visible, paused otherwise. */
function sync() {
  const howl = music;
  if (!howl || starting) return;

  const want = on && !document.hidden;
  const playing = howl.playing(musicId);
  if (want && !playing) {
    starting = true;
    if (howl.state() === "unloaded") howl.load();
    musicId = howl.play(musicId);
    return;
  }
  if (!playing) return;

  const from = howl.volume();
  const to = want ? VOLUME : 0;
  if (!want && (document.hidden || from === 0)) {
    // Hidden tabs throttle timers, so skip the fade there.
    howl.pause();
    howl.volume(0);
  } else if (from !== to) {
    // Guarded because fade(x, x) never fires its "fade" event.
    howl.fade(from, to, FADE_MS);
  }
}

function apply() {
  if (on && !music) {
    if (!howler) return void loadHowler().then(apply);
    music = createMusic(howler);
  }
  sync();
}

export function setSound(next: boolean) {
  on = next;
  try {
    localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
  } catch {}
  emit();
  apply();
}

/* Mount-time setup: restore the saved choice, warm up howler, and pause
   while the tab is hidden. Returns the cleanup for useEffect. */
export function initSound() {
  if (!MUSIC_SRC.length) return;

  try {
    on = localStorage.getItem(STORAGE_KEY) === "on";
  } catch {}
  emit();

  // Safari has no requestIdleCallback.
  const warmUp = () => void loadHowler().then(apply);
  const hasIdle = "requestIdleCallback" in window;
  const handle = hasIdle ? requestIdleCallback(warmUp) : window.setTimeout(warmUp, 1200);
  document.addEventListener("visibilitychange", sync);

  return () => {
    if (hasIdle) cancelIdleCallback(handle);
    else window.clearTimeout(handle);
    document.removeEventListener("visibilitychange", sync);
  };
}
