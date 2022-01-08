<template>
  <div class="room-page">
    <div class="title-bar">
      <p class="welcome-text">Welcome to <span class="room-name">{{ roomData.roomName }}</span>!</p>
      <p>{{ BackendController.uniqueId }}</p>
      <join-code :join-code="roomData.joinCode"/>
    </div>
    <div v-if="true">
      <input v-model="queueInput.trackId">
      <input v-model="queueInput.platform">
      <button @click="submitTrack">Queue</button>
    </div>
    <track-controller class="track-controller" ref="track-controller" @next="BackendController.roomNextTrack()"/>
    <div class="party-members-section">
      <p class="title">Party Members <font-awesome-icon :icon="fa.faUsers"/></p>

      <p class="member" v-for="member in roomMembers" :key="member.userId"><font-awesome-icon :icon="fa.faUser"/> {{ member.username }}</p>
    </div>

    <div class="queued-tracks-section">
      <p class="title">Next up</p>
      <div class="queued-tracks">

      </div>
    </div>
  </div>
</template>

<script>
import BackendController from "@/scripts/BackendController";
import RoomWebsocketHandler from "@/scripts/room/RoomWebsocketHandler";
import TrackController from "@/components/TrackController";

import { getPlatformClass } from "@/scripts/room/RoomHelper";
import JoinCode from "@/components/room/JoinCode";

import { faUsers, faUser } from "@fortawesome/free-solid-svg-icons";
import {UserManager} from "@/scripts/room/UserManager";

export default {
  name: "RoomPage",
  components: {JoinCode, TrackController},
  data: () => ({
    fa: {
      faUsers,
      faUser,
    },
    BackendController,
    queueInput: {
      trackId: '',
      platform: 'youtube'
    },
    userManager: new UserManager(),
    roomData: {
      joinCode: "ABCDEF",
      roomMembers: [
        {
          "userId": "8654475980237673",
          "isAdmin": true
        }
      ],
      currentTrack: {
        "userId": "amisdajsodijaosdnsadasdawd",
        "trackId": "WkVvG4QTO9M",
        "platform": "youtube"
      },
      "queuedTracks": [
        {
          "userId": "amisdajsodijaosdnsadasdawd",
          "trackId": "WkVvG4QTO9M",
          "platform": "youtube"
        },
        {
          "userId": "amisdajsodijaosdnsadasdawd",
          "trackId": "WkVvG4QTO9M",
          "platform": "youtube"
        },
        {
          "userId": "amisdajsodijaosdnsadasdawd",
          "trackId": "WkVvG4QTO9M",
          "platform": "youtube"
        },
      ],
    },
    roomMembers: {

    },
    websocketHandler: null,
  }),
  async mounted() {
    let response = await BackendController.getRoomData();

    if (!response.success && response.message === "NOT_IN_A_ROOM") {
      console.log("not in room, redirecting?");
      return;
    } else if (!response.success) {
      alert(JSON.stringify(response));
      return;
    }

    this.roomData = response.data;
    this.websocketHandler = new RoomWebsocketHandler(this);

    if (this.roomData.currentTrack != null) {
      let trackClass = getPlatformClass(this.roomData.currentTrack.platform);
      let track = new trackClass(this.roomData.currentTrack.trackId);
      await track.loadMetadata();
      await this.$refs["track-controller"].initControllers();
      this.$refs["track-controller"].loadTrack(track);
      this.$refs["track-controller"].toggleStart();
    }

    await this.userManager.loadUsers(this.roomData.roomMembers.map(v => v.userId));
    this.roomMembers = this.userManager.getAllUsers();
    console.log(this.roomMembers)
  },

  methods: {
    async submitTrack() {
      await BackendController.roomAddTrack(this.queueInput.trackId, this.queueInput.platform);
    }
  },
}
</script>

<style lang="scss">
.room-page {
  .title-bar {
    display: flex;
    align-items: start;
    justify-content: space-between;

    .welcome-text {
      font-size: 2rem;
      font-weight: 600;
      color: black;
      margin: 0;

      .room-name {
        font-style: italic;
      }
    }
  }

  .party-members-section {
    .title {
      display: flex;
      margin: 1rem auto;
      align-items: center;
      font-size: 1.5rem;
      font-weight: 600;
      color: black;

      svg {
        margin-left: .5rem;
        font-size: 1.7rem;
      }
    }

    .member {
      color: lighten(black, 50%);
      font-style: italic;

      svg {
        color: lighten(black, 70%);
      }
    }
  }
}
</style>