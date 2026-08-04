/* ================================================================
   A LETTER FOR SOMEONE WHO CHANGED MY WORLD
   Script
   ================================================================
   HOW THIS FILE IS ORGANIZED
   0. CONFIG               <- 99% of personalization happens here
   1. Small helpers
   2. Scene machine (showScene, chapter dots)
   3. Ambient background (hearts + petals)
   4. Music (lightweight synthesized piano — no audio file needed)
   5. Scene 1  Cover / password
   6. Scene 2  Welcome
   7. Scene 3  Garden
   8. Scene 4  Envelope
   9. Scene 5  Letter
   10. Scene 6 Signature (+ Easter egg)
   11. Scene 7 Secret
   12. Scene 8 Ending
   13. Boot
   ================================================================ */

/* ----------------------------------------------------------------
   0. CONFIG — edit everything about the letter from right here.
   ---------------------------------------------------------------- */
const CONFIG = {
  // The secret word. Comparison is case-insensitive and trims spaces.
  password: "smiles",

  // Shown when the wrong word is entered.
  wrongPasswordMessage: "Not quite... try the word that reminds me of you.",

  // Welcome scene, written out letter by letter.
  welcomeSentence: "Every love story begins with a smile...",

  // Text on the ribbon in the garden scene.
  ribbonText: "For my Mama Mhlungu.",

  // Two-line title shown at the top of the letter.
  letterTitle: ["To My Mama Mhlungu,", "My Momo Smiles"],

  // The letter itself. Each entry is one sentence.
  // `fx` (optional) fires a little animation the moment that
  // sentence appears. Valid values:
  //   "hearts"   - tiny hearts float up
  //   "sparkles" - sparkles twinkle around the letter
  //   "blush"    - a soft pink glow washes over the page
  //   "stars"    - little stars twinkle
  //   "cooldown" - petals pause and the palette turns cooler
  //   "bloom"    - flowers bloom around the page and warmth returns
  letterSentences: [
    { text: "Every love story begins with a smile — and yours has never once let me go.", fx: "hearts" },
    { text: "I still remember the first time your laughter caught me off guard, loud, unfiltered, and completely you.", fx: "sparkles" },
    { text: "Your cheeks go soft and pink whenever you're trying not to smile at something silly I said, and I live for that exact second.", fx: "blush" },
    { text: "Even your braces catch the light when you grin like nothing in the world could touch you.", fx: "stars" },
    { text: "And when you leave the room, even for a minute, everything goes a little quieter, a little colder — like the sun stepped out too.", fx: "cooldown" },
    { text: "But you always come back. You always do.", fx: null },
    { text: "So hear this clearly, in case you've ever doubted it for even a second — you are seen, you are chosen, and you are loved.", fx: "bloom" },
    { text: "Thank you for being the softest place I have ever landed.", fx: null }
  ],

  signatureLine: "Yours,",
  signatureName: "Bigduggmustfall ❤️",

  // How many times the little heart must be tapped to unlock the
  // secret scene.
  easterEggClicks: 5,

  secretMessage: "Every smile you've ever given me is still living rent-free in my heart. Thank you for being my Momo Smiles.",
  polaroidCaption: "us, always",

  psSentence: "P.S. Every time you smile, somewhere there is a boy smiling too."
};

/* ----------------------------------------------------------------
   1. SMALL HELPERS
   ---------------------------------------------------------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const rand = (min, max) => Math.random() * (max - min) + min;

const prefersReducedMotion =
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ----------------------------------------------------------------
   2. SCENE MACHINE
   ---------------------------------------------------------------- */
const DOT_SCENES = ["welcome", "garden", "envelope", "letter", "signature"];

function updateChapterDots(name) {
  const nav = $("#chapter-dots");
  if (DOT_SCENES.includes(name)) {
    nav.classList.add("visible");
    $$(".dot", nav).forEach((d) => d.classList.toggle("active", d.dataset.scene === name));
  } else {
    nav.classList.remove("visible");
  }
}

// Registered per-scene "on enter" behaviour (populated further down).
const SCENE_INIT = {};

function showScene(name) {
  const current = $(".scene.active");
  const next = document.getElementById("scene-" + name);
  if (!next || current === next) return;

  if (current) {
    current.classList.remove("active");
    current.classList.add("exiting");
    setTimeout(() => current.classList.remove("exiting"), 1600);
  }

  // Force a reflow so the entrance transition reliably replays.
  void next.offsetWidth;
  next.classList.add("active");

  updateChapterDots(name);
  if (SCENE_INIT[name]) SCENE_INIT[name]();
}

/* ----------------------------------------------------------------
   3. AMBIENT BACKGROUND — floating hearts + drifting petals
   These run continuously from the cover page through the secret
   scene, then stop for the night-sky ending.
   ---------------------------------------------------------------- */
let heartTimer = null;
let petalTimer = null;
let ambientPetalsPaused = false; // set true during the "cooldown" letter moment

function spawnHeart() {
  const layer = document.getElementById("ambient-hearts");
  const el = document.createElement("span");
  el.className = "ambient-heart";
  el.textContent = Math.random() > 0.5 ? "❤" : "♥";
  el.style.left = rand(2, 96) + "vw";
  el.style.bottom = "-30px";
  el.style.fontSize = rand(12, 26) + "px";
  const dur = rand(7, 13);
  el.style.animationDuration = dur + "s";
  layer.appendChild(el);
  setTimeout(() => el.remove(), dur * 1000 + 200);
}

function spawnPetal() {
  const layer = document.getElementById("ambient-petals");
  const el = document.createElement("span");
  el.className = "ambient-petal";
  el.style.left = rand(2, 96) + "vw";
  el.style.top = "-5vh";
  const size = rand(8, 15);
  el.style.width = size + "px";
  el.style.height = size * 1.4 + "px";
  el.style.setProperty("--drift", rand(-90, 90) + "px");
  const dur = rand(8, 14);
  el.style.animationDuration = dur + "s";
  layer.appendChild(el);
  setTimeout(() => el.remove(), dur * 1000 + 200);
}

function startAmbient() {
  if (prefersReducedMotion) return;
  if (!heartTimer) heartTimer = setInterval(spawnHeart, 950);
  if (!petalTimer) {
    petalTimer = setInterval(() => {
      if (!ambientPetalsPaused) spawnPetal();
    }, 750);
  }
}

function stopAmbient() {
  clearInterval(heartTimer);
  clearInterval(petalTimer);
  heartTimer = null;
  petalTimer = null;
}

/* ----------------------------------------------------------------
   4. MUSIC
   A soft, looping music-box style pad synthesized in the browser
   with the Web Audio API — no external mp3 required, so the site
   works the moment it's hosted on GitHub Pages. To use a real
   recording instead, uncomment the <audio id="bg-music"> tag in
   index.html and swap startMusic()/stopMusic() below to control
   that element instead.
   ---------------------------------------------------------------- */
let audioCtx = null;
let masterGain = null;
let musicTimer = null;
let musicPlaying = false;
let patternIndex = 0;

const NOTE_FREQS = { C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.0, A4: 440.0, B4: 493.88, D5: 587.33 };
const PATTERN = ["C4", "E4", "G4", "B4", "D5", "B4", "G4", "E4"];

function ensureAudioCtx() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    audioCtx = new Ctx();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(audioCtx.destination);
  }
  return audioCtx;
}

function playNote(freq, startTime, duration, gain) {
  const osc = audioCtx.createOscillator();
  const noteGain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  noteGain.gain.setValueAtTime(0, startTime);
  noteGain.gain.linearRampToValueAtTime(gain, startTime + 0.5);
  noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  osc.connect(noteGain);
  noteGain.connect(masterGain);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.1);
}

function scheduleLoop() {
  const now = audioCtx.currentTime + 0.05;
  const note = PATTERN[patternIndex % PATTERN.length];
  playNote(NOTE_FREQS[note], now, 2.4, 0.05);
  if (patternIndex % 4 === 0) {
    playNote(NOTE_FREQS.C4 / 2, now, 3.8, 0.03); // low, warm undertone
  }
  patternIndex++;
  musicTimer = setTimeout(scheduleLoop, 950);
}

function startMusic() {
  ensureAudioCtx();
  if (audioCtx.state === "suspended") audioCtx.resume();
  musicPlaying = true;
  masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
  masterGain.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 1.4);
  scheduleLoop();
  const btn = $("#music-toggle");
  btn.classList.add("playing");
  btn.setAttribute("aria-pressed", "true");
  btn.setAttribute("aria-label", "Pause music");
}

function stopMusic() {
  musicPlaying = false;
  clearTimeout(musicTimer);
  if (audioCtx) {
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.8);
  }
  const btn = $("#music-toggle");
  btn.classList.remove("playing");
  btn.setAttribute("aria-pressed", "false");
  btn.setAttribute("aria-label", "Play soft piano music");
}

function fadeOutMusicSlow(durationMs) {
  if (!audioCtx || !musicPlaying) return;
  masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
  masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + durationMs / 1000);
  setTimeout(() => {
    clearTimeout(musicTimer);
    musicPlaying = false;
    $("#music-toggle").classList.remove("playing");
  }, durationMs + 200);
}

/* ----------------------------------------------------------------
   5. SCENE 1 — COVER / PASSWORD
   ---------------------------------------------------------------- */
function initCoverScene() {
  const form = $("#password-form");
  const input = $("#password-input");
  const error = $("#password-error");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = input.value.trim().toLowerCase();

    if (value.length && value === CONFIG.password.trim().toLowerCase()) {
      unlockLetter();
    } else {
      input.classList.remove("shake");
      void input.offsetWidth; // restart the shake animation
      input.classList.add("shake");
      error.textContent = CONFIG.wrongPasswordMessage;
      error.classList.add("visible");
      input.value = "";
      input.focus();
    }
  });
}

function unlockLetter() {
  const overlay = $("#fade-overlay");
  overlay.classList.add("active"); // fade to black

  if (!musicPlaying) startMusic(); // form submit = a real user gesture

  setTimeout(() => {
    showScene("welcome");
    setTimeout(() => overlay.classList.remove("active"), 250);
  }, 900);
}

/* ----------------------------------------------------------------
   6. SCENE 2 — WELCOME
   ---------------------------------------------------------------- */
SCENE_INIT.welcome = function initWelcomeScene() {
  const el = $("#welcome-sentence");
  el.innerHTML = "";
  el.classList.remove("visible", "fading");

  const text = CONFIG.welcomeSentence;
  const perChar = 45; // ms

  text.split("").forEach((ch, i) => {
    const span = document.createElement("span");
    span.className = "char";
    span.textContent = ch === " " ? "\u00A0" : ch;
    span.style.animationDelay = i * perChar + "ms";
    el.appendChild(span);
  });
  el.classList.add("visible");

  const typeTime = text.length * perChar + 900;
  setTimeout(() => el.classList.add("fading"), typeTime + 1300);
  setTimeout(() => showScene("garden"), typeTime + 1300 + 1700);
};

/* ----------------------------------------------------------------
   7. SCENE 3 — GARDEN
   ---------------------------------------------------------------- */
function initGardenInteractions() {
  const ribbon = $("#ribbon");
  ribbon.addEventListener("click", () => {
    const bed = $("#flower-bed");
    ribbon.classList.add("clicked");
    bed.classList.add("parted");
    setTimeout(() => bed.classList.add("gone"), 1000);
    setTimeout(() => showScene("envelope"), 1700);
  });
}

SCENE_INIT.garden = function initGardenScene() {
  // Reset in case the visitor loops back through (e.g. via restart).
  const bed = $("#flower-bed");
  bed.classList.remove("parted", "gone");
  const ribbon = $("#ribbon");
  ribbon.classList.remove("clicked");
  $(".ribbon-text", ribbon).textContent = CONFIG.ribbonText;
  ribbon.setAttribute("aria-label", CONFIG.ribbonText + " — tap to continue");

  // Butterflies: a handful of little emoji fluttering on loop.
  const layer = $("#butterflies");
  layer.innerHTML = "";
  const count = prefersReducedMotion ? 0 : 5;
  for (let i = 0; i < count; i++) {
    const b = document.createElement("span");
    b.className = "butterfly";
    b.textContent = "🦋";
    b.style.left = rand(8, 88) + "vw";
    b.style.top = rand(12, 55) + "vh";
    b.style.animationDuration = rand(3.5, 6) + "s";
    b.style.animationIterationCount = "infinite";
    b.style.animationDelay = rand(0, 2) + "s";
    layer.appendChild(b);
  }
};

/* ----------------------------------------------------------------
   8. SCENE 4 — ENVELOPE
   ---------------------------------------------------------------- */
function initEnvelopeInteractions() {
  const seal = $("#wax-seal");
  seal.addEventListener("click", () => {
    if (seal.classList.contains("cracked")) return;
    seal.classList.add("cracked");
    $("#envelope-hint").style.opacity = "0";

    setTimeout(() => {
      seal.classList.add("hidden-seal");
      $("#envelope").classList.add("opened");
    }, 450);

    setTimeout(() => showScene("letter"), 1900);
  });
}

SCENE_INIT.envelope = function initEnvelopeScene() {
  const seal = $("#wax-seal");
  seal.classList.remove("cracked", "hidden-seal");
  $("#envelope").classList.remove("opened");
  $("#envelope-hint").style.opacity = "";
};

/* ----------------------------------------------------------------
   9. SCENE 5 — THE LETTER
   ---------------------------------------------------------------- */
function triggerLetterEffect(fx) {
  const layer = $("#letter-fx-layer");
  const paper = $("#letter-paper");
  const sceneEl = $("#scene-letter");

  if (fx === "hearts") {
    for (let i = 0; i < 6; i++) {
      const h = document.createElement("span");
      h.className = "fx-heart";
      h.textContent = "❤";
      h.style.left = rand(15, 85) + "%";
      h.style.top = rand(55, 80) + "%";
      h.style.fontSize = rand(12, 20) + "px";
      h.style.animationDelay = rand(0, 0.4) + "s";
      layer.appendChild(h);
      setTimeout(() => h.remove(), 2800);
    }
  }

  if (fx === "sparkles") {
    for (let i = 0; i < 8; i++) {
      const s = document.createElement("span");
      s.className = "fx-sparkle";
      s.textContent = "✨";
      s.style.left = rand(5, 95) + "%";
      s.style.top = rand(10, 90) + "%";
      s.style.fontSize = rand(12, 18) + "px";
      s.style.animationDelay = rand(0, 0.5) + "s";
      layer.appendChild(s);
      setTimeout(() => s.remove(), 2000);
    }
  }

  if (fx === "stars") {
    for (let i = 0; i < 6; i++) {
      const s = document.createElement("span");
      s.className = "fx-star";
      s.textContent = "✦";
      s.style.left = rand(5, 95) + "%";
      s.style.top = rand(10, 90) + "%";
      s.style.fontSize = rand(12, 20) + "px";
      s.style.animationDelay = rand(0, 0.5) + "s";
      layer.appendChild(s);
      setTimeout(() => s.remove(), 2200);
    }
  }

  if (fx === "blush") {
    const glow = document.createElement("div");
    glow.className = "blush-glow";
    paper.appendChild(glow);
    setTimeout(() => glow.remove(), 2600);
  }

  if (fx === "cooldown") {
    sceneEl.classList.add("cooled");
    ambientPetalsPaused = true;
  }

  if (fx === "bloom") {
    sceneEl.classList.remove("cooled");
    ambientPetalsPaused = false;
    const blossoms = ["🌹", "🌷", "🌼", "🤍"];
    for (let i = 0; i < 8; i++) {
      const b = document.createElement("span");
      b.className = "bloom-burst";
      b.textContent = blossoms[i % blossoms.length];
      b.style.left = rand(2, 92) + "%";
      b.style.top = rand(2, 92) + "%";
      b.style.animationDelay = rand(0, 0.6) + "s";
      layer.appendChild(b);
      setTimeout(() => b.remove(), 2600);
    }
  }
}

SCENE_INIT.letter = function initLetterScene() {
  const titleEl = $("#letter-title");
  const bodyEl = $("#letter-body");
  const continueBtn = $("#letter-continue");
  const paper = $("#letter-paper");
  const sceneEl = $("#scene-letter");

  sceneEl.classList.remove("cooled");
  ambientPetalsPaused = false;
  titleEl.innerHTML = CONFIG.letterTitle.join("<br />");
  bodyEl.innerHTML = "";
  continueBtn.classList.remove("show");
  paper.scrollTop = 0;

  const gap = prefersReducedMotion ? 400 : 2500;

  CONFIG.letterSentences.forEach((sentence, i) => {
    const p = document.createElement("p");
    p.className = "letter-sentence";
    p.textContent = sentence.text;
    bodyEl.appendChild(p);

    setTimeout(() => {
      p.classList.add("visible");
      if (sentence.fx) triggerLetterEffect(sentence.fx);
      paper.scrollTo({ top: p.offsetTop - 60, behavior: "smooth" });
    }, i * gap);
  });

  const totalTime = CONFIG.letterSentences.length * gap + 900;
  setTimeout(() => continueBtn.classList.add("show"), totalTime);
};

function initLetterInteractions() {
  $("#letter-continue").addEventListener("click", () => showScene("signature"));
}

/* ----------------------------------------------------------------
   10. SCENE 6 — SIGNATURE (+ Easter egg)
   ---------------------------------------------------------------- */
let heartClicks = 0;

SCENE_INIT.signature = function initSignatureScene() {
  $("#signature-line").textContent = CONFIG.signatureLine;
  $("#signature-name").textContent = CONFIG.signatureName;
  heartClicks = 0;
};

function initSignatureInteractions() {
  const heart = $("#signature-heart");
  heart.addEventListener("click", () => {
    heartClicks++;
    heart.classList.remove("pulse");
    void heart.offsetWidth;
    heart.classList.add("pulse");

    if (heartClicks >= CONFIG.easterEggClicks) {
      setTimeout(() => showScene("secret"), 350);
    }
  });
}

/* ----------------------------------------------------------------
   11. SCENE 7 — SECRET
   ---------------------------------------------------------------- */
SCENE_INIT.secret = function initSecretScene() {
  $("#secret-message").textContent = CONFIG.secretMessage;
  $("#polaroid-caption").textContent = CONFIG.polaroidCaption;
  const btn = $("#secret-continue");
  btn.classList.remove("show");
  setTimeout(() => btn.classList.add("show"), prefersReducedMotion ? 300 : 2400);
};

function initSecretInteractions() {
  $("#secret-continue").addEventListener("click", () => {
    stopAmbient();
    showScene("ending");
  });
}

/* ----------------------------------------------------------------
   12. SCENE 8 — ENDING
   ---------------------------------------------------------------- */
let endingBuilt = false;

SCENE_INIT.ending = function initEndingScene() {
  $("#ps-sentence").textContent = CONFIG.psSentence;

  if (!endingBuilt) {
    endingBuilt = true;

    const sky = $("#night-sky");
    const starCount = prefersReducedMotion ? 15 : 50;
    for (let i = 0; i < starCount; i++) {
      const s = document.createElement("span");
      s.className = "star";
      s.style.left = rand(0, 100) + "vw";
      s.style.top = rand(0, 70) + "vh";
      s.style.animationDuration = rand(2, 5) + "s";
      s.style.animationDelay = rand(0, 4) + "s";
      sky.appendChild(s);
    }

    const fireflyLayer = $("#fireflies");
    const fireflyCount = prefersReducedMotion ? 0 : 10;
    for (let i = 0; i < fireflyCount; i++) {
      const f = document.createElement("span");
      f.className = "firefly";
      f.style.left = rand(10, 90) + "vw";
      f.style.top = rand(30, 85) + "vh";
      f.style.setProperty("--fx", rand(-60, 60) + "px");
      f.style.setProperty("--fy", rand(-100, -20) + "px");
      f.style.setProperty("--fx2", rand(-60, 60) + "px");
      f.style.setProperty("--fy2", rand(-160, -60) + "px");
      f.style.animationDuration = rand(6, 11) + "s";
      f.style.animationDelay = rand(0, 5) + "s";
      fireflyLayer.appendChild(f);
    }
  }

  fadeOutMusicSlow(7000);
};

function initEndingInteractions() {
  $("#restart-btn").addEventListener("click", () => location.reload());
}

/* ----------------------------------------------------------------
   13. BOOT
   ---------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initCoverScene();
  initGardenInteractions();
  initEnvelopeInteractions();
  initLetterInteractions();
  initSignatureInteractions();
  initSecretInteractions();
  initEndingInteractions();

  $("#music-toggle").addEventListener("click", () => {
    if (musicPlaying) stopMusic();
    else startMusic();
  });

  // Hearts + petals begin drifting immediately on the cover page.
  startAmbient();
});
