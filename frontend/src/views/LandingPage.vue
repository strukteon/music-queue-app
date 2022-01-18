<template>
  <div class="starting-screen">
    <div class="title-wrapper">
      <h1 class="title">Listening to music yet?</h1>
      <p class="subtitle">Let the party start.</p>
    </div>

    <div class="selection-wrapper">
      <router-link to="/join" class="join-room" @mouseenter="startVideo" @mouseleave="pauseVideo">
        <video class="video" :src="require('@/assets/videos/ezgif.com-gif-maker(4).mp4')" loop></video>
        <p>Join a room</p>
      </router-link>
      <router-link to="/create-room" class="create-room" @mouseenter="startVideo" @mouseleave="pauseVideo">
        <video class="video" :src="require('@/assets/videos/ezgif.com-gif-maker(1).mp4')" loop></video>
        <p>Create a room</p>
      </router-link>
    </div>

    <div class="about-the-project">
      <p>About the project</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "LandingPage",
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

  .starting-screen {
    background-color: colors.$darkblue;
    color: #f5f7f3;
    padding: 2rem;
    padding-top: 4rem;

    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0;

    height: 100vh;
    box-sizing: border-box;

    .title-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;

      margin: min(7rem, 10vw) 0 1rem 0;

      .title {
        font-size: min(5rem, 10vw);
        margin: 0;
        font-weight: 700;
        text-align: center;
      }

      .subtitle {
        margin: 0;
        font-weight: 400;
        font-size: min(1.5rem, 5vw);
        margin-bottom: 2rem;
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

        &.join-room p {
          background-color: rgba(#3D74BD, .5);
        }

        &.create-room p {
          background-color: rgba(#AD3F59, .65);
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
      margin-top: auto;
    }
  }
</style>