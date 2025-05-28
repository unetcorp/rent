document.addEventListener('DOMContentLoaded', function() {
    // Genera un numero di prenotazione casuale se non è già presente
    generateBookingNumber();
    
    // Inizializza le funzionalità della pagina
    initPrintFunctionality();
    initEmailFunctionality();
    initAnimations();
});

/**
 * Genera un numero di prenotazione casuale
 */
function generateBookingNumber() {
    const bookingNumberElement = document.querySelector('.booking-number');
    
    // Se l'elemento esiste e non ha già un numero di prenotazione personalizzato
    if (bookingNumberElement && bookingNumberElement.textContent === 'CR-2023-78945612') {
        // In un'app reale, questo numero verrebbe dal server
        // Per il mockup, generiamo un numero casuale
        const year = new Date().getFullYear();
        const randomPart = Math.floor(10000000 + Math.random() * 90000000);
        const bookingNumber = `CR-${year}-${randomPart}`;
        
        bookingNumberElement.textContent = bookingNumber;
    }
}

/**
 * Inizializza la funzionalità di stampa
 */
function initPrintFunctionality() {
    const printButton = document.querySelector('.confirmation-actions .btn-outline:nth-child(2)');
    
    if (printButton) {
        printButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // In un'app reale, potremmo voler formattare la pagina per la stampa
            // Per il mockup, utilizziamo semplicemente la funzione di stampa del browser
            window.print();
        });
    }
}

/**
 * Inizializza la funzionalità di invio email
 */
function initEmailFunctionality() {
    const emailButton = document.querySelector('.confirmation-actions .btn-outline:nth-child(3)');
    
    if (emailButton) {
        emailButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // In un'app reale, questo aprirebbe un modale o invierebbe una richiesta al server
            // Per il mockup, mostriamo un alert
            alert('La ricevuta è stata inviata alla tua email.');
        });
    }
}

/**
 * Inizializza le animazioni della pagina
 */
function initAnimations() {
    // Animazione per i dettagli della conferma
    animateElements('.confirmation-details > div', 'fadeInUp', 300);
    
    // Animazione per i prossimi passi
    animateElements('.step-item', 'fadeInUp', 200);
}

/**
 * Anima una serie di elementi con un effetto e un ritardo
 * @param {string} selector - Selettore CSS degli elementi da animare
 * @param {string} animationClass - Classe CSS dell'animazione
 * @param {number} delay - Ritardo tra le animazioni in ms
 */
function animateElements(selector, animationClass, delay) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach((element, index) => {
        // Aggiungiamo un ritardo crescente per ogni elemento
        setTimeout(() => {
            element.classList.add(animationClass);
        }, index * delay);
    });
}

// Aggiungiamo stili CSS per le animazioni direttamente nel JavaScript
// In un'app reale, questi sarebbero nel file CSS
(function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .fadeInUp {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        .confirmation-details > div,
        .step-item {
            opacity: 0;
        }
    `;
    document.head.appendChild(style);
})();