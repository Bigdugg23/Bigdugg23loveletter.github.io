/* ==========================================================================
   LOVE LETTER INTERACTIVE ENGINE
   ========================================================================== */

// Config & State
const SECRET_PASSWORD = "smiles";
let heartClickCount = 0;

// Letter Content (Triggers animations based on text tags)
const letterSentences = [
    { text: "My dearest Mama Mhlungu,", trigger: null },
    { text: "I built this quiet space in the digital universe just for you—a small reflection of the warmth you bring into my life.", trigger: null },
    { text: "Every time I see your smile ❤️, something inside me settles into pure peace.", trigger: "smile" },
    { text: "Your laughter 😂 fills up rooms I didn't even know were empty.", trigger: "laughter" },
    { text: "Even the subtle way your cheeks 😊 glow when you get soft or embarrassed makes the rest of the world fade away.", trigger: "cheeks" },
    { text: "And those little stars ✨ when your braces catch the light... I notice every single detail.", trigger: "braces" },
    { text: "Sometimes, when you leave... 🥹 the day gets just a little quieter, and I find myself waiting for your return.", trigger: "cool-down" },
    { text: "I wanted to remind you today, without any distraction: You are loved. ❤️", trigger: "bloom-all" }
];

const psText = "P.S. Every time you smile, somewhere there is a boy smiling too.";

// DOM Elements
const music = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
const particleContainer = document.getElementById('particle-container');

// Audio Toggle Logic
musicToggle.addEventListener('click', () => {
    if (music.paused) {
        music.play();
        musicToggle.style.opacity = '1';
    } else {
        music.pause();
        musicToggle.style.opacity = '0.5';
    }
});

/* ==========================================================================
   SCENE NAVIGATION CONTROLLER
   ========================================================================== */
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

/* ==========================================================================
   PARTICLE GENERATOR (Petals, Hearts, Stars)
   ========================================================================== */
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

// Default Petal Interval
let petalInterval = setInterval(() => createParticle('🌸', 7), 800);

/* ==========================================================================
   1. COVER PAGE LOGIC
   ========================================================================== */
const form = document.getElementById('password-form');
const passwordInput = document.getElementById('password-input');
const errorMsg = document.getElementById('error-message');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = passwordInput.value.trim().toLowerCase();

    if (val === SECRET_PASSWORD) {
        errorMsg.innerText = "";
        music.play().catch(() => console.log("Audio autoplay prevented"));
        
        // Transition to Welcome
        transitionScene('cover-scene', 'welcome-scene');
        runWelcomeScene();
    } else {
        const card = document.querySelector('.cover-card');
        card.classList.add('shake');
        errorMsg.innerText = "Not quite... try the word that reminds me of you.";
        setTimeout(() => card.classList.remove('shake'), 400);
    }
});

/* ==========================================================================
   2. WELCOME SCENE LOGIC
   ========================================================================== */
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

/* ==========================================================================
   3. GARDEN SCENE LOGIC
   ========================================================================== */
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

/* ==========================================================================
   4. ENVELOPE SCENE LOGIC
   ========================================================================== */
const waxSeal = document.getElementById('wax-seal');
waxSeal.addEventListener('click', () => {
    waxSeal.classList.add('crack');
    
    setTimeout(() => {
        transitionScene('envelope-scene', 'letter-scene');
        runLetterScene();
    }, 1000);
});

/* ==========================================================================
   5. LOVE LETTER SCENE LOGIC
   ========================================================================== */
function runLetterScene() {
    const container = document.getElementById('letter-content');
    
    letterSentences.forEach((sentenceObj, index) => {
        setTimeout(() => {
            const p = document.createElement('p');
            p.classList.add('letter-line');
            p.innerText = sentenceObj.text;
            container.appendChild(p);
            
            // Trigger animation frame
            requestAnimationFrame(() => p.classList.add('visible'));

            // Triggers based on text context
            handleSentenceTrigger(sentenceObj.trigger);

        }, index * 3200); // Slow, emotional delay between lines
    });

    // Auto-transition to ending scene after full letter is read
    const totalDuration = letterSentences.length * 3200 + 7000;
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
            clearInterval(petalInterval); // Petals stop falling
            document.body.style.transition = "background-color 3s ease";
            document.body.style.backgroundColor = "#121820"; // Cooler background tones
            break;
        case 'bloom-all':
            document.body.style.backgroundColor = "var(--deep-burgundy)";
            petalInterval = setInterval(() => createParticle('🌹', 5), 400);
            break;
    }
}

/* ==========================================================================
   6. ENDING SCENE LOGIC
   ========================================================================== */
function runEndingScene() {
    // Fireflies effect
    setInterval(() => createParticle('🌟', 8), 500);

    const psElement = document.getElementById('ps-text');
    psElement.innerText = psText;
    
    setTimeout(() => {
        psElement.classList.add('visible');
    }, 1500);

    // Single rose petal fall at the very end
    setTimeout(() => {
        createParticle('🌹', 10);
    }, 4000);
}

/* ==========================================================================
   7. EASTER EGG LOGIC
   ========================================================================== */
const heartBtn = document.getElementById('easter-egg-heart');
const modal = document.getElementById('polaroid-modal');
const closeModal = document.getElementById('close-modal');

heartBtn.addEventListener('click', () => {
    heartClickCount++;
    
    // Heart bounce feedback
    heartBtn.style.transform = `scale(${1 + heartClickCount * 0.2})`;

    if (heartClickCount === 5) {
        modal.classList.add('open');
        heartClickCount = 0; // Reset
        heartBtn.style.transform = `scale(1)`;
    }
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('open');
});
