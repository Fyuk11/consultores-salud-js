export function initHeroSlider() {
    const sliderContainer = document.querySelector('.hero-slides-container');
    if (!sliderContainer) return;
    
    const slides = document.querySelectorAll('.hero-slide');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const indicators = document.querySelectorAll('.indicator');
    const autoplayToggle = document.querySelector('.autoplay-toggle');
    const progressBar = document.querySelector('.progress-bar');
    
    let currentSlide = 0;
    let totalSlides = slides.length;
    let isAutoPlaying = true;
    let autoPlayInterval;
    let progressInterval;
    const slideDuration = 5000; // 5 segundos por slide
    
    // Inicializar slider
    function initSlider() {
        if (slides.length === 0) return;
        
        // Mostrar primer slide
        showSlide(currentSlide);
        
        // Iniciar autoplay
        if (isAutoPlaying) {
            startAutoPlay();
        }
        
        // Configurar eventos
        setupEventListeners();
    }
    
    // Mostrar slide específico
    function showSlide(index) {
        // Validar índice
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        
        // Ocultar slide actual
        slides[currentSlide].classList.remove('active');
        slides[currentSlide].style.opacity = '0';
        slides[currentSlide].style.visibility = 'hidden';
        
        // Remover clase active de indicadores
        indicators[currentSlide].classList.remove('active');
        
        // Actualizar slide actual
        currentSlide = index;
        
        // Mostrar nuevo slide
        slides[currentSlide].classList.add('active');
        slides[currentSlide].style.opacity = '1';
        slides[currentSlide].style.visibility = 'visible';
        
        // Actualizar indicador
        indicators[currentSlide].classList.add('active');
        
        // Reiniciar progress bar
        resetProgressBar();
        
        // Enviar evento analytics
        sendSlideAnalytics(currentSlide);
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
        stopAutoPlay(); // Limpiar intervalos previos
        
        autoPlayInterval = setInterval(() => {
            nextSlide();
        }, slideDuration);
        
        // Iniciar progress bar
        startProgressBar();
        
        // Actualizar ícono del toggle
        if (autoplayToggle) {
            autoplayToggle.innerHTML = '<i class="fas fa-pause" aria-hidden="true"></i>';
            autoplayToggle.setAttribute('aria-label', 'Pausar carrusel');
        }
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
        
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
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
    
    // Progress bar
    function startProgressBar() {
        if (!progressBar) return;
        
        let progress = 0;
        const step = 100 / (slideDuration / 50); // Actualizar cada 50ms
        
        progressBar.style.width = '0%';
        
        progressInterval = setInterval(() => {
            progress += step;
            if (progress <= 100) {
                progressBar.style.width = `${progress}%`;
            }
        }, 50);
    }
    
    function resetProgressBar() {
        if (!progressBar) return;
        
        progressBar.style.width = '0%';
        
        if (isAutoPlaying) {
            startProgressBar();
        }
    }
    
    // Configurar event listeners
    function setupEventListeners() {
        // Botones anterior/siguiente
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
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                goToSlide(index);
                if (isAutoPlaying) {
                    stopAutoPlay();
                    startAutoPlay();
                }
            });
        });
        
        // Toggle autoplay
        if (autoplayToggle) {
            autoplayToggle.addEventListener('click', toggleAutoPlay);
        }
        
        // Pausar autoplay al hacer hover
        sliderContainer.addEventListener('mouseenter', () => {
            if (isAutoPlaying) {
                stopAutoPlay();
            }
        });
        
        sliderContainer.addEventListener('mouseleave', () => {
            if (isAutoPlaying) {
                startAutoPlay();
            }
        });
        
        // Navegación por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                if (isAutoPlaying) {
                    stopAutoPlay();
                    startAutoPlay();
                }
            }
            
            if (e.key === 'ArrowRight') {
                nextSlide();
                if (isAutoPlaying) {
                    stopAutoPlay();
                    startAutoPlay();
                }
            }
            
            if (e.key === ' ') {
                toggleAutoPlay();
            }
        });
        
        // Detectar cuando el usuario deja de interactuar
        let userInteractionTimeout;
        
        function resetUserInteraction() {
            if (userInteractionTimeout) clearTimeout(userInteractionTimeout);
            
            userInteractionTimeout = setTimeout(() => {
                if (isAutoPlaying && !autoPlayInterval) {
                    startAutoPlay();
                }
            }, 3000); // Reanudar después de 3 segundos de inactividad
        }
        
        // Eventos de interacción del usuario
        sliderContainer.addEventListener('click', resetUserInteraction);
        sliderContainer.addEventListener('touchstart', resetUserInteraction);
        sliderContainer.addEventListener('keydown', resetUserInteraction);
    }
    
    // Analytics
    function sendSlideAnalytics(slideIndex) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'slide_view', {
                'event_category': 'engagement',
                'event_label': `slide_${slideIndex + 1}`
            });
        }
        
        // También para console
        console.log(`Slide ${slideIndex + 1} activo`);
    }
    
    // Inicializar cuando el DOM esté listo
    initSlider();
    
    // Pausar cuando la página no esté visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoPlay();
        } else if (isAutoPlaying) {
            startAutoPlay();
        }
    });
    
    // Retornar funciones públicas si es necesario
    return {
        nextSlide,
        prevSlide,
        goToSlide,
        toggleAutoPlay
    };
}

// Versión simplificada si prefieres
export function initSimpleSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    
    if (slides.length === 0) return;
    
    function showSlide(index) {
        // Ocultar todos
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.opacity = '0';
        });
        
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Mostrar slide actual
        slides[index].classList.add('active');
        slides[index].style.opacity = '1';
        indicators[index].classList.add('active');
        currentSlide = index;
    }
    
    // Auto slide
    setInterval(() => {
        let nextSlide = currentSlide + 1;
        if (nextSlide >= slides.length) nextSlide = 0;
        showSlide(nextSlide);
    }, 5000);
    
    // Indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
        });
    });
}