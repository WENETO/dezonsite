// ===== СИСТЕМА ОТЗЫВОВ =====

// Инициализация системы отзывов
document.addEventListener('DOMContentLoaded', function() {
    initReviewsSystem();
    loadReviewsFromStorage();
});

function initReviewsSystem() {
    const addReviewBtn = document.createElement('button');
    addReviewBtn.className = 'btn btn--primary';
    addReviewBtn.id = 'addReviewBtn';
    addReviewBtn.innerHTML = '<i class="fas fa-pen"></i> Оставить отзыв';
    addReviewBtn.style.cssText = `
        display: block;
        margin: 30px auto;
        padding: 15px 30px;
        font-size: 1.1rem;
        max-width: 300px;
    `;
    
    // Находим секцию отзывов и добавляем кнопку
    const reviewsSection = document.getElementById('reviews');
    if (reviewsSection) {
        const container = reviewsSection.querySelector('.container');
        if (container) {
            const existingBtn = container.querySelector('#addReviewBtn');
            if (!existingBtn) {
                container.appendChild(addReviewBtn);
            }
        }
    }
    
    // Добавляем обработчик клика
    addReviewBtn.addEventListener('click', function() {
        openReviewForm();
    });
    
    // Создаем модальное окно для отзыва
    createReviewModal();
}

function createReviewModal() {
    // Проверяем, есть ли уже модальное окно
    if (document.getElementById('reviewModal')) return;
    
    const modalHTML = `
        <div class="modal" id="reviewModal">
            <div class="modal__content" style="max-width: 600px;">
                <button class="modal__close" aria-label="Закрыть">&times;</button>
                <h3 class="modal__title">Оставить отзыв</h3>
                <p class="modal__text">Поделитесь своим опытом работы с DEZON</p>
                
                <form id="reviewForm" class="contact-form">
                    <div class="form-group">
                        <label for="reviewName">Ваше имя *</label>
                        <input type="text" id="reviewName" name="name" placeholder="Имя" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="reviewEmail">Email (необязательно)</label>
                        <input type="email" id="reviewEmail" name="email" placeholder="email@example.com">
                    </div>
                    
                    <div class="form-group">
                        <label for="reviewService">Услуга *</label>
                        <select id="reviewService" name="service" required class="select-animated">
                            <option value="" disabled selected>Выберите услугу</option>
                            <option value="Дезинсекция">Дезинсекция</option>
                            <option value="Дератизация">Дератизация</option>
                            <option value="Дезинфекция">Дезинфекция</option>
                            <option value="Комплексная обработка">Комплексная обработка</option>
                            <option value="Другое">Другое</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Оценка *</label>
                        <div class="rating-stars" style="display: flex; gap: 10px; margin: 10px 0;">
                            <span class="star" data-value="1">☆</span>
                            <span class="star" data-value="2">☆</span>
                            <span class="star" data-value="3">☆</span>
                            <span class="star" data-value="4">☆</span>
                            <span class="star" data-value="5">☆</span>
                        </div>
                        <input type="hidden" id="reviewRating" name="rating" value="0" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="reviewText">Текст отзыва *</label>
                        <textarea id="reviewText" name="text" placeholder="Расскажите о вашем опыте..." rows="5" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="checkbox checkbox-modern">
                            <input type="checkbox" name="consent" required>
                            <span class="checkmark"></span>
                            <span class="checkbox-text">Согласен с обработкой персональных данных *</span>
                        </label>
                    </div>
                    
                    <div class="form-buttons" style="display: flex; gap: 15px; margin-top: 20px;">
                        <button type="submit" class="btn btn--primary">Отправить отзыв</button>
                        <button type="button" class="btn btn--outline" id="cancelReviewBtn">Отмена</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Инициализация звезд рейтинга
    initRatingStars();
    
    // Обработчики событий
    const modal = document.getElementById('reviewModal');
    const closeBtn = modal.querySelector('.modal__close');
    const cancelBtn = modal.querySelector('#cancelReviewBtn');
    const form = modal.querySelector('#reviewForm');
    
    closeBtn.addEventListener('click', function() {
        closeReviewModal();
    });
    
    cancelBtn.addEventListener('click', function() {
        closeReviewModal();
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeReviewModal();
        }
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitReview(this);
    });
}

function initRatingStars() {
    const stars = document.querySelectorAll('.rating-stars .star');
    const ratingInput = document.getElementById('reviewRating');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const value = parseInt(this.getAttribute('data-value'));
            ratingInput.value = value;
            
            // Подсветка звезд
            stars.forEach((s, index) => {
                if (index < value) {
                    s.textContent = '★';
                    s.style.color = '#ff9800';
                } else {
                    s.textContent = '☆';
                    s.style.color = '#ccc';
                }
            });
        });
        
        star.addEventListener('mouseenter', function() {
            const value = parseInt(this.getAttribute('data-value'));
            stars.forEach((s, index) => {
                if (index < value) {
                    s.style.color = '#ff9800';
                }
            });
        });
        
        star.addEventListener('mouseleave', function() {
            const currentRating = parseInt(ratingInput.value);
            stars.forEach((s, index) => {
                if (index >= currentRating) {
                    s.style.color = '#ccc';
                }
            });
        });
    });
}

function openReviewForm() {
    const modal = document.getElementById('reviewModal');
    if (modal) {
        if (window.DEZ && window.DEZ.closeAllModals) {
            window.DEZ.closeAllModals();
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeReviewModal() {
    const modal = document.getElementById('reviewModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Очистка формы
        const form = modal.querySelector('#reviewForm');
        form.reset();
        
        // Сброс звезд
        const stars = modal.querySelectorAll('.rating-stars .star');
        const ratingInput = modal.querySelector('#reviewRating');
        stars.forEach(star => {
            star.textContent = '☆';
            star.style.color = '#ccc';
        });
        ratingInput.value = '0';
    }
}

function submitReview(form) {
    // Валидация
    const rating = form.querySelector('#reviewRating').value;
    if (rating === '0' || rating === 0) {
        if (window.DEZ && window.DEZ.showNotification) {
            window.DEZ.showNotification('Пожалуйста, поставьте оценку', 'error');
        } else {
            alert('Пожалуйста, поставьте оценку');
        }
        return;
    }
    
    // Собираем данные
    const formData = new FormData(form);
    const reviewData = {
        id: Date.now(),
        name: formData.get('name'),
        email: formData.get('email'),
        service: formData.get('service'),
        rating: parseInt(formData.get('rating')),
        text: formData.get('text'),
        date: new Date().toLocaleDateString('ru-RU'),
        timestamp: new Date().toISOString(),
        approved: false // Новые отзывы требуют модерации
    };
    
    // Сохраняем отзыв
    saveReviewToStorage(reviewData);
    
    // Закрываем модальное окно
    closeReviewModal();
    
    // Показываем сообщение
    if (window.DEZ && window.DEZ.showNotification) {
        window.DEZ.showNotification('Спасибо за отзыв! После проверки он появится на сайте.', 'success');
    } else {
        alert('Спасибо за отзыв! После проверки он появится на сайте.');
    }
    
    // Обновляем список отзывов
    setTimeout(loadReviewsFromStorage, 1000);
}

function saveReviewToStorage(review) {
    try {
        let reviews = JSON.parse(localStorage.getItem('dezReviews') || '[]');
        reviews.unshift(review); // Добавляем в начало
        localStorage.setItem('dezReviews', JSON.stringify(reviews));
        console.log('Отзыв сохранен. Всего отзывов:', reviews.length);
        return true;
    } catch (e) {
        console.warn('Не удалось сохранить отзыв:', e);
        return false;
    }
}

function loadReviewsFromStorage() {
    try {
        const reviews = JSON.parse(localStorage.getItem('dezReviews') || '[]');
        const approvedReviews = reviews.filter(review => review.approved);
        
        console.log('Загружено отзывов:', approvedReviews.length);
        
        // Обновляем карусель отзывов
        updateReviewsCarousel(approvedReviews);
        
        return approvedReviews;
    } catch (e) {
        console.warn('Не удалось загрузить отзывы:', e);
        return [];
    }
}

function updateReviewsCarousel(reviews) {
    if (reviews.length === 0) return;
    
    const carouselContainer = document.querySelector('.carousel-container');
    const carouselDots = document.querySelector('.carousel-dots');
    
    if (!carouselContainer || !carouselDots) return;
    
    // Очищаем существующие отзывы, кроме оригинальных
    const originalSlides = carouselContainer.querySelectorAll('.review-slide');
    originalSlides.forEach(slide => {
        if (!slide.hasAttribute('data-original')) {
            slide.remove();
        }
    });
    
    // Очищаем точки, кроме оригинальных
    const originalDots = carouselDots.querySelectorAll('.dot');
    originalDots.forEach(dot => {
        if (!dot.hasAttribute('data-original')) {
            dot.remove();
        }
    });
    
    // Добавляем новые отзывы
    reviews.slice(0, 3).forEach((review, index) => {
        const slideHTML = createReviewSlideHTML(review);
        carouselContainer.insertAdjacentHTML('beforeend', slideHTML);
        
        // Добавляем точку
        const dot = document.createElement('span');
        dot.className = 'dot';
        dot.setAttribute('data-index', originalDots.length + index);
        carouselDots.appendChild(dot);
    });
    
    // Обновляем обработчики событий
    initUpdatedCarousel();
}

function createReviewSlideHTML(review) {
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    
    return `
        <div class="review-slide" data-review-id="${review.id}">
            <div class="review-card" style="background-color: #ffffff; color: #000000;">
                <div class="review-card__header">
                    <div class="review-card__avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div>
                        <div class="review-card__author" style="color: #000000;">${review.name}</div>
                        <div class="review-card__date" style="color: #5a6268;">${review.date}</div>
                        <div class="review-rating" style="color: #ff9800;">
                            ${stars}
                        </div>
                    </div>
                </div>
                <div class="review-card__text" style="color: #000000;">
                    "${review.text}"
                </div>
                <div class="review-service">
                    <i class="fas fa-tag"></i> ${review.service}
                </div>
            </div>
        </div>
    `;
}

function initUpdatedCarousel() {
    const reviewSlides = document.querySelectorAll('.review-slide');
    const reviewDots = document.querySelectorAll('.carousel-dots .dot');
    const carouselPrev = document.querySelector('.carousel-prev');
    const carouselNext = document.querySelector('.carousel-next');
    
    if (reviewSlides.length === 0) return;
    
    let currentReview = 0;
    
    function showReview(n) {
        reviewSlides.forEach(slide => slide.classList.remove('active'));
        reviewDots.forEach(dot => dot.classList.remove('active'));
        
        currentReview = (n + reviewSlides.length) % reviewSlides.length;
        
        reviewSlides[currentReview].classList.add('active');
        reviewDots[currentReview].classList.add('active');
    }
    
    if (carouselPrev) {
        carouselPrev.addEventListener('click', () => {
            showReview(currentReview - 1);
        });
    }
    
    if (carouselNext) {
        carouselNext.addEventListener('click', () => {
            showReview(currentReview + 1);
        });
    }
    
    reviewDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showReview(index);
        });
    });
    
    // Автопереключение отзывов
    let reviewInterval = setInterval(() => {
        showReview(currentReview + 1);
    }, 7000);
    
    // Останавливаем автопереключение при наведении
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(reviewInterval);
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            reviewInterval = setInterval(() => {
                showReview(currentReview + 1);
            }, 7000);
        });
    }
    
    // Показать первый слайд
    showReview(0);
}

// Функции для администратора
function getAllReviews() {
    try {
        return JSON.parse(localStorage.getItem('dezReviews') || '[]');
    } catch (e) {
        console.warn('Не удалось загрузить все отзывы:', e);
        return [];
    }
}

function approveReview(reviewId) {
    try {
        let reviews = JSON.parse(localStorage.getItem('dezReviews') || '[]');
        reviews = reviews.map(review => {
            if (review.id === reviewId) {
                return { ...review, approved: true };
            }
            return review;
        });
        localStorage.setItem('dezReviews', JSON.stringify(reviews));
        
        // Обновляем отображение
        loadReviewsFromStorage();
        
        if (window.DEZ && window.DEZ.showNotification) {
            window.DEZ.showNotification('Отзыв одобрен и теперь отображается на сайте', 'success');
        }
        
        return true;
    } catch (e) {
        console.warn('Не удалось одобрить отзыв:', e);
        return false;
    }
}

function deleteReview(reviewId) {
    try {
        let reviews = JSON.parse(localStorage.getItem('dezReviews') || '[]');
        reviews = reviews.filter(review => review.id !== reviewId);
        localStorage.setItem('dezReviews', JSON.stringify(reviews));
        
        // Обновляем отображение
        loadReviewsFromStorage();
        
        if (window.DEZ && window.DEZ.showNotification) {
            window.DEZ.showNotification('Отзыв удален', 'success');
        }
        
        return true;
    } catch (e) {
        console.warn('Не удалось удалить отзыв:', e);
        return false;
    }
}

// Экспорт функций
window.Reviews = {
    initReviewsSystem,
    getAllReviews,
    approveReview,
    deleteReview,
    loadReviewsFromStorage,
    saveReviewToStorage
};