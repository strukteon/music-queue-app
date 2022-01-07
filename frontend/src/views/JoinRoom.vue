<template>
  <div>
    <input type="text" placeholder="username" v-model="username"><br>
    <input type="text" placeholder="Room Code" v-model="joinCode"><br>
    <button @click="joinRoom">GO</button>
  </div>
</template>

<script>
import BackendController from "@/scripts/BackendController";

export default {
  name: "JoinRoom",
  data: () => ({
    username: "",
    joinCode: ""
  }),
  methods: {
    async joinRoom() {
      console.log(await BackendController.joinRoom(this.username, this.joinCode))
    }
  }
}

</script>

<style scoped>

</style>