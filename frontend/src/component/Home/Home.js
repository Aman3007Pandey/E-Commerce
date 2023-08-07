import React ,{Fragment,useEffect} from 'react';
import{CgMouse} from 'react-icons/all';
import "./Home.css"
import ProductCard from "./ProductCard"
import MetaData from '../layout/MetaData';
import { clearErrors, getProduct } from '../../actions/productActions';
import {useDispatch,useSelector} from 'react-redux'
import Loader from "../layout/Loader/Loader.js";
import {useAlert} from 'react-alert'


const Home=()=>{

    const dispatch=useDispatch();
    const alert=useAlert();
    const {error,products,loading} =useSelector(state=>state.products);

    useEffect(()=>{

        if(error)
        {
            alert.error(error);
           dispatch( clearErrors());
        }
     dispatch(getProduct());
    },[dispatch,error,alert])
     
    return (
        <Fragment>
            {loading?<Loader/>:<Fragment>

            <MetaData title="E-Commerce"/>
            <div className='banner'>
                <p>Welcome to E-commerce</p>
                <h1>Find amazing Products below</h1>

                <a href='#container'>
                    <button>
                        Scroll <CgMouse/>
                    </button>
                </a>
            </div>
            
            <h2 className='homeHeading'>FeaturedProducts</h2>

            <div className='container' id='container'>
                {
                    products && products.map(product=>(
                        <ProductCard product={product}/>
                    ))
                }
            </div>

        </Fragment>}
        </Fragment>
    )
}

export default Home;