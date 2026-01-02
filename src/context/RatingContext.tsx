"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Rating {
    dramaId: string;
    rating: number; // 1-5 stars
    timestamp: number;
}

interface RatingContextType {
    ratings: Rating[];
    getRating: (dramaId: string) => number | null;
    setRating: (dramaId: string, rating: number) => void;
    getAverageRating: (dramaId: string, defaultRating?: number) => number;
}

const RatingContext = createContext<RatingContextType | undefined>(undefined);

const STORAGE_KEY = "layar-drama-ratings";

export function RatingProvider({ children }: { children: ReactNode }) {
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load ratings from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setRatings(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Error loading ratings:", error);
        }
        setIsLoaded(true);
    }, []);

    // Save ratings to localStorage whenever they change
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
            } catch (error) {
                console.error("Error saving ratings:", error);
            }
        }
    }, [ratings, isLoaded]);

    const getRating = (dramaId: string): number | null => {
        const rating = ratings.find((r) => r.dramaId === dramaId);
        return rating ? rating.rating : null;
    };

    const setRatingValue = (dramaId: string, rating: number) => {
        setRatings((prev) => {
            const filtered = prev.filter((r) => r.dramaId !== dramaId);
            return [...filtered, { dramaId, rating, timestamp: Date.now() }];
        });
    };

    const getAverageRating = (dramaId: string, defaultRating: number = 0): number => {
        const userRating = getRating(dramaId);
        // For now, just return user rating or default
        // In a real app, this would aggregate multiple user ratings
        return userRating || defaultRating;
    };

    return (
        <RatingContext.Provider
            value={{ ratings, getRating, setRating: setRatingValue, getAverageRating }}
        >
            {children}
        </RatingContext.Provider>
    );
}

export function useRating() {
    const context = useContext(RatingContext);
    if (context === undefined) {
        throw new Error("useRating must be used within a RatingProvider");
    }
    return context;
}
