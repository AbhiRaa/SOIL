import API from '../utils/axiosUtil';

const addReview = (review)=>{
    return API.post('/review', review);
}

const fetchReviews = (productId)=>{
    return API.get(`/review/${productId}`);
}

const updateReview = (review)=>{
    console.log(review.reviewId)
    return API.put(`/review/update/${review.reviewId}`, review);
}

const addReply = (reviewId,reply)=>{
    return API.post(`/reply/${reviewId}`, reply);
}

const fetchReplies = (reviewId)=>{
    return API.get(`/replies/${reviewId}`);
}

const deleteReview = (reviewId)=>{
    return API.delete(`/review/${reviewId}`)
}

export{
    addReview,
    fetchReviews,
    updateReview,
    addReply,
    fetchReplies,
    deleteReview,
}