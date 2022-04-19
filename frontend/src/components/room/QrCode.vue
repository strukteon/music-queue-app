<template>
  <q-r-code-vue3 class="qr-code" :value="value"
                 :dots-options="{
                            type: 'extra-rounded',
                            color: 'green',
                            gradient: {
                              type: '#ff0000',
                              rotation: 0,
                              colorStops: [
                                { offset: 1, color: '#274b7b' },
                                { offset: 0, color: '#0b1523' },
                              ],
                            },
                         }"
                 :corners-dot-options="{
                            type: 'none',
                            color: '#000'
                         }"
                 :corners-square-options="{
                            type: 'extra-rounded'
                         }"
  />
</template>

<script>
import QRCodeVue3 from 'qrcode-vue3';

export default {
  name: "QrCode",
  props: {
    value: String,
  },
  components: {
    QRCodeVue3
  }
}
</script>

<style lang="scss">
.qr-code {
  img {
    padding: 8px;
    border-radius: 16px;
    background-color: white;
  }
}
</style>
