const express=require('express');
const router=express.Router();
const {getAllUser,getUser,showCurrentUser,updateUser,updateUserPassword}=require('../controllers/user-controller');

const {authenticateUser,authorizePermission}=require('../middleware/authentication');
router.route('/').get(authenticateUser,authorizePermission('owner','admin'),getAllUser);
router.route('/showme').get(authenticateUser,showCurrentUser);
router.route('/:id').get(authenticateUser,getUser);
router.route('/update').patch(authenticateUser,updateUser);
router.route('/updatepassword').post(authenticateUser,updateUserPassword);

module.exports=router;

