<template>
  <div class="track-controller">
    <div class="track-img-wrapper">
      <img :class="{'track-img': true, 'thumbnail-yt': track.platform === 'youtube' }" :src="track.thumbnailUrl"/>
    </div>

    <div>
      <div class="track-details">
        <p class="name">{{ track.trackName }}</p>
        <p class="artist">{{ track.artist }}</p>
      </div>
      <div class="button-section">
        <div class="buttons">
          <button class="mute"><font-awesome-icon :icon="fa.faVolumeMute"/></button>
          <button class="play"><font-awesome-icon :icon="true ? fa.faPause : fa.faPlay"/></button>
          <button class="next"><font-awesome-icon :icon="fa.faStepForward"/></button>
        </div>
        <p class="track-submitter"><font-awesome-icon :icon="fa.faUser"/> PartyMember1</p>
      </div>
      <div class="progress-section">
        <div class="progress-text">
          <p>{{ positionMinutes }}:{{ positionSeconds }}</p>
          <p class="divider">/</p>
          <p>{{ durationMinutes }}:{{ durationSeconds }}</p>
        </div>
        <div class="progress-bar">
          <input type="range" v-model="progress"
                 ref="progressBar"
                 @change="seek(); updateCSSVar();"
                 @mousedown="this.pauseProgressUpdate = true"
                 @mouseup="this.pauseProgressUpdate = false"
                 min="0" max="1000"><br>
        </div>
      </div>

      Volume:
      <input type="range" v-model="volume" @input="updateVolume"
             min="0" max="100"><br>
      <br>
      <button @click="$emit('previous')">previous</button>
      <button @click="activeController.play()">play</button>
      <button @click="activeController.pause()">pause</button>
      <button @click="$emit('next')">next</button>

      <div id="youtube-iframe-wrapper"></div>
      <div id="soundcloud"></div>
    </div>
  </div>
</template>

<script>
import { YoutubeController } from "@/scripts/track-controller/YoutubeController";
import { SoundcloudController } from "@/scripts/track-controller/SoundcloudController";
import { faVolumeMute, faStepForward, faPause, faPlay, faUser } from "@fortawesome/free-solid-svg-icons";

export default {
  name: "TrackController",
  data: () => ({
    fa: {
      faVolumeMute,
      faStepForward,
      faPause,
      faPlay,
      faUser
    },
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
      // this.activeController.setVolume(this.volume);
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

    updateCSSVar() {
      this.$refs.progressBar.style.setProperty("--background-size", `${getBackgroundSize(this.$refs.progressBar)}%`)

      function getBackgroundSize(input) {
        const min = +input.min || 0;
        const max = +input.max || 100;
        const value = +input.value;

        const size = (value - min) / (max - min) * 100;

        return size;
      }
    },

    updateVolume() {
      this.activeController.setVolume(this.volume)
    }
  },

  computed: {
    durationMinutes() {
      if (Number.isNaN(this.track.duration)) return '-';
      return Math.floor(this.track.duration / 60 / 1000);
    },
    durationSeconds() {
      if (Number.isNaN(this.track.duration)) return '--';
      return (Math.floor((this.track.duration / 1000) % 60) + '').padStart(2, '0');
    },
    positionMinutes() {
      if (Number.isNaN(this.track.position)) return '-';
      return Math.floor(this.track.position / 60 / 1000);
    },
    positionSeconds() {
      if (Number.isNaN(this.track.position)) return '--';
      return (Math.floor((this.track.position / 1000) % 60) + '').padStart(2, '0');
    },
  }
}
</script>

<style lang="scss">
  .track-controller {
    display: flex;
    flex-direction: row;

    .track-img-wrapper {
      width: 200px;
      height: 200px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;


      .track-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .track-img.thumbnail-yt {
        height: 134%;
      }
    }

    .track-details > p {
      margin: 0;
      font-size: 2rem;
      line-height: 2.1rem;

      &.name {
        color: black;
        font-weight: 600;
      }
      &.artist {
        color: lighten(black, 30%);
        font-weight: 500;
      }
    }

    .button-section {
      display: flex;
      flex-direction: row;
      align-items: center;

      .buttons {
        button {
          border: none;
          background-color: transparent;
          cursor: pointer;
          width:  3rem;
          height: 3rem;
          transition: background-color .2s ease, color .2s ease;
          border-radius: 50%;
          margin: auto .2rem;
          font-size: 1.5rem;

          &:hover {
            background-color: rgba(black, .1);
          }

          &.play {
            width:  3.5rem;
            height: 3.5rem;
            border: 1px transparent solid;
            background-color: black;
            color: white;

            &:hover {
              color: darken(white, 20%);
            }
          }
        }
      }

      .track-submitter {
        margin-left: auto;
        color: lighten(black, 50%);
        font-style: italic;

        svg {
          color: lighten(black, 70%);
        }
      }
    }

    .progress-section {


      .progress-text {
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 600;
        font-size: 1.5rem;
        color: black;

        p {
          margin: 0;
        }

        .divider {
          margin: auto .2rem;
        }
      }

      .progress-bar input[type="range"] {
        outline: 0;
        border: 0;
        border-radius: 500px;
        width: 400px;
        max-width: 100%;
        margin: 24px 0 16px;

        @media screen and (-webkit-min-device-pixel-ratio:0) {
          & {
            height: 16px;
            -webkit-appearance: none;
          }
          &::-webkit-slider-runnable-track {
            height: 8px;
            background-color: #C4C4C4;
            border-radius: 99px;
          }
          &::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: black;
          }
          &::-webkit-slider-thumb::before {
            position: absolute;
            content: '';
            height: 10px; /* equal to height of runnable track */
            width: 500px; /* make this bigger than the widest range input element */
            left: -502px; /* this should be -2px - width */
            top: 8px; /* don't change this */
            background: #777;
          }
          &::-webkit-progress-value {
            background-color: #2c3e50;
          }
          &::-moz-range-thumb {
            background-color: black;
            width: 16px;
            height: 16px;
            border: none;
            border-radius: 50%;
          }
          &::-moz-range-progress, &::-moz-range-track {
            height: 8px;
            border-radius: 999px;
          }
          &::-moz-range-progress {
            background-color: black;
          }
          &::-moz-range-track {
            background-color: #C4C4C4;
          }
        }
      }
    }
  }
</style>