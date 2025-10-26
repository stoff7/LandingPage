/**
 * ========================================
 * УНИФИЦИРОВАННЫЙ КОМПОЗАБЛ ДЛЯ АНИМАЦИЙ
 * TRAVEL AI PROJECT
 * ========================================
 * 
 * Предоставляет единый интерфейс для работы с анимациями:
 * - IntersectionObserver для анимаций при скролле
 * - Последовательные анимации элементов
 * - Автоматическую очистку observers
 * - Поддержку data-атрибутов для декларативных анимаций
 */

import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Конфигурация по умолчанию для анимаций
 */
const DEFAULT_CONFIG = {
    // IntersectionObserver
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px',

    // Задержки
    delay: 0,
    delayBetween: 150, // мс между элементами в последовательности

    // Анимации
    defaultAnimation: 'fade-in-up',

    // Поведение
    repeat: false,
    autoCleanup: true
}

export function useAnimations(config = {}) {
    // Объединяем конфигурацию с дефолтной
    const settings = { ...DEFAULT_CONFIG, ...config }

    const isVisible = ref(false)
    const animationClass = ref('')
    const observers = []

    /**
     * Наблюдает за элементом и анимирует его при появлении в viewport
     * @param {HTMLElement} element - DOM элемент для наблюдения
     * @param {string} animationName - Имя CSS класса анимации
     * @param {Object} options - Опции для observer и анимации
     * @returns {IntersectionObserver|null}
     */
    const observeElement = (element, animationName = settings.defaultAnimation, options = {}) => {
        if (!element) {
            console.warn('observeElement: element is null or undefined')
            return null
        }

        const observerOptions = {
            threshold: options.threshold || settings.threshold,
            rootMargin: options.rootMargin || settings.rootMargin
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const delay = options.delay || settings.delay

                        setTimeout(() => {
                            entry.target.classList.add('animated', animationName)

                            // Убираем will-change после завершения анимации
                            if (settings.autoCleanup) {
                                const animationDuration = getAnimationDuration(entry.target)
                                setTimeout(() => {
                                    entry.target.style.willChange = 'auto'
                                }, animationDuration)
                            }
                        }, delay)

                        // Отключаем наблюдатель после анимации
                        if (!options.repeat && !settings.repeat) {
                            observer.unobserve(entry.target)
                        }
                    } else if (options.repeat || settings.repeat) {
                        // Повторная анимация при повторном появлении
                        entry.target.classList.remove('animated', animationName)
                    }
                })
            },
            observerOptions
        )

        observer.observe(element)
        observers.push(observer)

        return observer
    }

    /**
     * Наблюдает за несколькими элементами с задержкой между ними
     * @param {Array<HTMLElement>} elements - Массив DOM элементов
     * @param {string} animationName - Имя CSS класса анимации
     * @param {number} delayBetween - Задержка между анимациями в мс
     * @param {Object} options - Дополнительные опции
     */
    const observeElements = (elements, animationName = settings.defaultAnimation, delayBetween = settings.delayBetween, options = {}) => {
        if (!Array.isArray(elements)) {
            console.warn('observeElements: elements должен быть массивом')
            return
        }

        elements.forEach((element, index) => {
            if (element) {
                observeElement(element, animationName, {
                    ...options,
                    delay: (options.delay || 0) + (index * delayBetween)
                })
            }
        })
    }

    /**
     * Добавляет анимацию к элементу напрямую (без observer)
     * @param {HTMLElement} element - DOM элемент
     * @param {string} animationName - Имя CSS класса анимации
     * @param {number} delay - Задержка перед анимацией в мс
     */
    const addAnimation = (element, animationName, delay = 0) => {
        if (!element) {
            console.warn('addAnimation: element is null or undefined')
            return
        }

        setTimeout(() => {
            element.classList.add('animated', animationName)

            // Оптимизация: убираем will-change после анимации
            if (settings.autoCleanup) {
                const animationDuration = getAnimationDuration(element)
                setTimeout(() => {
                    element.style.willChange = 'auto'
                }, animationDuration)
            }
        }, delay)
    }

    /**
     * Удаляет анимацию с элемента
     * @param {HTMLElement} element - DOM элемент
     * @param {string} animationName - Имя CSS класса анимации (опционально)
     */
    const removeAnimation = (element, animationName = null) => {
        if (!element) {
            console.warn('removeAnimation: element is null or undefined')
            return
        }

        if (animationName) {
            element.classList.remove('animated', animationName)
        } else {
            element.classList.remove('animated')
        }
    }

    /**
     * Добавляет анимацию исчезновения к элементу
     * @param {HTMLElement} element - DOM элемент
     * @param {string} animationName - Имя CSS класса анимации исчезновения
     * @param {number} delay - Задержка перед анимацией в мс
     * @returns {Promise} Promise, который выполняется после завершения анимации
     */
    const addExitAnimation = (element, animationName, delay = 0) => {
        if (!element) {
            console.warn('addExitAnimation: element is null or undefined')
            return Promise.resolve()
        }

        return new Promise((resolve) => {
            setTimeout(() => {
                element.classList.add('animated', animationName)

                const handleAnimationEnd = () => {
                    element.removeEventListener('animationend', handleAnimationEnd)
                    if (settings.autoCleanup) {
                        element.style.willChange = 'auto'
                    }
                    resolve()
                }

                element.addEventListener('animationend', handleAnimationEnd)
            }, delay)
        })
    }

    /**
     * Анимирует исчезновение массива элементов последовательно
     * @param {Array<HTMLElement>} elements - Массив DOM элементов
     * @param {string} animationName - Имя CSS класса анимации исчезновения
     * @param {number} delayBetween - Задержка между анимациями в мс
     * @returns {Promise} Promise, который выполняется после завершения всех анимаций
     */
    const animateExitSequence = async (elements, animationName, delayBetween = settings.delayBetween) => {
        if (!Array.isArray(elements)) {
            console.warn('animateExitSequence: elements должен быть массивом')
            return Promise.resolve()
        }

        const promises = elements.map((element, index) => {
            if (element) {
                return addExitAnimation(element, animationName, index * delayBetween)
            }
            return Promise.resolve()
        })

        return Promise.all(promises)
    }

    /**
     * Анимирует массив элементов последовательно
     * @param {Array<HTMLElement>} elements - Массив DOM элементов
     * @param {string} animationName - Имя CSS класса анимации
     * @param {number} delayBetween - Задержка между анимациями в мс
     */
    const animateSequence = (elements, animationName, delayBetween = settings.delayBetween) => {
        if (!Array.isArray(elements)) {
            console.warn('animateSequence: elements должен быть массивом')
            return
        }

        elements.forEach((element, index) => {
            if (element) {
                addAnimation(element, animationName, index * delayBetween)
            }
        })
    }

    /**
     * Получает длительность анимации элемента из CSS
     * @param {HTMLElement} element - DOM элемент
     * @returns {number} Длительность в мс
     */
    const getAnimationDuration = (element) => {
        const styles = window.getComputedStyle(element)
        const duration = parseFloat(styles.animationDuration) || 0.6
        const delay = parseFloat(styles.animationDelay) || 0
        return (duration + delay) * 1000
    }

    /**
     * Очищает все observers
     */
    const cleanup = () => {
        observers.forEach(observer => {
            if (observer) observer.disconnect()
        })
        observers.length = 0
    }

    /**
     * Автоматическая инициализация для элементов с data-атрибутами
     */
    const initDataAnimations = () => {
        const animateElements = document.querySelectorAll('[data-animate]')

        animateElements.forEach((element) => {
            const animationName = element.dataset.animate || settings.defaultAnimation
            const delay = parseInt(element.dataset.delay) || 0
            const repeat = element.dataset.repeat === 'true'
            const threshold = parseFloat(element.dataset.threshold) || settings.threshold

            observeElement(element, animationName, { delay, repeat, threshold })
        })
    }

    // Автоматическая очистка при размонтировании
    onUnmounted(() => {
        cleanup()
    })

    // Автоматическая инициализация при монтировании
    onMounted(() => {
        initDataAnimations()
    })

    return {
        // Состояние
        isVisible,
        animationClass,

        // Методы для IntersectionObserver
        observeElement,
        observeElements,

        // Методы для прямых анимаций
        addAnimation,
        removeAnimation,
        animateSequence,

        // Утилиты
        cleanup,
        initDataAnimations,
        getAnimationDuration
    }
}

/**
 * Vue директива для простых анимаций
 * Использование: v-animate="'fade-in-up'" или v-animate.delay="'scale-in'"
 */
export const animateDirective = {
    mounted(el, binding) {
        const animationName = binding.value || DEFAULT_CONFIG.defaultAnimation
        const delay = binding.modifiers.delay ? 500 : 0

        setTimeout(() => {
            el.classList.add('animated', animationName)

            // Убираем will-change после анимации
            const styles = window.getComputedStyle(el)
            const duration = (parseFloat(styles.animationDuration) || 0.6) * 1000
            setTimeout(() => {
                el.style.willChange = 'auto'
            }, duration + delay)
        }, delay)
    },

    unmounted(el) {
        el.classList.remove('animated')
    }
}

/**
 * Вспомогательные функции для работы с анимациями
 */
export const animationHelpers = {
    /**
     * Добавляет класс с автоматическим удалением
     */
    addTemporaryClass(element, className, duration = 1000) {
        if (!element) return

        element.classList.add(className)
        setTimeout(() => {
            element.classList.remove(className)
        }, duration)
    },

    /**
     * Ждет окончания анимации
     */
    waitForAnimation(element) {
        return new Promise((resolve) => {
            const handleAnimationEnd = () => {
                element.removeEventListener('animationend', handleAnimationEnd)
                resolve()
            }
            element.addEventListener('animationend', handleAnimationEnd)
        })
    },

    /**
     * Проверяет, поддерживает ли браузер анимации
     */
    supportsAnimations() {
        const el = document.createElement('div')
        return typeof el.style.animation !== 'undefined'
    }
}