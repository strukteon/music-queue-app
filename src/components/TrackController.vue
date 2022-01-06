<template>
  <div class="track-controller">
    <p>{{ track.trackName }} by {{ track.artist }}</p>
    <p>{{ Math.floor(track.position/1000) }} / {{ Math.floor(track.duration/1000) }}</p>
    <input type="range" v-model="progress" @change="seek"
           @mousedown="this.pauseProgressUpdate = true"
           @mouseup="this.pauseProgressUpdate = false"
           min="0" max="1000"><br>
    Volume:
    <input type="range" v-model="volume" @input="updateVolume"
           min="0" max="100"><br>
    <img :src="track.thumbnailUrl" width="192" height="108"/>
    <br>
    <button @click="nextSong()">previous</button>
    <button @click="activeController.play()">play</button>
    <button @click="activeController.pause()">pause</button>
    <button @click="soundcloudController.init">next</button>

    <div id="youtube-iframe-wrapper"></div>
    <div id="soundcloud"></div>
  </div>
</template>

<script>
import { YoutubeController } from "@/scripts/track-controller/YoutubeController";
import { SoundcloudController } from "@/scripts/track-controller/SoundcloudController";

export default {
  name: "TrackController",
  data: () => ({
    activeController: null,
    youtubeController: null,
    soundcloudController: null,
    track: {},
    pauseProgressUpdate: false,
    progress: 0,
    volume: 0,
  }),

  emits: [
      "previous",
      "next",
      "ended"
  ],

  async mounted() {
    this.youtubeController = new YoutubeController("youtube-iframe-wrapper");
    this.soundcloudController = new SoundcloudController();
    await this.youtubeController.init();
    await this.soundcloudController.init();
  },

  methods: {
    async loadTrack(track) {
      if (this.activeController !== null) {
        this.activeController.removeEventListeners();
        this.activeController.pause();
      }

      if (track.platform === "youtube")
        this.activeController = this.youtubeController;
      else if (track.platform === "soundcloud")
        this.activeController = this.soundcloudController;

      this.track = track;
      this.activeController.setVolume(this.volume);
      this.activeController.load(track.trackId);
      this.activeController.play();

      this.activeController.setOnTrackProgress((position, duration) => {
        this.track.position = position;
        this.track.duration = duration;
        if (!this.pauseProgressUpdate)
          this.progress = Math.floor(position / duration * 1000);
      })
    },

    async seek() {
      this.track.position = this.progress / 1000 * this.track.duration
      this.activeController.skipTo(this.track.position);
    },

    updateVolume() {
      this.activeController.setVolume(this.volume)
    }
  },
}
</script>

<style scoped>

</style>