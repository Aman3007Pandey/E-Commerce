const express=require('express');
const router=express.Router();

const {createProduct,getAllProduct,getProduct,updateProduct,deleteProduct,uploadProductImage}=require('../controllers/product-controller');
const {authenticateUser,authorizePermission}=require('../middleware/authentication')

router.route('/').post([authenticateUser,authorizePermission('admin')],createProduct).get(getAllProduct);

router.route('/uploadImage').post([authenticateUser,authorizePermission('admin')],uploadProductImage)
router.route('/:id').get(getProduct).patch([authenticateUser,authorizePermission('admin')],updateProduct).delete([authenticateUser,authorizePermission('admin')],deleteProduct);


module.exports=router;