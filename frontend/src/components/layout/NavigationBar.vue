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
  width: calc(100% - 16px);
  background-color: #3d74bd;
  top: 0;
  border-radius: 16px;
  margin: 8px;
  position: relative;
  z-index: 100;

  .logo {
    padding: .75rem;
    display: flex;
    width: 10rem;
    justify-content: center;
    align-items: center;

    img {
      display: block;
      height: 80%;
      width: auto;
    }
  }

  .nav-links {
    display: flex;
    align-items: center;

    > * {
      text-decoration: none;
      color: white;
      font-size: 1.5rem;
      padding: .5rem;
      margin: .3rem;
      font-weight: 500;

      &:hover {
        background-color: #293043;
      }
    }
  }
}
</style>