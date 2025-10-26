<template>
    <div class="phone-frame">
        <!-- Telegram content inside frame -->
        <div class="frame-content" :style="contentStyle">
            <slot></slot>
        </div>

        <!-- iPhone Frame Image (overlay) -->
        <img :src="frameSrc" alt="iPhone Frame" class="frame-image" />
    </div>
</template>

<script>
/**
 * PhoneFrame - Компонент для встраивания контента в рамку iPhone
 * 
 * Использование:
 * <PhoneFrame
 *     :top-offset="2"
 *     :left-offset="2"
 *     :right-offset="2"
 *     :bottom-offset="2"
 *     :border-radius="45"
 *     :notch-padding="35"
 * >
 *     <TelegramMockup ... />
 * </PhoneFrame>
 * 
 * Настройка:
 * - *Offset - отступы от краев рамки в процентах
 * - borderRadius - закругление углов экрана в пикселях
 * - notchPadding - отступ под челку iPhone в пикселях
 */
import frameImage from '~/assets/frame.png'

export default {
    name: 'PhoneFrame',
    props: {
        frameSrc: {
            type: String,
            default: frameImage
        },
        // Отступы от краев в процентах
        topOffset: {
            type: Number,
            default: 2
        },
        leftOffset: {
            type: Number,
            default: 2
        },
        rightOffset: {
            type: Number,
            default: 2
        },
        bottomOffset: {
            type: Number,
            default: 2
        },
        // Border radius в пикселях
        borderRadius: {
            type: Number,
            default: 45
        },
        // Отступ для челки в пикселях
        notchPadding: {
            type: Number,
            default: 35
        }
    },
    computed: {
        contentStyle() {
            const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
            const offset = isMobile ? 3 : this.topOffset; // Увеличить отступы на мобильных
            return {
                top: `${offset}%`,
                left: `${offset}%`,
                right: `${offset}%`,
                bottom: `${offset}%`,
                borderRadius: `calc(${this.borderRadius / 1920 * 100}vw)`,
                paddingTop: `calc(${this.notchPadding / 1920 * 100}vw)`
            };
        }
    }
}
</script>

<style lang="scss" scoped>
.phone-frame {
    position: relative;
    width: 100%;
    max-width: calc(21.9vw + 0vh);
    aspect-ratio: 9 / 19.5;
    margin: 0 auto;

    @media (max-width: 768px) {
        max-width: calc(35vw + 10vh);
    }
}

.frame-content {
    position: absolute;
    overflow: hidden;
    z-index: 1;

    @media (max-width: 768px) {
        border-radius: calc(3vw + 0vh) !important;
        padding-top: calc(2.5vw + 0vh) !important;
    }
}

.frame-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
    z-index: 2;
    pointer-events: none;
    object-fit: contain;
}
</style>
