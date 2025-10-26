<template>
    <div class="feature-card">
        <div class="feature-card__icon" v-if="icon">
            <img :src="icon" alt="" />
        </div>
        <div class="feature-card__content">
            <h3 class="feature-card__title">{{ title }}</h3>
            <p class="feature-card__description">{{ description }}</p>
        </div>

    </div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: [String, Object],
        default: null
    }
})
</script>

<style scoped lang="scss">
@import '@/styles/animations';
@import '@/styles/mixins';

.feature-card {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    max-width: calc(17.6vw);
    min-height: calc(20.3vh);
    padding: calc(1vw);
    border-radius: calc(2vw);
    background: rgba(35, 35, 35, 0.95);
    box-shadow: 0 calc(0.2vw) calc(0.6vw) rgba(0, 0, 0, 0.3);
    cursor: default;
    border: 1px solid rgba(255, 255, 255, 0.15);

    // Начальное скрытое состояние для анимации
    opacity: 0;
    transform: translateY(50px) translateZ(0);

    // Оптимизация производительности
    backface-visibility: hidden;
    -webkit-font-smoothing: antialiased;

    &.animated {
        opacity: 1;
        transform: translateY(0) translateZ(0);
        animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    // Hover эффект - поднятие карточки
    transition: transform 0.3s ease-out,
    box-shadow 0.3s ease-out,
    border-color 0.3s ease-out;

    @media (hover: hover) {
        &:hover {
            transform: translateY(-8px) translateZ(0) scale(1.05);
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(232, 223, 202, 0.1);
            border-color: rgba(232, 223, 202, 0.3);
        }
    }

    // Респонсивность
    @media (max-width: 768px) {
        max-width: 90%;
        min-height: calc(14vh);
        padding: calc(1vw);
        border-radius: calc(5.2vw);
    }

}

// Keyframe для плавного появления снизу
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(50px) translateZ(0);
    }

    to {
        opacity: 1;
        transform: translateY(0) translateZ(0);
    }
}

.feature-card__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: calc(0.8vw);
}

.feature-card__title {
    margin-top: 7vh;
    font-family: $secondary-font;
    font-size: calc(1.2vw);
    max-width: 14vw;
    font-weight: bold;
    line-height: 1.4;
    letter-spacing: 0.02em;
    color: $white;
    transition: text-shadow 0.3s ease-out, transform 0.3s ease-out;

    @media (max-width: 768px) {
        max-width: 70%;
        margin-top: 1vh;
        font-size: calc(5vw);
    }

}

@media (hover: hover) {
    .feature-card:hover {
        text-shadow: 0 0 15px rgba(232, 223, 202, 0.6);
        transform: scale(1.02);
    }
}

.feature-card__description {
    margin: 0;
    font-family: $secondary-font;
    font-size: calc(1.3vw);
    font-weight: 300;
    line-height: 1.7;
    letter-spacing: 0.01em;
    color: $white;
    white-space: pre-line;
    transition: opacity 0.3s ease-out, text-shadow 0.3s ease-out;

    @media (max-width: 768px) {

        font-size: calc(4.5vw);
    }
}

@media (hover: hover) {
    .feature-card:hover {
        opacity: 1;
        text-shadow: 0 0 10px rgba(232, 223, 202, 0.3);
    }
}

.feature-card__icon {
    position: absolute;
    top: calc(1.7vw);
    right: calc(1.7vw);
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(3.3vw);
    height: calc(3.3vw);
    color: $beige;
    font-size: calc(2.5vw);
    transition: transform 0.3s ease-out, filter 0.3s ease-out;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: brightness(0) saturate(100%) invert(92%) sepia(13%) saturate(685%) hue-rotate(328deg) brightness(100%) contrast(93%);
        transition: filter 0.3s ease-out;
    }

    svg {
        width: 100%;
        height: 100%;
        fill: currentColor;
    }

    @media (max-width: 768px) {
        top: calc(1.3vw);
        right: calc(1.3vw);
        width: calc(10vw);
        height: calc(10vw);
        font-size: calc(2.2vw);
    }

}

@media (hover: hover) {
    .feature-card:hover {
        transform: scale(1.1);
        filter: drop-shadow(0 0 10px rgba(232, 223, 202, 0.4));

        img {
            filter: brightness(0) saturate(100%) invert(92%) sepia(13%) saturate(685%) hue-rotate(328deg) brightness(120%) contrast(100%);
        }
    }
}
</style>