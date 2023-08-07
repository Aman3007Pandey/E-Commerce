const express=require('express');
const { registerUser, loginUser, logoutUser, forgotPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser } = require('../controller/userController');

const {isAuthenticatedUser,authorizeRoles} =require('../middleware/auth')
const router=express.Router();
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/logout').get(logoutUser);
router.route('/me').get(isAuthenticatedUser,getUserDetails);
router.route('/password/update').put(isAuthenticatedUser,updatePassword);
router.route('/me/update').put(isAuthenticatedUser,updateProfile);

router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles("admin"),getAllUsers);

router.route('/admin/user/:id').put(isAuthenticatedUser,authorizeRoles("admin"),updateUserRole);
router.route('/admin/user/:id').delete(isAuthenticatedUser,authorizeRoles("admin"),deleteUser);
router.route('/admin/user/:id').get(isAuthenticatedUser,authorizeRoles("admin"),getSingleUser);




module.exports=router;