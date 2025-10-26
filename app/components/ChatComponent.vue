<template>
    <div class="chat-container">
        <div class="chat-header">
            <div class="chat-title">Travel AI</div>
        </div>
        <div class="chat-messages">
            <ChatMessage v-for="(message, index) in visibleMessages" :key="`${currentConversationId}-${index}`"
                :type="message.type" :images="message.images" :class="{ 'message-animated': true }"
                :style="{ animationDelay: `${index * 0.3}s` }">
                {{ message.text }}
            </ChatMessage>
        </div>
    </div>
</template>

<script>
import ChatMessage from './ChatMessage.vue'
import messagesData from '@/assets/messages.json'

export default {
    name: 'ChatComponent',
    components: {
        ChatMessage
    },
    data() {
        return {
            visibleMessages: [],
            currentConversationIndex: 0,
            currentMessageIndex: 0,
            conversations: messagesData.conversations,
            animationTimer: null,
            cycleTimer: null,
            isAnimating: false
        }
    },
    computed: {
        currentConversation() {
            return this.conversations[this.currentConversationIndex] || { messages: [] }
        },
        currentConversationId() {
            return this.currentConversation.id || 0
        }
    },
    mounted() {
        // Последовательность анимаций:
        // 1. Фон чата уже анимируется через MainPage
        // 2. Заголовок появляется через CSS
        // 3. Запускаем сообщения с задержкой
        setTimeout(() => {
            this.startMessageAnimation()
        }, 3000) // Увеличиваем задержку для заголовка
    },
    beforeUnmount() {
        this.clearTimers()
    },
    methods: {
        startMessageAnimation() {
            if (this.isAnimating) return

            this.isAnimating = true
            this.showNextMessage()
        },

        showNextMessage() {
            if (this.currentMessageIndex < this.currentConversation.messages.length) {
                const message = this.currentConversation.messages[this.currentMessageIndex]

                // Добавляем сообщение с анимацией
                this.visibleMessages.push(message)
                this.currentMessageIndex++

                // Плавно прокручиваем к новому сообщению с оптимизированной задержкой
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.scrollToBottom()
                    }, 200) // Уменьшаем задержку для более отзывчивого интерфейса
                })

                // Планируем показ следующего сообщения
                this.animationTimer = setTimeout(() => {
                    this.showNextMessage()
                }, message.delay || 1000)
            } else {
                // Все сообщения показаны, ждем и прокручиваем к началу
                this.cycleTimer = setTimeout(() => {
                    this.scrollToTopBeforeTransition()
                }, 1000) // Задержка перед прокруткой наверх (1 секунда для просмотра)
            }
        },

        nextConversation() {
            // Переходим к следующему диалогу без дополнительной очистки
            // (сообщения уже очищены в clearMessagesGradually)
            this.currentConversationIndex = (this.currentConversationIndex + 1) % this.conversations.length
            this.currentMessageIndex = 0
            this.isAnimating = false

            // Запускаем новый диалог
            setTimeout(() => {
                this.startMessageAnimation()
            }, 500)
        },

        scrollToBottom() {
            const messagesContainer = this.$el.querySelector('.chat-messages')
            if (messagesContainer) {
                const targetScrollTop = messagesContainer.scrollHeight - messagesContainer.clientHeight
                const startScrollTop = messagesContainer.scrollTop
                const distance = targetScrollTop - startScrollTop

                // Фиксированная длительность для стабильного поведения
                const duration = 300 // 300мс для плавной прокрутки

                let startTime = null

                const easeInOutQuad = (t) => {
                    // Простая и надежная функция сглаживания
                    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
                }

                const smoothScroll = (currentTime) => {
                    if (startTime === null) startTime = currentTime
                    const timeElapsed = currentTime - startTime
                    const progress = Math.min(timeElapsed / duration, 1)

                    const easedProgress = easeInOutQuad(progress)
                    messagesContainer.scrollTop = startScrollTop + (distance * easedProgress)

                    if (progress < 1) {
                        requestAnimationFrame(smoothScroll)
                    }
                }

                if (Math.abs(distance) > 5) { // Прокручиваем даже для небольших расстояний
                    requestAnimationFrame(smoothScroll)
                }
            }
        },

        scrollToTopBeforeTransition() {
            this.scrollAndClearMessages()
        },

        scrollAndClearMessages() {
            const messagesContainer = this.$el.querySelector('.chat-messages')
            const messages = document.querySelectorAll('.chat-messages .message-animated')

            if (messagesContainer && messages.length > 0) {
                const startScrollTop = messagesContainer.scrollTop
                const distance = -startScrollTop

                // Длительность анимации скролла
                const scrollDuration = 1000 // 1 секунда для скролла вверх
                const clearingDelay = 200 // Задержка перед началом очистки
                const clearingDuration = 800 // Длительность очистки сообщений

                let startTime = null

                const easeInOutCubic = (t) => {
                    return t < 0.5
                        ? 4 * t * t * t
                        : 1 - Math.pow(-2 * t + 2, 3) / 2
                }

                // Запускаем очистку сообщений с небольшой задержкой
                setTimeout(() => {
                    this.startClearingMessages(messages, clearingDuration)
                }, clearingDelay)

                const smoothScrollUp = (currentTime) => {
                    if (startTime === null) startTime = currentTime
                    const timeElapsed = currentTime - startTime
                    const progress = Math.min(timeElapsed / scrollDuration, 1)

                    const easedProgress = easeInOutCubic(progress)
                    messagesContainer.scrollTop = startScrollTop + (distance * easedProgress)

                    if (progress < 1) {
                        requestAnimationFrame(smoothScrollUp)
                    } else {
                        // После завершения скролла ждем завершения очистки
                        setTimeout(() => {
                            this.visibleMessages = []
                            this.nextConversation()
                        }, clearingDuration + 200)
                    }
                }

                requestAnimationFrame(smoothScrollUp)
            }
        },

        startClearingMessages(messages, scrollDuration) {
            // Рассчитываем интервалы для исчезновения сообщений
            const messageCount = messages.length
            const intervalBetweenMessages = scrollDuration / messageCount

            messages.forEach((message, index) => {
                const reverseIndex = messageCount - 1 - index // Снизу вверх
                const delay = reverseIndex * intervalBetweenMessages

                setTimeout(() => {
                    // Добавляем класс для плавного исчезновения
                    message.style.transition = 'all 0.4s ease-out'
                    message.style.opacity = '0'
                    message.style.transform = 'translateY(-20px) scale(0.95)'
                }, delay)
            })
        },

        clearMessagesGradually() {
            // Запасная функция для отдельной очистки сообщений (если понадобится)
            const messages = document.querySelectorAll('.chat-messages .message-animated')

            messages.forEach((message, index) => {
                const reverseIndex = messages.length - 1 - index
                setTimeout(() => {
                    message.style.animation = 'fadeOutDown 0.4s ease-in forwards'
                }, reverseIndex * 120)
            })

            setTimeout(() => {
                this.visibleMessages = []
                this.nextConversation()
            }, messages.length * 120 + 400)
        },

        scrollToTop() {
            const messagesContainer = this.$el.querySelector('.chat-messages')
            if (messagesContainer) {
                // Быстрая прокрутка наверх при очистке чата
                messagesContainer.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                })
            }
        },

        clearTimers() {
            if (this.animationTimer) {
                clearTimeout(this.animationTimer)
                this.animationTimer = null
            }
            if (this.cycleTimer) {
                clearTimeout(this.cycleTimer)
                this.cycleTimer = null
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/animations';
@import '@/styles/mixins';

// Liquid glass переменные
$glass-bg: rgba(255, 255, 255, 0.08);
$glass-border: rgba(255, 255, 255, 0.18);
$glass-blur: blur(12px);
$glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

// Цвета из Figma
$white-50: rgba(255, 255, 255, 0.5);
$black-4: rgba(0, 0, 0, 0.04);
$white-100: #FFFFFF;
$gray-333: #333333;
$gray-f7: #F7F7F7;
$gray-404: #404040;
$gray-c2: #C2C2C2;
$white-26: rgba(255, 255, 255, 0.26);

.chat-container {
    position: absolute;
    top: 10%;
    right: 3%;
    transform: translateY(-50%) translateX($animation-distance-nav);
    width: 31.77vw;
    height: 65.74vh;
    opacity: 0;

    // Используем миксин для glass эффекта
    @include glass-effect(0.08, 1.11vh, 0.15);

    border-radius: 2.22vh;
    box-shadow:
        0 1.11vh 3.7vh rgba(0, 0, 0, 0.25),
        inset 0 0.09vh 0 rgba(255, 255, 255, 0.1);

    display: flex;
    flex-direction: column;
    overflow: hidden;

    // Используем унифицированные переменные
    transition: all $animation-duration-normal ease;

    &.animated {
        opacity: 1;
        transform: translateY(-50%) translateX(0);
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 0.09vh;
        background: linear-gradient(90deg,
                transparent,
                rgba(255, 255, 255, 0.2),
                transparent);
        border-radius: 2.22vh 2.22vh 0 0;
    }

    @media (hover: hover) {
        &:hover {
            backdrop-filter: blur(1.48vh) saturate(1.3);
            transform: translateY(-50%) translateX(0) scale(1.01);
            box-shadow:
                0 1.48vh 4.63vh rgba(0, 0, 0, 0.3),
                inset 0 0.09vh 0 rgba(255, 255, 255, 0.15);
            transition: all $animation-duration-fast ease;
        }
    }

    // Респонсивность для мобильных устройств
    @media (max-width: 1600px) {
        width: 26.04vw;
        height: 55.56vh;
        right: 2%;
        top: 10%;
    }

    @media (max-width: 1300px) {
        width: 23.44vw;
        height: 46.3vh;
        right: 5%;
        top: 20%;
    }

    @media (max-width: 1100px) {
        width: 13.02vw;

    }

    @media (max-width: 800px) {
        display: none;
    }
}

.chat-header {
    padding: 1.85vh;
    background: rgba(255, 255, 255, 0.06);
    border-bottom: 0.09vh solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.11vh;
    backdrop-filter: blur(0.93vh);

    // Анимация заголовка - используем унифицированные переменные
    opacity: 0;
    transform: translateY(-$animation-distance-small);
    animation: headerSlideIn $animation-duration-slow ease-out forwards;
    animation-delay: 1s; // После анимации фона чата

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 1.04vw;
        right: 1.04vw;
        height: 0.09vh;
        background: linear-gradient(90deg,
                transparent,
                rgba(255, 255, 255, 0.15),
                transparent);
    }

    @media (max-width: 1100px) {
        padding: 1.39vh;
        gap: 0.74vh;
    }
}

.chat-title {
    cursor: default;
    font-family: $chat-font;
    font-weight: 100;
    letter-spacing: 0.5em;
    font-size: 2.47vh;
    color: rgba(255, 255, 255, 0.9);

    @media (max-width: 1100px) {
        font-size: 1.85vh;
    }
}

.chat-messages {
    flex: 1;
    padding: 1.85vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.02);
    gap: 1.48vh;

    // Разрешаем взаимодействие с сообщениями
    .message {
        pointer-events: auto;
    }
}

// Анимации для заголовка - локальная для этого компонента
@keyframes headerSlideIn {
    from {
        opacity: 0;
        transform: translateY(-$animation-distance-small);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

// Остальные анимации теперь используются из _animations.scss:
// - slideInLeft
// - slideInRight  
// - fadeOutDown
// - fadeInUp
// Они определены глобально и доступны везде

// Стили для анимированных сообщений
.message-animated {
    opacity: 0;
    transform: translateY(1.85vh);

    // Оптимизация производительности
    will-change: transform, opacity;
    backface-visibility: hidden;

    // Единые тайминги для всех сообщений: 0.4s на появление
    &:nth-child(odd) {
        animation: slideInLeft 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }

    &:nth-child(even) {
        animation: slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }

    @media (hover: hover) {
        &:hover {
            transform: translateY(-0.19vh) !important;
            transition: transform 0.2s ease;
            animation-play-state: running; // Позволяем анимации продолжаться
        }
    }

    // Убираем will-change после завершения анимации
    &.animation-complete {
        will-change: auto;
    }
}
</style>