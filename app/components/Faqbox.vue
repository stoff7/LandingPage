<template>
    <div class="question-box" :class="{ open: isVisible, animated: isAnimated }">
        <div class="question-header" @click="isVisible = !isVisible">
            <p>{{ question }}</p>
            <div class="icon" :class="{ 'minus': isVisible }">+</div>
        </div>
        <transition name="slide">
            <div v-if="isVisible" class="answer">
                <p>{{ answer }}</p>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    name: 'Faqbox',
    props: {
        question: {
            type: String,
            required: true,
        },
        answer: {
            type: String,
            required: true,
        },
        staggerDelay: {
            type: Number,
            default: 0,
        }
    },
    data() {
        return {
            isVisible: false,
            isAnimated: false,
        };
    },
    mounted() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            this.isAnimated = true;
                        }, this.staggerDelay);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );
        observer.observe(this.$el);
    }
}
</script>
<style lang="scss" scoped>
.question-box {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid $beige;
    border-radius: 10px;
    padding: 20px;
    margin: 20px auto;
    width: 90%;
    max-width: 1200px;
    max-height: 160px;
    overflow: hidden;
    box-shadow: 0 0 0 rgba(255, 236, 210, 0);
    opacity: 0;
    transform: translateY(-30px) scale(0.9);
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);

    @media (hover: hover) {
        &:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }
    }

    &.open {
        max-height: 2000px;
        box-shadow: 0 0 20px rgba(255, 236, 210, 0.5);

    }

    &.animated {
        opacity: 1;
        transform: translateY(0) scale(1);
    }

    opacity: 0;
    transform: translateY(-30px);

    .question-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        letter-spacing: 0.23em;

        p {
            color: $beige;
            font-family: "Oswald";
            font-weight: 200;
            font-size: calc(1vw + 1vh);
            line-height: 1.5;
            margin: 0;
            flex: 1;

            @media (max-width: 700px) {
                font-size: calc(2vw + 2vh);
            }
        }

        .icon {
            color: $beige;
            font-size: calc(2vw + 2vh);
            font-weight: bold;
            transition: transform 0.3s ease;
            margin-left: 20px;

            &.minus {
                transform: rotate(45deg);
            }
        }

    }

    .answer {
        margin-top: 20px;
        overflow: hidden;
        transition: all 0.5s ease;

        p {
            color: color.adjust($beige, $lightness: -2%);
            font-family: $secondary-font;
            font-weight: 200;
            font-size: calc(1vw + 1vh);
            line-height: 1.5;
            margin: 0;

            @media (max-width: 700px) {
                font-size: calc(2vw + 2vh);
            }
        }
    }
}

.slide-enter-active,
.slide-leave-active {
    transition: all 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.slide-enter-to,
.slide-leave-from {
    opacity: 1;
    transform: translateY(0);
}
</style>