<template>
  <div class="menu-selection">
    <h2>Ready to Rumble?</h2>
    <router-link to="/join">Add some Tunes / Join a room</router-link>
    <router-link to="/create-room">Create a Room</router-link>
  </div>
</template>

<script>
export default {
  name: "LandingPage",
}
</script>

<style lang="scss">
  .menu-selection {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    a {
      font-family: "Poppins", sans-serif;
      border: 1px transparent solid;
      border-radius: 999px;
      margin: 0.25rem;
      font-size: 1rem;
      padding: 0.5rem 1rem;
      cursor: pointer;
      transition: background-color 0.2s ease;
      background-color: #e9e9ed;
      text-decoration: none;
      color: black;

      &:hover {
        background-color: #d0d0d7;
      }
    }
  }
</style>