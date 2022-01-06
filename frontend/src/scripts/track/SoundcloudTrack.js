import { Track } from "./Track";
import axios from "axios";

export class SoundcloudTrack extends Track {
    constructor(trackId) {
        super(trackId, "soundcloud");
    }

    async loadMetadata() {
        const axiosResponse = await axios.get(`https://soundcloud.com/oembed?url=http%3A//soundcloud.com/${this.trackId}&format=json`);
        const trackData = axiosResponse.data;
        this.trackName = trackData.title;
        this.artist = trackData.author_name;
        this.thumbnailUrl = trackData.thumbnail_url;
    }
}