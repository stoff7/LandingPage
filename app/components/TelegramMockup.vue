<template>
    <div class="telegram-mockup">
        <!-- Telegram Header -->
        <div class="tg-header">
            <div class="tg-avatar"></div>
            <div class="tg-chat-info">
                <div class="tg-chat-name">{{ chatName }}</div>
                <div class="tg-chat-status">{{ chatStatus }}</div>
            </div>
            <div class="tg-header-actions">
                <div class="tg-icon-btn">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor"
                            d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                </div>
                <div class="tg-icon-btn">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor"
                            d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- Telegram Messages -->
        <div class="tg-messages">
            <transition-group name="message-list" tag="div">
                <TelegramMessage v-for="(message, index) in messages" :key="`msg-${index}`" :text="message.text"
                    :time="message.time" :type="message.type" :buttons="message.buttons" :images="message.images" />
            </transition-group>
        </div>

        <!-- Telegram Input -->
        <div class="tg-input">
            <div class="tg-input-field">
                <div class="tg-icon-btn">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor"
                            d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z" />
                    </svg>
                </div>
                <input type="text" :placeholder="inputPlaceholder" />
                <div class="tg-icon-btn">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor"
                            d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                        <path fill="currentColor"
                            d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TelegramMessage from './TelegramMessage.vue';

export default {
    name: 'TelegramMockup',
    components: {
        TelegramMessage
    },
    props: {
        chatName: {
            type: String,
            default: 'Bot Assistant'
        },
        chatStatus: {
            type: String,
            default: 'online'
        },
        messages: {
            type: Array,
            default: () => []
        },
        inputPlaceholder: {
            type: String,
            default: 'Напишите сообщение...'
        }
    }
}
</script>

<style lang="scss" scoped>
.telegram-mockup {
    font-family: $chat-font;
    margin-top: calc(-0.26vw);
    margin-left: 0.5vw;
    width: 97%;
    height: 97%;
    background: #181818;
    border-radius: 5%;
    box-shadow: none;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;

    @media (max-width: 768px) {
        margin-top: calc(-1.5vw);
        margin-left: 2vw;
        width: 96%;
        height: 96%;
    }
}

/* Telegram Header */
.tg-header {
    margin-top: 0.1vw;
    background: #212121;
    padding: calc(0.63vw) calc(0.83vw);
    display: flex;
    align-items: center;
    gap: calc(0.63vw);
    border-bottom: 1px solid #0f0f0f;
    flex-shrink: 0;

    @media (max-width: 768px) {
        padding-top: calc(2.1vh);
    }
}

.tg-avatar {
    margin-top: 0.7vw;
    width: calc(2.2vw);
    height: calc(2.2vw);
    border-radius: 50%;
    background: linear-gradient(135deg, #8774e1 0%, #b2a6eb 100%);
    flex-shrink: 0;
    position: relative;

    @media (max-width: 768px) {
        margin-top: -0.5vh;
        width: calc(5.2vw);
        height: calc(5.2vw);
    }

    &::after {
        content: '';
        position: absolute;
        bottom: calc(0.1vw);
        right: calc(0.1vw);
        width: calc(0.63vw);
        height: calc(0.63vw);
        background: #5CC85E;
        border: calc(0.1vw) solid #181818;
        border-radius: 50%;
    }
}

.tg-chat-info {
    flex: 1;
    min-width: 0;
}

.tg-chat-name {
    margin-top: 0.9vw;
    color: #ffffff;
    font-size: calc(0.83vw);
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 768px) {
        font-size: calc(3.5vw);
    }
}

.tg-chat-status {
    color: #aaaaaa;
    font-size: calc(0.73vw);

    @media (max-width: 768px) {
        font-size: calc(2.3vw);
    }
}

.tg-header-actions {
    display: flex;
    gap: calc(0.42vw);
}

.tg-icon-btn {
    width: calc(1.9vw);
    height: calc(1.9vw);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #aaaaaa;
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.2s;

    @media (hover: hover) {
        &:hover {
            background: rgba(255, 255, 255, 0.08);
        }
    }

    svg {
        width: calc(1.25vw);
        height: calc(1.25vw);

        @media (max-width: 768px) {
            width: calc(2.2vw);
            height: calc(2.2vw);
        }
    }
}

/* Telegram Messages */
.tg-messages {
    flex: 1;
    padding: calc(0.83vw);
    overflow: hidden;
    background: #181818;
    display: flex;
    flex-direction: column;
    gap: calc(0.63vw);

    // Стили для transition-group контейнера
    >div {
        display: flex;
        flex-direction: column;
        gap: calc(0.63vw);
        width: 100%;
    }
}

/* Анимация переключения сообщений */
.message-list-enter-active {
    transition: all 0.4s ease-out;
}

.message-list-leave-active {
    transition: all 0.3s ease-in;
}

.message-list-enter-from {
    opacity: 0;
    transform: translateY(20px);
}

.message-list-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

/* Telegram Input */
.tg-input {
    background: #212121;
    border-top: 1px solid #0f0f0f;
    padding: calc(0.63vw) calc(0.83vw);
    flex-shrink: 0;
}

.tg-input-field {
    background: #181818;
    border-radius: 24px;
    display: flex;
    align-items: center;
    gap: calc(0.42vw);
    padding: 0 calc(0.42vw);

    input {
        flex: 1;
        background: transparent;
        border: none;
        color: #ffffff;
        font-size: calc(0.83vw);
        padding: calc(0.63vw) calc(0.42vw);
        outline: none;

        &::placeholder {
            color: #707579;
        }

        @media (max-width: 768px) {
            font-size: calc(1.5vw);
        }
    }
}
</style>
