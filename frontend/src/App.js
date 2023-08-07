import "./App.css";
import Header from "./component/layout/Header/Header.js"
import Footer from "./component/layout/Footer/Footer.js"
import React ,{useState,useEffect}from 'react';
import {BrowserRouter as Router, Route,Switch} from 'react-router-dom'
import Webfont from 'webfontloader';
import Home from "./component/Home/Home.js";
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Product/Products.js"
import ProductsQuery from "./component/Product/ProductsQuery.js"
import Search from "./component/Product/Search.js";
import LoginSignUp from "./component/User/LoginSignUp";
import store from "./store.js";
import { loadUser } from "./actions/userAction";
import UserOptions from "./component/layout/Header/UserOptions.js";
import { useSelector } from "react-redux";
import Profile from "./component/User/Profile.js"
import ProtectedRoute from "./component/Route/ProtectedRoute.js";
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import Cart from "./component/Cart/Cart.js"
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import Payment from "./component/Cart/Payment.js";
import OrderSuccess from "./component/Cart/OrderSuccess.js";
import OrderDetails from "./component/Order/OrderDetails.js";

import MyOrders from "./component/Order/MyOrders.js";

import axios from "axios";
import {Elements} from '@stripe/react-stripe-js'
import {loadStripe} from "@stripe/stripe-js";
import ProductList from "./component/Admin/ProductList.js";
import DashboardNew from "./component/Admin/DashboardNew.js";
import NewProduct from "./component/Admin/NewProduct.js";
import UpdateProduct from "./component/Admin/UpdateProduct.js";
import OrderList from "./component/Admin/OrderList";
import ProcessOrder from "./component/Admin/ProcessOrder";
import UsersList from "./component/Admin/UsersList";
import UpdateUser from "./component/Admin/UpdateUser";
const App = () => {
  const {isAuthenticated,user} =useSelector(state=>state.user)
  
  const [stripeApiKey,setStripeApiKey]=useState("");

  async function getStripeApiKey(){

    const {data}=await axios.get('/api/v1/stripeapikey');
    setStripeApiKey(data.stripeApiKey);
  }


  useEffect(()=>{
Webfont.load({
  google:{families:['roboto',"Droid sans","chilanka"]}
})

store.dispatch(loadUser());
getStripeApiKey();
},[])
   
  return (
    <Router>
      <Header/>
      {isAuthenticated && <UserOptions user={user}/>}
      <Route exact path="/" component={Home}/>
      <Route exact path="/product/:id" component={ProductDetails}/>
      <Route exact path="/products" component={Products}/>
      <Route path="/products/:keyword" component={ProductsQuery}/>
      <Route exact path="/search" component={Search}/>
      <Route exact path="/login" component={LoginSignUp}/>
      <ProtectedRoute exact path="/account" component={Profile}/>
      <ProtectedRoute exact path="/me/update" component={UpdateProfile}/>
      <ProtectedRoute exact path="/password/update" component={UpdatePassword}/>
      <Route exact path="/cart" component={Cart}/>
      <ProtectedRoute exact path="/shipping" component={Shipping}/>
      
      {
         stripeApiKey && (
          <Elements stripe={loadStripe(stripeApiKey)}><ProtectedRoute exact path="/process/payment" component={Payment}/>
</Elements>
         )
      }
      <ProtectedRoute exact path="/success" component={OrderSuccess}/>

      <Switch>
      <ProtectedRoute exact path="/order/me" component={MyOrders}/>
      <ProtectedRoute exact path="/order/confirm" component={ConfirmOrder}/>
      <ProtectedRoute exact path="/order/:id" component={OrderDetails}/>
      </Switch>
      
      
      <Switch>
      <ProtectedRoute isAdmin={true} exact path="/admin/dashboard" component={DashboardNew}/>
      <ProtectedRoute isAdmin={true} exact path="/admin/products" component={ProductList}/>
      <ProtectedRoute isAdmin={true} exact path="/admin/product" component={NewProduct}/>
      <ProtectedRoute isAdmin={true} exact path="/admin/product/:id" component={UpdateProduct}/>
      <ProtectedRoute isAdmin={true} exact path="/admin/orders" component={OrderList}/>
      <ProtectedRoute isAdmin={true} exact path="/admin/order/:id" component={ProcessOrder}/>
      <ProtectedRoute isAdmin={true} exact path="/admin/users" component={UsersList}/>
      <ProtectedRoute isAdmin={true} exact path="/admin/user/:id" component={UpdateUser}/>
      </Switch>
      <Footer/>
    </Router>
  );
};

export default App;
