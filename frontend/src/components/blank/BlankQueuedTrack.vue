<template>
  <div class="queued-track blank">
    <div class="img-wrapper">
      <div class="img-blank animate-bg"/>
    </div>
    <div class="right-section">
      <div class="track-text">
        <p class="name animate-bg">Ganaggi</p>
        <p class="artist animate-bg">Ganaggi</p>

        <blank-party-member class="user"/>
      </div>
      <div class="platform-info">
        <div class="bg-wrapper animate-bg">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { faSoundcloud, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import BlankPartyMember from "@/components/blank/BlankPartyMember";
export default {
  name: "BlankQueuedTrack",
  components: {BlankPartyMember},
  data: () => ({
    fa: {
      faUser,
      platform: {
        soundcloud: faSoundcloud,
        youtube: faYoutube,
      }
    }
  }),
}
</script>

<style lang="scss">
@import "~@/assets/styles/skeleton.scss";

.queued-track.blank {
  .img-blank {
    background-color: lightgrey;
  }

  .track-text {
    .name, .artist {
      width: 100%;
      background-color: lightgrey;
      border-radius: 999px;
      height: 11px;
      margin-top: 7px;
      margin-bottom: 6px;
      color: transparent;
    }
    .artist {
      margin-bottom: calc(6px + 0.5rem);
    }
  }

  .platform-info .bg-wrapper {
    background-color: lightgrey;
    border-radius: 6px;
    height: 38px;
    width: 38px;
  }
}
</style>