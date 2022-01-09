<template>
  <navigation-bar/>
  <router-view/>
</template>

<script>
import NavigationBar from "@/components/layout/NavigationBar";
export default {
  components: {NavigationBar},
  data: () => ({
    id: null,
  }),
  mounted() {
    this.id = localStorage.getItem("uniqueId")
  }
}
</script>

<style>
html, body {
  margin: 0;
}

#app {
  font-family: "Poppins", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
