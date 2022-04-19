<template>
  <p class="member blank"><font-awesome-icon :icon="faUser"/><span class="username animate-bg">sub 2 pewds</span></p>
</template>

<script>
import { faUser } from "@fortawesome/free-solid-svg-icons";
export default {
  name: "BlankPartyMember",
  data: () => ({
    faUser,
  }),
}
</script>

<style lang="scss" scoped>
.member {
  height: 25px;

  .username {
    display: inline-block;
    background-color: lightgrey;
    border-radius: 999px;
    height: 9px;
    color: transparent;
  }
}
</style>