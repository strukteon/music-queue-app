<template>
  <div>
    <p>Room Code: {{ roomCode }}</p>

    <input v-model="editor.trackId">
    <input v-model="editor.platform">
    <button @click="startTrack">play</button>

    <div class="currently-playing">
      <h3>Currently Playing:</h3>
      <track-controller ref="trackController"/>
    </div>

    <div class="next-up">
      <h3>Next up:</h3>
      <p v-for="i in new Array(10).fill(0)" :key="i">Song</p>
    </div>
  </div>
</template>

<script>

import TrackController from "@/components/TrackController";

import { YoutubeTrack } from "@/scripts/track/YoutubeTrack";
import { SoundcloudTrack } from "@/scripts/track/SoundcloudTrack";

export default {
  name: "RoomDjScreen",
  components: {
    TrackController
  },
  data: () => ({
    roomCode: "123ABC",
    editor: {
      trackId: "mWKDZRJWdF4",//"F0y7KxZR9BQ",
      platform: "youtube"
    },
    track: null,
  }),
  mounted() {
    setTimeout(()=>this.startTrack(), 1000)
  },
  methods: {
    async startTrack() {
      let track = null;
      if (this.editor.platform === "youtube") {
        track = new YoutubeTrack(this.editor.trackId);
      } else if (this.editor.platform === "soundcloud") {
        track = new SoundcloudTrack(this.editor.trackId);
      }

      await track.loadMetadata();
      await this.$refs["trackController"].loadTrack(track);
    }
  }
}
</script>

<style scoped>

</style>