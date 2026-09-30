"use client";

import { useEffect, useSyncExternalStore } from "react";
import { MUSIC_SRC, SOUND_EVENT, getSoundState, initSound, setSound } from "./sound";

const subscribe = (cb: () => void) => {
  window.addEventListener(SOUND_EVENT, cb);
  return () => window.removeEventListener(SOUND_EVENT, cb);
};

/* Floating ambient-sound toggle, bottom right. On by default; turning it off
   is remembered on this device. The bars dance while it plays; while the
   browser is still holding the sound back, it pulses and a click starts it. */
export default function SoundToggle() {
  const state = useSyncExternalStore(subscribe, getSoundState, () => "off" as const);
  const on = state === "on";

  useEffect(initSound, []);

  if (!MUSIC_SRC.length) return null;

  return (
    <button
      type="button"
      className="sound-btn"
      data-state={state}
      aria-pressed={on}
      aria-label="Ambient sound"
      title={on ? "Turn sound off" : "Turn sound on"}
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
