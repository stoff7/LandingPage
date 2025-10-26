<template>
    <div class="message" :class="messageTypeClass">
        <div class="message-content" :class="{ 'has-images': hasImages, 'has-multiple-images': images.length > 1 }">
            <div v-if="hasImages" class="message-images">
                <div class="images-grid" :class="gridClass">
                    <div v-for="(image, index) in processedImages" :key="index" class="image-container image-animated"
                        :class="getImageContainerClass(index)" :style="{ animationDelay: `${index * 0.2}s` }">
                        <img :src="image" :alt="`Изображение ${index + 1}`" @error="onImageError" />
                    </div>
                </div>
            </div>
            <div class="message-text" v-if="$slots.default">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ChatMessage',
    props: {
        type: {
            type: String,
            required: true,
            validator: (value) => ['request', 'reply'].includes(value)
        },
        images: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        messageTypeClass() {
            return this.type === 'request' ? 'user-message' : 'bot-message'
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

                return placeholders[index % placeholders.length];
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
            console.log('Ошибка загрузки изображения:', event)
            // Можно установить fallback изображение
            event.target.src = 'https://via.placeholder.com/400x300?text=Изображение+недоступно'
        }
    }
}
</script>

<style lang="scss" scoped>
// Liquid glass переменные
$glass-bg: rgba(255, 255, 255, 0.08);
$glass-border: rgba(255, 255, 255, 0.18);
$glass-blur: blur(12px);
$glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

// Цвета
$white-50: rgba(255, 255, 255, 0.5);
$black-4: rgba(0, 0, 0, 0.04);
$white-100: #FFFFFF;
$gray-333: #333333;
$gray-f7: #F7F7F7;
$gray-404: #404040;
$gray-c2: #C2C2C2;
$white-26: rgba(255, 255, 255, 0.26);

.message {
    max-width: 85%;
    margin-bottom: 1.48vh;

    // Оптимизация для производительности
    will-change: transform, opacity;
    backface-visibility: hidden;
    transform: translateZ(0); // Активируем аппаратное ускорение

    &.bot-message {
        align-self: flex-start;
    }

    &.user-message {
        align-self: flex-end;
    }

    // Респонсивность для планшетов и мобильных
    @media (max-width: 1100px) {
        max-width: 90%;
        margin-bottom: 1.11vh;
    }

    @media (max-width: 768px) {
        max-width: 95%;
        margin-bottom: 0.93vh;
    }
}

.message-content {
    cursor: default;
    background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.1),
            rgba(255, 255, 255, 0.05));
    backdrop-filter: blur(1.85vh);
    border: 0.09vh solid rgba(255, 255, 255, 0.1);
    border-radius: 1.67vh;
    padding: 1.48vh;
    color: #ffffff;
    line-height: 1.5;
    max-width: 27.08vw;
    word-wrap: break-word;
    box-shadow:
        0 0.74vh 2.96vh rgba(0, 0, 0, 0.1),
        inset 0 0.09vh 0 rgba(255, 255, 255, 0.1);

    &.has-images {
        padding: 1.11vh;

        .message-text {
            cursor: default;
            margin-top: 1.11vh;
        }
    }

    &.has-multiple-images {
        .message-text {
            margin-top: 1.48vh;
        }
    }

    // Респонсивность для планшетов и мобильных
    @media (max-width: 1100px) {
        max-width: 20.83vw;
        padding: 1.3vh;
        border-radius: 1.48vh;

        &.has-images {
            padding: 0.93vh;

            .message-text {
                margin-top: 0.93vh;
            }
        }

        &.has-multiple-images {
            .message-text {
                margin-top: 1.3vh;
            }
        }
    }

    @media (max-width: 768px) {
        max-width: 100%;
        padding: 1.11vh;
        border-radius: 1.3vh;

        &.has-images {
            padding: 0.74vh;

            .message-text {
                margin-top: 0.74vh;
            }
        }

        &.has-multiple-images {
            .message-text {
                margin-top: 1.11vh;
            }
        }
    }
}

.message-images {
    margin-bottom: 0.74vh;

    .images-grid {
        display: grid;
        gap: 0.74vh;
        border-radius: 1.11vh;
        overflow: hidden;

        &.grid-single {
            grid-template-columns: 1fr;
        }

        &.grid-two {
            grid-template-columns: 1fr 1fr;
        }

        &.grid-three {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;

            .image-container.top-image {
                height: 11.11vh;
            }

            .image-container.bottom-image {
                grid-column: 1 / -1;
                height: 11.11vh;
            }
        }

        &.grid-four {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
        }

        &.grid-multiple {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        }

        // Респонсивность для планшетов
        @media (max-width: 1100px) {
            gap: 0.56vh;

            &.grid-three {
                .image-container.top-image {
                    height: 9.26vh;
                }

                .image-container.bottom-image {
                    height: 9.26vh;
                }
            }

            &.grid-four .image-container {
                height: 9.26vh;
            }

            &.grid-multiple {
                grid-template-columns: repeat(auto-fit, minmax(9.26vh, 1fr));
            }
        }

        // Респонсивность для мобильных
        @media (max-width: 768px) {
            gap: 0.37vh;

            &.grid-three {
                .image-container.top-image {
                    height: 7.41vh;
                }

                .image-container.bottom-image {
                    height: 7.41vh;
                }
            }

            &.grid-four .image-container {
                height: 7.41vh;
            }

            &.grid-multiple {
                grid-template-columns: repeat(auto-fit, minmax(7.41vh, 1fr));
            }
        }
    }
}

.image-container {
    position: relative;
    overflow: hidden;
    border-radius: 0.74vh;
    background: rgba(255, 255, 255, 0.05);

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        @media (hover: hover) {
            &:hover {
                transform: scale(1.05);
            }
        }
    }

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg,
                rgba(255, 255, 255, 0.1) 0%,
                transparent 50%,
                rgba(0, 0, 0, 0.1) 100%);
        pointer-events: none;
        transition: opacity 0.3s ease;
        opacity: 0;
    }

    @media (hover: hover) {
        &:hover::after {
            opacity: 1;
        }
    }
}

// Анимации для изображений
@keyframes imageSlideIn {
    from {
        opacity: 0;
        transform: scale(0.9) translateY(0.93vh);
    }

    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.image-animated {
    opacity: 0;
    // Длительность 0.3s для изображений
    animation: imageSlideIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;

    // Задержки для изображений - начинаются после появления сообщения (0.4s)
    &:nth-child(1) {
        animation-delay: 0.5s;
    }

    &:nth-child(2) {
        animation-delay: 0.65s;
    }

    &:nth-child(3) {
        animation-delay: 0.8s;
    }

    &:nth-child(4) {
        animation-delay: 0.95s;
    }
}

// Для одного изображения
.grid-single .image-container {
    height: 18.52vh;

    @media (max-width: 1100px) {
        height: 14.81vh;
    }

    @media (max-width: 768px) {
        height: 12.96vh;
    }
}

// Для двух изображений
.grid-two .image-container {
    height: 13.89vh;

    @media (max-width: 1100px) {
        height: 11.11vh;
    }

    @media (max-width: 768px) {
        height: 9.26vh;
    }
}

// Для четырех изображений
.grid-four .image-container {
    height: 11.11vh;

    @media (max-width: 1100px) {
        height: 9.26vh;
    }

    @media (max-width: 768px) {
        height: 7.41vh;
    }
}

.message-image {
    width: 100%;
    margin-bottom: 0.74vh;
    border-radius: 1.85vh 1.85vh 0.74vh 0.74vh;
    overflow: hidden;

    img {
        width: 100%;
        height: 18.52vh;
        object-fit: cover;
        display: block;
        transition: transform 0.3s ease;
        cursor: pointer;

        @media (hover: hover) {
            &:hover {
                transform: scale(1.02);
            }
        }
    }

    // Респонсивность для планшетов и мобильных
    @media (max-width: 1100px) {
        margin-bottom: 0.56vh;
        border-radius: 1.48vh 1.48vh 0.56vh 0.56vh;

        img {
            height: 14.81vh;
        }
    }

    @media (max-width: 768px) {
        margin-bottom: 0.37vh;
        border-radius: 1.11vh 1.11vh 0.37vh 0.37vh;

        img {
            height: 12.96vh;
        }
    }
}

.message-text {
    white-space: pre-line;
    font-family: $chat-font;
    font-size: 1.48vh;
    line-height: 1.5;
    animation: textFadeIn 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 0.45s; // Появляется сразу после контейнера сообщения (0.4s + 0.05s)

    // Респонсивность для планшетов и мобильных
    @media (max-width: 1100px) {
        font-size: 1.3vh;
    }

    @media (max-width: 768px) {
        font-size: 1.2vh;
        line-height: 1.4;
    }
}

// Анимация для плавного появления текста
@keyframes textFadeIn {
    from {
        opacity: 0;
        transform: translateY(0.46vh);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>