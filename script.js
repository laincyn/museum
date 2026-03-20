window.onload = () => {
    setTimeout(() => {
        document.getElementById('title-container').classList.remove('intro');
        document.getElementById('black-screen').classList.add('hidden');
    }, 1500); 
};

const cameraStage = document.getElementById('camera-stage');
const playerContainer = document.getElementById('player-container');
const playerSprite = document.getElementById('player-sprite');
const playerReflection = document.getElementById('player-reflection');
const dynamicLighting = document.getElementById('dynamic-lighting');

const WALK_SPEED = 4;
const RUN_SPEED = 9;
const RUN_DELAY_MS = 1000; 
const WORLD_WIDTH = 3500;
let posX = 1750; 

const keys = {};
const pressTimes = {};

const eraData = [
    { 
        title: "1. Pre-Colonial Era", focus: "Indigenous culture, Baybayin, and tribal leadership.", 
        images: [
            { src: "museum_arts/pre-colonial/painting/art1.jpeg", title: "T'nalak Cloth", author: "T'boli Weavers", age: "Pre-Colonial", desc: "A traditional sacred cloth woven by the T'boli people in South Cotabato, representing their dreams and beliefs." },
            { src: "museum_arts/pre-colonial/painting/art2.jpg", title: "Pintados", author: "Visayan Indigenous Peoples", age: "Pre-Colonial", desc: "Refers to the beautifully tattooed indigenous peoples of the Visayas, with ink depicting bravery and social status." },
            { src: "museum_arts/pre-colonial/painting/art3.jpg", title: "Peñablanca Petroglyphs", author: "Early Inhabitants", age: "Pre-Colonial", desc: "Ancient charcoal drawings on cave walls in Cagayan, depicting human-like figures and local wildlife." },
            { src: "museum_arts/pre-colonial/painting/art4.jpg", title: "Bul-ul", author: "Ifugao Carvers", age: "Pre-Colonial", desc: "Carved wooden figures used to guard the rice crop by the Ifugao peoples of Northern Luzon." },
            { src: "museum_arts/pre-colonial/painting/art5.jpg", title: "Angono Petroglyphs", author: "Early Inhabitants", age: "~2000 BC", desc: "The oldest known work of art in the Philippines, consisting of 127 human and animal figures engraved on a rock wall." },
            { src: "museum_arts/pre-colonial/painting/T_NALAK.webp", title: "Anda Peninsula Petroglyphs", author: "Early Inhabitants", age: "Pre-Colonial", desc: "Red hematite paintings found in the caves of Bohol, showcasing early artistic expression in the islands." }
        ] 
    },
    { 
        title: "2. Spanish Era", focus: "Colonial architecture, the Propaganda Movement, and the Revolution.", 
        images: [
            { src: "museum_arts/spanish/painting/art1.jpg", title: "The Blood Compact", author: "Juan Luna", age: "1886", desc: "Depicts the 1565 Sandugo between Spanish explorer Miguel López de Legazpi and Datu Sikatuna of Bohol." },
            { src: "museum_arts/spanish/painting/art2.jpg", title: "Spoliarium", author: "Juan Luna", age: "1884", desc: "A massive, emotionally charged masterpiece showing fallen gladiators being dragged into the Roman amphitheater's basement." },
            { src: "museum_arts/spanish/painting/art3.jpeg", title: "Las Virgenes Cristianas", author: "Félix Resurrección Hidalgo", age: "1884", desc: "Portrays a tragic scene of Christian virgins being mocked in Ancient Rome, symbolizing colonial oppression." },
            { src: "museum_arts/spanish/painting/art4.jpg", title: "Las Damas Romanas", author: "Juan Luna", age: "1882", desc: "Depicts the leisurely life of Roman women, showcasing Luna's mastery of classical European themes." },
            { src: "museum_arts/spanish/painting/art5.jpg", title: "La Barca de Aqueronte", author: "Félix Resurrección Hidalgo", age: "1887", desc: "A dark and dramatic interpretation of Dante's Inferno, showing damned souls crossing the river Acheron." },
            { src: "museum_arts/spanish/painting/art6.jpg", title: "El Asesinato", author: "Félix Resurrección Hidalgo", age: "1904", desc: "Illustrates the dramatic assassination of Governor-General Fernando Manuel de Bustamante by friars." }
        ] 
    },
    { 
        title: "3. American Era", focus: "The Thomasites, public education, and the Commonwealth government.", 
        images: [
            { src: "museum_arts/american/painting/art1.jpg", title: "The Builders", author: "Victorio Edades", age: "1928", desc: "A groundbreaking work that introduced modernism to the Philippines, moving away from idealized rural landscapes." },
            { src: "museum_arts/american/painting/art2.jpg", title: "Planting Rice", author: "Fernando Amorsolo", age: "1922", desc: "Captures the romanticized, sun-drenched beauty of rural Filipino life and agricultural labor." },
            { src: "museum_arts/american/painting/art3.jpg", title: "Mango Gatherers", author: "Fernando Amorsolo", age: "1936", desc: "A classic example of Amorsolo's mastery of light (chiaroscuro) highlighting idyllic provincial scenes." },
            { src: "museum_arts/american/painting/art4.jpg", title: "Maiden in a Stream", author: "Fernando Amorsolo", age: "1921", desc: "Celebrates the innocent and natural beauty of the Filipina set against a lush, rural backdrop." },
            { src: "museum_arts/american/painting/art5.jpg", title: "Dalagang Bukid", author: "Fernando Amorsolo", age: "1958", desc: "Portrays the quintessential 'Dalagang Bukid' (country maiden) with a bright smile and traditional attire." },
            { src: "museum_arts/american/painting/art6.jpg", title: "Afternoon Meal", author: "Fernando Amorsolo", age: "1939", desc: "A warm and inviting painting depicting a communal rest period during a hard day's harvest." }
        ] 
    },
    { 
        title: "4. Post-War Era", focus: "Rebuilding the nation, the Third Republic, and industrialization.", 
        images: [
            { src: "museum_arts/post-war/painting/art1.jpg", title: "Woman", author: "Willem de Kooning", age: "1950", desc: "A bold, abstract expressionist piece characterized by aggressive brushstrokes and intense emotional energy." },
            { src: "museum_arts/post-war/painting/art2.jpg", title: "No. 5", author: "Jackson Pollock", age: "1948", desc: "A famous example of 'drip painting', showcasing the chaotic yet controlled movement of abstract expressionism." },
            { src: "museum_arts/post-war/painting/art3.jpg", title: "Marilyn Diptych", author: "Andy Warhol", age: "1962", desc: "A pop art icon that explores celebrity culture, mass production, and mortality." },
            { src: "museum_arts/post-war/painting/art4.jpg", title: "Flag", author: "Jasper Johns", age: "1954", desc: "Blurs the line between everyday objects and fine art, challenging the viewer to look closer at familiar symbols." },
            { src: "museum_arts/post-war/painting/art5.jpg", title: "Campbell's Soup Cans", author: "Andy Warhol", age: "1962", desc: "Elevated a mundane consumer product to the status of high art, defining the Pop Art movement." },
            { src: "museum_arts/post-war/painting/art6.jpg", title: "Black Square", author: "Kazimir Malevich", age: "1915", desc: "A purely non-objective, suprematist work that completely rejects traditional representation." }
        ] 
    },
    { 
        title: "5. Contemporary Era", focus: "Digital transformation, modern civil movements, and current events.", 
        images: [
            { src: "museum_arts/contemporary/art1.jpg", title: "Sabel in Blue", author: "Benedicto Cabrera", age: "2006", desc: "Features BenCab's signature muse, Sabel, wrapped in dynamic, flowing blue drapery." },
            { src: "museum_arts/contemporary/art2.jpg", title: "Hapag ng Pag-asa", author: "Joey Velasco", age: "2005", desc: "A poignant Filipino recreation of the Last Supper featuring street children instead of the apostles." },
            { src: "museum_arts/contemporary/art3.jpg", title: "Grayground", author: "Ronald Ventura", age: "2011", desc: "A hyper-realistic and surreal masterpiece combining pop culture, graffiti, and classical techniques." },
            { src: "museum_arts/contemporary/art4.jpg", title: "Last Trip", author: "Contemporary Artist", age: "Modern", desc: "A modern reflection on urban life, commuting, and the everyday struggles of the working class." },
            { src: "museum_arts/contemporary/art5.jpg", title: "Itak sa Puso ni Mang Juan", author: "Antipas Delotavo", age: "1978", desc: "A powerful social realist painting highlighting the oppressive weight of foreign corporate influence." },
            { src: "museum_arts/contemporary/art6.png", title: "Fishermen", author: "Ang Kiukok", age: "1981", desc: "A dynamic, cubist-inspired piece displaying the harsh realities and struggle for survival in the fishing industry." }
        ] 
    }
];

let wallImageIndices = eraData.map(() => 0); 

// Update Wall Canvases with the object 'src' property
// Modified to also update dynamic titles and authors on the wall
document.querySelectorAll('.art-piece').forEach((piece) => {
    const eraIndex = piece.getAttribute('data-era');
    const canvas = piece.querySelector('.art-canvas');
    // Select the new metadata elements
    const wallTitle = piece.querySelector('.wall-art-title');
    const wallAuthor = piece.querySelector('.wall-art-author');

    if (eraData[eraIndex] && eraData[eraIndex].images.length > 0) {
        const initialArt = eraData[eraIndex].images[0];
        canvas.src = initialArt.src;
        // Set initial text
        wallTitle.innerText = initialArt.title;
        wallAuthor.innerText = initialArt.author;
    }
});

// Automatically change the picture and metadata every 3000ms (3 seconds)
setInterval(() => {
    document.querySelectorAll('.art-piece').forEach((piece) => {
        const eraIndex = piece.getAttribute('data-era');
        const canvas = piece.querySelector('.art-canvas');
        // Select the new metadata elements
        const wallTitle = piece.querySelector('.wall-art-title');
        const wallAuthor = piece.querySelector('.wall-art-author');

        const images = eraData[eraIndex].images;
        if (images && images.length > 1) { 
            wallImageIndices[eraIndex] = (wallImageIndices[eraIndex] + 1) % images.length;
            
            // Access the *full artwork object*
            const newArt = images[wallImageIndices[eraIndex]];
            
            // Update canvas and metadata in sync
            canvas.src = newArt.src;
            wallTitle.innerText = newArt.title;
            wallAuthor.innerText = newArt.author;
        }
    });
}, 3000);


let isFocusing = false;
let focusHoldStartTime = 0; 
let currentSlide = 0;
let currentEraIndex = 0;

const bgMusic = document.getElementById('bg-music');
const sfxFootsteps = document.getElementById('sfx-footsteps'); 
const volumeSlider = document.getElementById('volume-slider');
const muteIcon = document.getElementById('mute-icon');

volumeSlider.value = 0.2;
bgMusic.volume = 0.2;
sfxFootsteps.volume = 1.0; 

let musicStarted = false;
let isMusicMuted = false;

const tryPlayMusic = () => { if (!musicStarted) { bgMusic.play().catch(e => {}); musicStarted = true; } };

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
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); tryPlayMusic(); if (!keys[key]) { keys[key] = true; pressTimes[key] = Date.now(); } });
    btn.addEventListener('touchend', (e) => { e.preventDefault(); keys[key] = false; delete pressTimes[key]; });
});

volumeSlider.addEventListener('input', (e) => {
    let vol = e.target.value; bgMusic.volume = vol; 
    if (isMusicMuted && vol > 0) { isMusicMuted = false; bgMusic.muted = false; }
    updateMuteIcon(vol);
});

muteIcon.addEventListener('click', () => { isMusicMuted = !isMusicMuted; bgMusic.muted = isMusicMuted; updateMuteIcon(volumeSlider.value); });

function updateMuteIcon(vol) {
    if (isMusicMuted || vol == 0) muteIcon.textContent = '🔇';
    else if (vol < 0.5) muteIcon.textContent = '🔉';
    else muteIcon.textContent = '🔊';
}

function updateSprite(imageName) {
    const newPath = `char_images/${imageName}`;
    if (!playerSprite.src.endsWith(newPath)) { playerSprite.src = newPath; playerReflection.src = newPath; }
}

function updateArtworkMeta() {
    const artData = eraData[currentEraIndex].images[currentSlide];
    
    // Normal UI Elements
    const titleEl = document.getElementById('art-title');
    const authorEl = document.getElementById('art-author');
    const descEl = document.getElementById('art-description');
    const rightPanel = document.getElementById('focus-right');
    const detailsPanel = document.getElementById('art-details');

    // Super Zoom UI Elements
    const szTitle = document.getElementById('sz-title');
    const szAuthor = document.getElementById('sz-author');
    const szDesc = document.getElementById('sz-desc');

    rightPanel.classList.remove('active');
    detailsPanel.style.opacity = 0;

    setTimeout(() => {
        // Set Normal UI Text
        titleEl.innerText = artData.title;
        authorEl.innerText = `${artData.author} • ${artData.age}`;
        descEl.innerText = artData.desc;

        // Set Super Zoom UI Text
        szTitle.innerText = artData.title;
        szAuthor.innerText = `${artData.author} • ${artData.age}`;
        szDesc.innerText = artData.desc;

        rightPanel.classList.add('active');
        detailsPanel.style.opacity = 1;
    }, 300); 
}

function loadFocusData(index) {
    const data = eraData[index]; currentEraIndex = index; currentSlide = 0; 
    document.getElementById('era-title').innerText = data.title;
    document.querySelector('#era-focus span').innerText = data.focus;
    
    const track = document.getElementById('slider-track'); track.innerHTML = ''; 
    data.images.forEach(art => {
        let img = document.createElement('img'); img.src = art.src; img.className = 'slide-image'; track.appendChild(img);
    });
    track.style.transform = `translateX(0%)`;
    setTimeout(updateArtworkMeta, 100);
}

function swipeSlider(direction) {
    const totalSlides = eraData[currentEraIndex].images.length;
    currentSlide += direction;
    if (currentSlide < 0) currentSlide = 0;
    if (currentSlide >= totalSlides) currentSlide = totalSlides - 1;
    
    document.getElementById('slider-track').style.transform = `translateX(-${currentSlide * 100}%)`;
    updateArtworkMeta();
}

function gameLoop() {
    let currentSpeedX = 0; let now = Date.now();
    let isMovingHorizontally = false; let wPressed = keys['w'] || keys['up'];
    let isRunning = false; 

    let pCenter = posX + (playerContainer.offsetWidth / 2); let closestArt = null; let closestIndex = null;
    document.querySelectorAll('.art-piece').forEach(art => {
        let artX = parseInt(art.style.left); 
        if (Math.abs(pCenter - artX) < 120) { art.classList.add('near'); closestArt = art; closestIndex = art.getAttribute('data-era'); } 
        else { art.classList.remove('near'); }
    });

    const focusOverlay = document.getElementById('focus-overlay');

    if (isFocusing) {
        if ((keys['a'] || keys['left']) && !pressTimes['swiped']) { swipeSlider(-1); pressTimes['swiped'] = true; }
        else if ((keys['d'] || keys['right']) && !pressTimes['swiped']) { swipeSlider(1); pressTimes['swiped'] = true; }
        if (!keys['a'] && !keys['left'] && !keys['d'] && !keys['right']) delete pressTimes['swiped'];
    }

    if (!isFocusing) {
        if (keys['a'] || keys['left']) { isRunning = (now - (pressTimes['a'] || pressTimes['left'])) >= RUN_DELAY_MS; currentSpeedX = isRunning ? -RUN_SPEED : -WALK_SPEED; updateSprite('A.png'); isMovingHorizontally = true; } 
        else if (keys['d'] || keys['right']) { isRunning = (now - (pressTimes['d'] || pressTimes['right'])) >= RUN_DELAY_MS; currentSpeedX = isRunning ? RUN_SPEED : WALK_SPEED; updateSprite('D.png'); isMovingHorizontally = true; }
    }

    if (isMovingHorizontally) { sfxFootsteps.playbackRate = isRunning ? 1.5 : 1.0; if (sfxFootsteps.paused) sfxFootsteps.play(); } 
    else { if (!sfxFootsteps.paused) { sfxFootsteps.pause(); sfxFootsteps.currentTime = 0; } }

    if (!isMovingHorizontally) {
        if (wPressed) {
            updateSprite('W.png'); 
            if (closestArt && !isFocusing) { isFocusing = true; focusHoldStartTime = Date.now(); loadFocusData(closestIndex); focusOverlay.classList.add('active'); }
            // SUPER ZOOM TRIGGER
            if (isFocusing && (Date.now() - focusHoldStartTime > 3000)) { focusOverlay.classList.add('super-zoom'); }
        } 
        else {
            if (isFocusing) {
                if (focusOverlay.classList.contains('super-zoom')) {
                    focusOverlay.classList.remove('super-zoom');
                    setTimeout(() => { isFocusing = false; focusOverlay.classList.remove('active'); }, 600); 
                } else { isFocusing = false; focusOverlay.classList.remove('active'); }
            }
        }
    }

    posX += currentSpeedX; posX = Math.max(0, Math.min(posX, WORLD_WIDTH - playerContainer.offsetWidth)); playerContainer.style.left = `${posX}px`;

    let cameraX = (window.innerWidth / 2) - posX - (playerContainer.offsetWidth / 2);
    let minCameraX = window.innerWidth - WORLD_WIDTH;
    cameraX = Math.max(minCameraX, Math.min(0, cameraX));
    cameraStage.style.transform = `translateX(${cameraX}px)`;

    let pRect = playerContainer.getBoundingClientRect();
    dynamicLighting.style.setProperty('--light-x', `${pRect.left + pRect.width / 2}px`);
    dynamicLighting.style.setProperty('--light-y', `${pRect.top + pRect.height / 3}px`);

    requestAnimationFrame(gameLoop);
}

function createParticles() {
    const container = document.getElementById('particles-container');
    for (let i = 0; i < 150; i++) { 
        let p = document.createElement('div'); p.classList.add('particle');
        let size = Math.random() * 4 + 1; p.style.width = p.style.height = `${size}px`;
        p.style.left = `${Math.random() * WORLD_WIDTH}px`; p.style.animationDuration = `${Math.random() * 10 + 8}s`;
        p.style.animationDelay = `-${Math.random() * 15}s`; container.appendChild(p);
    }
}
createParticles(); gameLoop();