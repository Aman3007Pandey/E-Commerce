import React,{Fragment,useEffect,useState} from 'react';
import "./newProduct.css";
import { useSelector,useDispatch } from 'react-redux';
import { clearErrors,createProduct } from '../../actions/productActions';
import { useAlert } from 'react-alert';
import { Button } from '@material-ui/core';
import MetaData from '../layout/MetaData';
import Sidebar from './Sidebar';
import {AccountTree,Description,Storage,Spellcheck,AttachMoney} from "@material-ui/icons"
import { NEW_PRODUCT_RESET } from '../../constants/productConstansts';

const NewProduct = ({history}) => {
    
    const dispatch=useDispatch();
    const alert=useAlert();

    const {loading,error,success}=useSelector((state)=>state.newProduct);


    const [name,setName]=useState("");
    const [price,setPrice]=useState(0);
    const [description,setDescription]=useState("");
    const [category,setCategory]=useState("");
    const [Stock,setStock]=useState(0);
    const [images,setImages]=useState([]);
    const [imagesPreview,setImagesPreview]=useState([]);

    const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones",
  ];

    useEffect(()=>{
        if(error)
        {
            alert.show('Error');
            dispatch(clearErrors());
        }

        if(success){
            alert.show("Product Created SuccessFully");
            history.push('/admin/dashboard');
            dispatch({type:NEW_PRODUCT_RESET});
        }
    },[dispatch,alert,success,history]);

    const createProdcuthandler=(e)=>{

        e.preventDefault();
        const myForm=new FormData();

        myForm.set("name",name);
        myForm.set("price",price);
        myForm.set("description",description);
        myForm.set("category",category);
        myForm.set("Stock",Stock);
        
        images.forEach((image)=>{
            myForm.append("images",image);
        })

        dispatch(createProduct(myForm));
    }

    const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };


    return (
        <Fragment>
            <MetaData title="Create Product"/>
            <div classname='dashboard'>
                <Sidebar/>
                <div className='newProductContainer'>
                    <form className='createProductForm'
                    encType='multipart/form-data'
                    onSubmit={createProdcuthandler}>
                        <h1>Create Product</h1>
                        <div>
                            <Spellcheck/>
                            <input type='text' placeholder="Product Name" required value={name}
                            onChange={(e)=>setName(e.target.value)}/>
                        </div>
                        <div>
                            <AttachMoney/>
                            <input type='number' placeholder="Price" required 
                            onChange={(e)=>setPrice(e.target.value)}/>
                        </div>

                        <div>
                            <Description/>
                            <textarea placeholder='"Product Description' value={description}
                            onChange={(e)=>setDescription(e.target.value)}
                            cols="30" rows="1"/>
                        </div>

                        <div>
                            <AccountTree/>
                            <select onChange={(e)=>setCategory(e.target.value)}>
                                <option value="">Choose Category</option>

                                {categories.map((cate)=>(
                                    <option key={cate} value={cate}>
                                        {cate}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
              <Storage/>
              <input
                type="number"
                placeholder="Stock"
                required
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            <div id="createProductFormFile">
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={createProductImagesChange}
                multiple
              />
            </div>

            <div id="createProductFormImage">
              {imagesPreview.map((image, index) => (
                <img key={index} src={image} alt="Product Preview" />
              ))}
            </div>
           <Button id='createProductBtn' type='submit' disabled={loading?true:false}>
           Create
           </Button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
};

export default NewProduct;