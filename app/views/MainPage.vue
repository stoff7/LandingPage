<template>
    <div class="content">
        <div class="image-container" ref="imageContainerRef">
            <img class="background-image" ref="backgroundImageRef" src="@/assets/background.jpg" />
            <div class="text-overlay" ref="textOverlayRef">
                <h1 class="hero-title" ref="heroTitleRef">
                    Найди идеальное место для рыбалки или кемпинга
                </h1>
                <h2 class="hero-subtitle" ref="heroSubtitleRef">
                    Опиши цель и наш ИИ проанализирует сезон, тип
                    рыбы/локации, подходящее
                    снаряжение и даст готовые места с картами и отзывами.
                </h2>
                <button class="get-started-button" ref="buttonRef" @click="handleGetStarted">
                    Попробуй прямо сейчас
                </button>
            </div>
            <ChatComponent class="chat-component" ref="chatRef" />
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import NavigationBar from '@/components/NavigationBar.vue';
import ChatComponent from '@/components/ChatComponent.vue';
import { useAnimations } from '@/composables/useAnimations';

export default {
    name: 'MainPage',
    components: {
        NavigationBar,
        ChatComponent,
    },
    setup() {
        const imageContainerRef = ref(null)
        const backgroundImageRef = ref(null)
        const textOverlayRef = ref(null)
        const heroTitleRef = ref(null)
        const heroSubtitleRef = ref(null)
        const buttonRef = ref(null)
        const chatRef = ref(null)

        // Используем унифицированный композабл для анимаций
        const { addAnimation, addExitAnimation, animateExitSequence } = useAnimations()

        // Функция для анимации исчезновения всех элементов

        // Пример: запуск исчезновения при клике на кнопку
        const handleGetStarted = async () => {

            // Переход на Telegram группу
            window.open('https://t.me/Fish_Agent_Bot', '_blank')
        }

        onMounted(() => {
            // Последовательная анимация появления элементов главной страницы
            addAnimation(imageContainerRef.value, 'scale-in', 600)
            addAnimation(backgroundImageRef.value, 'fade-in', 800)
            addAnimation(heroTitleRef.value, 'fade-in-up', 1600)
            addAnimation(heroSubtitleRef.value, 'fade-in-up', 2000)
            addAnimation(buttonRef.value, 'fade-in-up', 2400)
            addAnimation(chatRef.value?.$el, 'fade-in-right', 2800)
        })

        return {
            imageContainerRef,
            backgroundImageRef,
            textOverlayRef,
            heroTitleRef,
            heroSubtitleRef,
            buttonRef,
            chatRef,
            handleGetStarted
        }
    }
};
</script>

<style lang="scss" scoped>
body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: $black;
    overflow-x: hidden;
}

.content {
    width: 100%;
    display: flex;
    justify-content: center;
    position: relative;
}

.image-container {
    position: relative;
    margin-top: 13.89vh;
    margin-left: 1.82vw;
    margin-right: 1.82vw;
    width: calc(100vw - 3.65vw);
    height: 80vh;
    max-width: calc(100% - 3.65vw);

    // Используем унифицированные стили для анимаций
    @include animation-hidden();
    transform: scale(0.9);
    @include smooth-transition($animation-duration-fast);

    &.animated {
        opacity: 1;
        transform: scale(1);
    }
}

.text-overlay {
    position: absolute;
    top: 50%;
    left: 30%;
    transform: translate(-50%, -50%);
    text-align: left;
    color: $white;
    z-index: 10;
    max-width: 90%;
    padding: 0 2.08vw;

    @media (max-width: 1600px) {
        top: 45%;
        left: 30%;
    }

    @media (max-width: 1300px) {
        top: 50%;
        left: 30%;
    }

    @media (max-width: 1100px) {
        top: 50%;
        left: 31%;
    }

    @media (max-width: 800) {
        position: relative;

    }

}

.hero-title {
    cursor: default;
    font-family: $main-font;
    font-size: clamp(3.7vh, 6.17vh, 6.79vh);
    font-weight: bold;
    line-height: 117%;
    letter-spacing: 0.08em;
    max-width: 870px;
    margin-bottom: 2.22vh;
    text-shadow: 0.19vh 0.19vh 0.74vh rgba(0, 0, 0, 0.7);
    color: $beige;

    // Используем унифицированные стили
    @include animation-hidden();
    transform: translateY($animation-distance-large);
    @include smooth-transition($animation-duration-fast);

    &.animated {
        opacity: 1;
        transform: translateY(0);
    }

    @media (hover: hover) {
        &:hover {
            text-shadow: 0 0 15px rgba($beige, 0.6);
            transform: scale(1.02);
        }
    }

    @media (max-width: 1600px) {
        max-width: 700px;
        font-size: 4.94vh;
    }

    @media (max-width: 1300px) {
        max-width: 500px;
        font-size: 3.7vh;
    }

    @media (max-width: 1100px) {
        max-width: 500px;
        font-size: 3.33vh;
    }
}

.hero-subtitle {
    cursor: default;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: clamp(1.98vh, 3.09vh, 3.7vh);
    font-weight: 300;
    line-height: 112%;
    letter-spacing: 0.2em;
    max-width: 610px;
    margin-top: 5vh;
    margin-bottom: 0;
    text-shadow: 0.09vh 0.05vw 0.37vh rgba(0, 0, 0, 0.8);
    color: $beige;

    // Используем унифицированные стили
    @include animation-hidden();
    transform: translateY($animation-distance-large);
    @include smooth-transition($animation-duration-fast);

    &.animated {
        opacity: 0.95;
        transform: translateY(0);
    }

    @media (hover: hover) {
        &:hover {
            opacity: 1;
            text-shadow: 0 0 10px rgba($beige, 0.4);
        }
    }

    @media (max-width: 1600px) {
        font-size: 2.47vh;

    }

    @media (max-width: 1100px) {
        font-size: 1.85vh;
        max-width: 400px;
    }
}

.background-image {
    width: 100%;
    height: 100%;
    border-radius: 11.85vh;
    object-fit: cover;
    object-position: center 70%;
    user-select: none;
    opacity: 0;
    pointer-events: none;
    -webkit-user-drag: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
    transform: scale(0.9);
    filter: blur(0.93vh);

    // Используем унифицированную длительность и timing
    transition: all $animation-duration-very-slow $animation-ease-smooth;

    &.animated {
        opacity: 0.82;
        transform: scale(1);
        filter: blur(0px);
    }
}

.get-started-button {
    margin-top: 10vh;
    height: 9vh;
    width: 30vw;
    padding: 1.39vh 1.56vw;
    font-family: $main-font;
    font-size: clamp(1.73vh, 3.09vh, 3.09vh);
    font-weight: 300;
    color: $white;
    background-color: $orange;
    border: none;
    border-radius: 2.78vh;
    cursor: pointer;
    box-shadow: 0 0.37vh 1.11vh rgba(0, 0, 0, 0.3);
    position: relative;
    overflow: hidden;

    // Используем унифицированные стили
    @include animation-hidden();
    transform: translateY($animation-distance-large);
    @include smooth-transition($animation-duration-fast);

    &.animated {
        opacity: 1;
        transform: translateY(0);
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba($beige, 0.3), transparent);
        transition: left $animation-duration-normal ease;
    }

    @media (hover: hover) {
        &:hover {
            background-color: #d14d1c;
            box-shadow: 0 0.74vh 1.85vh rgba(0, 0, 0, 0.4);
            transform: translateY(-0.28vh) scale(1.02);

            &::before {
                left: 100%;
            }
        }
    }

    @media (max-width: 1600px) {
        width: 25vw;
        font-size: 2.47vh;

    }

    @media (max-width: 1300px) {
        max-width: 23vw;
        font-size: 1.85vh;
    }


    &:active {
        background-color: #c54218;
        box-shadow: 0 0.19vh 0.74vh rgba(0, 0, 0, 0.2);
        transform: translateY(-0.09vh) scale(0.98);
    }
}

// Мобильная адаптивность для iPhone SE и других устройств
@media (max-width: 768px) {
    .content {
        height: 100vh;
        overflow: hidden;
    }

    .image-container {
        margin: 0;
        width: 100vw;
        height: 100vh;
        border-radius: 0;
    }

    .text-overlay {
        position: absolute;
        top: 52%;
        left: 7%;
        transform: translateY(-50%);
        text-align: left;
        padding: 0 1.04vw;
        max-width: 80%;
    }

    .hero-title {
        font-size: 4.4vh;
        margin-bottom: 1.48vh;
        line-height: 110%;
    }

    .hero-subtitle {
        font-size: 3.3vh;
        max-width: 280px;
        margin-top: 3vh;
        line-height: 115%;
        letter-spacing: 0.1em;
    }

    .background-image {
        border-radius: 0;
        object-fit: cover;
        object-position: 25% 10%;
    }

    .get-started-button {
        margin-top: 12vh;
        max-width: 100%;
        width: 50.42vw;
        height: 10.63vh;
        font-size: 2.5vh;
        box-shadow: 0 0.74vh 1.85vh rgba(0, 0, 0, 0.4);
    }

    .chat-component {
        display: none;
    }
}
</style>