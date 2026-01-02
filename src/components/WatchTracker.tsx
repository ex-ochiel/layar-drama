"use client";

import { useEffect } from "react";
import { useWatchHistory } from "@/context/WatchHistoryContext";

interface WatchTrackerProps {
    dramaId: string;
    dramaTitle: string;
    dramaThumbnail: string;
    episodeNumber: number;
    totalEpisodes?: number;
}

export default function WatchTracker({
    dramaId,
    dramaTitle,
    dramaThumbnail,
    episodeNumber,
    totalEpisodes,
}: WatchTrackerProps) {
    const { addToHistory } = useWatchHistory();

    useEffect(() => {
        // Add to history when component mounts (user starts watching)
        addToHistory({
            dramaId,
            dramaTitle,
            dramaThumbnail,
            lastEpisode: episodeNumber,
            totalEpisodes,
        });
    }, [dramaId, dramaTitle, dramaThumbnail, episodeNumber, totalEpisodes, addToHistory]);

    return null; // This is a tracking component, no UI
}
