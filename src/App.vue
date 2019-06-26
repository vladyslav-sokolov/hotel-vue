<template>
  <v-app>
    <Header></Header>
    <v-content class="mb-5">
      <v-layout align-space-around column fill-height>
        <router-view></router-view>
      </v-layout>
    </v-content>
    <Footer></Footer>
  </v-app>
</template>

<script>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "App",
  components: {
    Header,
    Footer
  },
  data() {
    return {};
  }
};
</script>

<style>
</style>
