<template>
  <nav>
    <router-link to="/" class="logo">
      <img src="@/assets/images/logo_white.svg"/>
      <span class="text">MusiQ</span>
    </router-link>
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

    text-decoration: none;
    color: white;
    font-size: 1.5rem;
    font-weight: 600;
    font-style: italic;

    img {
      display: block;
      height: 60%;
      width: auto;
    }

    .text {
      margin-left: .25rem;
    }
  }

  .nav-links {
    display: flex;
    align-items: center;

    > * {
      text-decoration: none;
      color: white;
      font-size: 1.5rem;
      padding: .8rem;
      font-weight: 500;
      transition: background-color .2s ease;

      &:hover {
        background-color: rgba(black, .1);
      }
    }
  }
}
</style>