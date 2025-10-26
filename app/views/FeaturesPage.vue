<template>
    <div class="features-page">

        <div class="features-wrapper" ref="featuresWrapperRef">
            <div class="header-container" ref="headerRef">
                <h1 ref="headerTitleRef">Преимущества</h1>
                <h2 ref="headerSubtitleRef">TRAVEL AI</h2>
            </div>
            <div class="features-container" ref="featuresContainerRef">
                <FeatureComponent ref="feature1Ref" title="Подбор мест под ваши привычки"
                    description="Бот анализирует ваши предпочтения, стиль отдыха и прошлые запросы, предлагая  подходящие локации."
                    :icon="personIcon" />
                <FeatureComponent ref="feature2Ref" title="Всегда знайте, как далеко до цели"
                    description="Travel AI рассчитывает расстояние до места отдыха и показывает примерное время в пути."
                    :icon="mapIcon" />
                <FeatureComponent ref="feature3Ref" title="Отдыхайте без штрафов и рисков"
                    description="Бот автоматически предупреждает о региональных законах и где действуют ограничения."
                    :icon="lawIcon" />
                <FeatureComponent ref="feature4Ref" title="Выбирайте спокойные места без толпы"
                    description="ИИ анализирует  данные о посещаемости и показывает, насколько место популярно сейчас"
                    :icon="leafIcon" />
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import FeatureComponent from '@/components/FeatureComponent.vue';
import personIcon from '~/assets/person.svg';
import mapIcon from '~/assets/map.svg';
import lawIcon from '~/assets/law.svg';
import leafIcon from '~/assets/leaf.svg';

export default {
    name: 'FeaturesPage',
    components: {
        FeatureComponent
    },
    setup() {
        const featuresWrapperRef = ref(null);
        const headerTitleRef = ref(null);
        const headerSubtitleRef = ref(null);
        const feature1Ref = ref(null);
        const feature2Ref = ref(null);
        const feature3Ref = ref(null);
        const feature4Ref = ref(null);

        onMounted(() => {
            // Создаем единый observer для всех элементов
            const createObserver = (element, delay) => {
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                // Задержка применяется ПОСЛЕ того как элемент в viewport
                                setTimeout(() => {
                                    entry.target.classList.add('animated');
                                }, delay);
                                observer.unobserve(entry.target);
                            }
                        });
                    },
                    { threshold: 0.1 }
                );

                if (element) {
                    observer.observe(element);
                }
            };

            // Анимация фона
            createObserver(featuresWrapperRef.value, 0);

            // Анимация заголовков с задержкой
            createObserver(headerTitleRef.value, 200);
            createObserver(headerSubtitleRef.value, 400);

            // Анимация карточек с последовательными задержками
            const features = [
                { ref: feature1Ref, delay: 600 },
                { ref: feature2Ref, delay: 800 },
                { ref: feature3Ref, delay: 1000 },
                { ref: feature4Ref, delay: 1200 }
            ];

            features.forEach(({ ref: featureRef, delay }) => {
                if (featureRef.value?.$el) {
                    createObserver(featureRef.value.$el, delay);
                }
            });
        });

        return {
            featuresWrapperRef,
            headerTitleRef,
            headerSubtitleRef,
            feature1Ref,
            feature2Ref,
            feature3Ref,
            feature4Ref,
            personIcon,
            mapIcon,
            lawIcon,
            leafIcon
        };
    }
};
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/animations';
@import '@/styles/mixins';

.features-page {
    margin-top: 20vh;
    margin-bottom: 20vh;
    position: relative;
    width: 100%;
    min-height: 100vh;
    padding-top: calc(4.2vh);
    background-color: #000000;
    overflow: hidden;


}

.header-container {
    position: relative;
    z-index: 10;
    max-width: 1920px;
    ;

    text-align: center;
    cursor: default;

    h1 {
        margin: 0 0 16px 0;
        font-family: $secondary-font;
        font-size: calc(3.3vw);
        letter-spacing: 0.3em;
        font-weight: bold;
        color: $beige;
        text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);

        opacity: 0;
        transform: translateY(-30px);
        transition: all 0.6s ease;

        &.animated {
            opacity: 1;
            transform: translateY(0);
        }

        @media (hover: hover) {
            &:hover {
                text-shadow: 0 0 20px rgba($beige, 0.7);
                transform: scale(1.02);
            }
        }

        @media (max-width: 700px) {
            font-size: calc(5vw + 2vh);
        }
    }

    h2 {
        margin: 0;
        font-family: $secondary-font;
        line-height: 1.95em;
        font-size: calc(2.7vw);
        letter-spacing: 0.22em;
        font-weight: 200;
        color: $beige;
        text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.4);
        margin-bottom: 7vh;
        opacity: 0;
        transform: translateY(-30px);
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
            font-size: calc(4vw + 2vh);
        }
    }
}

.features-wrapper {
    position: relative;
    z-index: 5;
    max-width: 1920px;
    margin: 0 auto;
    padding-top: 10vh;

    // Фоновое изображение сзади карточек (как в Figma)
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%) scale(1.1);
        width: calc(96vw);
        height: calc(79.5vh);
        background-image: url('@/assets/background2.jpg');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        border-radius: calc(6.7vw);
        opacity: 0;
        filter: blur(10px);
        z-index: 0;
        pointer-events: none;
        transition: all 1.2s ease;

        @media (max-width: 700px) {
            height: 160vh;
        }
    }

    // Анимированное состояние фона
    &.animated::before {
        opacity: 0.7;
        transform: translateX(-50%) scale(1);
        filter: blur(0px) brightness(1.1);
    }
}

.features-container {
    position: relative;
    z-index: 6;
    display: flex;
    justify-content: center;
    align-items: stretch;
    gap: calc(4.2vw);
    flex-wrap: wrap;

    // Адаптивность для меньших экранов
    @media (max-width: 1919px) {
        gap: calc(3.1vw);
    }

    @media (max-width: 1440px) {
        gap: calc(2.1vw);
    }

    @media (max-width: 1200px) {
        gap: calc(1.6vw);
    }

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
        gap: calc(5vw);
        // padding: 0 calc(1.3vw);
        padding-bottom: 5vh;
    }
}
</style>