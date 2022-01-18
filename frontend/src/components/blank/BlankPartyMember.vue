<template>
  <p class="user blank"><font-awesome-icon :icon="fa.faUser"/>&nbsp;<span class="submitter-name animate-bg">I am not here</span></p>
</template>

<script>
import { faUser } from "@fortawesome/free-solid-svg-icons";
export default {
  name: "BlankPartyMember",
  data: () => ({
    fa: {
      faUser,
    }
  }),
}
</script>

<style lang="scss">
.user.blank {
  display: flex;
  align-items: center;
  .submitter-name {
    display: inline-block;
    background-color: lightgrey;
    border-radius: 999px;
    height: 9px;
    color: transparent;
  }
}
</style>