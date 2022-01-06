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

<style scoped>
.btn {
  font-family: 'Encode Sans';
  font-size: 1.1rem;
  font-weight: 500;
  text-transform: uppercase;
  color: white;
  background-color: dodgerblue;
  border: 1px transparent solid;
  padding: 8px;
}

</style>