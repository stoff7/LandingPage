<template>
    <div v-if="isMenuOpen" class="side-menu">
        <ul>
            <li><a @click.prevent="scrollToFeatures">Преимущества</a></li>
            <li><a @click.prevent="scrollToHowItWorks">Как это работает</a></li>
            <li><a @click.prevent="scrollToAbout">О нас</a></li>
            <li><a @click.prevent="scrollToFAQ">FAQ</a></li>
            <li><button @click="openTelegram" class="tg-link">
                    <img src="@/assets/tg.svg" alt="Tg" />
                </button></li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'SideMenu',
    props: ['isMenuOpen'],
    data() {
        return {
            windowWidth: process.client ? window.innerWidth : 1200
        }
    },
    computed: {
        isMobile() {
            return this.windowWidth < 768;
        }
    },
    mounted() {
        if (process.client) {
            window.addEventListener('resize', this.handleResize);
        }
    },
    beforeUnmount() {
        if (process.client) {
            window.removeEventListener('resize', this.handleResize);
        }
    },
    methods: {
        handleResize() {
            if (process.client) {
                this.windowWidth = window.innerWidth;
            }
        },
        scrollToSection(sectionId, block = 'start') {
            if (process.client) {
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: block
                    });
                }
            }
        },
        scrollToFeatures() {
            this.scrollToSection('features');
            this.$emit('close-menu');
        },
        scrollToHowItWorks() {
            this.scrollToSection('demo');
            this.$emit('close-menu');
        },
        scrollToAbout() {
            this.scrollToSection('goal', 'end');
            this.$emit('close-menu');
        },
        scrollToFAQ() {
            this.scrollToSection('faq', 'center');
            this.$emit('close-menu');
        },
        openTelegram() {
            if (process.client) {
                window.open('https://t.me/travel_ai_group', '_blank');
            }
            this.$emit('close-menu');
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

.side-menu {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    width: 250px;
    background-color: $black;
    padding: 20px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
}

.side-menu ul {
    list-style: none;
    padding: 0;
}

.side-menu li {
    margin-bottom: 15px;
}

.side-menu a {
    text-decoration: none;
    color: $beige;
    font: $main-font;
    font-size: 18px;
    position: relative;
    @include smooth-transition($animation-duration-fast);

    @media (hover: hover) {
        &:hover {
            color: $orange;
            text-shadow: 0 0 15px rgba($orange, 0.8);
            transform: translateY(-3px) scale(1.05);
            @include animated-underline($beige, 2px, $animation-duration-fast);

            &::after {
                width: 100%;
                background: linear-gradient(90deg, $orange, $beige);
            }
        }
    }

    // Эффекты active только для мобильных (но поскольку SideMenu не для мобильных, возможно, не нужно, но добавлю)
    @media (max-width: 768px) {
        &:active {
            color: $orange;
            transform: scale(0.95);
        }
    }
}

.tg-link {
    background: none;
    border: none;
    padding: 10px;
    cursor: pointer;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    overflow: hidden;
    position: relative;
    @include smooth-transition($animation-duration-fast);

    @media (hover: hover) {
        &:hover {
            transform: scale(1.1);
            box-shadow: 0 0 15px rgba($beige, 0.5);

            &::before {
                opacity: 1;
                background: linear-gradient(45deg, $orange, $beige, $orange);
            }
        }
    }

    // Эффекты active для мобильных
    @media (max-width: 768px) {
        &:active {
            transform: scale(0.9);
        }
    }

    &::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(45deg, $orange, $beige, $orange);
        border-radius: 50%;
        opacity: 0;
        z-index: -1;
        transition: opacity $animation-duration-fast ease;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
    }
}
</style>