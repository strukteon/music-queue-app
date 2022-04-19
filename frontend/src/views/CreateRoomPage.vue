<template>
  <div class="create-room">
    <div class="create-room-wrapper">
      <settings-modal ref="settingsModal"/>
      <button class="action-button" @click="$refs['settingsModal'].open()">Settings <font-awesome-icon class="icon" :icon="faCog"/></button>
      <div class="middle-part">
        <div class="input-wrapper">
          <label for="input-username">Username</label>
          <input id="input-username" type="text" v-model="username">
        </div>
        <div class="input-wrapper">
          <label for="input-room-name">Room Name</label>
          <input id="input-room-name" type="text" v-model="roomName">
        </div>
        <button class="button-submit" @click="createRoom">Click to create</button>
      </div>
      <div class="title-wrapper">
        <h2 class="verb">Create</h2>
        <h2 class="title-rest">a room</h2>
      </div>
    </div>
  </div>
</template>

<script>
import {Room} from "@/scripts/models/Room";
import {faCog} from "@fortawesome/free-solid-svg-icons";
import SettingsModal from "../components/create-room/SettingsModal";
import {User} from "@/scripts/models/Users";

export default {
  name: "CreateRoomPage",
  components: {SettingsModal},
  data: () => ({
    faCog,
    username: "",
    roomName: ""
  }),
  async mounted() {
    let self = await User.getSelf();
    if (self !== null) {
      this.$router.push({ name: "RoomPage" });
    }
  },
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
@use "~@/assets/styles/colors.scss";

.create-room {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.create-room-wrapper {
  display: flex;

  .title-wrapper {
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: end;
    width:  200px;
    height: 200px;
    transform: rotateZ(90deg);
    margin: 1rem;

    > * {
      margin: 0;
      font-size: 3rem;
      line-height: 2.5rem;
      font-weight: 700;
    }
    .title-rest {
      background: -webkit-linear-gradient(0deg, rgba(white, .8), rgba(white, .5));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .input-wrapper {
    display: flex;
    flex-direction: column;
    align-items: end;
    margin-bottom: 1.5rem;

    label {
      padding-right: .5rem;
      font-size: .9rem;
      margin-bottom: .25rem;
    }

    input {
      border-radius: 999px;
      border-color: transparent;
      font-family: "Poppins", Helvetica, Arial, sans-serif;

      width: 12rem;

      padding: .125rem .5rem
    }
  }

  .middle-part {
    display: flex;
    flex-direction: column;
    flex-grow: 0;
    align-items: start;
    margin: 0 1rem;
  }

  .button-submit {
    border-color: transparent;
    border-radius: 999px;
    font-family: "Poppins", Helvetica, Arial, sans-serif;
    font-size: 1rem;
    font-weight: 600;
    font-style: italic;
    color: white;
    padding: .25rem 1.5rem;
    background-color: colors.$blue;
    cursor: pointer;
    transition: background-color .2s ease;

    &:hover {
      background-color: darken(colors.$blue, 20%);
    }
  }

  .action-button {
    background-color: colors.$red;
    border-color: transparent;
    border-radius: 16px;
    font-family: "Poppins", Helvetica, Arial, sans-serif;
    font-size: 1rem;
    font-weight: 600;
    font-style: italic;
    color: white;
    width: 100px;
    height: 100px;
    padding: .5rem;

    margin: 2rem;

    cursor: pointer;
    transition: background-color .2s ease;

    &:hover {
      background-color: darken(colors.$red, 20%);
    }

    .icon {
      font-size: 3rem;
      padding: .2rem;
    }

    &:disabled {
      cursor: default;
      pointer-events: none;
      background-color: transparentize(colors.$red, .4);
      color: transparentize(white, .4);
    }
  }
}
</style>
