<template>
  <NavigationBar />
  <MainPage id="main" />
  <FeaturesPage id="features" />
  <DemoPage id="demo" />
  <GoalPage id="goal" />
  <FAQ id="faq" />
  <Contacts id="contacts" />
  <Basement id="basement" />
</template>
<script>
import MainPage from './views/MainPage.vue';
import NavigationBar from './components/NavigationBar.vue';
import FeaturesPage from './views/FeaturesPage.vue';
import DemoPage from './views/DemoPage.vue';
import GoalPage from './views/GoalPage.vue';
import FAQ from './views/FAQ.vue';
import Contacts from './views/Contacts.vue';
import Basement from './views/Basement.vue';

export default {
  name: 'App',
  components: {
    MainPage,
    NavigationBar,
    FeaturesPage,
    DemoPage,
    GoalPage,
    FAQ,
    Contacts,
    Basement,
  },
};
</script>

<style lang="scss">
body {
  overscroll-behavior: none;
  background: $black;
  margin: 0;
  padding: 0;
}

feature-page {
  margin-top: 100px;
}
</style>
