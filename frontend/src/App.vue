<template>
  <div class="body-wrapper">
    <navigation-bar/>
    <router-view class="router-view"/>
  </div>
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

<style lang="scss">
@use "~@/assets/styles/colors.scss";

html, body {
  margin: 0;
  font-family: "Poppins", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: colors.$darkblue;
  color: white;

  display: flex;
  flex-direction: column;
  align-items: center;

  min-height: 100vh;
  width: 100%;
  flex-grow: 1;
}
#app {
  display: flex;
  width: 100%;
}
#app, .body-wrapper {
  flex-grow: 1;
}

.body-wrapper {
  width: 100%;
}

.router-view {
}
</style>
