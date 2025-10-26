<template>
    <div class="goal-page">
        <div class="goal-wrapper" ref="goalWrapperRef">
            <h1 ref="goalTitleRef">Наша цель</h1>
            <div class="svg-container">
                <svg class="svg-line" ref="svgLineRef">
                    <line x1="0%" y1="45%" x2="100%" y2="45%" stroke="#FFECD2" stroke-width="calc(0.1vw + 0.1vh)"
                        stroke-linecap="round" />
                </svg>
            </div>
            <div class="content">
                <p ref="goalDescriptionRef">Сделать отдых на природе простым, безопасным и вдохновляющим.</p>
            </div>
        </div>
    </div>


</template>
<script>
import { ref, onMounted } from 'vue';

export default {
    name: 'GoalPage',
    setup() {
        const goalWrapperRef = ref(null);
        const goalTitleRef = ref(null);
        const goalDescriptionRef = ref(null);
        const svgLineRef = ref(null);

        onMounted(() => {
            // Создаем observer для анимаций
            const createObserver = (element, delay) => {
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                setTimeout(() => {
                                    entry.target.classList.add('animated');
                                }, delay);
                                observer.unobserve(entry.target);
                            }
                        });
                    },
                    { threshold: 0.3 }
                );

                if (element) {
                    observer.observe(element);
                }
            };

            // Анимация wrapper (фона)
            createObserver(goalWrapperRef.value, 300);
            createObserver(goalTitleRef.value, 500);

            // Анимация описания с задержкой
            createObserver(goalDescriptionRef.value, 600);

            // Анимация SVG линии
            createObserver(svgLineRef.value, 800);
        });

        return {
            goalWrapperRef,
            goalTitleRef,
            goalDescriptionRef,
            svgLineRef
        };
    }
};
</script>
<style lang="scss" scoped>
.goal-page {
    margin-top: 10vh;
    margin-bottom: 20vh;

    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 100vh;
    padding-top: 10vh;
    background-color: $black;
    overflow: hidden;
    font-family: $accent-font;

    .goal-wrapper {
        position: relative;
        z-index: 0;
        width: 100%;
        height: 100vh;
        margin: 0 auto;
        padding: 25vh 0 0;
        /* Опускает контент внутри wrapper */
        text-align: center;
        cursor: default;

        @media (max-width: 700px) {
            padding: 20vh 0 0 0;
            height: 60vh;
        }

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to bottom, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 100%), url("@/assets/campfire.jpg");
            background-size: cover;
            background-position: center 87%;
            background-repeat: no-repeat;
            background-blend-mode: overlay;
            /* Смешивает градиент с изображением */
            z-index: -1;
            opacity: 0;
            transform: scale(1.1);
            filter: blur(10px);
            transition: all 1.2s ease;
        }

        &.animated::before {
            opacity: 1;
            transform: scale(1);
            filter: blur(0px);
        }
    }

    h1 {
        z-index: 1;
        font-family: "Oswald";
        font-weight: 300;
        color: $beige;
        font-size: calc(7.4vw + 0vh);
        letter-spacing: 0.26em;
        text-align: center;

        opacity: 0;
        transform: translateY(-30px);
        transition: all 0.6s ease;

        &.animated {
            opacity: 1;
            transform: translateY(0);
        }

        @media (hover: hover) {
            &:hover {
                text-shadow: 0 0 20px rgba($beige, 0.8);
                transform: scale(1.02);
            }
        }


        @media (max-width: 700px) {
            letter-spacing: 0.15em;
            font-size: calc(6vw + 5vh);
        }
    }

    p {
        margin-top: calc(9.3vh);
        text-align: center;
        letter-spacing: 0.2em;
        font-size: calc(4vw + 1vh);
        color: $beige;
        text-align: center;

        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;

        &.animated {
            opacity: 1;
            transform: translateY(0);
        }

        @media (hover: hover) {
            &:hover {
                opacity: 1;
                text-shadow: 0 0 15px rgba($beige, 0.5);
            }
        }

        @media (max-width: 700px) {
            font-size: calc(3vw + 2vh);
        }
    }

    .svg-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 2vh 0;
        width: 100%;
    }

    .svg-line {
        width: 100%;
        max-width: 200px;
        height: auto;
        opacity: 0;
        transform: scale(0.8);
        transition: all 0.8s ease;

        &.animated {
            opacity: 1;
            transform: scale(1);
        }

        @media (hover: hover) {
            &:hover line {
                stroke-width: calc(0.2vw + 0vh);
                stroke: rgba($beige, 0.8);
                filter: drop-shadow(0 0 10px rgba($beige, 0.6));
            }
        }
    }

    .content {
        position: relative;
        z-index: 1;
        color: #ffffff;
        text-align: center;
    }
}
</style>