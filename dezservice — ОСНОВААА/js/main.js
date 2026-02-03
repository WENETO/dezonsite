// ===== ГЛАВНЫЙ ФАЙЛ JAVASCRIPT =====

// Глобальные переменные
let DEZ = {};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Сайт DEZON загружен. Формы НЕ отправляют данные.');
    
    initMobileMenu();
    initModals();
    initScrollAnimations();
    initSmoothScroll();
    highlightActiveNav();
    
    // Инициализация виджетов услуг
    if (window.Animations && window.Animations.initServiceWidgets) {
        window.Animations.initServiceWidgets();
    }
    
    // Исправление контраста в калькуляторе
    if (window.Animations && window.Animations.fixCalculatorContrast) {
        window.Animations.fixCalculatorContrast();
    }
    
    // Показать уведомление о демо-версии
    setTimeout(() => {
        console.log('ВНИМАНИЕ: Это демо-версия сайта. Формы не отправляют данные на сервер.');
    }, 1000);
});

// ===== МОБИЛЬНОЕ МЕНЮ =====
function initMobileMenu() {
    const navToggle = document.querySelector('.nav__toggle');
    const navList = document.querySelector('.nav__list');
    
    if (!navToggle || !navList) return;
    
    navToggle.addEventListener('click', function() {
        navList.classList.toggle('active');
        this.classList.toggle('active');
        document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : '';
        
        // Анимация иконки гамбургера
        const spans = this.querySelectorAll('span');
        if (navList.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav__list a').forEach(link => {
        link.addEventListener('click', function() {
            navList.classList.remove('active');
            
            if (navToggle) {
                navToggle.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
            
            document.body.style.overflow = '';
            
            // Подсветка активной ссылки
            document.querySelectorAll('.nav__list a').forEach(a => {
                a.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.nav') && !event.target.closest('.nav__toggle') && navList.classList.contains('active')) {
            navList.classList.remove('active');
            if (navToggle) {
                navToggle.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
            document.body.style.overflow = '';
        }
    });
}

// ===== МОДАЛЬНЫЕ ОКНА =====
function initModals() {
    const modals = document.querySelectorAll('.modal');
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const closeButtons = document.querySelectorAll('.modal__close');
    
    // Открытие модальных окон
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId + 'Modal');
            
            if (modal) {
                closeAllModals();
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Если у кнопки есть data-service, заполняем поле услуги
                const service = this.getAttribute('data-service');
                if (service) {
                    const serviceInput = document.getElementById('serviceInput');
                    if (serviceInput) {
                        serviceInput.value = service;
                    }
                }
            }
        });
    });
    
    // Закрытие по кнопке
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            closeAllModals();
        });
    });
    
    // Закрытие по клику вне окна
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeAllModals();
            }
        });
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

// ===== ПЛАВНАЯ ПРОКРУТКА =====
function initSmoothScroll() {
    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Пропускаем якоря, которые не ведут на странице
            if (href === '#') return;
            
            // Если это якорь на другой странице, пропускаем
            if (href.includes('.html')) return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                // Закрываем мобильное меню если открыто
                const navList = document.querySelector('.nav__list');
                const navToggle = document.querySelector('.nav__toggle');
                if (navList && navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    if (navToggle) {
                        navToggle.classList.remove('active');
                        const spans = navToggle.querySelectorAll('span');
                        spans[0].style.transform = 'none';
                        spans[1].style.opacity = '1';
                        spans[2].style.transform = 'none';
                    }
                    document.body.style.overflow = '';
                }
                
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Обновляем URL без перезагрузки страницы
                history.pushState(null, null, href);
            }
        });
    });
}

// ===== АНИМАЦИИ ПРИ ПРОКРУТКЕ =====
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.service-card, .process-step, .review-card');
    
    if (!fadeElements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Инициализация анимаций при скролле из animations.js
    if (window.Animations && window.Animations.initScrollAnimations) {
        window.Animations.initScrollAnimations();
    }
}

// ===== ПОДСВЕТКА АКТИВНОЙ ССЫЛКИ В НАВИГАЦИИ =====
function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav__list a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        if (currentPage === 'index.html' && link.getAttribute('href') === 'index.html') {
            link.classList.add('active');
        } else if (currentPage === 'services.html' && link.getAttribute('href') === 'services.html') {
            link.classList.add('active');
        } else if (currentPage === 'blog.html' && link.getAttribute('href') === 'blog.html') {
            link.classList.add('active');
        }
        
        // Подсветка якорных ссылок на главной
        if (currentPage === 'index.html' && window.location.hash) {
            const hash = window.location.hash;
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
            }
        }
    });
}

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
function showNotification(message, type = 'info') {
    // Проверяем, есть ли уже уведомление
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">${message}</div>
        <button class="notification__close">&times;</button>
    `;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#2a6b3f' : type === 'error' ? '#dc3545' : '#f9a826'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 500px;
        animation: slideIn 0.3s ease;
        font-family: 'Open Sans', sans-serif;
    `;
    
    // Стиль для контента
    notification.querySelector('.notification__content').style.cssText = `
        flex: 1;
        margin-right: 10px;
    `;
    
    // Стиль для кнопки закрытия
    notification.querySelector('.notification__close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
    `;
    
    // Анимация появления
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Кнопка закрытия
    notification.querySelector('.notification__close').addEventListener('click', function() {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
    
    // Автоматическое закрытие через 5 секунд
    document.body.appendChild(notification);
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Инициализация кнопки наверх
function initScrollTop() {
    const scrollBtn = document.querySelector('.scroll-top');
    
    if (!scrollBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Экспорт функций для использования в других файлах
DEZ = {
    showNotification,
    closeAllModals,
    initScrollTop
};

// Глобальный экспорт
window.DEZ = DEZ;

// Инициализация кнопки наверх при загрузке
document.addEventListener('DOMContentLoaded', function() {
    if (window.DEZ && window.DEZ.initScrollTop) {
        window.DEZ.initScrollTop();
    }
});

// Инициализация системы отзывов
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    // Загружаем систему отзывов только на главной странице
    const script = document.createElement('script');
    script.src = 'js/reviews.js';
    script.onload = function() {
        if (window.Reviews && window.Reviews.initReviewsSystem) {
            window.Reviews.initReviewsSystem();
        }
    };
    document.head.appendChild(script);
}