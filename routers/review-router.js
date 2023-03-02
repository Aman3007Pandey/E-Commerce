const express=require('express');
const router=express.Router();

const {getAllReview,getReview,createReview,updateReview,deleteReview}=require('../controllers/review-controller');
const { authenticateUser } = require('../middleware/authentication');

router.route('/').get(getAllReview).post(authenticateUser,createReview);
router.route('/:id').patch(authenticateUser,updateReview).delete(authenticateUser,deleteReview);
router.route('/:id').get(getReview);

module.exports=router;