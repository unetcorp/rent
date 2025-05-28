document.addEventListener('DOMContentLoaded', function() {
    // Inizializzazione date nel form di ricerca
    initDatePickers();
    
    // Validazione form di ricerca
    initSearchFormValidation();
    
    // Slider testimonianze
    initTestimonialsSlider();
    
    // Animazioni scroll
    initScrollAnimations();
    
    // Menu mobile
    initMobileMenu();
});

// Inizializzazione date nel form di ricerca
function initDatePickers() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const pickupDateInput = document.getElementById('pickup-date');
    const returnDateInput = document.getElementById('return-date');
    
    if (pickupDateInput && returnDateInput) {
        // Formatta la data in YYYY-MM-DD per l'input date
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        
        // Imposta la data minima a oggi
        const todayFormatted = formatDate(today);
        pickupDateInput.min = todayFormatted;
        pickupDateInput.value = todayFormatted;
        
        // Imposta la data minima di restituzione a domani
        const tomorrowFormatted = formatDate(tomorrow);
        returnDateInput.min = tomorrowFormatted;
        returnDateInput.value = tomorrowFormatted;
        
        // Aggiorna la data minima di restituzione quando cambia la data di ritiro
        pickupDateInput.addEventListener('change', function() {
            const newPickupDate = new Date(this.value);
            const newMinReturnDate = new Date(newPickupDate);
            newMinReturnDate.setDate(newMinReturnDate.getDate() + 1);
            
            returnDateInput.min = formatDate(newMinReturnDate);
            
            // Se la data di restituzione è prima della nuova data minima, aggiornala
            if (new Date(returnDateInput.value) <= newPickupDate) {
                returnDateInput.value = formatDate(newMinReturnDate);
            }
        });
    }
}

// Validazione form di ricerca
function initSearchFormValidation() {
    const searchForm = document.querySelector('.search-box form');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const location = document.getElementById('location').value;
            const pickupDate = document.getElementById('pickup-date').value;
            const returnDate = document.getElementById('return-date').value;
            
            if (!location || !pickupDate || !returnDate) {
                alert('Per favore, compila tutti i campi');
                return;
            }
            
            // Simulazione di reindirizzamento alla pagina dei risultati
            window.location.href = `catalogo.html?location=${location}&pickup=${pickupDate}&return=${returnDate}`;
        });
    }
}

// Slider testimonianze
function initTestimonialsSlider() {
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    
    if (testimonialsSlider) {
        // Clona le testimonianze esistenti per creare un effetto di scorrimento infinito
        const testimonials = document.querySelectorAll('.testimonial');
        testimonials.forEach(testimonial => {
            const clone = testimonial.cloneNode(true);
            testimonialsSlider.appendChild(clone);
        });
        
        // Variabili per lo scorrimento automatico
        let scrollPosition = 0;
        const scrollAmount = 2; // pixel per frame
        const scrollDelay = 30; // millisecondi
        
        // Funzione di scorrimento automatico
        function autoScroll() {
            scrollPosition += scrollAmount;
            
            // Resetta la posizione quando si raggiunge la fine
            if (scrollPosition >= testimonialsSlider.scrollWidth / 2) {
                scrollPosition = 0;
            }
            
            testimonialsSlider.scrollLeft = scrollPosition;
            setTimeout(autoScroll, scrollDelay);
        }
        
        // Avvia lo scorrimento automatico dopo un ritardo
        setTimeout(autoScroll, 2000);
        
        // Pausa lo scorrimento quando il mouse è sopra lo slider
        testimonialsSlider.addEventListener('mouseenter', function() {
            clearTimeout(autoScroll);
        });
        
        // Riprendi lo scorrimento quando il mouse esce dallo slider
        testimonialsSlider.addEventListener('mouseleave', function() {
            setTimeout(autoScroll, scrollDelay);
        });
    }
}

// Animazioni scroll
function initScrollAnimations() {
    const elements = document.querySelectorAll('.car-card, .step, .testimonial');
    
    // Funzione per verificare se un elemento è visibile nella viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Funzione per aggiungere la classe 'animate' agli elementi visibili
    function handleScroll() {
        elements.forEach(element => {
            if (isElementInViewport(element)) {
                element.classList.add('animate');
            }
        });
    }
    
    // Aggiungi l'evento scroll
    window.addEventListener('scroll', handleScroll);
    
    // Esegui una volta all'inizio per gli elementi già visibili
    handleScroll();
}

// Menu mobile
function initMobileMenu() {
    const header = document.querySelector('header');
    
    if (header) {
        // Crea il pulsante del menu mobile
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuBtn.style.display = 'none';
        
        // Aggiungi il pulsante all'header
        const container = header.querySelector('.container');
        container.insertBefore(mobileMenuBtn, container.firstChild);
        
        // Funzione per gestire il menu mobile
        function handleMobileMenu() {
            const windowWidth = window.innerWidth;
            const nav = document.querySelector('nav');
            const userActions = document.querySelector('.user-actions');
            
            if (windowWidth <= 768) {
                // Mostra il pulsante del menu mobile
                mobileMenuBtn.style.display = 'block';
                
                // Nascondi il menu e le azioni utente
                nav.style.display = 'none';
                userActions.style.display = 'none';
                
                // Aggiungi la classe per il layout mobile
                header.classList.add('mobile-layout');
            } else {
                // Nascondi il pulsante del menu mobile
                mobileMenuBtn.style.display = 'none';
                
                // Mostra il menu e le azioni utente
                nav.style.display = 'block';
                userActions.style.display = 'flex';
                
                // Rimuovi la classe per il layout mobile
                header.classList.remove('mobile-layout');
            }
        }
        
        // Gestisci il click sul pulsante del menu mobile
        mobileMenuBtn.addEventListener('click', function() {
            const nav = document.querySelector('nav');
            const userActions = document.querySelector('.user-actions');
            
            // Alterna la visibilità del menu e delle azioni utente
            nav.style.display = nav.style.display === 'none' ? 'block' : 'none';
            userActions.style.display = userActions.style.display === 'none' ? 'flex' : 'none';
        });
        
        // Esegui la funzione all'inizio e quando la finestra viene ridimensionata
        handleMobileMenu();
        window.addEventListener('resize', handleMobileMenu);
    }
}

// Funzione per simulare il caricamento delle immagini
function loadImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Aggiungi una classe di caricamento
        img.classList.add('loading');
        
        // Simula il caricamento dell'immagine
        setTimeout(() => {
            img.classList.remove('loading');
            img.classList.add('loaded');
        }, Math.random() * 1000 + 500); // Tempo casuale tra 500ms e 1500ms
    });
}

// Esegui il caricamento delle immagini quando la pagina è caricata
window.addEventListener('load', loadImages);