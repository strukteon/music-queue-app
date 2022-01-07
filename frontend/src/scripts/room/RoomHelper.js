import { Track } from "@/scripts/track/Track";
import { YoutubeTrack } from "@/scripts/track/YoutubeTrack";
import { SoundcloudTrack } from "@/scripts/track/SoundcloudTrack";

export function getPlatformClass(platform) {
    switch (platform) {
        case 'youtube':
            return YoutubeTrack;
        case 'soundcloud':
            return SoundcloudTrack;
        default:
            return Track;
    }
}