export function initNavigation() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMobile = document.getElementById('navMobile');
    const header = document.querySelector('.header');
    
    if (!mobileMenuToggle || !navMobile) return;
    
    // Toggle del menú móvil
    function toggleMobileMenu() {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        
        // Actualizar atributos ARIA
        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
        navMobile.hidden = isExpanded;
        
        // Toggle clases
        mobileMenuToggle.classList.toggle('active');
        navMobile.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Prevenir scroll cuando el menú está abierto
        if (!isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    // Cerrar menú al hacer clic en un enlace
    function closeMobileMenu() {
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        navMobile.hidden = true;
        mobileMenuToggle.classList.remove('active');
        navMobile.classList.remove('active');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
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
    
    // Cerrar menú al hacer clic en enlaces
    document.querySelectorAll('.nav-mobile a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (navMobile.hidden) return;
        
        const isClickInsideMenu = navMobile.contains(e.target);
        const isClickOnToggle = mobileMenuToggle.contains(e.target);
        
        if (!isClickInsideMenu && !isClickOnToggle) {
            closeMobileMenu();
        }
    });
    
    // Cerrar menú con Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !navMobile.hidden) {
            closeMobileMenu();
        }
    });
    
    // Scroll event
    window.addEventListener('scroll', handleScroll);
    
    // Inicializar
    handleScroll(); // Para estado inicial
    
    // Log
    console.log('Navegación móvil inicializada');
}