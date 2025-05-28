document.addEventListener('DOMContentLoaded', function() {
    // Inizializzazione validazione form
    initializeFormValidation();
    
    // Inizializzazione date picker
    initializeDatePickers();
    
    // Caricamento dati prenotazione
    loadBookingData();
});

/**
 * Inizializza la validazione del form dei dati personali
 */
function initializeFormValidation() {
    const personalInfoForm = document.getElementById('personal-info-form');
    
    if (personalInfoForm) {
        personalInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Verifica che tutti i campi obbligatori siano compilati
            const requiredFields = personalInfoForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    showFieldError(field, 'Questo campo è obbligatorio');
                } else {
                    field.classList.remove('error');
                    removeFieldError(field);
                }
            });
            
            // Validazione email
            const emailField = document.getElementById('email');
            if (emailField && emailField.value.trim() && !isValidEmail(emailField.value)) {
                isValid = false;
                emailField.classList.add('error');
                showFieldError(emailField, 'Inserisci un indirizzo email valido');
            }
            
            // Validazione telefono
            const phoneField = document.getElementById('phone');
            if (phoneField && phoneField.value.trim() && !isValidPhone(phoneField.value)) {
                isValid = false;
                phoneField.classList.add('error');
                showFieldError(phoneField, 'Inserisci un numero di telefono valido');
            }
            
            // Validazione data di nascita (età minima 21 anni)
            const birthDateField = document.getElementById('birth-date');
            if (birthDateField && birthDateField.value.trim()) {
                const birthDate = new Date(birthDateField.value);
                const today = new Date();
                const age = calculateAge(birthDate, today);
                
                if (age < 21) {
                    isValid = false;
                    birthDateField.classList.add('error');
                    showFieldError(birthDateField, 'Devi avere almeno 21 anni per noleggiare un\'auto');
                }
            }
            
            // Validazione data scadenza patente
            const licenseExpiryField = document.getElementById('license-expiry-date');
            if (licenseExpiryField && licenseExpiryField.value.trim()) {
                const expiryDate = new Date(licenseExpiryField.value);
                const today = new Date();
                
                if (expiryDate <= today) {
                    isValid = false;
                    licenseExpiryField.classList.add('error');
                    showFieldError(licenseExpiryField, 'La patente deve essere valida');
                }
            }
            
            // Se il form è valido, procedi al pagamento
            if (isValid) {
                // In un'applicazione reale, qui salveremmo i dati e passeremmo alla pagina di pagamento
                window.location.href = 'pagamento.html';
            } else {
                // Scorri fino al primo campo con errore
                const firstErrorField = personalInfoForm.querySelector('.error');
                if (firstErrorField) {
                    firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstErrorField.focus();
                }
            }
        });
        
        // Aggiungi listener per rimuovere gli errori quando l'utente modifica i campi
        const formFields = personalInfoForm.querySelectorAll('input, select');
        formFields.forEach(field => {
            field.addEventListener('input', function() {
                this.classList.remove('error');
                removeFieldError(this);
            });
            
            field.addEventListener('change', function() {
                this.classList.remove('error');
                removeFieldError(this);
            });
        });
    }
}

/**
 * Inizializza i date picker con validazione
 */
function initializeDatePickers() {
    const birthDateInput = document.getElementById('birth-date');
    const licenseIssueDateInput = document.getElementById('license-issue-date');
    const licenseExpiryDateInput = document.getElementById('license-expiry-date');
    
    if (birthDateInput) {
        // Imposta la data massima a 18 anni fa (anche se la validazione richiede 21 anni)
        const today = new Date();
        const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        birthDateInput.max = maxDate.toISOString().split('T')[0];
    }
    
    if (licenseIssueDateInput && licenseExpiryDateInput) {
        // La data di rilascio non può essere nel futuro
        const today = new Date();
        licenseIssueDateInput.max = today.toISOString().split('T')[0];
        
        // La data di scadenza deve essere successiva alla data di rilascio
        licenseIssueDateInput.addEventListener('change', function() {
            if (this.value) {
                licenseExpiryDateInput.min = this.value;
            }
        });
        
        // La data di scadenza deve essere nel futuro
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        licenseExpiryDateInput.min = tomorrow.toISOString().split('T')[0];
    }
}

/**
 * Carica i dati della prenotazione (in un'app reale, questi dati verrebbero dal server)
 */
function loadBookingData() {
    // In un'applicazione reale, qui recupereremmo i dati della prenotazione dal server
    // Per il mockup, utilizziamo dati statici
    
    // Potremmo anche recuperare i dati dell'utente se è già registrato
    const isLoggedIn = false; // In un'app reale, questo valore verrebbe dal server
    
    if (isLoggedIn) {
        // Precompila i campi con i dati dell'utente
        document.getElementById('first-name').value = 'Mario';
        document.getElementById('last-name').value = 'Rossi';
        document.getElementById('email').value = 'mario.rossi@example.com';
        document.getElementById('phone').value = '+39 123 456 7890';
        // ... altri campi
    }
}

/**
 * Mostra un messaggio di errore sotto un campo del form
 */
function showFieldError(field, message) {
    // Rimuovi eventuali messaggi di errore esistenti
    removeFieldError(field);
    
    // Crea il messaggio di errore
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    // Inserisci il messaggio dopo il campo
    field.parentNode.appendChild(errorElement);
}

/**
 * Rimuove il messaggio di errore sotto un campo del form
 */
function removeFieldError(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

/**
 * Verifica se un'email è valida
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Verifica se un numero di telefono è valido
 */
function isValidPhone(phone) {
    // Accetta formati come: +39 123 456 7890, 123-456-7890, (123) 456-7890, ecc.
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}$/;
    return phoneRegex.test(phone);
}

/**
 * Calcola l'età in base alla data di nascita
 */
function calculateAge(birthDate, currentDate) {
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}