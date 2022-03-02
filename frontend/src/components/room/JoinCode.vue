<template>
  <div class="join-code-wrapper">
    <p class="title">Join Code</p>
    <div class="code-wrapper">
      <p class="code">{{ isVisible ? joinCode : '******' }}</p>
      <button @click="isVisible = !isVisible"><font-awesome-icon :icon="isVisible ? faEyeSlash : faEye"/></button>
    </div>
  </div>
</template>

<script>
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default {
  name: "JoinCode",
  props: {
    joinCode: String
  },
  data: () => ({
    isVisible: true,
    faEye,
    faEyeSlash
  }),
}
</script>

<style lang="scss">
.join-code-wrapper {
  display: inline-block;
  p {
    margin: 0;
  }

  .title {
    font-size: 1.25rem;
    line-height: 1.25rem;
    padding-top: .5rem;
    font-weight: 700;
    color: #F5F7F3;
    text-align: center;
  }

  .code-wrapper {
    width: 100%;
    display: inline-flex;
    justify-content: space-around;
    align-items: center;
    font-weight: 600;
    font-size: 1.25rem;
    color: darken(white, 30%);

    .code {
      font-size: 1.5rem;
      width: 6rem;
      text-align: center;
    }

    button {
      background-color: transparent;
      border: 1px transparent solid;
      transition: background-color .2s ease;
      border-radius: 50%;
      height: 2.5rem;
      width: 2.5rem;
      font-size: 1rem;
      margin-left: .5rem;
      cursor: pointer;
      color: darken(white, 30%);

      &:hover {
        background-color: rgba(white, .1);
      }
    }
  }
}
</style>