<template>
  <div>
    <join-code :join-code="roomData.joinCode"/>
    <div>
      <input v-model="queueInput.trackId">
      <input v-model="queueInput.platform">
      <button @click="submitTrack">Queue</button>
    </div>
    <div>
      <h3>User List</h3>
      <p v-for="member in roomData.roomMembers" :key="member.userId"><b>ID:</b> {{ member.userId }} <span v-if="member.isAdmin"><i>[ADMIN]</i></span> </p>
    </div>
    <div>
      <h3>Current Track</h3>
      <button @click="BackendController.roomNextTrack()">Next Track</button>
      <p v-if="roomData.currentTrack"><b>TrackId:</b> {{ roomData.currentTrack.trackId }} <b>Platform:</b> {{ roomData.currentTrack.platform }}</p>
    </div>
    <div>
      <h3>Track Player</h3>
      <track-controller ref="track-controller"/>
    </div>
    <div>
      <h3>Queued Tracks</h3>
      <p v-for="(track, index) in roomData.queuedTracks" :key="track.trackId + index"><b>TrackId:</b> {{ track.trackId }} <b>Platform:</b> {{ track.platform }}</p>
    </div>
  </div>
</template>

<script>
import BackendController from "@/scripts/BackendController";
import RoomWebsocketHandler from "@/scripts/room/RoomWebsocketHandler";
import TrackController from "@/components/TrackController";

import { getPlatformClass } from "@/scripts/room/RoomHelper";
import JoinCode from "@/components/room/JoinCode";

export default {
  name: "RoomPage",
  components: {JoinCode, TrackController},
  data: () => ({
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
      this.$refs["track-controller"].loadTrack(track);
      this.$refs["track-controller"].activeController.play();
    }
  },

  methods: {
    async submitTrack() {
      await BackendController.roomAddTrack(this.queueInput.trackId, this.queueInput.platform);
    }
  }
}
</script>

<style scoped>

</style>