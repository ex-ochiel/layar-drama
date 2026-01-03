"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useAuth } from "./AuthContext";

interface Rating {
    id?: string;
    dramaId: string;
    rating: number; // 1-10
    comment?: string;
    timestamp?: number;
}

interface ReviewData {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    user_id: string;
    user: {
        name: string;
        avatar: string | null;
    };
}

interface RatingContextType {
    ratings: Rating[];
    getRating: (dramaId: string) => number | null;
    setRating: (dramaId: string, rating: number, comment?: string) => Promise<void>;
    getAverageRating: (dramaId: string, defaultRating?: number) => number;
    fetchReviews: (dramaId: string) => Promise<{ reviews: ReviewData[]; averageRating: number; totalReviews: number }>;
    deleteReview: (reviewId: string) => Promise<void>;
    isLoading: boolean;
}

const RatingContext = createContext<RatingContextType | undefined>(undefined);

const STORAGE_KEY = "layar-drama-ratings";

export function RatingProvider({ children }: { children: ReactNode }) {
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    // Load ratings from localStorage on mount (for guest users)
    useEffect(() => {
        if (!user) {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    setRatings(JSON.parse(stored));
                }
            } catch (error) {
                console.error("Error loading ratings:", error);
            }
        }
        setIsLoaded(true);
    }, [user]);

    // Save ratings to localStorage for non-logged-in users
    useEffect(() => {
        if (isLoaded && !user) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
            } catch (error) {
                console.error("Error saving ratings:", error);
            }
        }
    }, [ratings, isLoaded, user]);

    const getRating = (dramaId: string): number | null => {
        const rating = ratings.find((r) => r.dramaId === dramaId);
        return rating ? rating.rating : null;
    };

    const setRatingValue = async (dramaId: string, rating: number, comment?: string) => {
        // Optimistically update local state
        setRatings((prev) => {
            const filtered = prev.filter((r) => r.dramaId !== dramaId);
            return [...filtered, { dramaId, rating, comment, timestamp: Date.now() }];
        });

        // If logged in, save to database
        if (user) {
            try {
                const res = await fetch('/api/reviews', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ drama_id: dramaId, rating, comment }),
                });

                if (!res.ok) {
                    console.error("Failed to save rating to database");
                    // Could revert here if needed
                }
            } catch (error) {
                console.error("Error saving rating:", error);
            }
        }
    };

    const fetchReviews = async (dramaId: string) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/reviews?drama_id=${dramaId}`);
            if (res.ok) {
                const data = await res.json();
                return data;
            }
            return { reviews: [], averageRating: 0, totalReviews: 0 };
        } catch (error) {
            console.error("Error fetching reviews:", error);
            return { reviews: [], averageRating: 0, totalReviews: 0 };
        } finally {
            setIsLoading(false);
        }
    };

    const deleteReview = async (reviewId: string) => {
        if (!user) return;

        try {
            const res = await fetch(`/api/reviews?id=${reviewId}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                console.error("Failed to delete review");
            }
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };

    const getAverageRating = (dramaId: string, defaultRating: number = 0): number => {
        const userRating = getRating(dramaId);
        // For now, just return user rating or default
        // In a real app, this would fetch from API
        return userRating || defaultRating;
    };

    return (
        <RatingContext.Provider
            value={{
                ratings,
                getRating,
                setRating: setRatingValue,
                getAverageRating,
                fetchReviews,
                deleteReview,
                isLoading
            }}
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
