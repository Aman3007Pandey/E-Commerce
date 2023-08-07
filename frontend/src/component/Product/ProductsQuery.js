import React ,{useEffect,Fragment,useState}from 'react';
import "./Products.css";
import {useDispatch,useSelector} from "react-redux";
import { clearErrors,getProduct } from '../../actions/productActions';
import Loader from "../layout/Loader/Loader.js";
import {useAlert} from 'react-alert'
import ProductCard from '../Home/ProductCard';
import Pagination from 'react-js-pagination';
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import Metadata from "../layout/MetaData.js";


const categories = [
  "Laptop",
  "Footwear",
  "Mobile",
  "Tops",
  "Biscuit",
  "Camera",
  "SmartPhones",
  "Speaker",
  "All"
];


const ProductsQuery = ({match}) => {

    const dispatch=useDispatch();
    const alert=useAlert();
    const [currentPage,setCurrentPage]=useState(1);
    const [price,setPrice]=useState([0,40000]);
    const [category,setCategory]=useState("");
    const [ratings,setRatings]=useState(0);


    const {error,loading,products,productsCount,resultPerPage,filteredProductsCount}=useSelector(state=>state.products);
    
    const setCurrentPageNo=(e)=>{
        setCurrentPage(e);
    }

    const priceHandler=(event,newPrice)=>{
         setPrice(newPrice);
    }

    const keyword=match.params.keyword;
    useEffect(()=>{
      if(error)
      {
         alert.error(error);
         dispatch(clearErrors());
      }

      dispatch(getProduct(keyword,currentPage,price,category,ratings));
    },[dispatch,alert,error,keyword,currentPage,price,category,ratings])

    let count=filteredProductsCount;

    return (
        <Fragment>
           {loading?<Loader/>:(
           <Fragment>
             <Metadata title={`PRODUCTS ECOMMERCE`}/>
            <h2 className='productsQueryHeading'>SIMILAR RESULTS</h2>
            <div className='products'>

                {products && products[0]?(<></>):(<p>Oops we cannot find anything similar :( </p>)}
                {products && products.map((product)=>(
                    <ProductCard key={product._id} product={product}/>
                ))}
            </div>

            <div className='filterBox'>
            <Typography>Price</Typography>
            <Slider value={price} onChange={priceHandler} valueLabelDisplay='auto' aria-labelledby='range-silider' min={0} max={40000}></Slider>
            <Typography>Categories</Typography>
            <ul className='categoryBox'>
                {categories.map((category)=>(
                    <li className='category-link'
                        key={category}
                        onClick={()=>setCategory(category)}
                    >
                    {category}
                    </li>
                ))}
            </ul>
            <fieldset>
              <Typography component="legend">Ratings Above</Typography>
              <Slider
                value={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>
            </div>

            {resultPerPage<=count && <div className='paginationBox'>
                <Pagination activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText="next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass='page-item'
                linkClass='page-link'
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"/>
            </div>}
            </Fragment>
            )}
        </Fragment>
    );
};

export default ProductsQuery;