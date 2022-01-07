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
#app {
  font-family: "Poppins", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
