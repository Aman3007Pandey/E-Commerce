import {combineReducers,createStore,applyMiddleware} from 'redux'
import thunk from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension";
import { newProductReducer, newReviewReducer, productDetailsReducer, productReducer, productsReducers } from './reducers/productReducers';
import { allUsersReducer, profileReducer, userDetailsReducer, userReducer } from './reducers/userReducers';
import { cartReducer } from './reducers/cartReducers';
import { MyOrdersReducer, allOrdersReducer, neworderReducer, orderDetailsReducer, orderReducer } from './reducers/orderReducers';

const reducer=combineReducers({
    products:productsReducers,
    productDetails:productDetailsReducer,
    user:userReducer,
    profile:profileReducer,
    cart:cartReducer,
    newOrder:neworderReducer,
    myOrders:MyOrdersReducer,
    orderDetails:orderDetailsReducer,
    newReview:newReviewReducer,
    newProduct:newProductReducer,
    product:productReducer,
    allOrders:allOrdersReducer,
    order:orderReducer,
    allUsers:allUsersReducer,
    userDetails:userDetailsReducer,

});

const initialState={

    cart:{
        cartItems:localStorage.getItem("cartItems")?JSON.parse(localStorage.getItem("cartItems")):[],

        shippingInfo:localStorage.getItem("shippingInfo")?JSON.parse(localStorage.getItem("shippingInfo")):[],
        
    },

    
};

const middleware=[thunk];

const store=createStore(reducer,initialState,composeWithDevTools(applyMiddleware(...middleware)));

export default store;


