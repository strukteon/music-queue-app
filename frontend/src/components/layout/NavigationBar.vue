<template>
  <nav>
    <router-link to="/" class="logo"><img src="@/assets/images/musiq_logo_v2.svg"/></router-link>
    <div class="nav-links">
      <router-link to="/">Home</router-link>
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
  width: 100%;
  background-color: #3d74bd;
  position: fixed;
  top: 0;
  z-index: 100;

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
      color: white;
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