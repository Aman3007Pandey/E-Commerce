import React,{Fragment, useState} from 'react';
import './Header.css';
import {SpeedDial,SpeedDialAction} from "@material-ui/lab";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import { useHistory } from 'react-router-dom';
import { useAlert } from 'react-alert';
import {useDispatch,useSelector} from 'react-redux'
import { logOut } from '../../../actions/userAction';
import zIndex from '@material-ui/core/styles/zIndex';
import Backdrop from "@material-ui/core/Backdrop";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

const UserOptions = ({user}) => {

    const [open,setOpen]=useState(false);
    const {cartItems}=useSelector(state=>state.cart);
    const alert=useAlert();
    const history=useHistory();
    const dispatch=useDispatch();
    
    
  const options = [
    { icon: <ListAltIcon />, name: "Orders", func: orders },
    { icon: <PersonIcon />, name: "Profile", func: account },
    { icon: <ShoppingCartIcon  style={{color:cartItems.length>0?"tomato":"unset"}}/>, name: `Cart (${cartItems.length})`, func: cart },
    { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
  ];

  
  if (user.role === "admin") {
    options.unshift({
      icon: <DashboardIcon />,
      name: "Dashboard",
      func: dashboard,
    });
  }
  
   function dashboard(){
    history.push('/admin/dashboard');
   }

   function orders() {
    history.push("/order/me");
  }
  function account() {
    history.push("/account");
  }
  function cart() {
    history.push("/cart");
  }

   function logoutUser() {
    alert.show("Logout Successfully");
    dispatch(logOut());
  }  

    return (
        <Fragment>
            <Backdrop open={open} style={{zIndex:"10"}}/> 
            <SpeedDial ariaLabel='SpeedDial tooltip example'
            onClose={()=>setOpen(false)}
            onOpen={()=>setOpen(true)}
            open={open}
            direction='down'
            className='speedDial'
            style={{zIndex:"11"}}
            icon={<img className='speedDialIcon' src={user.avatar.url?user.avatar.url:"/Profile.png"} alt='Profile'/>}
            >

            {options.map((item)=>(
                <SpeedDialAction key={item.name} icon={item.icon} tooltipTitle={item.name} onClick={item.func}
                tooltipOpen={window.innerWidth<=600}/>
            ))}    
            </SpeedDial>

        </Fragment>
    );
};

export default UserOptions;