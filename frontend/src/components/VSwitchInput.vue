<template>
  <label class="custom-input custom-input-switch">
    <input type="checkbox" v-model="inputValue">
    <span class="slider-wrapper">
      <span class="slider-button"/>
    </span>
    <slot/>
  </label>
</template>

<script>
export default {
  name: "VSwitchInput",
  props: {
    value: Boolean,
  },
  data: () => ({
    inputValue: false,
  }),
  mounted() {
    this.inputValue = this.value;
  }
}
</script>

<style lang="scss">
.custom-input.custom-input-switch {

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider-wrapper {
    position: relative;
    display: inline-block;
    width: 2.5rem;
    height: 1.25rem;
    border-radius: 999px;
    overflow: hidden;
    background-color: grey;
    transition: background-color .2s ease;

    cursor: pointer;

    .slider-button {
      position: absolute;
      top: 0;
      left: 0;
      display: inline-block;
      height: 100%;
      border-radius: 999px;
      aspect-ratio: 1;
      background-color: black;

      transition: transform .2s ease;
    }
  }

  input:checked + .slider-wrapper {
    background-color: greenyellow;

    .slider-button {
      transform: translateX(100%);
    }
  }

}
</style>
