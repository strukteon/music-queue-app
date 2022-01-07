<template>
  <div>
    <input type="text" placeholder="username" v-model="username"><br>
    <input type="text" placeholder="Room Name" v-model="roomName"><br>
    <button @click="createRoom">GO</button>
  </div>
</template>

<script>
import BackendController from "@/scripts/BackendController";

export default {
  name: "CreateRoomPage",
  data: () => ({
    username: "",
    roomName: ""
  }),
  methods: {
    async createRoom() {
      let res = await BackendController.createRoom(this.username, this.roomName);
      console.log(res, BackendController.uniqueId)
      if (! res.success) {
        alert(JSON.stringify(res));
        return;
      }
      this.$router.push({ name: "RoomPage" });
    }
  }
}

</script>

<style scoped>

</style>