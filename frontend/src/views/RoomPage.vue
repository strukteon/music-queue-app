<template>
  <div class="room-page">
    <div class="left-part">
      <div class="title-bar">
        <p class="welcome-text">Welcome to <span class="room-name">{{ room.roomName }}</span>!</p>
        <join-code :join-code="room.joinCode"/>
      </div>


      <track-controller v-show="/*trackHasLoaded*/ false" ref="track-controller" @next="Room.Tracks.next()"/>
      <blank-track-controller v-if="true"/>

      <div class="party-members-section">
        <p class="title">Party Members
          <font-awesome-icon :icon="fa.faUsers"/>
        </p>

        <div class="member-wrapper">
          <template v-if="/*usersHaveLoaded*/ roomMembers != null">
            <party-member v-for="member in roomMembers" :key="member.userId" :member="member"/>
          </template>
          <template v-else>
            <blank-party-member v-for="i in 15" :key="i"/>
          </template>
        </div>
      </div>

      <div class="qr-code-wrapper">
        <vue-button @click="showQrCode = ! showQrCode">{{ showQrCode ? 'Hide' : 'Show'}} QR-Code</vue-button>
        <qr-code v-show="showQrCode" :value="qrcodeValue"/>
      </div>
    </div>

    <div class="right-part">
      <div class="add-track-button-wrapper">
        <vue-button class="add-track-button" @click="$refs.trackAddModal.open()">Add Track</vue-button>
        <track-add-modal ref="trackAddModal"/>
      </div>

      <div class="queued-tracks-section">
        <p class="title">Next up</p>
        <div class="queued-tracks">
          <template v-if="queuedTracks == null">
            <blank-queued-track v-for="i in 4" :key="i"/>
          </template>
          <template v-else-if="/*queuedTracksHaveLoaded*/ queuedTracks.length > 0">
            <queued-track v-for="(track, i) in queuedTracks" :key="track.trackId + i" :track="track"/>
          </template>
          <p v-else>No tracks queued!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BackendController from "@/scripts/BackendController";
import {RoomWebsocketHandler} from "@/scripts/room/RoomWebsocketHandler";
import TrackController from "@/components/TrackController";

import JoinCode from "@/components/room/JoinCode";

import {faUsers, faUser} from "@fortawesome/free-solid-svg-icons";
import {TrackManager} from "@/scripts/room/TrackManager";
import QueuedTrack from "@/components/room/QueuedTrack";
import BlankQueuedTrack from "@/components/blank/BlankQueuedTrack";

import {Room} from "@/scripts/models/Room";
import TrackAddModal from "@/components/room/TrackAddModal";
import PartyMember from "@/components/blank/PartyMember";
import BlankPartyMember from "@/components/blank/BlankPartyMember";
import BlankTrackController from "@/components/blank/BlankTrackController";
import VueButton from "@/components/VueButton";
import QrCode from "@/components/room/QrCode";

const {MemberManager} = require("@/scripts/room/MemberManager");

export default {
  name: "RoomPage",
  components: {
    QrCode,
    VueButton,
    BlankTrackController,
    BlankPartyMember, PartyMember, TrackAddModal, BlankQueuedTrack, QueuedTrack, JoinCode, TrackController
  },
  data: () => ({
    fa: {
      faUsers,
      faUser,
    },
    addTrackOpen: false,
    BackendController,
    Room,
    room: {},
    roomMembers: null,
    TrackManager,
    currentTrack: null,
    queuedTracks: null,
    websocketHandler: null,
    showQrCode: true,
  }),
  async beforeCreate() {
    BackendController.loadUniqueId();
    console.log(BackendController.uniqueId)

    let room = await Room.getCurrent();
    if (!room) alert("Error: not in room");
    this.room = room;

    console.log(Room.Tracks)
    let tracks = await Room.Tracks.getAll();
    if (tracks.success && tracks.data.currentTrack !== null)
      await TrackManager.loadCurrentTrack(TrackManager.createTrackObject(tracks.data.currentTrack));
    await TrackManager.loadQueuedTracks(tracks.data.queuedTracks.map(t => TrackManager.createTrackObject(t)));
    this.currentTrack = TrackManager.getCurrentTrack();
    this.queuedTracks = TrackManager.getQueuedTracks();

    if (!this.$refs["track-controller"].isInitialized)
      await this.$refs["track-controller"].initControllers();
    if (this.currentTrack !== null)
      this.$refs["track-controller"].loadTrack(this.currentTrack);

    console.log(MemberManager.members)
    await MemberManager.loadAllMembers();
    this.roomMembers = MemberManager.getAllMembers();

    this.websocketHandler = new RoomWebsocketHandler(this);
    console.log("xxxx")
  },

  /*async mounted() {
    let response = await BackendController.getRoomData();

    if (!response.success && response.message === "NOT_IN_A_ROOM") {
      console.log("not in room, redirecting?");
      return;
    } else if (!response.success) {
      alert(JSON.stringify(response));
      return;
    }

    this.roomData = response.data;
    this.websocketHandler = new RoomWebsocketHandler(this);

    (async () => {
      if (this.roomData.currentTrack != null) {
        let track = TrackManager.createTrackObject(this.roomData.currentTrack.trackId, this.roomData.currentTrack.platform, this.roomData.currentTrack.userId)
        await track.loadMetadata();
        await this.$refs["track-controller"].initControllers();
        await this.$refs["track-controller"].loadTrack(track);
        this.$refs["track-controller"].toggleStart();
      }
    })();

    (async () => {
      await UserManager.loadUsers(this.roomData.roomMembers.map(v => v.userId));
      this.roomMembers = UserManager.getAllUsers();
    })();

    (async () => {
      await TrackManager.loadTracks(this.roomData.queuedTracks.map(v => TrackManager.createTrackObject(v.trackId, v.platform, v.userId)));
      this.queuedTracks = TrackManager.getTracks();
    })();
  },*/

  methods: {},

  computed: {
    qrcodeValue() {
      return `https://musiq.pq/join/${this.room.joinCode}`;
    }
  }
}
</script>

<style lang="scss">
@use "~@/assets/styles/colors.scss";

body {
  background-size: cover;
  background-position: center;
  background-image: url("~@/assets/images/image 11.png");
}

.room-page {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  margin-top: 3rem;

  .title-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: start;
    justify-content: center;
    row-gap: 1rem;

    .welcome-text {
      font-size: 2rem;
      font-weight: 600;
      color: #F5F7F3;
      margin: 0;
      flex-grow: 1;
      text-align: center;

      .room-name {
        font-style: italic;
      }
    }
  }

  .track-controller {
    margin-top: 2rem;
    margin-bottom: 2rem;
    background-color: darken(white, 5%);
    border-radius: 24px;
    padding: 24px;
  }

  .party-members-section {
    .title {
      display: flex;
      margin: 1rem auto;
      align-items: center;
      font-size: 1.5rem;
      font-weight: 600;
      color: darken(white, 10%);

      svg {
        margin-left: .5rem;
        font-size: 1.7rem;
      }
    }

    .member-wrapper {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      border-radius: 24px;
      background-color: darken(white, 5%);
      padding: 12px;
    }
  }

  .add-track-button-wrapper {
    display: flex;
  }

  .queued-tracks-section {
    flex-grow: 1;
    display: block;
    width: min(calc(100vw - 1.5rem), 480px);

    .title {
      font-weight: 700;
      color: darken(white, 5%);
      font-size: 1.5rem;
      margin: 0;
      margin-bottom: 1rem;
    }

    .queued-track {
      margin: 1rem 0;
    }
  }

  .qr-code-wrapper {
    @media screen and (min-width: 1600px + 316) {
      display: flex;
      flex-direction: column-reverse;
      align-items: start;
      position: absolute;
      padding: 16px;
      bottom: 0px;
      left: 0px;

      .btn {
        margin: 1rem 0 0 0;
      }

      img {
        width: min(300px, calc(calc(100vw - 1600px) / 2 - 16px));
      }
    }
  }

  .left-part, .right-part {
    margin: 0 2rem;
  }

  .left-part {
    flex-grow: 1;
    max-width: 992px;
  }
}
</style>
