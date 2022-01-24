<template>
  <div class="create-room-wrapper">
    <h2>Create a room</h2>
    <input type="text" placeholder="Username" v-model="username"><br>
    <input type="text" placeholder="Room name" v-model="roomName"><br>
    <button @click="createRoom">Create room</button>
  </div>
</template>

<script>
import {Room} from "@/scripts/models/Room";

export default {
  name: "CreateRoomPage",
  data: () => ({
    username: "",
    roomName: ""
  }),
  methods: {
    async createRoom() {
      let res = await Room.create(this.roomName, this.username);
      if (! res.success) {
        alert(JSON.stringify(res));
        return;
      }
      this.$router.push({ name: "RoomPage" });
    }
  }
}

</script>

<style lang="scss">
  .create-room-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    input {
      outline: none;
      font-family: "Poppins", Helvetica, Arial, sans-serif;
      background-color: white;
      border: 1px lightgray solid;
      transition: border-color .2s ease;
      border-radius: 8px;
      padding: .25rem .25rem;
      width: 14rem;
      color: lighten(black, 10%);
      margin: .25rem;

      &:focus {
        border-color: gray;
      }
    }

    button {
      font-family: 'Poppins', sans-serif;
      border: 1px transparent solid;
      border-radius: 999px;
      margin: .25rem;
      font-size: 1rem;
      padding: .5rem 1rem;
      cursor: pointer;
      transition: background-color .2s ease;

      &[disabled] {
        cursor: unset;
      }
    }
  }
</style>