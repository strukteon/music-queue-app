<template>
<modal ref="modal" title="Settings" class="settings-modal">
  <div class="presets">
    <div class="title">Presets:</div>
    <div class="preset-list">
      <div v-for="preset in presets" :key="preset.subheading" :class="{'preset-item': true, 'active': preset.isActive}" @click="applyPreset(preset)">
        <img :src="preset.img"/>
        <div class="subheading">{{ preset.subheading }}</div>
      </div>
    </div>
  </div>

  <div class="options">
    <v-switch-input v-for="option in options" :key="option.title" :value="option.value" @input="e => option.value = e.target.checked">{{ option.title }}</v-switch-input>
  </div>
</modal>
</template>

<script>
import Modal from "../Modal";
import VSwitchInput from "../VSwitchInput";
export default {
  name: "SettingsModal",
  components: {VSwitchInput, Modal},
  data: () => ({
    x: false,
    options: {
      "play_on_all_devices": {
        title: "Play tracks synchronously on all devices",
        value: false
      },
    },
    presets: [
      {
        img: require("@/assets/images/landing_page/listen_alone.svg"),
        subheading: "Listen alone",
        options: {
          "play_on_all_devices": false,
        }
      },
      {
        img: require("@/assets/images/landing_page/listen_gathering.svg"),
        subheading: "DJ mode",
        isActive: true,
        options: {
          "play_on_all_devices": false,
        }
      },
      {
        img: require("@/assets/images/landing_page/listen_together.svg"),
        subheading: "Synchronized",
        options: {
          "play_on_all_devices": true,
        }
      }
    ]
  }),
  methods: {
    open() {
      this.$refs.modal.open();
    },
    applyPreset(preset) {
      for (let preset of this.presets) {
        preset.isActive = false;
      }
      preset.isActive = true;

      for (let option in preset.options) {
        this.options[option].value = preset.options[option];
        console.log(preset.subheading, preset.options[option])
      }
    },
    unselectPresets() {
      for (let preset of this.presets) {
        preset.isActive = false;
      }
    },
    handle(e) {
      console.log("x", e)
    }
  }
}
</script>

<style lang="scss" scoped>
.settings-modal {
  .presets {
    border-bottom: rgba(black, .05) solid 2px;
    margin-bottom: 1rem;

    .title {
      font-size: 1rem;
      color: lighten(black, 40%);
    }

    .preset-list {
      display: flex;
      justify-content: space-around;

      .preset-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        cursor: pointer;
        transition: all .2s ease;
        width: 25%;

        img {
          width: 50px;
          height: 50px;
          transition: all .2s ease;
        }

        &:not(.active) {
          border-bottom: 3px solid transparent;

          .subheading {
            color: rgba(black, .75);
          }

          img {
            filter: brightness(0) invert(60%);
          }
        }
        &.active {
          background-color: rgba(black, .05);
          border-bottom: 3px solid #3d74bd;
        }
      }
    }

  }
}
</style>
