<template>
  <nav>
    <router-link to="/" class="logo"><img src="@/assets/images/musiq_logo_v2.svg"/></router-link>
    <div class="nav-links">
      <router-link to="/">Home</router-link>
      <router-link to="/dj-test-screen">Test Screen</router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavigationBar"
}
</script>

<style lang="scss">
nav {
  display: flex;
  height: 60px;
  background-color: #42b983;

  .logo {
    padding: .75rem;
    display: flex;
    width: 10rem;
    justify-content: center;

    img {
      display: block;
      height: 100%;
      width: auto;
    }
  }

  .nav-links {
    display: flex;
    align-items: center;

    > * {
      text-decoration: none;
      color: black;
      font-size: 1.25rem;
      padding: .5rem;
      margin: .3rem;

      &:hover {
        background-color: #293043;
      }
    }
  }
}
</style>