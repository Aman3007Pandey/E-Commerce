const express=require('express');
const router=express.Router();

const {login,logout,register}=require('../controllers/auth-controller');
router.route('/logout').get(logout);
router.route('/login').post(login);
router.route('/register').post(register);

module.exports=router;