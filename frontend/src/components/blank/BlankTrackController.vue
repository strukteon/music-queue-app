<template>
  <div class="track-controller blank">
    <div class="track-img-wrapper">
      <div class="img-blank track-img animate-bg"/>
    </div>

    <div class="right-section">
      <div class="track-details">
        <p class="name animate-bg"></p>
        <p class="artist animate-bg"></p>
      </div>
      <div class="button-section">
        <div class="buttons">
          <button class="mute animate-bg"><font-awesome-icon :icon="fa.faVolumeMute"/></button>
          <button class="play animate-bg"><font-awesome-icon :icon="false ? fa.faPause : fa.faPlay"/></button>
          <button class="next animate-bg"><font-awesome-icon :icon="fa.faStepForward"/></button>
        </div>
        <blank-party-member class="track-submitter"/>
      </div>
      <div class="progress-section">
        <div class="progress-text">
          <p class="animate-bg">-:--</p>
          <p class="divider">/</p>
          <p class="animate-bg">-:--</p>
        </div>
        <div class="progress-bar animate-bg"></div>
      </div>
    </div>
  </div>
</template>

<script>

import { faVolumeMute, faStepForward, faPause, faPlay, faUser } from "@fortawesome/free-solid-svg-icons";
import BlankPartyMember from "@/components/blank/BlankPartyMember";

export default {
  name: "BlankTrackController",
  components: {BlankPartyMember},
  data: () => ({
    fa: {
      faVolumeMute,
      faStepForward,
      faPause,
      faPlay,
      faUser
    }
  })
}
</script>

<style lang="scss">
.blank {
  .img-blank {
    background-color: lightgrey;
  }

  .track-details {
    .name, .artist {
      width: 100%;
      background-color: lightgrey;
      border-radius: 999px;
      margin-top: 14px;
      margin-bottom: 10px;
      height: 18px;
    }
    .artist {
      margin-top: 24px;
    }
  }

  .button-section {

    .buttons {
      button {
        background-color: lightgrey !important;
        color: transparent !important;
        cursor: default !important;
      }
    }
  }

  .progress-text {
    p:not(.divider) {
      background-color: lightgrey;
      border-radius: 999px;
      height: 18px;
      color: transparent;
    }
  }

  .progress-bar {
    margin-top: 5px;
    background-color: lightgrey;
    height: 10px;
    border-radius: 999px;
  }

  .animate-bg {
    background-image: linear-gradient(
            90deg,
            rgba(#fff, 0) 0,
            rgba(#fff, 0.2) 20%,
            rgba(#fff, 0.5) 60%,
            rgba(#fff, 0)
    );
    background-size: 400% 400%;
    animation: skeleton-loader-bg linear;
    animation-duration: 8s;
    animation-iteration-count: infinite;

    @keyframes skeleton-loader-bg {
      100% {
        background-position: 0 0;
      }
      0% {
        background-position: 400% 400%;
      }
    }
  }
}
</style>