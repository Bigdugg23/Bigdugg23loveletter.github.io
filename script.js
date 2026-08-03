/* ==========================================================================
   LOVE LETTER INTERACTIVE ENGINE
   ========================================================================== */

// Password & State
const SECRET_PASSWORD = "smiles";
let heartClickCount = 0;

// Exact Love Letter Text from Image
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

// DOM Elements
const music = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
const particleContainer = document.getElementById('particle-container');

// Audio Toggle
musicToggle.addEventListener('click', () => {
    if (music.paused) {
        music.play();
        musicToggle.style.opacity = '1';
    } else {
        music.pause();
        musicToggle.style.opacity = '0.5';
    }
});

/* Scene Transitions */
function transitionScene(currentId, nextId, delay = 0) {
    setTimeout(() => {
        const current = document.getElementById(currentId);
        const next = document.getElementById(nextId);
        
        current.classList.remove('active');
        setTimeout(() => {
            next.classList.add('active');
        }, 1000);
    }, delay);
}

/* Falling Particle Generator */
function createParticle(symbol, duration = 6) {
    const particle = document.createElement('div');
    particle.classList.add('falling-item');
    particle.innerHTML = symbol;
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.fontSize = (Math.random() * 15 + 15) + 'px';
    particle.style.animationDuration = (Math.random() * 3 + duration) + 's';
    
    particleContainer.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, (duration + 3) * 1000);
}

let petalInterval = setInterval(() => createParticle('🌸', 7), 800);

/* 1. COVER PAGE */
const form = document.getElementById('password-form');
const passwordInput = document.getElementById('password-input');
const errorMsg = document.getElementById('error-message');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = passwordInput.value.trim().toLowerCase();

    if (val === SECRET_PASSWORD) {
        errorMsg.innerText = "";
        music.play().catch(() => console.log("Autoplay waiting for user interaction"));
        
        transitionScene('cover-scene', 'welcome-scene');
        runWelcomeScene();
    } else {
        const card = document.querySelector('.cover-card');
        card.classList.add('shake');
        errorMsg.innerText = "Not quite... try the word that reminds me of you.";
        setTimeout(() => card.classList.remove('shake'), 400);
    }
});

/* 2. WELCOME SCENE */
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

/* 3. FLOWER GARDEN SCENE */
function runGardenScene() {
    const flowers = document.querySelectorAll('.flower');
    flowers.forEach((flower, index) => {
        setTimeout(() => {
            flower.classList.add('bloom');
        }, index * 600);
    });

    const ribbon = document.getElementById('ribbon');
    ribbon.addEventListener('click', () => {
        document.querySelector('.flowers-wrapper').style.transform = 'translateY(-100px)';
        document.querySelector('.flowers-wrapper').style.opacity = '0';
        ribbon.style.opacity = '0';
        
        transitionScene('garden-scene', 'envelope-scene', 800);
    });
}

/* 4. ENVELOPE SCENE */
const waxSeal = document.getElementById('wax-seal');
waxSeal.addEventListener('click', () => {
    waxSeal.classList.add('crack');
    
    setTimeout(() => {
        transitionScene('envelope-scene', 'letter-scene');
        runLetterScene();
    }, 1000);
});

/* 5. LOVE LETTER SCENE */
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

        }, index * 3400);
    });

    const totalDuration = letterSentences.length * 3400 + 6000;
    setTimeout(() => {
        transitionScene('letter-scene', 'ending-scene');
        runEndingScene();
    }, totalDuration);
}

function handleSentenceTrigger(trigger) {
    if (!trigger) return;

    switch (trigger) {
        case 'smile':
            for (let i = 0; i < 8; i++) createParticle('❤️', 4);
            break;
        case 'laughter':
            for (let i = 0; i < 12; i++) createParticle('✨', 3);
            break;
        case 'cheeks':
            document.getElementById('letter-paper').classList.add('blush-glow');
            setTimeout(() => {
                document.getElementById('letter-paper').classList.remove('blush-glow');
            }, 3000);
            break;
        case 'braces':
            for (let i = 0; i < 10; i++) createParticle('⭐', 5);
            break;
        case 'cool-down':
            clearInterval(petalInterval);
            document.body.style.transition = "background-color 3s ease";
            document.body.style.backgroundColor = "#121820";
            break;
        case 'bloom-all':
            document.body.style.backgroundColor = "var(--deep-burgundy)";
            petalInterval = setInterval(() => createParticle('🌹', 5), 400);
            break;
    }
}

/* 6. ENDING SCENE */
function runEndingScene() {
    setInterval(() => createParticle('🌟', 8), 500);

    const psElement = document.getElementById('ps-text');
    psElement.innerText = psText;
    
    setTimeout(() => {
        psElement.classList.add('visible');
    }, 1500);

    setTimeout(() => {
        createParticle('🌹', 10);
    }, 4000);
}

/* 7. EASTER EGG LOGIC */
const heartBtn = document.getElementById('easter-egg-heart');
const modal = document.getElementById('polaroid-modal');
const closeModal = document.getElementById('close-modal');

heartBtn.addEventListener('click', () => {
    heartClickCount++;
    heartBtn.style.transform = `scale(${1 + heartClickCount * 0.2})`;

    if (heartClickCount === 5) {
        modal.classList.add('open');
        heartClickCount = 0;
        heartBtn.style.transform = `scale(1)`;
    }
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('open');
});
