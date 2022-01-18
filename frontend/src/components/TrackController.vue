<template>
  <div class="track-controller">
    <div v-if="track != null" class="track-img-wrapper">
      <img :class="{'track-img': true, 'thumbnail-yt': track.platform === 'youtube' }" :src="track.thumbnailUrl"/>
      <font-awesome-icon class="platform-icon" :icon="fa.platformIcons[track.platform]"/>
    </div>
    <div v-else class="track-img-wrapper">
      <img class="track-img musiq-logo" :src="require('@/assets/images/musiq_logo.svg')"/>
    </div>

    <div class="right-section">
      <div class="track-details">
        <p class="name">{{ track?.trackName || "No track is playing" }}</p>
        <p class="artist">{{ track?.artist || "enjoy musiq!" }}</p>
      </div>
      <div class="button-section">
        <div class="buttons">
          <button :class="{ mute: true, active: isMuted }" @click="toggleMute"><font-awesome-icon :icon="fa.faVolumeMute"/></button>
          <button :class="{play: true, 'is-playing': isPlaying }" @click="toggleStart"><font-awesome-icon :icon="isPlaying ? fa.faPause : fa.faPlay"/></button>
          <button class="next" @click="$emit('next')"><font-awesome-icon :icon="fa.faStepForward"/></button>
        </div>
        <p v-if="track != null" class="track-submitter"><font-awesome-icon :icon="fa.faUser"/> {{ requesterName }}</p>
      </div>
      <div class="progress-section">
        <div v-if="track != null" class="progress-text">
          <p>{{ positionMinutes }}:{{ positionSeconds }}</p>
          <p class="divider">/</p>
          <p>{{ durationMinutes }}:{{ durationSeconds }}</p>
        </div>
        <div v-if="track != null" class="progress-bar">
          <input type="range" v-model="progress"
                 ref="progressBar"
                 @change="seek" @input="updateCSSVar"
                 @mousedown="this.pauseProgressUpdate = true"
                 @mouseup="this.pauseProgressUpdate = false"
                 min="0" max="1000"><br>
        </div>
      </div>

      <div class="iframes">
        <div id="youtube-iframe-wrapper"></div>
        <div id="soundcloud"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { YoutubeController } from "@/scripts/track-controller/YoutubeController";
import { SoundcloudController } from "@/scripts/track-controller/SoundcloudController";
import { faVolumeMute, faStepForward, faPause, faPlay, faUser } from "@fortawesome/free-solid-svg-icons";
import { faSoundcloud, faYoutube } from "@fortawesome/free-brands-svg-icons";

import { UserManager } from "@/scripts/room/UserManager";
import { deviceIsMobile } from "@/scripts/Tools";

export default {
  name: "TrackController",
  data: () => ({
    fa: {
      faVolumeMute,
      faStepForward,
      faPause,
      faPlay,
      faUser,
      platformIcons: {
        soundcloud: faSoundcloud,
        youtube: faYoutube,
      }
    },
    isPlaying: false,
    isMuted: false,
    activeController: null,
    youtubeController: null,
    soundcloudController: null,
    track: null,
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
  },

  methods: {
    async initControllers() {
      await this.youtubeController.init();
      await this.soundcloudController.init();
    },
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
      });

      this.activeController.setOnTrackEnd(() => {
        this.isPlaying = false;
      });

      if (deviceIsMobile()) {
        window.addEventListener("blur", () => {
          if (this.activeController != null) {
            setTimeout(() => {
              let pos = this.track.position;
              this.activeController.load(this.track.trackId, pos / 1000);
              this.activeController.play();
              console.log("paused & unpaused")
            }, 100)
          }
        })
      }
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

    toggleStart() {
      if (this.isPlaying) {
        this.isPlaying = false;
        this.activeController.pause();
      }
      else {
        this.isPlaying = true;
        this.activeController.play();
      }
    },

    toggleMute() {
      if (this.isMuted) {
        this.isMuted = false;
        this.activeController.unmute();
      }
      else {
        this.isMuted = true;
        this.activeController.mute();
      }
    },

    updateVolume() {
      this.activeController.setVolume(this.volume)
    }
  },

  computed: {
    durationMinutes() {
      let val = Math.floor(this.track.duration / 60 / 1000);
      return Number.isNaN(val) ? '-' : val;
    },
    durationSeconds() {
      let val = Math.floor((this.track.duration / 1000) % 60);
      return ((Number.isNaN(val) ? '--' : val) + '').padStart(2, '0');
    },
    positionMinutes() {
      let val = Math.floor(this.track.position / 60 / 1000);
      return Number.isNaN(val) ? '-' : val;
    },
    positionSeconds() {
      let val = Math.floor((this.track.position / 1000) % 60);
      return ((Number.isNaN(val) ? '--' : val) + '').padStart(2, '0');
    },

    requesterName() {
      console.log("----------", this.track.requesterId)
      let user = UserManager.getUser(this.track.requesterId);
      if (!user) return "user not found";
      return user.username;
    },
  }
}
</script>

<style lang="scss">
  .track-controller {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    column-gap: 1rem;

    .track-img-wrapper {
      width: 200px;
      height: 200px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      border-radius: 16px;

      .track-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .musiq-logo {
        width: 100%;
        height: 100%;
        padding: 1rem;
        color: white;
        object-fit: contain;
        background-color: lightgrey;
      }
      .track-img.thumbnail-yt {
        height: 134%;
      }
      
      .platform-icon {
        position: absolute;
        left: 0;
        bottom: 0;
        border-top-right-radius: 16px;
        color: white;
        padding: 1rem;
        background-color: black;
        font-size: 2rem;
      }
    }


    .right-section {
      padding: 1rem;
      flex-grow: 1;
      max-width: 512px;
    }

    .track-details > p {
      margin: 0;
      font-size: 2rem;
      line-height: 2.6rem;

      max-width: min(85vw, 30rem);
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;

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
      margin-top: 1rem;

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

          &.mute {
            color: lighten(black, 30%);

            &.active {
              color: black;
              background-color: rgba(black, .1);
            }
          }

          &.play {
            width:  3.5rem;
            height: 3.5rem;
            border: 1px transparent solid;
            background-color: black;
            color: white;

            &:not(.is-playing) svg {
              padding-left: .3rem;
            }

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
        justify-content: end;
        align-items: center;
        font-weight: 600;
        font-size: 1.5rem;
        color: black;

        p {
          margin: 0;
          line-height: 1.5rem;
        }

        .divider {
          color: lightgrey;
          margin: auto .2rem;
        }
      }

      .progress-bar {
        input[type='range'] {
          width: 100%;
        }
        input[type='range'],
        input[type='range']::-webkit-slider-runnable-track,
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
        }

        input[type='range']::-webkit-slider-runnable-track {
          height: 8px;
          background: linear-gradient(to right, #293043, #293043), #D7D7D7;
          background-size: var(--background-size, 0%) 100%;
          background-repeat: no-repeat;
          border-radius: 5px;

        }

        input[type='range']::-webkit-slider-thumb {
          width: 16px;
          height: 16px;
          cursor: pointer;
          background: black;
          border-radius: 50%;
          margin-top: -4px;
        }

        /** FF*/


        input[type="range"]::-moz-range-progress, input[type="range"]::-moz-range-track {
          height: 8px;
          border-bottom-left-radius: 999px;
          border-top-left-radius: 999px;
        }
        input[type="range"]::-moz-range-progress {
          background-color: black;
        }

        input[type="range"]::-moz-range-track {
          background-color: #C4C4C4;
          border-radius: 999px;
        }

        input[type="range"]::-moz-range-thumb {
          width: 15px;
          height: 15px;
          cursor: pointer;
          background-color: black;
          border: 1px solid transparent;
          border-radius: 50%;
          margin-top: -6px;
        }
      }
    }

    .iframes {
      position: absolute;
      user-focus: none;
      opacity: 0;
    }
  }
</style>