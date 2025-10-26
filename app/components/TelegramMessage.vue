<template>
    <div class="tg-message" :class="messageClass">
        <div class="tg-message-bubble" :class="{ 'has-images': hasImages }">
            <!-- Изображения -->
            <div v-if="hasImages" class="tg-message-images">
                <div class="tg-images-grid" :class="gridClass">
                    <div v-for="(image, index) in processedImages" :key="index" class="tg-image-container"
                        :class="getImageContainerClass(index)">
                        <img :src="image" :alt="`Изображение ${index + 1}`" @error="onImageError" />
                    </div>
                </div>
            </div>

            <!-- Текст сообщения -->
            <div v-if="text" class="tg-message-text">{{ text }}</div>

            <!-- Время -->
            <div class="tg-message-time">
                {{ time }}
                <svg v-if="isOutgoing" class="tg-message-check" width="12" height="10" viewBox="0 0 16 11"
                    stroke="currentColor" stroke-width="1.5" fill="none">
                    <path d="M1 5.5L5 9.5L15 1" />
                </svg>
            </div>
        </div>

        <!-- Клавиатура -->
        <div v-if="buttons && buttons.length" class="tg-keyboard">
            <button v-for="(button, index) in buttons" :key="index" class="tg-keyboard-btn">
                {{ button }}
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TelegramMessage',
    props: {
        text: {
            type: String,
            default: ''
        },
        time: {
            type: String,
            required: true
        },
        type: {
            type: String,
            default: 'in', // 'in' или 'out'
            validator: (value) => ['in', 'out'].includes(value)
        },
        buttons: {
            type: Array,
            default: null
        },
        images: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        messageClass() {
            return `tg-message-${this.type}`;
        },
        isOutgoing() {
            return this.type === 'out';
        },
        hasImages() {
            return this.images && this.images.length > 0;
        },
        processedImages() {
            return this.images.map((image, index) => {
                // Используем placeholder изображения с различными случайными значениями
                const placeholders = [
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop',
                    'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=400&h=300&fit=crop'
                ];

                if (typeof image === 'string' && image.includes('img')) {
                    const imgIndex = parseInt(image.replace('img', '')) - 1;
                    return placeholders[imgIndex % placeholders.length];
                }

                // Если передан URL, используем его напрямую
                return image || placeholders[index % placeholders.length];
            });
        },
        gridClass() {
            const count = this.images.length;
            if (count === 1) return 'grid-single';
            if (count === 2) return 'grid-two';
            if (count === 3) return 'grid-three';
            if (count === 4) return 'grid-four';
            return 'grid-multiple';
        }
    },
    methods: {
        getImageContainerClass(index) {
            const count = this.images.length;
            if (count === 3) {
                return index < 2 ? 'top-image' : 'bottom-image';
            }
            return '';
        },
        onImageError(event) {
            console.log('Ошибка загрузки изображения:', event);
            event.target.src = 'https://via.placeholder.com/400x300?text=Image+unavailable';
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/animations';
@import '@/styles/mixins';

.tg-message {
    display: flex;
    flex-direction: column;
    max-width: 80%;

    // Используем унифицированные переменные
    animation: messageSlideIn $animation-duration-fast $animation-ease-material;

    &.tg-message-in {
        align-self: flex-start;
    }

    &.tg-message-out {
        align-self: flex-end;
    }
}

// Локальная анимация для telegram сообщений
@keyframes messageSlideIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.tg-message-bubble {
    background: #212121;
    padding: calc(0.42vw) calc(0.63vw);
    border-radius: calc(0.63vw);
    position: relative;

    .tg-message-out & {
        background: #8774e1;
    }

    &.has-images {
        padding: calc(0.21vw);

        .tg-message-text {
            padding: calc(0.21vw) calc(0.42vw);
            margin-bottom: calc(0.21vw);
        }

        .tg-message-time {
            padding: 0 calc(0.42vw) calc(0.21vw) calc(0.42vw);
        }
    }
}

/* Изображения в сообщениях */
.tg-message-images {
    margin-bottom: calc(0.31vw);
}

.tg-images-grid {
    display: grid;
    gap: calc(0.1vw);
    border-radius: calc(0.42vw);
    overflow: hidden;

    &.grid-single {
        grid-template-columns: 1fr;

        .tg-image-container {
            height: calc(10.4vw);
            max-height: calc(13vw);

            @media (max-width: 768px) {
                height: calc(20vw);
                max-height: calc(24vw);
            }
        }
    }

    &.grid-two {
        grid-template-columns: 1fr 1fr;

        .tg-image-container {
            height: calc(6.25vw);

            @media (max-width: 768px) {
                height: calc(12vw);
            }
        }
    }

    &.grid-three {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;

        .tg-image-container.top-image {
            height: calc(5.2vw);

            @media (max-width: 768px) {
                height: calc(10vw);
            }
        }

        .tg-image-container.bottom-image {
            grid-column: 1 / -1;
            height: calc(5.2vw);

            @media (max-width: 768px) {
                height: calc(10vw);
            }
        }
    }

    &.grid-four {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;

        .tg-image-container {
            height: calc(5.2vw);

            @media (max-width: 768px) {
                height: calc(10vw);
            }
        }
    }

    &.grid-multiple {
        grid-template-columns: repeat(auto-fit, minmax(calc(5.2vw), 1fr));

        @media (max-width: 768px) {
            grid-template-columns: repeat(auto-fit, minmax(calc(7.5vw), 1fr));
        }

        .tg-image-container {
            height: calc(5.2vw);

            @media (max-width: 768px) {
                height: calc(10vw);
            }
        }
    }
}

.tg-image-container {
    position: relative;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.1);

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;

        // Используем унифицированную transition
        @include transition-transform($animation-duration-instant);
    }

    // Используем миксин для hover эффекта
    @media (hover: hover) {
        @include hover-scale(1.05, $animation-duration-instant);
    }
}

.tg-message-text {
    color: #ffffff;
    font-size: calc(0.83vw);
    line-height: 1.3125;
    word-wrap: break-word;
    margin-bottom: calc(0.21vw);

    @media (max-width: 768px) {
        font-size: calc(2.5vw);
    }
}

.tg-message-time {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: calc(0.21vw);
    color: #aaaaaa;
    font-size: calc(0.63vw);
    margin-top: calc(0.1vw);

    @media (max-width: 768px) {
        font-size: calc(1.2vw);
    }

    .tg-message-out & {
        color: rgba(255, 255, 255, 0.7);
    }
}

.tg-message-check {
    width: calc(0.63vw);
    height: calc(0.52vw);
    stroke: rgba(255, 255, 255, 0.7);

    @media (max-width: 768px) {
        width: calc(1.2vw);
        height: calc(1vw);
    }
}

/* Telegram Keyboard */
.tg-keyboard {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: calc(0.42vw);
    margin-top: calc(0.42vw);
}

.tg-keyboard-btn {
    background: #2f2f2f;
    color: #ffffff;
    border: none;
    padding: calc(0.52vw) calc(0.83vw);
    border-radius: calc(0.42vw);
    font-size: calc(0.73vw);
    cursor: pointer;

    @media (max-width: 768px) {
        font-size: calc(1.3vw);
    }

    // Используем унифицированную transition
    @include smooth-transition($animation-duration-instant);

    @media (hover: hover) {
        &:hover {
            background: #3f3f3f;
            transform: translateY(-1px);
        }
    }

    &:active {
        transform: translateY(0);
    }
}
</style>
