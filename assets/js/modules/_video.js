export function initVideo() {
    const videoWrapper = document.querySelector('.youtube-video');
    if (!videoWrapper) return;
    
    const videoId = videoWrapper.dataset.videoId;
    const placeholder = videoWrapper.querySelector('.video-placeholder');
    const playButton = videoWrapper.querySelector('.play-button');
    
    // Si no hay videoId, no hacemos nada
    if (!videoId) {
        console.warn('No se encontró videoId para el video de YouTube');
        return;
    }
    
    // Crear iframe de YouTube
    function loadYouTubeVideo() {
        // Mostrar indicador de carga
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'video-loading';
        videoWrapper.appendChild(loadingDiv);
        
        // Crear iframe
        const iframe = document.createElement('iframe');
        iframe.className = 'youtube-iframe';
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
        iframe.title = 'Video de presentación - Consultores de Salud JS';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.loading = 'lazy';
        
        // Cuando el iframe carga, remover loading
        iframe.onload = () => {
            loadingDiv.remove();
        };
        
        // Reemplazar placeholder con iframe
        placeholder.style.display = 'none';
        videoWrapper.appendChild(iframe);
        
        // Enviar evento a Google Analytics (si está configurado)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'video_play', {
                'event_category': 'engagement',
                'event_label': 'youtube_video'
            });
        }
    }
    
    // Event listeners
    if (playButton) {
        playButton.addEventListener('click', loadYouTubeVideo);
        playButton.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                loadYouTubeVideo();
            }
        });
    }
    
    placeholder.addEventListener('click', loadYouTubeVideo);
    
    // También permitir teclado
    placeholder.setAttribute('tabindex', '0');
    placeholder.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            loadYouTubeVideo();
        }
    });
    
    // Para videos HTML5 locales (si decides usarlos)
    const html5Video = document.querySelector('.html5-video video');
    if (html5Video) {
        // Añadir funcionalidad extra si es necesario
        html5Video.addEventListener('play', () => {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'video_play', {
                    'event_category': 'engagement',
                    'event_label': 'html5_video'
                });
            }
        });
    }
}

// Alternativa: si prefieres una solución más simple sin módulos
export function initSimpleVideo() {
    const videoContainers = document.querySelectorAll('.video-wrapper');
    
    videoContainers.forEach(container => {
        if (container.classList.contains('youtube-video')) {
            const videoId = container.dataset.videoId;
            const placeholder = container.querySelector('.video-placeholder');
            
            if (!videoId || !placeholder) return;
            
            placeholder.addEventListener('click', function() {
                const iframe = document.createElement('iframe');
                iframe.className = 'youtube-iframe';
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                iframe.title = 'Video explicativo';
                iframe.allow = 'autoplay; encrypted-media';
                iframe.allowFullscreen = true;
                
                placeholder.style.display = 'none';
                container.appendChild(iframe);
            });
        }
    });
}