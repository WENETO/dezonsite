// ===== КАЛЬКУЛЯТОР СТОИМОСТИ =====

// Базывые цены для расчета
const basePrices = {
    cockroach: { flat: 1800, house: 2500, office: 2200, cafe: 3000, warehouse: 3500 },
    bedbug: { flat: 2500, house: 3200, office: 2800, cafe: 3800, warehouse: 4200 },
    rodent: { flat: 2200, house: 3500, office: 3000, cafe: 4000, warehouse: 4500 },
    disinfection: { flat: 2000, house: 2800, office: 2500, cafe: 3500, warehouse: 4000 },
    complex: { flat: 3500, house: 5000, office: 4200, cafe: 5500, warehouse: 6000 }
};

// Соответствие типов объектов ключам
const propertyTypeMap = {
    flat: 'flat',
    house: 'house',
    office: 'office',
    cafe: 'cafe',
    warehouse: 'warehouse'
};

// Коэффициенты для дополнительных опций
const optionMultipliers = {
    urgent: 1.2,
    barrier: 1.20,  // +20%
    enhanced: 1.15, // +15%
    odorless: 1.20  // +20%
};

// Фиксированные доплаты
const fixedAdditions = {
    sticker: 500 // Наклейка сеточки от тараканов
};

// Инициализация калькулятора
function initCalculator() {
    const calculatorForm = document.getElementById('calculatorForm');
    const serviceTypeSelect = document.getElementById('serviceType');
    const propertyTypeSelect = document.getElementById('propertyType');
    const areaRange = document.getElementById('area');
    const areaValue = document.getElementById('areaValue');
    const totalPriceElement = document.getElementById('totalPrice');
    const checkboxes = document.querySelectorAll('input[name="options"]');
    
    if (!calculatorForm) {
        console.log('Калькулятор не найден на странице');
        return;
    }
    
    console.log('Калькулятор инициализирован');
    
    // Обновление значения площади
    if (areaRange && areaValue) {
        areaRange.addEventListener('input', function() {
            areaValue.textContent = this.value + ' м²';
            calculatePrice();
        });
    }
    
    // Пересчет при любом изменении
    [serviceTypeSelect, propertyTypeSelect, areaRange].forEach(el => {
        if (el) el.addEventListener('change', calculatePrice);
    });
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', calculatePrice);
    });
    
    // Анимация при изменении
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkmark = this.nextElementSibling;
            checkmark.style.transform = 'scale(1.2)';
            setTimeout(() => {
                checkmark.style.transform = 'scale(1)';
            }, 300);
        });
    });
    
    // Анимация для ползунка
    if (areaRange) {
        areaRange.addEventListener('input', function() {
            areaValue.style.transform = 'scale(1.2)';
            areaValue.style.color = 'var(--primary)';
            setTimeout(() => {
                areaValue.style.transform = 'scale(1)';
                areaValue.style.color = '';
            }, 300);
        });
    }
    
    // Первоначальный расчет
    calculatePrice();
}

// Расчет стоимости
function calculatePrice() {
    const serviceTypeSelect = document.getElementById('serviceType');
    const propertyTypeSelect = document.getElementById('propertyType');
    const areaRange = document.getElementById('area');
    const totalPriceElement = document.getElementById('totalPrice');
    const checkboxes = document.querySelectorAll('input[name="options"]');
    const savingsAmount = document.querySelector('.savings-amount');
    
    if (!serviceTypeSelect || !propertyTypeSelect || !areaRange || !totalPriceElement) {
        return;
    }
    
    const serviceType = serviceTypeSelect.value;
    const propertyType = propertyTypeSelect.value;
    const area = parseInt(areaRange.value);
    const propertyKey = propertyTypeMap[propertyType];
    
    if (!serviceType || !propertyType || !propertyKey) {
        totalPriceElement.textContent = '0 ₽';
        if (savingsAmount) savingsAmount.textContent = '0 ₽';
        return;
    }
    
    // Базовая цена
    let basePrice = basePrices[serviceType] ? basePrices[serviceType][propertyKey] : 0;
    if (!basePrice) basePrice = 2000;
    
    // Модификатор площади
    let areaMultiplier = 1;
    if (area > 100) areaMultiplier = 1.2;
    if (area > 200) areaMultiplier = 1.5;
    if (area > 300) areaMultiplier = 1.8;
    if (area > 400) areaMultiplier = 2.0;
    
    let total = basePrice * areaMultiplier;
    
    // Добавка за опции (процентные)
    checkboxes.forEach(checkbox => {
        if (checkbox.checked && optionMultipliers[checkbox.value]) {
            total *= optionMultipliers[checkbox.value];
        }
    });
    
    // Добавка фиксированных сумм
    checkboxes.forEach(checkbox => {
        if (checkbox.checked && fixedAdditions[checkbox.value]) {
            total += fixedAdditions[checkbox.value];
        }
    });
    
    // Форматирование и вывод
    const formattedPrice = Math.round(total).toLocaleString('ru-RU');
    totalPriceElement.textContent = formattedPrice + ' ₽';
    
    // Анимация изменения цены
    totalPriceElement.style.transform = 'scale(1.1)';
    totalPriceElement.style.color = 'var(--secondary)';
    setTimeout(() => {
        totalPriceElement.style.transform = 'scale(1)';
        totalPriceElement.style.color = 'var(--primary)';
    }, 300);
    
    // Расчет экономии (10% от цены)
    if (savingsAmount) {
        const savings = Math.round(total * 0.1);
        savingsAmount.textContent = savings.toLocaleString('ru-RU') + ' ₽';
    }
    
    // Показать детали расчета в консоли
    console.log('Расчет стоимости:', {
        базоваяЦена: basePrice,
        площадь: area,
        множительПлощади: areaMultiplier,
        итоговаяЦена: total,
        выбранныеОпции: Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value)
    });
}

// Обработка отправки формы калькулятора
function handleCalculatorSubmit() {
    const serviceTypeSelect = document.getElementById('serviceType');
    const propertyTypeSelect = document.getElementById('propertyType');
    const areaRange = document.getElementById('area');
    const totalPriceElement = document.getElementById('totalPrice');
    
    if (!serviceTypeSelect || !propertyTypeSelect || !areaRange || !totalPriceElement) {
        return;
    }
    
    // Получаем данные из формы
    const serviceTypeText = serviceTypeSelect.options[serviceTypeSelect.selectedIndex].text;
    const propertyTypeText = propertyTypeSelect.options[propertyTypeSelect.selectedIndex].text;
    const area = areaRange.value;
    const price = totalPriceElement.textContent;
    
    // Получаем выбранные опции
    const selectedOptions = [];
    const checkboxes = document.querySelectorAll('input[name="options"]:checked');
    checkboxes.forEach(checkbox => {
        if (checkbox.value === 'urgent') selectedOptions.push('Срочный выезд +20%');
        if (checkbox.value === 'barrier') selectedOptions.push('Барьерная защита +20%');
        if (checkbox.value === 'enhanced') selectedOptions.push('Усиленная защита +15%');
        if (checkbox.value === 'odorless') selectedOptions.push('Препараты без запаха +20%');
        if (checkbox.value === 'sticker') selectedOptions.push('Наклейка сеточки от тараканов +500₽');
    });
    
    // Заполняем поле услуги в форме заказа
    const serviceInput = document.getElementById('serviceInput');
    if (serviceInput) {
        let serviceText = `${serviceTypeText} для ${propertyTypeText} (${area} м²)`;
        if (selectedOptions.length > 0) {
            serviceText += ` + ${selectedOptions.join(', ')}`;
        }
        serviceText += ` - ${price}`;
        serviceInput.value = serviceText;
    }
    
    // Показываем модальное окно заказа
    const orderModal = document.getElementById('orderModal');
    if (orderModal) {
        if (window.DEZ && window.DEZ.closeAllModals) {
            window.DEZ.closeAllModals();
        }
        orderModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Сообщение в консоль (имитация отправки)
    console.log('Заявка из калькулятора:', {
        service: serviceTypeText,
        property: propertyTypeText,
        area: area,
        options: selectedOptions,
        price: price,
        timestamp: new Date().toISOString()
    });
    
    // Показать уведомление
    if (window.DEZ && window.DEZ.showNotification) {
        window.DEZ.showNotification('Заявка создана! Точную стоимость уточнит специалист после выезда.', 'success');
    } else {
        alert('Заявка создана! Точную стоимость уточнит специалист после бесплатного выезда.');
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initCalculator();
    
    // Обработка отправки формы калькулятора
    const calculatorForm = document.getElementById('calculatorForm');
    if (calculatorForm) {
        calculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCalculatorSubmit();
        });
    }
});

// Экспорт функций для использования в консоли
window.Calculator = {
    initCalculator,
    calculatePrice,
    handleCalculatorSubmit
};