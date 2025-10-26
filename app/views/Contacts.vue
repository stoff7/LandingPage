<template>
    <div class="Contacts-page" ref="contactsPageRef">
        <img class="logo" ref="logoRef" src="@/assets/logo.svg" alt="Logo">
        </img>
        <h1 ref="titleRef">Найди своё идеальное место для отдыха</h1>
        <button class="get-started-button" ref="buttonRef" @click="handleGetStarted">
            Попробуй прямо сейчас
        </button>
    </div>

</template>
<script>
import { ref, onMounted } from 'vue';

export default {
    name: 'Contacts',
    setup() {
        const contactsPageRef = ref(null);
        const logoRef = ref(null);
        const titleRef = ref(null);
        const buttonRef = ref(null);

        const handleGetStarted = () => {
            window.open('https://t.me/Fish_Agent_Bot', '_blank')
        };

        onMounted(() => {
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
                if (element) observer.observe(element);
            };

            createObserver(contactsPageRef.value, 300);
            createObserver(logoRef.value, 500);
            createObserver(titleRef.value, 700);
            createObserver(buttonRef.value, 900);
        });

        return {
            contactsPageRef,
            logoRef,
            titleRef,
            buttonRef,
            handleGetStarted
        };
    }
};
</script>
<style lang="scss" scoped>
.Contacts-page {
    margin-top: 25vh;
    font-family: $main-font;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: calc(3.7vh) calc(1vw);
    color: $beige;
    text-align: center;

    @include animation-hidden();
    transform: translateY(2.78vh);
    @include smooth-transition(0.6s);

    &.animated {
        opacity: 1;
        transform: translateY(0);
    }

    h1 {
        font-size: calc(3.5vw + 0vh);
        margin-top: calc(4.6vh);
        font-family: "Oswald";
        letter-spacing: 0.2em;
        font-weight: bold;
        @include animation-hidden();
        transform: translateY(2.78vh);
        @include smooth-transition(0.6s);

        &.animated {
            opacity: 1;
            transform: translateY(0);
        }

        @media (max-width: 700px) {
            font-size: calc(5vw + 2vh);
        }
    }

    .logo {
        padding-top: 10vh;
        width: calc(19vw + 11vh);
        height: calc(19vw + 11vh);
        user-select: none;
        // pointer-events: none;

        @media (max-width: 700px) {
            width: calc(30vw + 15vh);
            height: calc(30vw + 15vh);
        }

        @media (hover: hover) {
            &:hover {
                scale: 1.05;
                animation: rotateLogo 4s linear infinite;
            }
        }

        @include animation-hidden();
        transform: translateY(2.78vh) scale(0.9);
        @include smooth-transition(0.8s);

        &.animated {
            opacity: 1;
            transform: translateY(0) scale(1);
        }

        @media (max-width: 700px) {}
    }

    .get-started-button {
        margin: 2.5vh 0;
        height: 9vh;
        width: 30vw;
        padding: calc(1vh) calc(2vw);
        font-family: $main-font;
        font-size: clamp(calc(1vw + 0vh), calc(1.7vw + 0vh), calc(1.7vw + 0vh));
        font-weight: 300;
        color: $white;
        background-color: $orange;
        border: none;
        border-radius: 2.78vh;
        cursor: pointer;
        box-shadow: 0 0.37vh 1.11vh rgba(0, 0, 0, 0.3);
        position: relative;
        overflow: hidden;

        @media (max-width: 700px) {
            height: 10vh;
            width: 55vw;
            font-size: clamp(calc(2vw + 1vh), calc(2.7vw + 1vh), calc(2.7vw + 1vh));
        }

        @include animation-hidden();
        transform: translateY(2.78vh);
        @include smooth-transition(0.6s);

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
            transition: left 0.5s ease;
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

        &:active {
            background-color: #c54218;
            box-shadow: 0 0.19vh 0.74vh rgba(0, 0, 0, 0.2);
            transform: translateY(-0.09vh) scale(0.98);
        }
    }
}
</style>