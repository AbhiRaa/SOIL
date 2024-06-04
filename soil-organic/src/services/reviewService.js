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

export{
    addReview,
    fetchReviews,
    updateReview
}