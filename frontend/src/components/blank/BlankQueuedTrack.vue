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
.queued-tracks > div {
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
    height: 48px;
    width: 38px;
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

    > * {
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