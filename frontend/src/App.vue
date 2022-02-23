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
}

.body-wrapper {
  max-width: 1440px;
  width: 100vw;
}

.router-view {
}
</style>
