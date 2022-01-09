<template>
  <div class="room-page">
    <div class="left-part">
      <div class="title-bar">
        <p class="welcome-text">Welcome to <span class="room-name">{{ roomData.roomName }}</span>!</p>
        <join-code :join-code="roomData.joinCode"/>
      </div>
      <div v-if="false">
        <input v-model="queueInput.trackId">
        <input v-model="queueInput.platform">
        <button @click="submitTrack">Queue</button>
      </div>
      <track-controller class="track-controller" ref="track-controller" @next="BackendController.roomNextTrack()"/>
      <div class="party-members-section">
        <p class="title">Party Members <font-awesome-icon :icon="fa.faUsers"/></p>

        <p class="member" v-for="member in roomMembers" :key="member.userId"><font-awesome-icon :icon="fa.faUser"/> {{ member.username }}</p>
      </div>
    </div>

    <div class="right-part">
      <button class="add-track-button" @click="addTrackOpen = true">Add Track</button>
      <track-add-popup v-model="addTrackOpen"/>

      <div class="queued-tracks-section">
        <p class="title">Next up</p>
        <div class="queued-tracks">
          <queued-track v-for="(track, i) in queuedTracks" :key="track.trackId + i" :track="track"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BackendController from "@/scripts/BackendController";
import RoomWebsocketHandler from "@/scripts/room/RoomWebsocketHandler";
import TrackController from "@/components/TrackController";

import JoinCode from "@/components/room/JoinCode";

import { faUsers, faUser } from "@fortawesome/free-solid-svg-icons";
import {UserManager} from "@/scripts/room/UserManager";
import {TrackManager} from "@/scripts/room/TrackManager";
import QueuedTrack from "@/components/room/QueuedTrack";
import TrackAddPopup from "@/components/room/TrackAddPopup";

export default {
  name: "RoomPage",
  components: {TrackAddPopup, QueuedTrack, JoinCode, TrackController},
  data: () => ({
    fa: {
      faUsers,
      faUser,
    },
    addTrackOpen: true,
    BackendController,
    queueInput: {
      trackId: '',
      platform: 'youtube'
    },
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
    roomMembers: [],
    queuedTracks: [],
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

    (async () => {
      if (this.roomData.currentTrack != null) {
        let track = TrackManager.createTrackObject(this.roomData.currentTrack.trackId, this.roomData.currentTrack.platform, this.roomData.currentTrack.userId)
        await track.loadMetadata();
        await this.$refs["track-controller"].initControllers();
        await this.$refs["track-controller"].loadTrack(track);
        this.$refs["track-controller"].toggleStart();
      }
    })();

    (async () => {
      await UserManager.loadUsers(this.roomData.roomMembers.map(v => v.userId));
      this.roomMembers = UserManager.getAllUsers();
    })();

    (async () => {
      await TrackManager.loadTracks(this.roomData.queuedTracks.map(v => TrackManager.createTrackObject(v.trackId, v.platform, v.userId)));
      this.queuedTracks = TrackManager.getTracks();
    })();
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
  display: flex;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  margin-top: 3rem;

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

  .track-controller {
    margin-top: 2rem;
    margin-bottom: 2rem;
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

  .queued-tracks-section {
    .title {
      font-weight: 700;
      color: black;
      font-size: 1.5rem;
      margin: 0;
      margin-bottom: 1rem;
    }
    .queued-track {
      margin: 1rem 0;
    }
  }

  .left-part, .right-part {
    margin: 0 2rem;
  }
  .left-part {
    flex-grow: 1;
  }
}
</style>