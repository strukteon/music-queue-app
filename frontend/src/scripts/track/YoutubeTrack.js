import { Track } from "./Track";
import axios from "axios";

export class YoutubeTrack extends Track {
    constructor(trackId) {
        super(trackId, "youtube");
    }

    async loadMetadata() {
        const axiosResponse = await axios.get(`https://www.youtube.com/oembed?url=http%3A//youtube.com/watch%3Fv%3D${this.trackId}&format=json`);
        const trackData = axiosResponse.data;
        this.trackName = trackData.title;
        this.artist = trackData.author_name;
        this.thumbnailUrl = trackData.thumbnail_url;
    }
}