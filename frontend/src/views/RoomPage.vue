<template>
  <div class="room-page">
    <div class="left-part">
      <div class="title-bar">
        <p class="welcome-text">Welcome to <span class="room-name">{{ room.roomName }}</span>!</p>
        <join-code :join-code="room.joinCode"/>
      </div>
      <track-controller class="track-controller" ref="track-controller" @next="Room.Tracks.next()"/>
      <div class="party-members-section">
        <p class="title">Party Members <font-awesome-icon :icon="fa.faUsers"/></p>

        <p class="member" v-for="member in roomMembers" :key="member.userId"><font-awesome-icon :icon="fa.faUser"/> {{ member.username }}</p>
      </div>
    </div>

    <div class="right-part">
      <div class="add-track-button-wrapper">
        <button class="add-track-button" @click="addTrackOpen = true">Add Track</button>
        <track-add-popup v-model="addTrackOpen"/>
      </div>

      <div class="queued-tracks-section">
        <p class="title">Next up</p>
        <div class="queued-tracks">
          <blank-queued-track v-if="true"/>
          <queued-track v-for="(track, i) in queuedTracks" :key="track.trackId + i" :track="track"/>
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

import { faUsers, faUser } from "@fortawesome/free-solid-svg-icons";
// import {UserManager} from "@/scripts/room/UserManager";
import {TrackManager} from "@/scripts/room/TrackManager";
import QueuedTrack from "@/components/room/QueuedTrack";
import TrackAddPopup from "@/components/room/TrackAddPopup";
import BlankQueuedTrack from "@/components/blank/BlankQueuedTrack";

import {Room} from "@/scripts/models/Room";

const {MemberManager} = require("@/scripts/room/MemberManager");

export default {
  name: "RoomPage",
  components: {BlankQueuedTrack, TrackAddPopup, QueuedTrack, JoinCode, TrackController},
  data: () => ({
    fa: {
      faUsers,
      faUser,
    },
    addTrackOpen: false,
    BackendController,
    Room,
    room: { },
    roomMembers: [],
    TrackManager,
    currentTrack: null,
    queuedTracks: [],
    websocketHandler: null,
  }),
  async beforeCreate() {
    BackendController.loadUniqueId();
    console.log(BackendController.uniqueId)

    let room = await Room.getCurrent();
    if (! room) alert("Error: not in room");
    this.room = room;

    console.log(Room.Tracks)
    let tracks = await Room.Tracks.getAll();
    if (tracks.success && tracks.data.currentTrack !== null)
      await TrackManager.loadCurrentTrack(TrackManager.createTrackObject(tracks.data.currentTrack));
    await TrackManager.loadQueuedTracks(tracks.data.queuedTracks.map(t => TrackManager.createTrackObject(t)));
    this.currentTrack = TrackManager.getCurrentTrack();
    this.queuedTracks = TrackManager.getQueuedTracks();

    if (! this.$refs["track-controller"].isInitialized)
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

  methods: {
  },
}
</script>

<style lang="scss">
@use "~@/assets/styles/colors.scss";


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
      color: black;
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
  }

  .party-members-section {
    .title {
      display: flex;
      margin: 1rem auto;
      align-items: center;
      font-size: 1.5rem;
      font-weight: 600;
      color: black;

      svg {
        margin-left: .5rem;
        font-size: 1.7rem;
      }
    }

    .member-wrapper {
      display: flex;
      flex-wrap: wrap;
    }

    .member {
      margin: .5rem;
      color: lighten(black, 50%);
      font-style: italic;

      svg {
        color: lighten(black, 70%);
      }
    }
  }

  .add-track-button-wrapper {
    display: flex;
  }

  .add-track-button {
    display: block;
    flex-grow: 1;
    font-family: "Poppins", sans-serif;
    border: 1px transparent solid;
    border-radius: 999px;
    margin: 0.25rem;
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

  .queued-tracks-section {
    flex-grow: 1;
    display: block;
    width: min(calc(100vw - 1.5rem), 480px);

    .title {
      font-weight: 700;
      color: black;
      font-size: 1.5rem;
      margin: 0;
      margin-bottom: 1rem;
    }
    .queued-track {
      margin: 1rem 0;
    }
  }

  .left-part, .right-part {
    margin: 0 2rem;
  }
  .left-part {
    flex-grow: 1;
  }
}
</style>