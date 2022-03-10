<template>
  <div :class="{'modal': true, 'modal-visible': isVisible}">
    <div class="modal-card">
      <div class="header">
        <p class="title">{{ title }}</p>
        <button class="close-button" @click="close()"><font-awesome-icon :icon="faTimes"/></button>
      </div>
      <slot/>
    </div>
  </div>
</template>

<script>
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default {
  name: "Modal",
  props: {
    visible: Boolean,
    title: String,
  },
  emits: [
    "update:modelValue",
    "canceled"
  ],

  data: () => ({
    isVisible: false,
    faTimes
  }),

  methods: {
    open() {
      this.isVisible = true;
    },
    close() {
      this.isVisible = false;
    },
  }
}
</script>

<style lang="scss">
.modal {
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
  color: black;

  &:not(.modal-visible) {
    opacity: 0;
    pointer-events: none;
  }

  .modal-card {
    background-color: white;
    width: min(30rem, 80vw);
    border-radius: 1rem;
    padding: 1.5rem;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;

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
  }
}
</style>
