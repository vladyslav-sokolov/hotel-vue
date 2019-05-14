<template>
  <div>
    <v-layout column align-start justify-center class>
      <p class="display-2 text-uppercase font-weight-regular">Sorry!</p>
      <p class="display-1 font-weight-regular">Something went wrong.</p>
      <p class="font-weight-regular">We're working on it and we'll get it fixed as soon as we can.</p>
      <p class="font-weight-regular">
        Please&nbsp;<a @click="refresh">try again</a>&nbsp;later.
      </p>
    </v-layout>
  </div>
</template>
<script>
export default {
  data: () => ({}),
  mounted() {},
  methods: {
    refresh() {
      this.$router.go();
    }
  }
};
</script>
