<template>
  <div class="queued-track">
    <div class="img-wrapper">
      <img :class="{'thumbnail-yt': track.platform === 'youtube'}" :src="track.thumbnailUrl"/>
    </div>
    <div class="right-section">
      <div class="track-text">
        <p class="name">{{ track.trackName }}</p>
        <p class="artist">{{ track.artist }}</p>

        <p class="user"><font-awesome-icon :icon="fa.faUser"/> {{ requesterName }}</p>
      </div>
      <div class="platform-info">
        <p class="from">from</p>
        <font-awesome-icon class="platform-icon" :icon="fa.platform[track.platform]"/>
      </div>
    </div>
  </div>
</template>

<script>
import {Track} from "@/scripts/track/Track";
import {UserManager} from "@/scripts/room/UserManager";

import { faSoundcloud, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default {
  name: "QueuedTrack",
  props: {
    track: Track
  },
  data: () => ({
    fa: {
      faUser,
      platform: {
        soundcloud: faSoundcloud,
        youtube: faYoutube,
      }
    }
  }),
  computed: {
    requesterName() {
      console.log(this.track.requesterId)
      let user = UserManager.getUser(this.track.requesterId);
      if (!user) return "user not found";
      return user.username;
    },
  }
}
</script>

<style lang="scss">
  .queued-track {
    display: flex;

    .img-wrapper {
      width: 100px;
      height: 100px;
      overflow: hidden;
      border-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;

        &.thumbnail-yt {
          height: 134%;
        }
      }
    }

    .right-section {
      display: flex;
    }

    .track-text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 1rem;
      width: 15rem;

      p {
        margin: 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
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

      .user {
        font-weight: 500;
        font-style: italic;
        color: lighten(black, 50%);

        svg {
          color: lighten(black, 70%);
        }
      }
    }

    .platform-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: black;
      padding: 0 .5rem;

      .from {
        margin: 0;
        font-weight: 300;
        line-height: .9rem;
      }

      .platform-icon {
        width: 100%;
        max-width: 40px;
        height: auto;
      }
    }
  }
</style>