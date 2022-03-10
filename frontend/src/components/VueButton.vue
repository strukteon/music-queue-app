<template>
  <button :class="`btn btn-${visual}`">
    <slot>Empty</slot>
  </button>
</template>

<script>
export default {
  name: "VueButton",
  props: {
    visual: {
      type: String,
      default: "primary"
    }
  }
}
</script>

<style lang="scss" scoped>
.btn {
  display: block;
  flex-grow: 1;
  font-family: "Poppins", sans-serif;
  border: 1px transparent solid;
  border-radius: 999px;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  background-color: lighten(black, 40%);
  color: white;
  margin: .5rem;

  &:hover {
    background-color: lighten(black, 20%);
  }
}

</style>
