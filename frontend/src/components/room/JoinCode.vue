<template>
  <div>
    <p>Join Code: </p>
    <p>{{ joinCode }}</p>
  </div>
</template>

<script>
export default {
  name: "JoinCode",
  props: {
    joinCode: String
  }
}
</script>

<style scoped>

</style>