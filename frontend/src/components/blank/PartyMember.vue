<template>
  <p class="member"><font-awesome-icon :icon="faUser"/><span class="username">{{ member.username }}</span></p>
</template>

<script>
import {faUser } from "@fortawesome/free-solid-svg-icons";

export default {
  name: "PartyMember",
  props: {
    member: Object,
  },
  data: () => ({
    faUser,
  })
}
</script>

<style lang="scss">
.member {
  margin: .5rem;
  color: lighten(black, 50%);
  font-style: italic;
  display: flex;
  align-items: center;

  svg {
    color: lighten(black, 70%);
  }

  .username {
    margin-left: .5rem;
  }
}
</style>