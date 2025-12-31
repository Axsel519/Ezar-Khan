/** @format */

const API_URL = "http://localhost:3001";

export const apiService = {
    async getReviews(productId) {
        try {
            const response = await fetch(`${API_URL}/reviews?productId=${productId}`);
            return await response.json();
        } catch (error) {
            console.error("Error fetching reviews:", error);
            return [];
        }
    },

    async addReview(reviewData) {
        try {
            const response = await fetch(`${API_URL}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reviewData),
            });
            return await response.json();
        } catch (error) {
            console.error("Error adding review:", error);
            return null;
        }
    },

    async getComments(productId) {
        try {
            const response = await fetch(
                `${API_URL}/comments?productId=${productId}`
            );
            return await response.json();
        } catch (error) {
            console.error("Error fetching comments:", error);
            return [];
        }
    },

    async addComment(commentData) {
        try {
            const response = await fetch(`${API_URL}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(commentData),
            });
            return await response.json();
        } catch (error) {
            console.error("Error adding comment:", error);
            return null;
        }
    },

    async likeComment(commentId) {
        try {
            const response = await fetch(`${API_URL}/comments/${commentId}`);
            const comment = await response.json();

            const updatedComment = {
                ...comment,
                likes: (comment.likes || 0) + 1,
            };

            const updateResponse = await fetch(`${API_URL}/comments/${commentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedComment),
            });
            return await updateResponse.json();
        } catch (error) {
            console.error("Error liking comment:", error);
            return null;
        }
    },
};