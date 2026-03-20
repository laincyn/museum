// --- Cinematic Intro ---
window.onload = () => {
    setTimeout(() => {
        document.getElementById('title-container').classList.remove('intro');
        document.getElementById('black-screen').classList.add('hidden');
    }, 1500); 
};

const playerContainer = document.getElementById('player-container');
const playerSprite = document.getElementById('player-sprite');
const playerReflection = document.getElementById('player-reflection');
const dynamicLighting = document.getElementById('dynamic-lighting');

const WALK_SPEED = 3;
const RUN_SPEED = 7;
const RUN_DELAY_MS = 1000; 

let posX = window.innerWidth / 2;
const keys = {};
const pressTimes = {};

const eraData = [
    { title: "1. Pre-Colonial Era", focus: "Indigenous culture, Baybayin, and tribal leadership.", members: "Salonga, Ogalino, Alegre, Bañanola, Albero, Maranan, Cao", images: ["museum_arts/art1.png", "museum_arts/art1.png", "museum_arts/art1.png"] },
    { title: "2. Spanish Era", focus: "Colonial architecture, the Propaganda Movement, and the Revolution.", members: "Intiola, Gamba, Pagarita, Boza, Aviñante, Gatchalian, Namoco", images: ["museum_arts/art2.png", "museum_arts/art2.png", "museum_arts/art2.png"] },
    { title: "3. American Era", focus: "The Thomasites, public education, and the Commonwealth government.", members: "Magdura, Delacruz, Lachica, Tolentino, Gabatin, Alarcon, Caayupan", images: ["museum_arts/art3.png", "museum_arts/art3.png", "museum_arts/art3.png"] },
    { title: "4. Post-War Era", focus: "Rebuilding the nation, the Third Republic, and industrialization.", members: "Vidallon, Canaman, Martin, Zapanta, Colina, Morillo, Ersando", images: ["museum_arts/art4.png", "museum_arts/art4.png", "museum_arts/art4.png"] },
    { title: "5. Contemporary Era", focus: "Digital transformation, modern civil movements, and current events.", members: "Villaruel, Perseveranda, Esmerio, Crisostomo, Cardoza, Padilla", images: ["museum_arts/art5.png", "museum_arts/art5.png", "museum_arts/art5.png"] }
];

let isFocusing = false;
let focusHoldStartTime = 0; 
let currentSlide = 0;
let currentEraIndex = 0;

const bgMusic = document.getElementById('bg-music');
const sfxFootsteps = document.getElementById('sfx-footsteps'); 
const volumeSlider = document.getElementById('volume-slider');
const muteIcon = document.getElementById('mute-icon');

// Initialize starting volumes at 20%
volumeSlider.value = 0.2;
bgMusic.volume = 0.2;
sfxFootsteps.volume = 1.0; 

let musicStarted = false;
let isMusicMuted = false;

const tryPlayMusic = () => {
    if (!musicStarted) {
        bgMusic.play().catch(e => console.log("Audio waiting for interaction..."));
        musicStarted = true;
    }
};

document.addEventListener('keydown', (e) => {
    tryPlayMusic();
    let key = e.key.toLowerCase();
    if (key.startsWith('arrow')) key = key.replace('arrow', '');
    if (!keys[key]) { keys[key] = true; pressTimes[key] = Date.now(); }
});

document.addEventListener('keyup', (e) => {
    let key = e.key.toLowerCase();
    if (key.startsWith('arrow')) key = key.replace('arrow', '');
    keys[key] = false; delete pressTimes[key]; 
});

const mobileMapping = { 'btn-left': 'left', 'btn-right': 'right', 'btn-up': 'up' };
Object.keys(mobileMapping).forEach(id => {
    const btn = document.getElementById(id);
    const key = mobileMapping[id];
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault(); tryPlayMusic();
        if (!keys[key]) { keys[key] = true; pressTimes[key] = Date.now(); }
    });
    btn.addEventListener('touchend', (e) => {
        e.preventDefault(); keys[key] = false; delete pressTimes[key];
    });
});

volumeSlider.addEventListener('input', (e) => {
    let vol = e.target.value; bgMusic.volume = vol; 
    if (isMusicMuted && vol > 0) { isMusicMuted = false; bgMusic.muted = false; }
    updateMuteIcon(vol);
});

muteIcon.addEventListener('click', () => {
    isMusicMuted = !isMusicMuted;
    bgMusic.muted = isMusicMuted; 
    updateMuteIcon(volumeSlider.value);
});

function updateMuteIcon(vol) {
    if (isMusicMuted || vol == 0) muteIcon.textContent = '🔇';
    else if (vol < 0.5) muteIcon.textContent = '🔉';
    else muteIcon.textContent = '🔊';
}

function updateSprite(imageName) {
    const newPath = `char_images/${imageName}`;
    if (!playerSprite.src.endsWith(newPath)) {
        playerSprite.src = newPath;
        playerReflection.src = newPath;
    }
}

function loadFocusData(index) {
    const data = eraData[index]; currentEraIndex = index; currentSlide = 0; 
    document.getElementById('era-title').innerText = data.title;
    document.querySelector('#era-focus span').innerText = data.focus;
    document.querySelector('#era-members span').innerText = data.members;
    const track = document.getElementById('slider-track'); track.innerHTML = ''; 
    data.images.forEach(imgSrc => {
        let img = document.createElement('img'); img.src = imgSrc; img.className = 'slide-image'; track.appendChild(img);
    });
    track.style.transform = `translateX(0%)`;
}

function swipeSlider(direction) {
    const totalSlides = eraData[currentEraIndex].images.length;
    currentSlide += direction;
    if (currentSlide < 0) currentSlide = 0;
    if (currentSlide >= totalSlides) currentSlide = totalSlides - 1;
    document.getElementById('slider-track').style.transform = `translateX(-${currentSlide * 100}%)`;
}

function gameLoop() {
    let currentSpeedX = 0; let now = Date.now();
    let isMovingHorizontally = false; let wPressed = keys['w'] || keys['up'];
    let isRunning = false; 

    let pCenter = posX + (playerContainer.offsetWidth / 2); let closestArt = null; let closestIndex = null;
    document.querySelectorAll('.art-piece').forEach(art => {
        let artRect = art.getBoundingClientRect();
        if (Math.abs(pCenter - (artRect.left + artRect.width / 2)) < 120) {
            art.classList.add('near'); closestArt = art; closestIndex = art.getAttribute('data-era'); 
        } else { art.classList.remove('near'); }
    });

    const focusOverlay = document.getElementById('focus-overlay');

    if (isFocusing) {
        if ((keys['a'] || keys['left']) && !pressTimes['swiped']) { swipeSlider(-1); pressTimes['swiped'] = true; }
        else if ((keys['d'] || keys['right']) && !pressTimes['swiped']) { swipeSlider(1); pressTimes['swiped'] = true; }
        if (!keys['a'] && !keys['left'] && !keys['d'] && !keys['right']) delete pressTimes['swiped'];
    }

    if (!isFocusing) {
        if (keys['a'] || keys['left']) {
            isRunning = (now - (pressTimes['a'] || pressTimes['left'])) >= RUN_DELAY_MS;
            currentSpeedX = isRunning ? -RUN_SPEED : -WALK_SPEED; updateSprite('A.png'); isMovingHorizontally = true;
        } 
        else if (keys['d'] || keys['right']) {
            isRunning = (now - (pressTimes['d'] || pressTimes['right'])) >= RUN_DELAY_MS;
            currentSpeedX = isRunning ? RUN_SPEED : WALK_SPEED; updateSprite('D.png'); isMovingHorizontally = true;
        }
    }

    if (isMovingHorizontally) {
        sfxFootsteps.playbackRate = isRunning ? 1.5 : 1.0;
        if (sfxFootsteps.paused) sfxFootsteps.play();
    } else { if (!sfxFootsteps.paused) { sfxFootsteps.pause(); sfxFootsteps.currentTime = 0; } }

    if (!isMovingHorizontally) {
        if (wPressed) {
            updateSprite('W.png'); 
            if (closestArt && !isFocusing) { 
                isFocusing = true; 
                focusHoldStartTime = Date.now(); 
                loadFocusData(closestIndex); 
                focusOverlay.classList.add('active'); 
            }
            // SUPER ZOOM TRIGGER
            if (isFocusing && (Date.now() - focusHoldStartTime > 3000)) {
                focusOverlay.classList.add('super-zoom');
            }
        } 
        else {
            if (isFocusing) {
                if (focusOverlay.classList.contains('super-zoom')) {
                    focusOverlay.classList.remove('super-zoom');
                    setTimeout(() => {
                        isFocusing = false;
                        focusOverlay.classList.remove('active');
                    }, 500); 
                } else {
                    isFocusing = false;
                    focusOverlay.classList.remove('active');
                }
            }
        }
    }

    posX += currentSpeedX; posX = Math.max(0, Math.min(posX, window.innerWidth - playerContainer.offsetWidth));
    playerContainer.style.left = `${posX}px`;

    let pRect = playerContainer.getBoundingClientRect();
    dynamicLighting.style.setProperty('--light-x', `${pRect.left + pRect.width / 2}px`);
    dynamicLighting.style.setProperty('--light-y', `${pRect.top + pRect.height / 3}px`);

    requestAnimationFrame(gameLoop);
}

function createParticles() {
    const container = document.getElementById('particles-container');
    for (let i = 0; i < 75; i++) {
        let p = document.createElement('div'); p.classList.add('particle');
        let size = Math.random() * 4 + 1; p.style.width = p.style.height = `${size}px`;
        p.style.left = `${Math.random() * 100}vw`; p.style.animationDuration = `${Math.random() * 10 + 8}s`;
        p.style.animationDelay = `-${Math.random() * 15}s`; container.appendChild(p);
    }
}

createParticles(); gameLoop();