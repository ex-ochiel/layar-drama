"use client";

import { useState, useEffect } from "react";
import { Star, User, Trash2, Send, Loader2 } from "lucide-react";
import { useRating } from "@/context/RatingContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface ReviewsSectionProps {
    dramaId: string;
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

export default function ReviewsSection({ dramaId }: ReviewsSectionProps) {
    const { user } = useAuth();
    const { setRating, fetchReviews, deleteReview, getRating } = useRating();

    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Form state
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load reviews
    useEffect(() => {
        loadReviews();
    }, [dramaId]);

    const loadReviews = async () => {
        setIsLoading(true);
        const data = await fetchReviews(dramaId);
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
        setTotalReviews(data.totalReviews);

        // Set user's existing rating if any
        const existingRating = getRating(dramaId);
        if (existingRating) {
            setUserRating(existingRating);
        }

        // Check if user has a review
        if (user) {
            const userReview = data.reviews.find((r: ReviewData) => r.user_id === user.id);
            if (userReview) {
                setUserRating(userReview.rating);
                setComment(userReview.comment || "");
            }
        }

        setIsLoading(false);
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || userRating === 0) return;

        setIsSubmitting(true);
        await setRating(dramaId, userRating, comment);
        await loadReviews(); // Refresh reviews
        setIsSubmitting(false);
    };

    const handleDeleteReview = async (reviewId: string) => {
        if (!confirm("Are you sure you want to delete your review?")) return;

        await deleteReview(reviewId);
        await loadReviews();
        setUserRating(0);
        setComment("");
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <section className="mt-12 pb-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Reviews</h2>
                <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-xl font-semibold text-white">{averageRating}</span>
                    <span className="text-gray-400">({totalReviews} reviews)</span>
                </div>
            </div>

            {/* Write Review Form */}
            {user ? (
                <form onSubmit={handleSubmitReview} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4">Write a Review</h3>

                    {/* Star Rating */}
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-gray-400 text-sm">Your Rating:</span>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setUserRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="focus:outline-none"
                                >
                                    <Star
                                        className={cn(
                                            "w-5 h-5 transition-colors",
                                            (hoverRating || userRating) >= star
                                                ? "text-yellow-400 fill-current"
                                                : "text-gray-600"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                        <span className="text-white font-semibold ml-2">{userRating}/10</span>
                    </div>

                    {/* Comment */}
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts about this drama... (optional)"
                        className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 resize-none"
                        rows={3}
                    />

                    <button
                        type="submit"
                        disabled={userRating === 0 || isSubmitting}
                        className="mt-4 flex items-center gap-2 px-6 py-2 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                    </button>
                </form>
            ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8 text-center">
                    <p className="text-gray-400">
                        <a href="/login" className="text-rose-400 hover:underline">Login</a> to write a review
                    </p>
                </div>
            )}

            {/* Reviews List */}
            {isLoading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
            ) : reviews.length > 0 ? (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center overflow-hidden">
                                        {review.user.avatar ? (
                                            <img
                                                src={review.user.avatar}
                                                alt={review.user.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-5 h-5 text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">{review.user.name}</p>
                                        <p className="text-xs text-gray-500">{formatDate(review.created_at)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="text-white font-semibold">{review.rating}</span>
                                    </div>

                                    {user && user.id === review.user_id && (
                                        <button
                                            onClick={() => handleDeleteReview(review.id)}
                                            className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                                            title="Delete review"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {review.comment && (
                                <p className="mt-3 text-gray-300 leading-relaxed">{review.comment}</p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-gray-400">No reviews yet. Be the first to review!</p>
                </div>
            )}
        </section>
    );
}
