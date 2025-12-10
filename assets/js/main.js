// ===== NAVEGACIÓN MÓVIL MEJORADA =====
function initNavigation() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMobile = document.getElementById('navMobile');
    const navOverlay = document.getElementById('navOverlay');
    const header = document.querySelector('.header');
    
    if (!mobileMenuToggle || !navMobile || !navOverlay) return;
    
    // Toggle del menú móvil
    function openMobileMenu() {
        mobileMenuToggle.classList.add('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        navMobile.classList.add('active');
        navOverlay.classList.add('active');
        document.body.classList.add('menu-open');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMobileMenu() {
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        navMobile.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
    }
    
    function toggleMobileMenu() {
        if (navMobile.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
    
    // Cambiar header en scroll
    function handleScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Event Listeners
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    navOverlay.addEventListener('click', closeMobileMenu);
    
    // Cerrar menú al hacer clic en enlaces
    document.querySelectorAll('.nav-mobile a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Cerrar menú con Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMobile.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Scroll event
    window.addEventListener('scroll', handleScroll);
    
    // Inicializar
    handleScroll();
}

// ===== SLIDER SIMPLE (sin progress bar) =====
function initSimpleSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const autoplayToggle = document.querySelector('.autoplay-toggle');
    
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    let isAutoPlaying = true;
    let autoPlayInterval;
    
    // Mostrar slide específico
    function showSlide(index) {
        // Validar índice
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        // Ocultar slide actual
        slides[currentSlide].classList.remove('active');
        slides[currentSlide].style.opacity = '0';
        slides[currentSlide].style.visibility = 'hidden';
        
        // Remover clase active de indicadores
        if (indicators[currentSlide]) {
            indicators[currentSlide].classList.remove('active');
        }
        
        // Actualizar slide actual
        currentSlide = index;
        
        // Mostrar nuevo slide
        slides[currentSlide].classList.add('active');
        slides[currentSlide].style.opacity = '1';
        slides[currentSlide].style.visibility = 'visible';
        
        // Actualizar indicador
        if (indicators[currentSlide]) {
            indicators[currentSlide].classList.add('active');
        }
    }
    
    // Slide siguiente
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    // Slide anterior
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // Ir a slide específico
    function goToSlide(index) {
        showSlide(index);
    }
    
    // Autoplay
    function startAutoPlay() {
        stopAutoPlay();
        
        autoPlayInterval = setInterval(() => {
            nextSlide();
        }, 5000);
        
        // Actualizar ícono del toggle
        if (autoplayToggle) {
            autoplayToggle.innerHTML = '<i class="fas fa-pause" aria-hidden="true"></i>';
            autoplayToggle.setAttribute('aria-label', 'Pausar carrusel');
        }
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
        
        // Actualizar ícono del toggle
        if (autoplayToggle) {
            autoplayToggle.innerHTML = '<i class="fas fa-play" aria-hidden="true"></i>';
            autoplayToggle.setAttribute('aria-label', 'Reanudar carrusel');
        }
    }
    
    function toggleAutoPlay() {
        isAutoPlaying = !isAutoPlaying;
        
        if (isAutoPlaying) {
            startAutoPlay();
        } else {
            stopAutoPlay();
        }
    }
    
    // Inicializar slider
    function initSlider() {
        // Mostrar primer slide
        showSlide(0);
        
        // Iniciar autoplay
        startAutoPlay();
        
        // Configurar eventos
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                if (isAutoPlaying) {
                    stopAutoPlay();
                    startAutoPlay();
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                if (isAutoPlaying) {
                    stopAutoPlay();
                    startAutoPlay();
                }
            });
        }
        
        // Indicadores
        if (indicators.length > 0) {
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    goToSlide(index);
                    if (isAutoPlaying) {
                        stopAutoPlay();
                        startAutoPlay();
                    }
                });
            });
        }
        
        // Toggle autoplay (opcional)
        if (autoplayToggle) {
            autoplayToggle.addEventListener('click', toggleAutoPlay);
        }
    }
    
    // Inicializar
    initSlider();
}


// ===== VIDEO SIMPLE =====
// ===== VIDEO YOUTUBE MEJORADO =====
function initVideo() {
    const videoWrapper = document.querySelector('.youtube-video');
    if (!videoWrapper) return;
    
    const videoId = videoWrapper.dataset.videoId;
    console.log('Video ID encontrado:', videoId);
    
    if (!videoId) {
        console.warn('No hay video ID configurado');
        return;
    }
    
    const placeholder = videoWrapper.querySelector('.video-placeholder');
    const playButton = videoWrapper.querySelector('.play-button');
    const thumbnail = videoWrapper.querySelector('.video-thumbnail img');
    
    // Cargar thumbnail de YouTube si no hay imagen local
    if (thumbnail && !thumbnail.src.includes('assets/images/')) {
        thumbnail.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        thumbnail.onerror = function() {
            this.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        };
    }
    
    function loadVideo() {
        console.log('Cargando video de YouTube con sonido...');
        
        // Crear iframe con parámetros optimizados
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
        iframe.title = 'Video explicativo - Consultores de Salud JS';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        
        // Estilos
        iframe.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 0;
            border-radius: inherit;
        `;
        
        // Para habilitar sonido en móviles
        iframe.setAttribute('playsinline', '1');
        iframe.setAttribute('webkit-playsinline', '1');
        
        // Reemplazar contenido
        videoWrapper.innerHTML = '';
        videoWrapper.appendChild(iframe);
        
        // Forzar sonido (funciona en algunos navegadores)
        setTimeout(() => {
            iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        }, 1000);
        
        // Evento para analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'video_play', {
                'event_category': 'engagement',
                'event_label': 'youtube_video'
            });
        }
    }
    
    // Agregar eventos
    if (playButton) {
        playButton.addEventListener('click', loadVideo);
        playButton.addEventListener('touchend', loadVideo); // Para móviles
    }
    
    if (placeholder) {
        placeholder.addEventListener('click', loadVideo);
        placeholder.addEventListener('touchend', loadVideo); // Para móviles
        placeholder.style.cursor = 'pointer';
        
        // Hacerlo focusable para accesibilidad
        placeholder.setAttribute('tabindex', '0');
        placeholder.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                loadVideo();
            }
        });
    }
    
    // Mostrar mensaje si el video no está disponible
    fetch(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`)
        .then(response => {
            if (!response.ok) {
                console.warn('Video de YouTube no disponible');
                if (placeholder) {
                    placeholder.innerHTML = `
                        <div style="text-align: center; padding: 2rem; color: white;">
                            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                            <p>Video temporalmente no disponible</p>
                            <a href="contacto.html" style="color: #60a5fa; text-decoration: underline;">Contactanos para más información</a>
                        </div>
                    `;
                }
            }
        })
        .catch(error => console.log('Error verificando video:', error));
}


// ===== INICIALIZAR TODO =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('Consultores de Salud JS - Sitio cargado');
    
    // Inicializar módulos
    initNavigation();
    initSimpleSlider();
    initVideo(); // ✅ AGREGAR ESTA LÍNEA
    
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Actualizar año en footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    
    // Lazy loading para imágenes
    initLazyLoading();
});

// Lazy loading
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}