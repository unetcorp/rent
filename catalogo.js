document.addEventListener('DOMContentLoaded', function() {
    // Inizializzazione filtri e ordinamento
    initFilters();
    
    // Inizializzazione cambio visualizzazione (griglia/lista)
    initViewToggle();
    
    // Inizializzazione paginazione
    initPagination();
    
    // Recupera e applica i parametri di ricerca dall'URL
    applySearchParamsFromUrl();
});

// Funzione per inizializzare i filtri
function initFilters() {
    // Slider prezzo
    const priceSlider = document.getElementById('price-filter');
    const minPriceDisplay = document.getElementById('min-price');
    const maxPriceDisplay = document.getElementById('max-price');
    
    if (priceSlider) {
        priceSlider.addEventListener('input', function() {
            maxPriceDisplay.textContent = `€${this.value}`;
            applyFilters();
        });
    }
    
    // Checkbox filtri
    const filterCheckboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Pulsante reset filtri
    const resetButton = document.getElementById('reset-filters');
    if (resetButton) {
        resetButton.addEventListener('click', resetFilters);
    }
    
    // Ordinamento
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }
}

// Funzione per applicare i filtri
function applyFilters() {
    const carsContainer = document.getElementById('cars-container');
    const cars = carsContainer.querySelectorAll('.car-card');
    const maxPrice = parseInt(document.getElementById('price-filter').value);
    
    // Raccogli i valori dei filtri selezionati
    const selectedFilters = {
        vehicleTypes: getSelectedValues('vehicle-type'),
        brands: getSelectedValues('brand'),
        fuels: getSelectedValues('fuel'),
        transmissions: getSelectedValues('transmission'),
        features: getSelectedValues('features')
    };
    
    let visibleCars = 0;
    
    // Applica i filtri a ogni auto
    cars.forEach(car => {
        const price = parseInt(car.dataset.price);
        const brand = car.dataset.brand;
        const type = car.dataset.type;
        const fuel = car.dataset.fuel;
        const transmission = car.dataset.transmission;
        
        // Verifica se l'auto soddisfa tutti i filtri
        const matchesPrice = price <= maxPrice;
        const matchesVehicleType = selectedFilters.vehicleTypes.length === 0 || selectedFilters.vehicleTypes.includes(type);
        const matchesBrand = selectedFilters.brands.length === 0 || selectedFilters.brands.includes(brand);
        const matchesFuel = selectedFilters.fuels.length === 0 || selectedFilters.fuels.includes(fuel);
        const matchesTransmission = selectedFilters.transmissions.length === 0 || selectedFilters.transmissions.includes(transmission);
        
        // Mostra o nascondi l'auto in base ai filtri
        if (matchesPrice && matchesVehicleType && matchesBrand && matchesFuel && matchesTransmission) {
            car.style.display = '';
            visibleCars++;
        } else {
            car.style.display = 'none';
        }
    });
    
    // Aggiorna il contatore dei risultati
    document.getElementById('results-number').textContent = visibleCars;
    
    // Mostra messaggio se non ci sono risultati
    const noResultsMessage = document.querySelector('.no-results');
    if (visibleCars === 0) {
        if (!noResultsMessage) {
            const message = document.createElement('div');
            message.className = 'no-results';
            message.innerHTML = `
                <h3>Nessun risultato trovato</h3>
                <p>Prova a modificare i filtri di ricerca per trovare l'auto che fa per te.</p>
                <button id="clear-all-filters" class="btn btn-primary">Cancella tutti i filtri</button>
            `;
            carsContainer.appendChild(message);
            
            document.getElementById('clear-all-filters').addEventListener('click', resetFilters);
        }
    } else if (noResultsMessage) {
        noResultsMessage.remove();
    }
    
    // Applica ordinamento
    applySorting();
}

// Funzione per ottenere i valori selezionati dai checkbox
function getSelectedValues(name) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    return Array.from(checkboxes).map(cb => cb.value);
}

// Funzione per applicare l'ordinamento
function applySorting() {
    const carsContainer = document.getElementById('cars-container');
    const sortBy = document.getElementById('sort-by').value;
    const cars = Array.from(carsContainer.querySelectorAll('.car-card:not([style*="display: none"])'));
    
    // Ordina le auto in base al criterio selezionato
    cars.sort((a, b) => {
        switch (sortBy) {
            case 'price-asc':
                return parseInt(a.dataset.price) - parseInt(b.dataset.price);
            case 'price-desc':
                return parseInt(b.dataset.price) - parseInt(a.dataset.price);
            case 'name-asc':
                return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
            case 'name-desc':
                return b.querySelector('h3').textContent.localeCompare(a.querySelector('h3').textContent);
            case 'popularity':
                // Simulazione di popolarità (in un'app reale, questo sarebbe un valore dal database)
                return (b.querySelector('.tag') ? 1 : 0) - (a.querySelector('.tag') ? 1 : 0);
            default:
                return 0;
        }
    });
    
    // Riordina le auto nel DOM
    cars.forEach(car => carsContainer.appendChild(car));
}

// Funzione per resettare tutti i filtri
function resetFilters() {
    // Reset slider prezzo
    const priceSlider = document.getElementById('price-filter');
    priceSlider.value = priceSlider.max;
    document.getElementById('max-price').textContent = `€${priceSlider.max}`;
    
    // Reset checkbox
    const filterCheckboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    filterCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Reset ordinamento
    document.getElementById('sort-by').value = 'price-asc';
    
    // Applica i filtri resettati
    applyFilters();
}

// Funzione per inizializzare il cambio di visualizzazione (griglia/lista)
function initViewToggle() {
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');
    const catalogMain = document.querySelector('.catalog-main');
    
    if (gridViewBtn && listViewBtn) {
        gridViewBtn.addEventListener('click', function() {
            catalogMain.classList.remove('list-view-active');
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            // Salva la preferenza dell'utente
            localStorage.setItem('viewPreference', 'grid');
        });
        
        listViewBtn.addEventListener('click', function() {
            catalogMain.classList.add('list-view-active');
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            // Salva la preferenza dell'utente
            localStorage.setItem('viewPreference', 'list');
        });
        
        // Carica la preferenza dell'utente se disponibile
        const viewPreference = localStorage.getItem('viewPreference');
        if (viewPreference === 'list') {
            catalogMain.classList.add('list-view-active');
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
        }
    }
}

// Funzione per inizializzare la paginazione
function initPagination() {
    const paginationLinks = document.querySelectorAll('.pagination a');
    
    paginationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Rimuovi la classe active da tutti i link
            paginationLinks.forEach(l => l.classList.remove('active'));
            
            // Aggiungi la classe active al link cliccato
            this.classList.add('active');
            
            // In un'app reale, qui si caricherebbero i dati della pagina selezionata
            // Per questo mockup, simuliamo lo scroll verso l'alto
            window.scrollTo({
                top: document.querySelector('.catalog-content').offsetTop - 100,
                behavior: 'smooth'
            });
        });
    });
}

// Funzione per recuperare e applicare i parametri di ricerca dall'URL
function applySearchParamsFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const location = urlParams.get('location');
    const pickupDate = urlParams.get('pickup');
    const returnDate = urlParams.get('return');
    
    // Se ci sono parametri di ricerca, compila il form
    if (location) {
        const locationSelect = document.getElementById('location');
        if (locationSelect) {
            // Cerca l'opzione corrispondente
            for (let i = 0; i < locationSelect.options.length; i++) {
                if (locationSelect.options[i].value === location) {
                    locationSelect.selectedIndex = i;
                    break;
                }
            }
        }
    }
    
    if (pickupDate) {
        const pickupDateInput = document.getElementById('pickup-date');
        if (pickupDateInput) {
            pickupDateInput.value = pickupDate;
        }
    }
    
    if (returnDate) {
        const returnDateInput = document.getElementById('return-date');
        if (returnDateInput) {
            returnDateInput.value = returnDate;
        }
    }
}