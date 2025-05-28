document.addEventListener('DOMContentLoaded', function() {
    // Galleria immagini
    initializeGallery();
    
    // Inizializzazione date picker
    initializeDatePickers();
    
    // Calcolo prezzo dinamico
    initializePriceCalculator();
    
    // Validazione form di prenotazione
    initializeFormValidation();
    
    // Caricamento dati auto da URL
    loadCarDataFromUrl();
});

/**
 * Inizializza la galleria di immagini con anteprima
 */
function initializeGallery() {
    const mainImage = document.getElementById('main-car-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Aggiorna l'immagine principale
            const imageUrl = this.getAttribute('data-image');
            mainImage.src = imageUrl;
            
            // Aggiorna la classe active
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            this.classList.add('active');
            
            // Aggiungi effetto di transizione
            mainImage.classList.add('fade');
            setTimeout(() => {
                mainImage.classList.remove('fade');
            }, 300);
        });
    });
}

/**
 * Inizializza i date picker con validazione
 */
function initializeDatePickers() {
    const pickupDateInput = document.getElementById('pickup-date');
    const returnDateInput = document.getElementById('return-date');
    
    // Imposta la data minima a oggi
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];
    pickupDateInput.min = todayFormatted;
    returnDateInput.min = todayFormatted;
    
    // Imposta la data di ritiro predefinita a oggi
    pickupDateInput.value = todayFormatted;
    
    // Imposta la data di consegna predefinita a 7 giorni dopo
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const nextWeekFormatted = nextWeek.toISOString().split('T')[0];
    returnDateInput.value = nextWeekFormatted;
    
    // Aggiorna la data minima di consegna quando cambia la data di ritiro
    pickupDateInput.addEventListener('change', function() {
        const pickupDate = new Date(this.value);
        const minReturnDate = new Date(pickupDate);
        minReturnDate.setDate(pickupDate.getDate() + 1);
        
        const minReturnDateFormatted = minReturnDate.toISOString().split('T')[0];
        returnDateInput.min = minReturnDateFormatted;
        
        // Se la data di consegna è precedente alla nuova data minima, aggiornala
        if (new Date(returnDateInput.value) < minReturnDate) {
            returnDateInput.value = minReturnDateFormatted;
        }
        
        // Ricalcola il prezzo
        updateBookingSummary();
    });
    
    // Aggiorna il riepilogo quando cambia la data di consegna
    returnDateInput.addEventListener('change', function() {
        updateBookingSummary();
    });
}

/**
 * Inizializza il calcolatore di prezzo dinamico
 */
function initializePriceCalculator() {
    // Prezzo base giornaliero
    const baseDailyPrice = 80;
    
    // Elementi extra
    const extraCheckboxes = document.querySelectorAll('input[name="extra"]');
    extraCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateBookingSummary);
    });
    
    // Opzioni assicurazione
    const insuranceOptions = document.querySelectorAll('input[name="insurance"]');
    insuranceOptions.forEach(option => {
        option.addEventListener('change', updateBookingSummary);
    });
    
    // Calcolo iniziale
    updateBookingSummary();
    
    /**
     * Aggiorna il riepilogo della prenotazione e il prezzo totale
     */
    function updateBookingSummary() {
        const pickupDate = new Date(document.getElementById('pickup-date').value);
        const returnDate = new Date(document.getElementById('return-date').value);
        
        // Calcola il numero di giorni
        const diffTime = Math.abs(returnDate - pickupDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Calcola il prezzo base
        const basePrice = baseDailyPrice * diffDays;
        
        // Aggiorna il testo del noleggio base
        document.querySelector('.summary-items .summary-item:first-child span:first-child')
            .textContent = `Noleggio auto (${diffDays} giorni)`;
        document.querySelector('.summary-items .summary-item:first-child span:last-child')
            .textContent = `€${basePrice.toFixed(2)}`;
        
        // Calcola il prezzo degli extra
        let extrasPrice = 0;
        const selectedExtras = document.querySelectorAll('input[name="extra"]:checked');
        selectedExtras.forEach(extra => {
            switch(extra.value) {
                case 'gps':
                    extrasPrice += 5 * diffDays;
                    break;
                case 'child-seat':
                    extrasPrice += 7 * diffDays;
                    break;
                case 'additional-driver':
                    extrasPrice += 10 * diffDays;
                    break;
                case 'wifi':
                    extrasPrice += 8 * diffDays;
                    break;
            }
        });
        
        // Aggiorna il prezzo degli extra
        document.getElementById('extras-cost').querySelector('span:last-child')
            .textContent = `€${extrasPrice.toFixed(2)}`;
        
        // Calcola il prezzo dell'assicurazione
        let insurancePrice = 0;
        const selectedInsurance = document.querySelector('input[name="insurance"]:checked').value;
        switch(selectedInsurance) {
            case 'medium':
                insurancePrice = 15 * diffDays;
                break;
            case 'full':
                insurancePrice = 25 * diffDays;
                break;
            // L'assicurazione base è inclusa nel prezzo
        }
        
        // Aggiorna il prezzo dell'assicurazione
        document.getElementById('insurance-cost').querySelector('span:last-child')
            .textContent = `€${insurancePrice.toFixed(2)}`;
        
        // Calcola il prezzo totale
        const totalPrice = basePrice + extrasPrice + insurancePrice;
        document.getElementById('total-cost').textContent = `€${totalPrice.toFixed(2)}`;
    }
}

/**
 * Inizializza la validazione del form di prenotazione
 */
function initializeFormValidation() {
    const bookingForm = document.getElementById('booking-form');
    
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Verifica che tutti i campi obbligatori siano compilati
        const requiredFields = bookingForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        // Verifica che la data di consegna sia successiva alla data di ritiro
        const pickupDate = new Date(document.getElementById('pickup-date').value);
        const returnDate = new Date(document.getElementById('return-date').value);
        
        if (returnDate <= pickupDate) {
            isValid = false;
            document.getElementById('return-date').classList.add('error');
            alert('La data di consegna deve essere successiva alla data di ritiro.');
        }
        
        // Se il form è valido, simula l'invio
        if (isValid) {
            // In un'applicazione reale, qui invieremmo i dati al server
            // Per il mockup, mostriamo un messaggio di conferma
            alert('Prenotazione completata con successo! Riceverai una email di conferma a breve.');
            
            // Reindirizza alla pagina di conferma (in un'app reale)
            // window.location.href = 'conferma-prenotazione.html';
        }
    });
}

/**
 * Carica i dati dell'auto dall'URL
 */
function loadCarDataFromUrl() {
    // In un'applicazione reale, qui recupereremmo l'ID dell'auto dall'URL
    // e caricheremmo i dati dal server
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('id');
    
    // Per il mockup, utilizziamo dati statici
    // In un'app reale, faremmo una chiamata AJAX per ottenere i dati dell'auto
    if (carId) {
        console.log(`Caricamento dati per l'auto con ID: ${carId}`);
        // Qui potremmo aggiornare dinamicamente i contenuti della pagina
        // in base all'ID dell'auto
    }
}