document.addEventListener('DOMContentLoaded', function() {
    // Inizializzazione gestione metodi di pagamento
    initializePaymentMethods();
    
    // Inizializzazione validazione form carta di credito
    initializeCreditCardValidation();
    
    // Inizializzazione form PayPal
    initializePayPalForm();
    
    // Inizializzazione form bonifico bancario
    initializeBankTransferForm();
});

/**
 * Inizializza la gestione dei metodi di pagamento
 */
function initializePaymentMethods() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    const paymentForms = document.querySelectorAll('.payment-form');
    
    paymentMethods.forEach(method => {
        const radioInput = method.querySelector('input[type="radio"]');
        
        // Aggiungi listener per il cambio di metodo di pagamento
        radioInput.addEventListener('change', function() {
            // Rimuovi la classe active da tutti i metodi
            paymentMethods.forEach(m => m.classList.remove('active'));
            
            // Aggiungi la classe active al metodo selezionato
            method.classList.add('active');
            
            // Nascondi tutti i form di pagamento
            paymentForms.forEach(form => form.classList.remove('active'));
            
            // Mostra il form corrispondente al metodo selezionato
            const formId = `${this.value}-form`;
            document.getElementById(formId).classList.add('active');
        });
    });
}

/**
 * Inizializza la validazione del form della carta di credito
 */
function initializeCreditCardValidation() {
    const paymentForm = document.getElementById('payment-form');
    const cardNumberInput = document.getElementById('card-number');
    const cardExpiryInput = document.getElementById('card-expiry');
    const cardCvcInput = document.getElementById('card-cvc');
    const cardHolderInput = document.getElementById('card-holder');
    const cardTypeIcon = document.querySelector('.card-type-icon i');
    
    if (paymentForm) {
        // Formattazione e validazione numero carta
        cardNumberInput.addEventListener('input', function(e) {
            // Rimuovi tutti i caratteri non numerici
            let value = this.value.replace(/\D/g, '');
            
            // Limita a 16 cifre
            if (value.length > 16) {
                value = value.slice(0, 16);
            }
            
            // Formatta con spazi ogni 4 cifre
            let formattedValue = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            
            // Aggiorna il valore del campo
            this.value = formattedValue;
            
            // Identifica il tipo di carta
            identifyCardType(value, cardTypeIcon);
        });
        
        // Formattazione e validazione data di scadenza
        cardExpiryInput.addEventListener('input', function(e) {
            // Rimuovi tutti i caratteri non numerici
            let value = this.value.replace(/\D/g, '');
            
            // Limita a 4 cifre
            if (value.length > 4) {
                value = value.slice(0, 4);
            }
            
            // Formatta come MM/AA
            if (value.length > 2) {
                this.value = value.slice(0, 2) + '/' + value.slice(2);
            } else {
                this.value = value;
            }
        });
        
        // Validazione CVC
        cardCvcInput.addEventListener('input', function(e) {
            // Rimuovi tutti i caratteri non numerici
            let value = this.value.replace(/\D/g, '');
            
            // Limita a 3 o 4 cifre (a seconda del tipo di carta)
            if (value.length > 4) {
                value = value.slice(0, 4);
            }
            
            // Aggiorna il valore del campo
            this.value = value;
        });
        
        // Validazione form al submit
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Verifica che tutti i campi obbligatori siano compilati
            const requiredFields = paymentForm.querySelectorAll('[required]');
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
            
            // Validazione specifica per la carta di credito
            if (cardNumberInput.value.trim()) {
                const cardNumber = cardNumberInput.value.replace(/\D/g, '');
                if (cardNumber.length < 13 || cardNumber.length > 16 || !isValidLuhn(cardNumber)) {
                    isValid = false;
                    cardNumberInput.classList.add('error');
                    showFieldError(cardNumberInput, 'Numero di carta non valido');
                }
            }
            
            // Validazione data di scadenza
            if (cardExpiryInput.value.trim()) {
                const expiry = cardExpiryInput.value.split('/');
                if (expiry.length !== 2 || !isValidExpiry(expiry[0], expiry[1])) {
                    isValid = false;
                    cardExpiryInput.classList.add('error');
                    showFieldError(cardExpiryInput, 'Data di scadenza non valida');
                }
            }
            
            // Validazione CVC
            if (cardCvcInput.value.trim()) {
                const cvc = cardCvcInput.value;
                if (cvc.length < 3) {
                    isValid = false;
                    cardCvcInput.classList.add('error');
                    showFieldError(cardCvcInput, 'CVC non valido');
                }
            }
            
            // Se il form è valido, simula il pagamento
            if (isValid) {
                // Mostra un indicatore di caricamento
                const submitButton = paymentForm.querySelector('button[type="submit"]');
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Elaborazione in corso...';
                
                // Simula una richiesta di pagamento (in un'app reale, qui invieremmo i dati al server)
                setTimeout(function() {
                    // Reindirizza alla pagina di conferma
                    window.location.href = 'conferma.html';
                }, 2000);
            }
        });
        
        // Aggiungi listener per rimuovere gli errori quando l'utente modifica i campi
        const formFields = paymentForm.querySelectorAll('input');
        formFields.forEach(field => {
            field.addEventListener('input', function() {
                this.classList.remove('error');
                removeFieldError(this);
            });
        });
    }
}

/**
 * Inizializza il form di PayPal
 */
function initializePayPalForm() {
    const paypalButton = document.querySelector('.btn-paypal');
    
    if (paypalButton) {
        paypalButton.addEventListener('click', function() {
            // In un'app reale, qui reindirizzaremmo a PayPal
            // Per il mockup, simuliamo il reindirizzamento
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Reindirizzamento a PayPal...';
            
            setTimeout(function() {
                window.location.href = 'conferma.html';
            }, 2000);
        });
    }
}

/**
 * Inizializza il form del bonifico bancario
 */
function initializeBankTransferForm() {
    const confirmButton = document.getElementById('confirm-bank-transfer');
    
    if (confirmButton) {
        confirmButton.addEventListener('click', function() {
            // In un'app reale, qui invieremmo i dati al server
            // Per il mockup, simuliamo la conferma
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Conferma in corso...';
            
            setTimeout(function() {
                window.location.href = 'conferma.html';
            }, 2000);
        });
    }
}

/**
 * Identifica il tipo di carta di credito in base al numero
 */
function identifyCardType(cardNumber, iconElement) {
    // Rimuovi tutte le classi esistenti tranne fa-*
    iconElement.className = '';
    iconElement.classList.add('fab');
    
    // Identifica il tipo di carta in base ai primi numeri
    if (cardNumber.startsWith('4')) {
        // Visa
        iconElement.classList.add('fa-cc-visa');
    } else if (cardNumber.startsWith('5')) {
        // MasterCard
        iconElement.classList.add('fa-cc-mastercard');
    } else if (cardNumber.startsWith('3')) {
        // American Express
        iconElement.classList.add('fa-cc-amex');
    } else if (cardNumber.startsWith('6')) {
        // Discover
        iconElement.classList.add('fa-cc-discover');
    } else {
        // Default
        iconElement.classList.add('fa-credit-card');
        iconElement.classList.remove('fab');
        iconElement.classList.add('fas');
    }
}

/**
 * Verifica se un numero di carta è valido utilizzando l'algoritmo di Luhn
 */
function isValidLuhn(cardNumber) {
    let sum = 0;
    let shouldDouble = false;
    
    // Itera da destra a sinistra
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i));
        
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    
    return sum % 10 === 0;
}

/**
 * Verifica se una data di scadenza è valida
 */
function isValidExpiry(month, year) {
    // Converti in numeri
    const expiryMonth = parseInt(month, 10);
    const expiryYear = parseInt(year, 10) + 2000; // Assumiamo che sia 20XX
    
    // Verifica che il mese sia valido (1-12)
    if (expiryMonth < 1 || expiryMonth > 12) {
        return false;
    }
    
    // Ottieni la data corrente
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // getMonth() restituisce 0-11
    const currentYear = now.getFullYear();
    
    // Verifica che la data non sia nel passato
    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
        return false;
    }
    
    return true;
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
    const parent = field.parentNode;
    if (parent.classList.contains('card-input-wrapper') || parent.classList.contains('cvc-input-wrapper')) {
        parent.parentNode.appendChild(errorElement);
    } else {
        parent.appendChild(errorElement);
    }
}

/**
 * Rimuove il messaggio di errore sotto un campo del form
 */
function removeFieldError(field) {
    const parent = field.parentNode;
    let container;
    
    if (parent.classList.contains('card-input-wrapper') || parent.classList.contains('cvc-input-wrapper')) {
        container = parent.parentNode;
    } else {
        container = parent;
    }
    
    const errorElement = container.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}