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
    <img :src="track.thumbnailUrl" width="192"/>
    <br>
    <button @click="$emit('previous')">previous</button>
    <button @click="activeController.play()">play</button>
    <button @click="activeController.pause()">pause</button>
    <button @click="$emit('next')">next</button>

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
    volume: 100,
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
input[type="range"] {
  outline: 0;
  border: 0;
  border-radius: 500px;
  width: 400px;
  max-width: 100%;
  margin: 24px 0 16px;
  transition: box-shadow 0.2s ease-in-out;
}

@media screen and (-webkit-min-device-pixel-ratio:0) {
  input[type="range"] {
  overflow: hidden;
  height: 40px;
  -webkit-appearance: none;
  background-color: #ddd;
}
input[type="range"]::-webkit-slider-runnable-track {
  height: 40px;
  -webkit-appearance: none;
  color: #743939;
  background-color: green;
/*// margin-top: -1px;*/
  transition: box-shadow 0.2s ease-in-out;
}
  input[type="range"]::-webkit-slider-thumb {
   width: 40px;
   -webkit-appearance: none;
   height: 40px;
   cursor: ew-resize;
   background: #fff;
   box-shadow: -340px 0 0 320px #ff1515, inset 0 0 0 40px #bdaf52;
   border-radius: 50%;
   transition: box-shadow 0.2s ease-in-out;
   position: relative;
 /*// top: 1px;*/
 }
  input[type="range"]:active::-webkit-slider-thumb {
   background: #fff;
   box-shadow: -340px 0 0 320px #1597ff, inset 0 0 0 3px #1597ff;
 }
  input[type="range"]::-moz-range-progress {
   background-color: #43e5f7;
 }
  input[type="range"]::-moz-range-track {
   background-color: #9a905d;
 }
/*// IE*/
   input[type="range"]::-ms-fill-lower {
     background-color: #43e5f7;
   }
  input[type="range"]::-ms-fill-upper {
   background-color: #9a905d;
 }
}
</style>