import {Room} from "./Room";
import {Track} from "./Track";

export class TrackManager {
    room: Room;
    currentTrack: Track | null;
    queuedTracks: Track[];

    constructor(room) {
        this.room = room;
        this.currentTrack = null;
        this.queuedTracks = [];
    }

    getCurrentTrack() {
        return this.currentTrack;
    }

    getQueuedTracks() {
        return this.queuedTracks;
    }

    addTrack(track: Track) {
        this.queuedTracks.push(track);
        this.room.emit("TRACK_ADDED", track);
    }

    pullTrackFromQueue() {
        this.currentTrack = this.queuedTracks.shift();
        this.room.emit("NEXT_TRACK_STARTED", this.currentTrack);
    }

    removeTracksByIndex(trackIndexes: number[]) {
        for (let trackIndex of trackIndexes)
            this.queuedTracks.splice(trackIndex, 1);
        this.room.emit("TRACKS_REMOVED", trackIndexes);
    }

    removeTracksByMemberUid(uid: String) {
        this.queuedTracks = this.queuedTracks.filter(track => track.requesterUid !== uid);
        this.room.emit("TRACKS_REMOVED_BY_MEMBER_UID", uid);
    }

    moveTrackByIndex(trackIndex: number, posDelta: number) {
        let track = this.queuedTracks.splice(trackIndex, 1)[0];
        let newTrackIndex = Math.max(0, Math.min(this.queuedTracks.length - 1, trackIndex + posDelta));
        this.queuedTracks.splice(newTrackIndex, 0, track);
        this.room.emit("UPDATED_TRACK_INDEX", { trackIndex, posDelta });
    }
}