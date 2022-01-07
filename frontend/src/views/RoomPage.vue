<template>
  <div>
    <p><b>Join Code:</b> {{ roomData.joinCode }}</p>
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
      <h3>Queued Tracks</h3>
      <p v-for="(track, index) in roomData.queuedTracks" :key="track.trackId + index"><b>TrackId:</b> {{ track.trackId }} <b>Platform:</b> {{ track.platform }}</p>
    </div>
  </div>
</template>

<script>
import BackendController from "@/scripts/BackendController";
import RoomWebsocketHandler from "@/scripts/room/RoomWebsocketHandler";

export default {
  name: "RoomPage",
  data: () => ({
    BackendController,
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
  },
}
</script>

<style scoped>

</style>