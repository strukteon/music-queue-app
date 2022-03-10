<template>
  <label class="custom-input custom-input-switch">
    <input type="checkbox" :checked="value">
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
}
</script>

<style lang="scss">
.custom-input.custom-input-switch {

  display: flex;
  align-items: center;

  input {
    display: none;
    width: 0;
    height: 0;
  }

  .slider-wrapper {
    position: relative;
    display: block;
    width: 2.5rem;
    height: 1.25rem;
    border-radius: 999px;
    overflow: hidden;
    background-color: grey;
    transition: background-color .2s ease;
    margin: .2rem .5rem;

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
    background-color: #3d74bd;

    .slider-button {
      transform: translateX(100%);
    }
  }

}
</style>
