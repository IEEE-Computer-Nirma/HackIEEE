"use client";

import { useEffect, useSyncExternalStore } from "react";
import { MUSIC_SRC, SOUND_EVENT, initSound, isSoundOn, setSound } from "./sound";

const subscribe = (cb: () => void) => {
  window.addEventListener(SOUND_EVENT, cb);
  return () => window.removeEventListener(SOUND_EVENT, cb);
};

/* Background-music toggle. Off by default; the bars dance while it plays. */
export default function SoundToggle() {
  const on = useSyncExternalStore(subscribe, isSoundOn, () => false);

  useEffect(initSound, []);

  if (!MUSIC_SRC.length) return null;

  return (
    <button
      type="button"
      className="sound-btn"
      aria-pressed={on}
      aria-label="Background music"
      title={on ? "Mute music" : "Play music"}
      onClick={() => setSound(!on)}
    >
      <span className="sound-bars" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
    </button>
  );
}
