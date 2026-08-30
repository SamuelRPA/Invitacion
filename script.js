/* ==========================================================================
   INTERACCIONES Y LÓGICA JAVASCRIPT - INVITACIÓN DE 15 AÑOS VALERY
   ========================================================================== */

// Forzar inicio siempre desde la parte superior al recargar la página
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);
    
    // ELEMENTOS DEL DOM
    const waxSeal = document.getElementById('wax-seal');
    const envelope = document.getElementById('envelope');
    const hangingEnvelope = document.getElementById('hanging-envelope');
    const envelopeScreen = document.getElementById('envelope-screen');
    const mainContent = document.getElementById('main-content');
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');

    // BLOQUEAR SCROLL MIENTRAS EL SOBRE ESTÁ EN EL ÁRBOL
    document.body.classList.add('envelope-active');

    // Preparar todas las secciones con la clase de animación
    const animatableSections = document.querySelectorAll('.hero-cover-card, .torn-card, .invitation-footer');
    animatableSections.forEach(section => {
        section.classList.add('section-animate');
    });

    // 1. APERTURA DEL SOBRE: CAÍDA DESDE EL ÁRBOL Y ACERCAMIENTO A PANTALLA
    let isOpening = false;

    function openEnvelope() {
        if (isOpening) return;
        isOpening = true;

        // A. Animación de caída y zoom hacia la pantalla
        if (hangingEnvelope) {
            hangingEnvelope.classList.add('falling');
        }

        // B. Abrir la solapa del sobre mientras está en zoom
        setTimeout(() => {
            if (envelope) envelope.classList.add('open');
        }, 700);

        // C. Transición suave al contenido principal
        setTimeout(() => {
            if (envelopeScreen) envelopeScreen.classList.add('fade-out');
            document.body.classList.remove('envelope-active');
            if (mainContent) mainContent.classList.remove('content-hidden');
            
            // Garantizar scroll al inicio
            window.scrollTo({ top: 0, behavior: 'instant' });

            // Iniciar animaciones de scroll una vez visible el contenido
            initScrollAnimations();
        }, 1400);
    }

    if (waxSeal) {
        waxSeal.addEventListener('click', openEnvelope);
    }
    if (hangingEnvelope) {
        hangingEnvelope.addEventListener('click', (e) => {
            openEnvelope();
        });
    }

    // 2. CONTROL DEL REPRODUCTOR DE MÚSICA (DESDE EL SEGUNDO 5 HASTA EL MINUTO 1:30)
    let isPlaying = false;
    const MUSIC_START_SEC = 5;
    const MUSIC_END_SEC = 90;
    const customPlayerTrigger = document.getElementById('custom-player-trigger');
    const playerPlayIcon = document.getElementById('player-play-icon');
    const playerProgressFill = document.getElementById('player-progress-fill');

    function playAudio() {
        if (!bgMusic) return;

        // Asegurar que comience en el segundo 5 si está antes o pasó del minuto 1:30
        if (bgMusic.currentTime < MUSIC_START_SEC || bgMusic.currentTime >= MUSIC_END_SEC) {
            bgMusic.currentTime = MUSIC_START_SEC;
        }

        bgMusic.play().then(() => {
            isPlaying = true;
            if (musicToggle) musicToggle.classList.add('playing');
            if (playerPlayIcon) playerPlayIcon.className = 'fas fa-pause';
        }).catch((err) => {
            console.log('Autoplay bloqueado o esperando interacción del usuario:', err);
            isPlaying = false;
            if (musicToggle) musicToggle.classList.remove('playing');
            if (playerPlayIcon) playerPlayIcon.className = 'fas fa-play';
        });
    }

    function pauseAudio() {
        if (!bgMusic) return;

        bgMusic.pause();
        isPlaying = false;
        if (musicToggle) musicToggle.classList.remove('playing');
        if (playerPlayIcon) playerPlayIcon.className = 'fas fa-play';
    }

    if (musicToggle) {
        musicToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isPlaying) {
                pauseAudio();
            } else {
                playAudio();
            }
        });
    }

    if (customPlayerTrigger) {
        customPlayerTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isPlaying) {
                pauseAudio();
            } else {
                playAudio();
            }
        });
    }

    // Actualizar barra de progreso y bucle automático de 0:05 a 1:30 (90s)
    if (bgMusic) {
        bgMusic.addEventListener('timeupdate', () => {
            // Si llega al minuto 1:30 (90 seg), reiniciar al segundo 5
            if (bgMusic.currentTime >= MUSIC_END_SEC) {
                bgMusic.currentTime = MUSIC_START_SEC;
            }

            if (playerProgressFill) {
                const elapsed = Math.max(0, bgMusic.currentTime - MUSIC_START_SEC);
                const totalDuration = MUSIC_END_SEC - MUSIC_START_SEC;
                const pct = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
                playerProgressFill.style.width = pct + '%';
            }
        });

        // Asegurar inicio en segundo 5 al cargar metadata
        bgMusic.addEventListener('loadedmetadata', () => {
            if (bgMusic.currentTime < MUSIC_START_SEC) {
                bgMusic.currentTime = MUSIC_START_SEC;
            }
        });
    }

    // 3. RELOJ INTERACTIVO DE CUENTA REGRESIVA (FECHA: 21 DE NOVIEMBRE DE 2026 - 18:00 HRS)
    const targetDate = new Date('2026-11-21T18:00:00-04:00').getTime();

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            if (daysEl) daysEl.innerText = "00";
            if (hoursEl) hoursEl.innerText = "00";
            if (minutesEl) minutesEl.innerText = "00";
            if (secondsEl) secondsEl.innerText = "00";
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (daysEl) daysEl.innerText = days < 10 ? '0' + days : days;
        if (hoursEl) hoursEl.innerText = hours < 10 ? '0' + hours : hours;
        if (minutesEl) minutesEl.innerText = minutes < 10 ? '0' + minutes : minutes;
        if (secondsEl) secondsEl.innerText = seconds < 10 ? '0' + seconds : seconds;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // 4. ANIMACIÓN AL HACER SCROLL (REVEAL FIABLE DE SECCIONES)
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.08,
            rootMargin: "0px 0px -40px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatableSections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            // Si la sección ya está visible en la parte superior, revelarla de inmediato con ligero stagger
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                setTimeout(() => {
                    section.classList.add('visible');
                }, index * 120);
            } else {
                observer.observe(section);
            }
        });
    }

});
