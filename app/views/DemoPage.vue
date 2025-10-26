<template>
    <div class="demo-page" ref="demoPageRef">
        <div class="demo-container" :class="{ 'is-fixed': isFixed, 'is-bottom': isBottom, 'animated': isAnimated }"
            ref="containerRef">
            <!-- Левая колонка: макет телеграмм чата -->
            <div class="demo-column demo-frame" ref="phoneFrameRef">
                <PhoneFrame>
                    <TelegramMockup :chat-name="chatName" :chat-status="chatStatus" :messages="visibleMessages"
                        :input-placeholder="inputPlaceholder" />
                </PhoneFrame>
            </div>

            <!-- Правая колонка: инструкции -->
            <div class="demo-column demo-instructions" ref="instructionsRef">
                <div class="instructions-content">
                    <transition name="fade-slide" mode="out-in">
                        <div class="title-wrapper" :key="currentStep" ref="titleWrapperRef">
                            <img class="sign" :src="steps[currentStep].icon" />
                            <h1>{{ steps[currentStep].title }}</h1>
                        </div>
                    </transition>
                    <transition name="fade-slide" mode="out-in">
                        <div class="description-wrapper" :key="currentStep">
                            <p>{{ steps[currentStep].description }}</p>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
        <!-- Скролл-триггеры для анимации -->
        <div class="scroll-spacer" :style="{ height: scrollSpacerHeight + 'px' }"></div>
    </div>
</template>

<script>
import TelegramMockup from '@/components/TelegramMockup.vue';
import PhoneFrame from '@/components/PhoneFrame.vue';
import messagesData from '@/assets/messages.json';
import searchIcon from '~/assets/search.svg';
import requestIcon from '~/assets/request.svg';
import checkmarkIcon from '~/assets/checkmark.svg';

export default {
    name: 'DemoPage',
    components: {
        TelegramMockup,
        PhoneFrame
    },
    data() {
        return {
            chatName: 'Travel AI Bot',
            chatStatus: 'online',
            inputPlaceholder: 'Напишите сообщение...',
            messages: [],
            visibleMessages: [],
            currentConversationIndex: 0,
            conversations: messagesData.conversations,
            isFixed: false,
            isAnimated: false,
            isBottom: false, // Элемент "прилип" к низу секции
            currentStep: 0,
            ticking: false, // Для throttle скролла
            steps: [
                {
                    title: 'Начните поиск мест',
                    description: 'Укажите дату поездки и мы покажем, насколько популярна локация в выбранный день — чтобы вы не попали в толпу',
                    messageIndex: 0,
                    icon: searchIcon
                },
                {
                    title: 'Опишите пожелания к месту',
                    description: 'Любите тишину у озера, активный отдых в горах или удачную рыбалку? Ваши предпочтения — основа наших рекомендаций.',
                    messageIndex: 1,
                    icon: requestIcon
                },
                {
                    title: 'Получите подходящие места',
                    description: 'Только подходящие локации: с учётом погоды, расстояния, местных законов и реальных отзывов путешественников.',
                    messageIndex: 3,
                    icon: checkmarkIcon
                },
            ]
        }
    },
    mounted() {
        this.loadMessages();
        this.setupScrollAnimation();
        this.setupInitialAnimation();
        if (process.client) {
            window.addEventListener('scroll', this.throttledScroll, { passive: true });
        }
    },
    beforeUnmount() {
        if (process.client) {
            window.removeEventListener('scroll', this.throttledScroll);
        }
        if (this.initialObserver) {
            this.initialObserver.disconnect();
        }
    },
    computed: {
        scrollSpacerHeight() {
            if (process.client && window.innerWidth <= 768) {
                return 1500;
            }
            return 4200;
        }
    },
    methods: {
        loadMessages() {
            const conversation = this.conversations[this.currentConversationIndex];
            this.messages = conversation.messages.map((msg, index) => {
                const hours = 12;
                const minutes = 30 + index * 2;

                return {
                    text: msg.text,
                    time: `${hours}:${minutes.toString().padStart(2, '0')}`,
                    type: msg.type === 'reply' ? 'in' : 'out',
                    images: msg.images || []
                };
            });

            // Начинаем с первого сообщения
            this.visibleMessages = [this.messages[0]];
        },

        setupInitialAnimation() {
            // Создаем observer с задержкой ПОСЛЕ попадания в viewport
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting && !this.isAnimated) {
                            // Задержка применяется ПОСЛЕ того как элемент в viewport
                            setTimeout(() => {
                                this.isAnimated = true;
                            }, 400); // Можно добавить небольшую задержку, например 100-200ms
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.05,
                    rootMargin: '0px 0px -20px 0px'
                }
            );

            if (this.$refs.demoPageRef) {
                observer.observe(this.$refs.demoPageRef);
            }
        }, setupScrollAnimation() {
            // Пустая функция, можно удалить позже
        },

        throttledScroll() {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        },

        handleScroll() {
            if (!this.$refs.demoPageRef || !this.isAnimated || !process.client) return;

            const pageRect = this.$refs.demoPageRef.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const navbarHeight = 80;

            // Границы фиксации
            const fixStart = pageRect.top <= navbarHeight;
            const fixEnd = pageRect.bottom <= windowHeight;

            // Логика фиксации: включаем когда начали, выключаем когда закончили
            const shouldBeFixed = fixStart && !fixEnd;

            // Прогресс скролла (0 до 1)
            const scrollableHeight = Math.max(pageRect.height - windowHeight, 1);
            const scrolled = Math.max(navbarHeight - pageRect.top, 0);
            const progress = Math.min(scrolled / scrollableHeight, 1);

            // Определяем шаг
            const step = Math.min(
                Math.floor(progress * this.steps.length),
                this.steps.length - 1
            );

            if (!fixStart) {
                // Секция еще не началась
                if (this.isFixed || this.isBottom) {
                    this.isFixed = false;
                    this.isBottom = false;
                }
            } else if (shouldBeFixed) {
                // Внутри зоны фиксации по центру
                if (!this.isFixed || this.isBottom) {
                    this.isFixed = true;
                    this.isBottom = false;
                }

                if (step !== this.currentStep) {
                    this.currentStep = step;
                    this.updateVisibleMessages();
                }
            } else if (fixEnd) {
                // Конец секции - прилипает к низу
                if (!this.isBottom) {
                    this.isFixed = false;
                    this.isBottom = true;
                }
            }
        },

        updateVisibleMessages() {
            const targetIndex = this.steps[this.currentStep].messageIndex;

            // ДОБАВЛЕНИЕ: Добавляем сообщения если двигаемся вперед
            if (this.visibleMessages.length <= targetIndex && targetIndex < this.messages.length) {
                const startIndex = this.visibleMessages.length;
                const endIndex = targetIndex;

                // Добавляем сообщения с оптимизированной задержкой
                for (let i = startIndex; i <= endIndex; i++) {
                    const messageIndex = i;
                    const delay = (i - startIndex) * 400; // Немного быстрее

                    setTimeout(() => {
                        // Проверяем что сообщение еще не добавлено
                        if (this.visibleMessages.length === messageIndex) {
                            this.visibleMessages.push(this.messages[messageIndex]);
                        }
                    }, delay);
                }
            }
            // ОТКАТ: Убираем сообщения если двигаемся назад
            else if (this.visibleMessages.length > targetIndex + 1) {
                // Плавно убираем лишние сообщения
                const newLength = targetIndex + 1;
                this.visibleMessages = this.visibleMessages.slice(0, newLength);
            }
        }
    }
};
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/animations';
@import '@/styles/mixins';

.demo-page {
    position: relative;
    padding-top: calc(7.4vh + 0vw);
    min-height: 100vh; // Минимальная высота для absolute positioning
    overflow: hidden;

    // Оптимизация скролла
    -webkit-overflow-scrolling: touch;

    // Фоновое изображение с opacity
    &::before {
        content: '';
        position: absolute;
        top: -1%;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url('~@/assets/stars.jpg');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
        opacity: 0.2;
        z-index: 0;
        pointer-events: none;
    }

    // Градиент для общего фона как в FeaturesPage
    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
    }
}

.scroll-spacer {
    width: 100%;
    pointer-events: none;
    // Оптимизация - не участвует в композитинге
    content-visibility: auto;
}

.demo-container {

    position: relative;
    z-index: 1;
    max-width: 1600px;
    width: calc(100% - 4.2vw);
    margin: 0 auto;
    padding: 0 calc(2.1vw);
    display: grid;
    grid-template-columns: minmax(calc(20.8vw), 0.4fr) minmax(calc(31.25vw), 1.2fr);
    gap: calc(3.1vw);
    align-items: center;

    // Оптимизация для всех состояний
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;

    // Фиксация по центру экрана
    &.is-fixed {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -45%) !important;
        z-index: 10;
        will-change: transform;

        .demo-column {
            // Отменяем анимационный transform когда контейнер зафиксирован
            transform: none !important;

            &.demo-frame {
                transform: scale(1.20) !important;

                @media (max-width: 968px) {
                    transform: scale(1) !important;
                }
            }
        }
    }

    // Прилип к низу секции - остается на месте
    &.is-bottom {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%) !important;

        .demo-column {
            // Отменяем анимационный transform когда контейнер внизу
            transform: none !important;

            &.demo-frame {
                transform: scale(1.20) !important;

                @media (max-width: 968px) {
                    transform: scale(1) !important;
                }
            }
        }
    }

    @media (max-width: 1750px) {
        max-width: 1400px;
        width: calc(100% - 3.1vw);
        padding: 0 calc(1.7vw);
        grid-template-columns: 0.4fr 1.2fr;

        &.is-fixed {
            transform: translate(-50%, -50%) !important;
        }

        &.is-bottom {
            transform: translateX(-50%) !important;
        }
    }

    @media (max-width: 968px) {
        grid-template-columns: 1fr;
        gap: calc(4.1vw);
        padding: 0 calc(2.1vw);
        width: calc(100% - 4.1vw);

        &.is-fixed {
            transform: translate(-50%, -40%) !important;
        }

        &.is-bottom {
            transform: translateX(-50%) !important;
        }

        .demo-frame {
            position: static;
        }

        .demo-instructions {
            margin-top: 20px;
        }
    }
}

// Стили колонок и анимация появления
.demo-container {
    .demo-column {
        // Оптимизация рендеринга
        backface-visibility: hidden;
        -webkit-font-smoothing: antialiased;

        &.demo-frame {
            display: flex;
            justify-content: center;
            align-items: center;
            transform: scale(1.20);
            margin-left: calc(-5.2vw);

            @media (max-width: 968px) {
                transform: scale(1);
                margin-left: 0;
            }
        }

        &.demo-instructions {
            padding: calc(2.1vw + 0vh);
            background: transparent;
            border-radius: calc(1vw);
            box-shadow: 0 calc(1vw) calc(3.1vw) rgba(0, 0, 0, 0.2);
            width: 100%;
            min-width: 0;

            @media (max-width: 968px) {
                padding: calc(3.1vw + 0vh) calc(2.1vw + 0vh);
            }
        }
    }
}

// Стили для анимации появления - как в FeaturesPage с transition
.demo-container {
    .demo-column {
        opacity: 0;
        transform: translateY(50px);
        transition: opacity 0.8s ease, transform 0.8s ease;

        &.demo-frame {
            // Для frame добавляем scale в transform
            transform: scale(1.20) translateY(50px);
            transition: opacity 0.8s ease, transform 0.8s ease;

            @media (max-width: 968px) {
                transform: scale(1) translateY(50px);
            }
        }
    }

    &.animated {
        .demo-column {
            opacity: 1;
            transform: translateY(0);

            &.demo-frame {
                transform: scale(1.20) translateY(0);

                @media (max-width: 968px) {
                    transform: scale(1) translateY(0);
                }
            }

            &.demo-instructions {
                transition-delay: 0.2s;
            }
        }
    }
}

/* Instructions Column */
.instructions-content {
    margin-left: 8vw;
    margin-right: 5vw;
    display: flex;
    flex-direction: column;
    text-align: end;
    font-family: "Oswald";

    @media (max-width: 768px) {
        margin-left: 0;
        align-items: center;
        text-align: center;
    }

    h1 {
        font-size: calc(3vw + 2vh);
        font-weight: bold;
        letter-spacing: 0.15em;
        width: 100vw;
        margin-bottom: 5vh;
        color: $beige;
        text-shadow: calc(0.1vw) calc(0.1vw) calc(0.4vw) rgba(0, 0, 0, 0.7);
        transition: text-shadow 0.3s ease-out, transform 0.3s ease-out;

        @media (max-width: 768px) {
            text-align: center;
            margin-top: -10vh;
            font-size: calc(6.25vw + 0vh);
            margin-bottom: 0;
        }

        @media (hover: hover) {
            &:hover {
                text-shadow: 0 0 20px rgba($beige, 0.8);
                transform: scale(1.02);
            }
        }
    }

    p {
        text-align: end;
        font-family: Oswald;
        letter-spacing: 0.13em;
        font-size: calc(2.6vw + 0vh);
        font-weight: 300;
        color: $white;
        line-height: 1.6;
        text-shadow: calc(0.05vw) calc(0.05vw) calc(0.2vw) rgba(0, 0, 0, 0.6);
        transition: opacity 0.3s ease-out, text-shadow 0.3s ease-out;



        @media (max-width: 768px) {
            display: none;
        }

        @media (hover: hover) {
            &:hover {
                opacity: 1;
                text-shadow: 0 0 15px rgba($beige, 0.5);
            }
        }
    }
}

// Vue transition для плавной смены текста - используем унифицированные переменные
.fade-slide-enter-active {
    transition: opacity $animation-duration-slow $animation-ease-material,
        transform $animation-duration-slow $animation-ease-material;
}

.fade-slide-leave-active {
    transition: opacity 0.35s cubic-bezier(0.4, 0, 1, 1),
        transform 0.35s cubic-bezier(0.4, 0, 1, 1);
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateY($animation-distance-small);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-$animation-distance-small);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
    opacity: 1;
    transform: translateY(0);
}

.description-wrapper {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    max-width: 900px;
    align-self: flex-end;

    @media (max-width: 768px) {
        max-width: 100%;
    }
}

.title-wrapper {
    display: flex;
    align-items: center;
    gap: calc(2.1vw);
    width: 100%;
    min-width: calc(46.5vw); // Фиксированная минимальная ширина для предотвращения сдвигов

    @media (max-width: 768px) {
        gap: calc(2vw);
        margin-top: 5vh;
        min-width: auto;
        width: 100%;

        .sign {
            display: none;
        }
    }

    h1 {
        flex: 1; // h1 занимает оставшееся пространство
        min-width: 0; // Позволяет тексту переноситься при необходимости
    }
}

.sign {
    width: calc(10.4vw + 0vh);
    height: calc(10.4vw + 0vh);
    flex-shrink: 0;
    margin-left: -2vw;
    margin-top: calc(-4.2vh);
    filter: brightness(0) saturate(100%) invert(92%) sepia(13%) saturate(685%) hue-rotate(328deg) brightness(100%) contrast(93%);
    transition: transform 0.3s ease-out, filter 0.3s ease-out;
    user-select: none;
    pointer-events: none;

    @media (max-width: 768px) {
        width: calc(7.8vw + 0vh);
        height: calc(7.8vw + 0vh);
        margin-left: 0;
        margin-top: 0;
    }

    @media (hover: hover) {
        &:hover {
            transform: scale(1.1) rotate(5deg);
            filter: brightness(0) saturate(100%) invert(92%) sepia(13%) saturate(685%) hue-rotate(328deg) brightness(120%) contrast(100%) drop-shadow(0 0 calc(0.8vw) rgba(232, 223, 202, 0.4));
        }
    }
}
</style>
