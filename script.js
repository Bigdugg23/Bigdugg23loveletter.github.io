/* ==========================================================================
   LOVE LETTER INTERACTIVE ENGINE
   ========================================================================== */

const SECRET_PASSWORD = "smiles";
let heartClickCount = 0;

// Sentences matching the image layout precisely
const letterSentences = [
    { text: "It's your smile that steals pieces of my heart every time I see it.", trigger: "smile" },
    { text: "It's your laughter that turns ordinary moments into my favorite memories.", trigger: "laughter" },
    { text: "It's your soft cheeks that I never get tired of kissing.", trigger: "cheeks" },
    { text: "It's your cuteness that catches me off guard, even when I tell myself to act normal.", trigger: null },
    { text: "And your braces... I don't know why, but they've become one of my favorite things about you. Every time you smile, they remind me that the little things are often the ones we fall in love with the most.", trigger: "braces" },
    { text: "Your presence is my favorite place to be.", trigger: null },
    { text: "When you're around, everything feels warm, peaceful, and right.", trigger: null },
    { text: "But the moment you leave...", trigger: "cool-down" },
    { text: "the silence gets louder.", trigger: null },
    { text: "the room feels colder.", trigger: null },
    { text: "and I find myself missing you before you've even made it home.", trigger: null },
    { text: "You may never fully understand what your existence has done to my heart, but if there's one thing I hope you never question, it's this:", trigger: null },
    { text: "You are loved.", trigger: "bloom-all" },
    { text: "Not just for how pretty you are.", trigger: null },
    { text: "Not just for your smile.", trigger: null },
    { text: "But for the way you make my world feel like home.", trigger: null },
    { text: "So keep smiling, my Momo Smiles.", trigger: "smile" },
    { text: "Because every smile you wear is another reason I fall for you all over again.", trigger: null }
];

const psText = "P.S. Every time you smile, somewhere there is a boy smiling too.";

// Audio & Elements
const music = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
const particleContainer = document.getElementById('particle-container');

musicToggle.addEventListener('click', () => {
    if (music.paused) {
        music.play();
        musicToggle.style.opacity = '1';
    } else {
        music.pause();
        musicToggle.style.opacity = '0.5';
    }
});

function transitionScene(currentId, nextId, delay = 0) {
    setTimeout(() => {
        const current = document.getElementById(currentId);
        const next = document.getElementById(nextId);
        current.classList.remove('active');
        setTimeout(() => next.classList.add('active'), 1000);
    }, delay);
}

function createParticle(symbol, duration = 6) {
    const particle = document.createElement('div');
    particle.classList.add('falling-item');
    particle.innerHTML = symbol;
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.fontSize = (Math.random() * 15 + 15) + 'px';
    particle.style.animationDuration = (Math.random() * 3 + duration) + 's';
    particleContainer.appendChild(particle);

    setTimeout(() => particle.remove(), (duration + 3) * 1000);
}

let petalInterval = setInterval(() => createParticle('🌸', 7), 800);

/* Password Form */
const form = document.getElementById('password-form');
const passwordInput = document.getElementById('password-input');
const errorMsg = document.getElementById('error-message');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (passwordInput.value.trim().toLowerCase() === SECRET_PASSWORD) {
        errorMsg.innerText = "";
        music.play().catch(() => {});
        transitionScene('cover-scene', 'welcome-scene');
        runWelcomeScene();
    } else {
        errorMsg.innerText = "Not quite... try the word that reminds me of you.";
    }
});

/* Welcome Scene */
function runWelcomeScene() {
    const text = "Every love story begins with a smile...";
    const target = document.getElementById('welcome-text');
    let i = 0;
    const typewriter = setInterval(() => {
        if (i < text.length) {
            target.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(typewriter);
            setTimeout(() => {
                transitionScene('welcome-scene', 'garden-scene');
                runGardenScene();
            }, 2000);
        }
    }, 90);
}

/* Garden Scene */
function runGardenScene() {
    document.querySelectorAll('.flower').forEach((flower, index) => {
        setTimeout(() => flower.classList.add('bloom'), index * 600);
    });

    document.getElementById('ribbon').addEventListener('click', () => {
        transitionScene('garden-scene', 'envelope-scene', 500);
    });
}

/* Envelope Scene */
document.getElementById('wax-seal').addEventListener('click', () => {
    transitionScene('envelope-scene', 'letter-scene', 500);
    runLetterScene();
});

/* Love Letter Scene */
function runLetterScene() {
    const container = document.getElementById('letter-content');
    letterSentences.forEach((sentenceObj, index) => {
        setTimeout(() => {
            const p = document.createElement('p');
            p.classList.add('letter-line');
            p.innerText = sentenceObj.text;
            container.appendChild(p);
            requestAnimationFrame(() => p.classList.add('visible'));
            handleSentenceTrigger(sentenceObj.trigger);
        }, index * 3200);
    });

    const totalDuration = letterSentences.length * 3200 + 6000;
    setTimeout(() => {
        transitionScene('letter-scene', 'ending-scene');
        runEndingScene();
    }, totalDuration);
}

function handleSentenceTrigger(trigger) {
    if (!trigger) return;
    if (trigger === 'smile') for (let i = 0; i < 6; i++) createParticle('❤️', 4);
    if (trigger === 'laughter') for (let i = 0; i < 8; i++) createParticle('✨', 3);
    if (trigger === 'bloom-all') petalInterval = setInterval(() => createParticle('🌹', 5), 400);
}

/* Ending Scene */
function runEndingScene() {
    setInterval(() => createParticle('🌟', 8), 500);
    const psElement = document.getElementById('ps-text');
    psElement.innerText = psText;
    setTimeout(() => psElement.classList.add('visible'), 1500);
}

/* Easter Egg Modal */
const heartBtn = document.getElementById('easter-egg-heart');
const modal = document.getElementById('polaroid-modal');

heartBtn.addEventListener('click', () => {
    heartClickCount++;
    if (heartClickCount === 5) {
        modal.classList.add('open');
        heartClickCount = 0;
    }
});

document.getElementById('close-modal').addEventListener('click', () => {
    modal.classList.remove('open');
});
