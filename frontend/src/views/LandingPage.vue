<template>
  <div class="landing-page">
    <modal ref="inDevModal" title="Still in development">
      <p>Since this app is still in development, there may occur some bugs.</p>
      <p>Thank you for using musiQ!</p>
    </modal>

    <section class="starting-screen">
      <div class="title-wrapper">
        <h1 class="title">Listening to music yet?</h1>
        <p class="subtitle">Let the party start.</p>
      </div>

      <div class="selection-wrapper">
        <router-link class="join-room" to="/join" @mouseenter="startVideo" @mouseleave="pauseVideo">
          <video :src="require('@/assets/videos/ezgif.com-gif-maker(4).mp4')" class="video" loop></video>
          <p>Join a room</p>
        </router-link>
        <router-link class="create-room" to="/create-room" @mouseenter="startVideo" @mouseleave="pauseVideo">
          <video :src="require('@/assets/videos/ezgif.com-gif-maker(1).mp4')" class="video" loop></video>
          <p>Create a room</p>
        </router-link>
      </div>

      <div class="about-the-project">
        <p>About the project</p>
        <font-awesome-icon :icon="faAngleDown" class="icon"/>
      </div>
    </section>

    <section class="project-description">
      <div>
        <div class="text-wrapper left">
          <h2 class="title">Listen alone..</h2>
          <p class="description">MusiQ is the perfect place to listen to all of your favorite songs from different
            platforms, collected in a single webapp!</p>
        </div>
        <div class="img-wrapper listen-alone">
          <img src="@/assets/images/landing_page/listen_alone.svg"/>
        </div>
      </div>

      <div>
        <div class="text-wrapper right">
          <h2 class="title">..at gatherings..</h2>
          <p class="description">Who’s connected to the speaker?
            Doesn’t matter anymore! Add songs to the queue and the host will play them - one after another.</p>
        </div>
        <div class="img-wrapper listen-gathering">
          <img src="@/assets/images/landing_page/listen_gathering.svg"/>
        </div>
      </div>

      <div>
        <div class="text-wrapper left">
          <h2 class="title">..or with a friend!</h2>
          <p class="description">Sync your phones to play the same tracks simultaneously. Share your vibe with each
            other!</p>
        </div>
        <div class="img-wrapper listen-together">
          <img src="@/assets/images/landing_page/listen_together.svg"/>
        </div>
      </div>
    </section>

    <section class="section-features">
      <h2 class="title">Features</h2>

      <table>
        <tr>
          <th></th>
          <th>
            <font-awesome-icon :icon="faYoutube" class="icon-youtube"/>
          </th>
          <th>
            <font-awesome-icon :icon="faSpotify" class="icon-spotify"/>
          </th>
          <th>
            <font-awesome-icon :icon="faSoundcloud" class="icon-soundcloud"/>
          </th>
          <th><span class="logo-musiq">MusiQ</span></th>
        </tr>
        <tr v-for="feature of features" :key="feature.text">
          <td class="text">{{ feature.text }}</td>
          <td>
            <font-awesome-icon :class="{'icon-cross': ! feature.yt, 'icon-check': feature.yt}"
                               :icon="feature.yt ? faCheckCircle : faTimesCircle"/>
          </td>
          <td>
            <font-awesome-icon :class="{'icon-cross': ! feature.sp, 'icon-check': feature.sp}"
                               :icon="feature.sp ? faCheckCircle : faTimesCircle"/>
          </td>
          <td>
            <font-awesome-icon :class="{'icon-cross': ! feature.sc, 'icon-check': feature.sc}"
                               :icon="feature.sc ? faCheckCircle : faTimesCircle"/>
          </td>
          <td>
            <font-awesome-icon :class="{'icon-musiq': true, 'icon-check': feature.mq}"
                               :icon="feature.mq ? faCheckCircle : faTimesCircle"/>
          </td>
        </tr>
      </table>
    </section>

    <section class="section-thank-you">
      <font-awesome-icon :icon="faHandHoldingHeart" class="icon"/>
      <div class="text-wrapper">
        <h3 class="title">Do you like this app?</h3>
        <p class="text">Leave a tip over at my ko-fi page</p>
      </div>
    </section>
  </div>
</template>

<script>
import {faAngleDown, faCheckCircle, faTimesCircle, faHandHoldingHeart} from "@fortawesome/free-solid-svg-icons";
import {faYoutube, faSpotify, faSoundcloud} from "@fortawesome/free-brands-svg-icons";
import Modal from "@/components/Modal";

export default {
  name: "LandingPage",
  components: {Modal},
  data: () => ({
    faAngleDown,
    faCheckCircle,
    faTimesCircle,
    faHandHoldingHeart,
    faYoutube,
    faSpotify,
    faSoundcloud,
    features: [
      {text: "Play tracks from YouTube", yt: true, sp: false, sc: false, mq: true},
      {text: "Play tracks from Spotify", yt: false, sp: true, sc: false, mq: true},
      {text: "Play tracks from Soundcloud", yt: false, sp: false, sc: true, mq: true},
      {text: "Create a shared queue", yt: false, sp: false, sc: false, mq: true},
      {text: "Synchronized audio playback", yt: false, sp: true, sc: false, mq: true},
      {text: "Is 100% legal", yt: true, sp: true, sc: true, mq: true},
    ]
  }),
  mounted() {
    if (window.location.hostname != 'localhost')
      this.$refs.inDevModal.open();
  },
  methods: {
    startVideo(event) {
      event.target.firstChild.play();
    },
    pauseVideo(event) {
      event.target.firstChild.pause();
    }
  }
}
</script>

<style lang="scss">
@use "~@/assets/styles/colors.scss";

.landing-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .starting-screen {
    z-index: 1;

    .title-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;

      margin: 4rem 0;

      &::before {
        z-index: -1;
        content: '';
        position: absolute;
        width: 100%;
        top: -325px;
        height: 530px;
        background-position: bottom;
        background-image: url("~@/assets/images/landing_page/haikei_image_13.svg");
      }

      .title {
        font-size: 4rem;
        margin-top: 0;
        margin-bottom: 0;
      }

      .subtitle {
        font-size: 1.5rem;
        margin-top: 0;
      }
    }

    .selection-wrapper {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;

      margin: auto 0;

      > a {
        width: min(480px, 80vw);
        min-height: 200px;
        aspect-ratio: 16/10;
        margin: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 24px;
        text-decoration: none;
        position: relative;
        overflow: hidden;

        p {
          position: relative;

          &::after {
            position: absolute;
            content: '';
            z-index: -1;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            mix-blend-mode: lighten;
            opacity: .5;
            background-size: cover;
          }
        }

        &.join-room p {
          background-color: rgba(#3D74BD, .5);

          &::after {
            background-image: url("~@/assets/images/landing_page/haikei_blob_2.svg");
            background-size: contain;
            background-repeat: no-repeat;
            background-position: right;
          }
        }

        &.create-room p {
          background-color: rgba(#AD3F59, .65);

          &::after {
            background-image: url("~@/assets/images/landing_page/haikei_blob_1.svg");
            background-size: contain;
            background-repeat: no-repeat;
            background-position: left;
          }
        }

        p {
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-size: min(3.5rem, 8vw);
          font-weight: 700;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        video {
          position: absolute;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(0);
        }
      }
    }

    .about-the-project {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      margin-top: 2rem;
      margin-bottom: 2rem;

      position: relative;

      &::before {
        z-index: -1;
        content: '';
        position: absolute;
        width: 100%;
        top: -240px;
        height: 400px;
        background-position: bottom;
        background-repeat: no-repeat;
        background-image: url("~@/assets/images/landing_page/haikei_image_12.svg");
      }

      svg.icon {
        width: 42px;
        height: 42px;
      }
    }
  }

  .project-description {
    > div {
      display: flex;
      justify-content: center;
      align-items: center;

      margin: 10rem 0;


      .right {
        order: 1;
      }

      .text-wrapper {
        width: 400px;
        margin: 4rem;
        z-index: 1;

        .title {
          font-size: 2.25rem;
          font-weight: 600;
          margin-bottom: .25rem;
        }

        .description {
          font-size: 1.4rem;
          font-weight: 500;
          color: darken(white, 20%);
          margin-top: 0;
        }
      }

      .img-wrapper {
        position: relative;
        z-index: 1;

        &::before {
          z-index: -1;
          content: '';
          position: absolute;
          background-position: center;
          background-size: contain;
          background-repeat: no-repeat;
          width: 125%;
          height: 600px;
        }

        &.listen-alone::before {
          top: -120px;
          left: -60px;
          width: 115%;
          background-image: url("~@/assets/images/landing_page/haikei_image_16.svg");
        }

        &.listen-gathering::before {
          top: -120px;
          left: -50px;
          background-image: url("~@/assets/images/image 15.png");
        }

        &.listen-together::before {
          top: -150px;
          left: -50px;
          background-image: url("~@/assets/images/image 14.png");
        }
      }

      img {
        width: 256px;
        height: 256px;
        margin: 2rem;
      }
    }
  }

  .section-features {
    position: relative;

    padding: 4rem 0;
    margin-top: 4rem;

    z-index: 1;

    &::before {
      content: '';
      position: absolute;
      z-index: -1;
      top: 50%;
      left: 50%;
      width: 1456px;
      height: 100%;
      transform: translate(-50%, -50%) rotate(-8deg) skew(-8deg);
      background: #070E17;
    }

    .title {
      font-size: 2.75rem;
      font-weight: 600;
      margin-bottom: 0;
    }

    table {
      th {
        .icon-youtube {
          font-size: 2rem;
        }

        .icon-spotify {
          font-size: 2rem;
          margin: 0 1rem;
        }

        .icon-soundcloud {
          font-size: 2.25rem;
        }

        .logo-musiq {
          font-size: 2rem;
          margin: 0 2rem;
        }
      }

      .text {
        font-size: 1.5rem;
        color: darken(white, 15%);
        width: 400px;
      }

      td:not(.text) {
        text-align: center;
      }

      .icon-cross, .icon-check {
        font-size: 1.5rem;
      }

      .icon-check {
        color: darken(white, 30%);
      }

      .icon-cross {
        color: darken(white, 70%);
      }

      .icon-musiq {
        color: darken(white, 10%);
      }
    }
  }

  .section-thank-you {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    margin-top: -8rem;
    padding-top: 28rem;
    padding-bottom: 20rem;

    width: 1440px;
    background-size: cover;
    background-image: url("~@/assets/images/circle-scatter-haikei.svg");

    .icon {
      font-size: 6rem;
      color: darken(white, 40%);
    }

    .text-wrapper {
      margin: 0 3rem;

      .title {
        font-size: 2rem;
        margin-bottom: 0;
      }

      .text {
        font-size: 1.4rem;
        font-weight: 600;
        margin-top: 0;
        color: darken(white, 30%);
      }
    }
  }
}
</style>