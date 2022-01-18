<template>
  <div :class="{'track-add-popup-overlay': true, 'popup-visible': modelValue}">
    <div class="popup-card">
      <div class="header">
        <p class="title">Add track to queue</p>
        <button class="close-button" @click="$emit('update:modelValue', false)"><font-awesome-icon :icon="fa.faTimes"/></button>
      </div>
      <div class="supported-platforms-wrapper">
        <p class="title">Supported platforms:</p>
        <div class="supported-platforms">
          <p><font-awesome-icon :icon="fa.platform.youtube"/> YouTube</p>
          <p><font-awesome-icon :icon="fa.platform.soundcloud"/> Soundcloud</p>
        </div>
      </div>
      <div class="input">
        <input type="text" @input="loadTrack" v-model="trackUrl" placeholder="Track or Video URL"/>
        <button class="button-add" @click="addTrack" :disabled="addTrackButtonDisabled || trackUrl.length <= 0">{{ addTrackButtonText }}</button>
      </div>
      <p v-if="trackInfoText.length > 0">{{ trackInfoText }}</p>
      <div class="selected-track" v-if="track != null">
        <div class="img-wrapper">
          <img :class="{'thumbnail-yt': track.platform === 'youtube' }" :src="track.thumbnailUrl"/>
        </div>
        <div class="text">
          <p class="name">{{ track.trackName }}</p>
          <p class="artist">{{ track.artist }}</p>
          <p class="from">from {{ track.platformName }}</p>
        </div>
      </div>
      <div class="search-buttons">
        <button class="youtube-search-btn" @click="openWindow('https://youtube.com/search')">Open <font-awesome-icon :icon="fa.platform.youtube"/> Search</button>
        <button class="soundcloud-search-btn" @click="openWindow('https://soundcloud.com/search/sounds')">Open <font-awesome-icon :icon="fa.platform.soundcloud"/> Search</button>
      </div>
    </div>
  </div>
</template>

<script>
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faYoutube, faSoundcloud } from "@fortawesome/free-brands-svg-icons";
import { TrackManager } from "@/scripts/room/TrackManager";
import BackendController from "@/scripts/BackendController";

export default {
  name: "TrackAddPopup",
  props: {
    modelValue: Boolean,
  },
  emits: [
      "update:modelValue",
      "trackSelected",
      "canceled"
  ],

  data: () => ({
    fa: {
      faTimes,
      platform: {
        youtube: faYoutube,
        soundcloud: faSoundcloud,
      }
    },
    trackUrl: '',
    track: null,
    addTrackButtonText: "Add track",
    addTrackButtonDisabled: false,
    trackInfoText: '',
  }),

  methods: {
    openWindow(url) {
      window.open(url, "hello", "width=900,height=500");
    },

    async loadTrack() {
      const validYoutubeUrl1 = /https:\/\/(\w+\.)?youtube\.com\/watch\?.*v=(.+?)($|&.+)/;
      const validYoutubeUrl2 = /https:\/\/youtu\.be\/(.+)/;
      const validSoundcloudUrl = /https:\/\/(\w+\.)?soundcloud\.com\/(.+\/.+)(\?.+)?/;
      this.trackUrl = this.trackUrl.trim();
      let platform = null;
      let trackId = null;
      if (validYoutubeUrl1.test(this.trackUrl)) {
        platform = "youtube";
        console.log(this.trackUrl)
        trackId = validYoutubeUrl1.exec(this.trackUrl)[2];
      } else if (validYoutubeUrl2.test(this.trackUrl)) {
        platform = "youtube";
        trackId = validYoutubeUrl2.exec(this.trackUrl)[1];
      } else if (validSoundcloudUrl.test(this.trackUrl)) {
        platform = "soundcloud";
        trackId = validSoundcloudUrl.exec(this.trackUrl)[2];
      }

      if (platform == null || trackId == null) {
        return;
      }

      let track = TrackManager.createTrackObject(trackId, platform);
      try {
        await track.loadMetadata();
      } catch (e) {
        this.track = null;
        this.trackInfoText = "";
        console.log("not found")
        return;
      }
      this.trackInfoText = "Did you mean this track:";
      this.track = track;
    },

    async addTrack() {
      this.addTrackButtonText = "Loading...";
      this.addTrackButtonDisabled = true;
      await this.loadTrack();

      this.addTrackButtonDisabled = false;

      if (this.track == null) {
        this.addTrackButtonText = "Add track";
        this.trackInfoText = "Sorry, I couldn't find any track from this URL!"
        return;
      }

      this.addTrackButtonText = "Add another track";
      this.trackInfoText = "This track was added:";
      this.trackUrl = "";
      await BackendController.roomAddTrack(this.track.trackId, this.track.platform);
    }
  }
}
</script>

<style lang="scss">
.track-add-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(black, .6);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
  pointer-events: auto;
  transition: opacity .2s ease;
  z-index: 10000;

  &:not(.popup-visible) {
    opacity: 0;
    pointer-events: none;
  }

  .popup-card {
    background-color: white;
    width: min(30rem, 80vw);
    border-radius: 1rem;
    padding: 1.5rem;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
      }

      .close-button {
        background-color: transparent;
        border: none;
        transition: background-color .2s ease;
        border-radius: 50%;
        width: 2.5rem;
        height: 2.5rem;
        font-size: 1.25rem;
        cursor: pointer;

        &:hover {
          background-color: rgba(black, .2);
        }
      }
    }

    .supported-platforms-wrapper {
      display: flex;

      p {
        margin: 1rem 0;
      }

      .title {
        margin-right: .25rem;
      }

      .supported-platforms {
        display: flex;

        p {
          margin: auto .25rem;
        }
        p:not(:last-child):after {
          content: ',';
        }
      }
    }

    .input {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      input {
        outline: none;
        font-family: "Poppins", Helvetica, Arial, sans-serif;
        background-color: white;
        border: 1px lightgray solid;
        transition: border-color .2s ease;
        border-radius: 8px;
        padding: .25rem .25rem;
        width: 14rem;
        color: lighten(black, 10%);
        margin: .25rem;
        flex-grow: 1;

        &:focus {
          border-color: gray;
        }
      }

      button {
        font-family: 'Poppins', sans-serif;
        border: 1px transparent solid;
        border-radius: 999px;
        margin: .25rem;
        font-size: 1rem;
        padding: .5rem 1rem;
        cursor: pointer;
        transition: background-color .2s ease;

        &[disabled] {
          cursor: unset;
        }
      }
    }

    .selected-track {
      display: flex;
      justify-content: center;
      margin: 1rem 0;

      .img-wrapper {
        width: 100px;
        height: 100px;
        flex-shrink: 0;
        aspect-ratio: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        border-radius: 8px;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;

          &.thumbnail-yt {
            height: 134%;
          }
        }
      }

      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: start;
        margin: 0 .75rem;

        p {
          margin: 0;
          width: min(300px, 50vw);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .name, .artist {
          font-size: 1.2rem;
          line-height: 1.5rem;
        }
        .name {
          font-weight: 600;
          color: black;
        }

        .artist {
          font-weight: 500;
          color: lighten(black, 30%);
          margin-bottom: .5rem;
        }

        .from {
          font-weight: 300;
        }
      }
    }

    .search-buttons {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 1rem;

      button {
        font-family: 'Poppins', sans-serif;
        border: 1px transparent solid;
        border-radius: 999px;
        margin: .25rem;
        font-size: 1rem;
        padding: .5rem 1rem;
        cursor: pointer;
        transition: background-color .2s ease;

        svg {
          font-size: 1.25rem;
        }
      }
/*
      .youtube-search-btn {
        color: white;
        background-color: lighten(red, 15%);
        &:hover {
          background-color: lighten(red, 5%);
        }
      }

      .soundcloud-search-btn {
        color: white;
        background-color: lighten(#FE5000, 10%);
        &:hover {
          background-color: lighten(#FE5000, 0%);
        }
      }*/
    }
  }
}
</style>