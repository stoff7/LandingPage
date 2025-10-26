<template>
  <nav class="nav" ref="navRef">
    <div class="logo-section">
      <img class="logo-img" ref="logoImgRef" src="@/assets/logo.svg" alt="Logo" />
      <a @click.prevent="scrollToTop" class="nav-title" ref="logoTitleRef">TRAVEL AI</a>
    </div>
    <div class="nav-links" ref="navLinksRef" v-if="!isMobile">
      <a class="features-link" @click.prevent="scrollToFeatures" ref="featuresRef">Преимущества</a>
      <a class="how-it-works-link" @click.prevent="scrollToHowItWorks" ref="howItWorksRef">Как это работает</a>
      <a class="about-link" @click.prevent="scrollToAbout" ref="aboutRef">О нас</a>
      <a class="faq-link" @click.prevent="scrollToFAQ" ref="faqRef">FAQ</a>
      <button class="tg-link" @click="openTelegram" ref="tgRef">
        <img src="@/assets/tg.svg" alt="Tg" />
      </button>
    </div>
    <SideMenu :isMenuOpen="isMenuOpen" @close-menu="closeMenu" />
  </nav>
  <button class="burger" @click="toggleMenu" v-if="isMobile" ref="burgerRef" :class="{ open: isMenuOpen }">
    <span></span>
    <span></span>
    <span></span>
  </button>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useAnimations } from '@/composables/useAnimations'
import SideMenu from './SideMenu.vue';

export default {
  name: 'NavigationBar',
  components: {
    SideMenu
  },
  setup() {
    const navRef = ref(null)
    const logoImgRef = ref(null)
    const logoTitleRef = ref(null)
    const navLinksRef = ref(null)
    const featuresRef = ref(null)
    const howItWorksRef = ref(null)
    const aboutRef = ref(null)
    const faqRef = ref(null)
    const tgRef = ref(null)
    const burgerRef = ref(null)

    const isScrolled = ref(false)
    const lastScrollY = ref(0)
    const isMenuOpen = ref(false)
    const windowWidth = ref(1200) // Default value for SSR

    // Используем унифицированный композабл для анимаций
    const { addAnimation } = useAnimations()

    const isMobile = computed(() => windowWidth.value < 768)

    const handleResize = () => {
      if (process.client) {
        windowWidth.value = window.innerWidth
      }
    }

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value
    }

    const closeMenu = () => {
      isMenuOpen.value = false
    }

    const handleScroll = () => {
      if (process.client) {
        const currentScrollY = window.scrollY

        // Если прокрутили больше чем на 50px от начала
        if (currentScrollY > 50) {
          isScrolled.value = true
          if (navRef.value) {
            navRef.value.classList.add('scrolled')
          }
        } else {
          isScrolled.value = false
          if (navRef.value) {
            navRef.value.classList.remove('scrolled')
          }
        }

        lastScrollY.value = currentScrollY
      }
    }

    // Методы для плавной прокрутки к секциям
    const scrollToSection = (sectionId, block = 'start') => {
      if (process.client) {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: block
          })
        }
      }
    }

    const scrollToFeatures = () => scrollToSection('features')
    const scrollToHowItWorks = () => scrollToSection('demo')
    const scrollToAbout = () => scrollToSection('goal', 'end') // Прокрутка к концу для goal секции
    const scrollToFAQ = () => scrollToSection('faq', 'center')
    const scrollToTop = () => {
      if (process.client) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
    const openTelegram = () => {
      if (process.client) {
        window.open('https://t.me/travel_ai_group', '_blank')
      }
    }

    onMounted(() => {
      // Инициализация windowWidth
      handleResize()

      // Последовательные анимации появления элементов
      addAnimation(logoImgRef.value, 'fade-in-left', 300)
      addAnimation(logoTitleRef.value, 'fade-in-down', 500)
      addAnimation(featuresRef.value, 'fade-in-down', 700)
      addAnimation(howItWorksRef.value, 'fade-in-down', 900)
      addAnimation(aboutRef.value, 'fade-in-down', 1100)
      addAnimation(faqRef.value, 'fade-in-down', 1300)
      addAnimation(tgRef.value, 'fade-in-right', 1500)

      if (process.client) {
        // Добавляем слушатель скролла
        window.addEventListener('scroll', handleScroll)
        window.addEventListener('resize', handleResize)
      }
    })

    onUnmounted(() => {
      if (process.client) {
        // Убираем слушатель при размонтировании
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleResize)
      }
    })

    return {
      navRef,
      logoImgRef,
      logoTitleRef,
      navLinksRef,
      featuresRef,
      howItWorksRef,
      aboutRef,
      faqRef,
      tgRef,
      burgerRef,
      isScrolled,
      isMenuOpen,
      isMobile,
      scrollToFeatures,
      scrollToHowItWorks,
      scrollToAbout,
      scrollToFAQ,
      scrollToTop,
      openTelegram,
      toggleMenu,
      closeMenu
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/animations';
@import '@/styles/mixins';

// Базовый класс анимации - теперь используется из общего файла
.animated {
  @include animated-base($animation-duration-normal, $animation-ease-smooth);
}

.nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 100vw;
  min-height: 75px;
  max-height: 85px;
  padding: 0 22px;
  gap: clamp(15px, 3vw, 30px);
  flex-wrap: nowrap;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background: rgba($black, 0.3);
  backdrop-filter: blur(10px);
  box-sizing: border-box;
  opacity: 0;
  transform: translateY(-$animation-distance-nav);
  cursor: default;



  // Используем унифицированные переменные
  transition: all $animation-duration-slow ease;
  animation: slideDownNav $animation-duration-slow ease 0.1s forwards;

  &.scrolled {
    min-height: 55px;
    max-height: 75px;
    padding: 0 18px;
    background: rgba($black, 0.3);
    backdrop-filter: blur(15px);
    box-shadow: 0 2px 20px rgba($black, 0.3);
  }

  // Медиа-запросы для разных экранов
  @media (max-width: 1200px) {
    padding: 0 15px;
    gap: clamp(12px, 2.25vw, 22px);
  }

  @media (max-width: 768px) {
    padding: 0 12px;
    gap: 12px;
    height: 1vh;

    &.scrolled {
      min-height: 67px;
      max-height: 82px;
    }
  }
}

// Анимации теперь используются из общего файла _animations.scss
// @keyframes slideDownNav - определен в _animations.scss

.logo-section {
  display: flex;
  align-items: center;
  gap: 20px;
  opacity: 0;
  transform: translateX(-$animation-distance-large);
  animation: slideInLeft $animation-duration-slow ease 0.3s forwards;
}

.nav-links {
  display: flex;
  gap: clamp(12px, 3vw, 30px);
  align-items: center;
  flex-shrink: 1;
  min-width: 0;
  opacity: 0;
  transform: translateX($animation-distance-large);
  animation: slideInRight $animation-duration-slow ease 0.5s forwards;

  @media (max-width: 1200px) {
    gap: clamp(9px, 2.25vw, 22px);
  }

  @media (max-width: 768px) {
    gap: clamp(6px, 1.5vw, 15px);
  }
}

// Анимации для групп элементов теперь в _animations.scss
// @keyframes slideInLeft, slideInRight определены там

.nav a {
  text-decoration: none;
  color: $beige;
  font: $main-font;
  white-space: nowrap;
  flex-shrink: 0;
}

.logo-img {
  border-radius: 50%;
  width: clamp(75px, 2.25vw, 2.25vw);
  height: clamp(75px, 2.25vw, 2.25vw);
  opacity: 0;
  transform: translateX(-$animation-distance-medium);
  flex-shrink: 0;

  // Используем унифицированные переменные
  transition: transform $animation-duration-fast ease,
    opacity $animation-duration-fast ease,
    width $animation-duration-slow ease,
    height $animation-duration-slow ease;

  &.animated {
    opacity: 1;
    transform: translateX(0);
  }

  @media (hover: hover) {
    &:hover {
      transform: scale(1.1) rotate(10deg);
      box-shadow: 0 0 25px rgba($beige, 0.6);
    }
  }

  .nav.scrolled & {
    width: clamp(55px, 1.25vw, 1.25vw);
    height: clamp(55px, 1.25vw, 1.25vw);
  }

  @media (max-width: 768px) {
    width: clamp(35px, 9vw, 45px);
    height: clamp(35px, 9vw, 45px);

    .nav.scrolled & {
      width: clamp(25px, 8vw, 35px);
      height: clamp(25px, 8vw, 35px);
    }
  }
}

.nav-title {
  font-weight: lighter;

  font-size: clamp(30px, 5.25vw, 54px);
  margin: 0;
  opacity: 0;
  transform: translateY(-$animation-distance-medium);
  white-space: nowrap;
  flex-shrink: 0;

  // Используем унифицированные переменные
  transition: all $animation-duration-slow $animation-ease-smooth;

  &.animated {
    opacity: 1;
    transform: translateY(0);
  }

  @media (hover: hover) {
    &:hover {
      color: $orange;
      text-shadow: 0 0 30px rgba($orange, 1);
      transform: translateY(-3px) scale(1.02);
    }
  }

  .nav.scrolled & {
    font-size: clamp(24px, 4.5vw, 42px);
  }

  @media (max-width: 768px) {

    font-size: clamp(21px, 5.25vw, 30px);
  }
}

.features-link,
.how-it-works-link,
.about-link,
.faq-link {
  font-size: clamp(21px, 2.7vw, 30px);
  font-weight: normal;
  opacity: 0;
  transform: translateY(-$animation-distance-medium);
  white-space: nowrap;
  flex-shrink: 0;
  position: relative;

  // Используем унифицированные переменные
  @include smooth-transition($animation-duration-fast);

  &.animated {
    opacity: 1;
    transform: translateY(0);
  }

  @media (hover: hover) {
    &:hover {
      transform: translateY(-8px) scale(1.08);
      color: $orange;
      text-shadow: 0 0 15px rgba($orange, 0.8);
      // Используем миксин для подчеркивания
      @include animated-underline($beige, 2px, $animation-duration-fast);

      &::after {
        width: 100%;
        background: linear-gradient(90deg, $orange, $beige);
      }
    }
  }



  .nav.scrolled & {
    font-size: clamp(18px, 2.25vw, 24px);
  }

  @media (max-width: 1200px) {
    font-size: clamp(18px, 2.4vw, 27px);

    .nav.scrolled & {
      font-size: clamp(15px, 1.95vw, 21px);
    }
  }

  @media (max-width: 768px) {

    font-size: clamp(13px, 2.7vw, 18px);

  }
}

.tg-link {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  opacity: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(52px, 7.5vw, 67px);
  height: clamp(52px, 7.5vw, 67px);
  transform: translateX($animation-distance-medium);
  overflow: hidden;
  flex-shrink: 0;
  position: relative;

  // Используем унифицированные переменные
  @include smooth-transition($animation-duration-fast);

  &.animated {
    opacity: 1;
    transform: translateX(0);
  }

  @media (hover: hover) {
    &:hover {
      transform: scale(1.15) rotate(360deg);
      box-shadow: 0 0 30px rgba($beige, 0.8);

      &::before {
        opacity: 1;
        background: linear-gradient(45deg, $orange, $beige, $orange);
      }
    }
  }

  // Светящийся эффект при hover
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

  .nav.scrolled & {
    width: clamp(42px, 6vw, 52px);
    height: clamp(42px, 6vw, 52px);
  }

  @media (max-width: 768px) {

    width: clamp(37px, 7.5vw, 48px);
    height: clamp(37px, 7.5vw, 48px);

  }

  img {
    width: 120%;
    height: 120%;
    object-fit: cover;
    margin: -10%;
    border-radius: 50%;
    transition: width $animation-duration-slow ease,
      height $animation-duration-slow ease;
  }
}

.burger {
  position: fixed;
  right: 20px;
  top: 20px;
  z-index: 1001;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 30px;
  padding: 5px;
  @include smooth-transition($animation-duration-fast);

  span {
    width: 100%;
    height: 3px;
    background-color: $beige;
    border-radius: 2px;
    transition: all $animation-duration-fast ease;
    transform-origin: center;
  }

  @media (hover: hover) {
    &:hover span {
      background-color: $orange;
    }
  }

  // Анимация для открытого меню
  &.open span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  &.open span:nth-child(2) {
    opacity: 0;
  }

  &.open span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
  }
}
</style>