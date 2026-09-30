import type { Howl } from "howler";

/* Ambient loop: 0:00–1:35 of Background-Sound.mp3, trimmed, +6 dB, with short
   edge fades so the seam is click-free. The toggle stays hidden while this is empty. */
export const MUSIC_SRC: string[] = ["/sound/Ambient-Loop.mp3"];

/* Loading sound effect: 0:05–0:10 of Loading-Animation.mp3, −6 dB (the source
   clips), short edge fades. Plays with the intro video, which runs 5.1s at 1x. */
const SFX_SRC = ["/sound/Intro-Sfx.mp3"];
const SFX_VOLUME = 0.8;

export const SOUND_EVENT = "hackieee:sound";

const STORAGE_KEY = "hackieee-sound";
const VOLUME = 0.4;
const FADE_MS = 900;

let on = false;
let howler: typeof import("howler") | null = null;
let howlerLoading: Promise<unknown> | null = null;
let music: Howl | null = null;
let musicId: number | undefined;
let sfx: Howl | null = null;
/* The music waits for the intro animation to finish (see Intro.tsx). */
let introDone = false;
/* A play() is in flight — loading, or waiting for autoplay to be allowed.
   howler queues calls made meanwhile and can strand them, so everything
   waits for the "play" event instead. */
let starting = false;
/* Browsers refuse to start sound before the visitor has clicked, tapped or
   pressed a key on the page (scrolling doesn't count). While that holds the
   music back, the toggle says so instead of claiming it's playing. */
let blocked = false;

export type SoundState = "off" | "on" | "blocked";
export const getSoundState = (): SoundState => (!on ? "off" : blocked ? "blocked" : "on");

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
    // Web Audio (not html5): the loop is sample-accurate, with no gap at the seam.
    loop: true,
    volume: 0,
    // Created during the intro, so the track is decoded by the time it lifts.
    preload: true,
  });
  howl.on("play", () => {
    starting = false;
    setBlocked(false);
    sync();
  });
  howl.on("fade", sync);
  // HTML5 fallback (no Web Audio): retry on the first interaction. The Web Audio
  // path needs nothing here — howler holds play() until the context resumes.
  howl.on("playerror", () => {
    starting = false;
    setBlocked(true);
    howl.once("unlock", sync);
  });
  howl.on("loaderror", (_id, err) => {
    console.warn("[sound] could not load music:", err);
    starting = false;
    blocked = false;
    on = false;
    emit();
  });
  return howl;
}

function setBlocked(next: boolean) {
  if (blocked === next) return;
  blocked = next;
  emit();
}

/* Steers the music toward what it should be doing: playing at VOLUME while
   the toggle is on, the intro is over and the tab is visible; paused otherwise. */
function sync() {
  const howl = music;
  if (!howl || starting) return;

  const want = on && introDone && !document.hidden;
  const playing = howl.playing(musicId);
  if (want && !playing) {
    starting = true;
    if (howl.state() === "unloaded") howl.load();
    musicId = howl.play(musicId);
    // A suspended context only needs a click if the page has had none yet
    // (howler also suspends it itself after a while paused in a hidden tab).
    const ctx = howler?.Howler.ctx;
    if (ctx && ctx.state !== "running" && !navigator.userActivation?.hasBeenActive) setBlocked(true);
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

/* The intro's "click to enter" is up: fetch howler now rather than at idle
   and decode the sound effect, so both are ready when the click comes. */
export function primeSound() {
  void loadHowler().then(() => {
    if (howler && !sfx) sfx = new howler.Howl({ src: SFX_SRC, volume: SFX_VOLUME, preload: true });
  });
}

/* Called inside the intro's entering click/tap/key. Resuming the audio context
   there is what the browser requires; after that, the sound effect and the
   music may start whenever — no further click needed for this visit. */
export function unlockSound() {
  void howler?.Howler.ctx?.resume().catch(() => {});
}

/* Started by the intro once its video is actually playing, so the two line up. */
export function playIntroSfx() {
  if (on && sfx) sfx.play();
}

/* Called by the intro as it lifts (or right away when it's skipped — then no
   click has happened yet, and the toggle waits for one). */
export function releaseSound() {
  introDone = true;
  apply();
}

export function setSound(next: boolean) {
  // Inside the click: this is what lets a blocked context start.
  if (next) void howler?.Howler.ctx?.resume().catch(() => {});
  on = next;
  try {
    localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
  } catch {}
  emit();
  apply();
}

/* Mount-time setup: restore the saved choice (on unless the visitor turned
   it off before), warm up howler, and pause while the tab is hidden.
   Returns the cleanup for useEffect. */
export function initSound() {
  if (!MUSIC_SRC.length) return;

  try {
    on = localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    on = true;
  }
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
