<template>
<modal ref="modal" title="Settings">
  <v-switch-input>Test 12345</v-switch-input>
</modal>
</template>

<script>
import Modal from "../Modal";
import VSwitchInput from "../VSwitchInput";
export default {
  name: "SettingsModal",
  components: {VSwitchInput, Modal},
  methods: {
    open() {
      this.$refs.modal.open();
    }
  }
}
</script>

<style scoped>

</style>
