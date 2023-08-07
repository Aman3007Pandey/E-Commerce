import React ,{Fragment,useEffect,useState}from 'react';
import {DataGrid} from "@material-ui/data-grid";
import './ProductList.css';
import {useSelector,useDispatch} from "react-redux";

import {getAllOrders,deleteOrder,clearErrors} from "../../actions/orderActions";
import {Link} from "react-router-dom";
import {useAlert} from "react-alert";
import { Button } from '@material-ui/core';
import MetaData from "../layout/MetaData";
import {Edit,Delete} from "@material-ui/icons";
import SideBar from "./Sidebar";
import {DELETE_ORDER_RESET} from "../../constants/orderConstants"

const OrderList = ({history}) => {
    
    const dispatch =useDispatch();
    const alert=useAlert();

    const {error,orders} =useSelector(state=>state.allOrders);

    const {error:deleteError,isDeleted}=useSelector(state=>state.order);
    
    const deleteOrderHandler=(id)=>{
        dispatch(deleteOrder(id));
    }
    useEffect(()=>{
             
        if(error)
        {
            alert.show('Error!');
            dispatch(clearErrors());
        }
        
        if(deleteError)
        {
            alert.show('Delete Error');
            dispatch(clearErrors());
        }

        if(isDeleted)
        {
            alert.show('Order Deleted Successfully');
            history.push("/admin/dashboard");
            dispatch({type:DELETE_ORDER_RESET});
        }
        dispatch(getAllOrders());

    },[history,dispatch,error,alert,isDeleted,deleteError]);
    

    const columns=[
        {field:"id",headerName:"Order ID",minWidth:200,flex:0.8},

    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.5,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 150,
      flex: 0.4,
    },

    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 270,
      flex: 0.5,
    },


    {
        field:"actions",
        flex:0.3,
        headerName:"Actions",
        minWidth:150,
        type:"number",
        sortable:false,
        renderCell:(params)=>{
            return (
                <Fragment>
                    <Link to={`/admin/order/${params.getValue(params.id,"id")}`}>
                        <Edit/>
                    </Link>
                    <Button onClick={()=>deleteOrderHandler(params.getValue(params.id,"id"))}>
                    <Delete/>
                </Button>
                </Fragment>
                
            )
        }
    }

    ];


    const rows=[];

    orders && orders.forEach((item)=>{
        rows.push({
            id:item._id,
            stock:item.Stock,
            price:item.price,
            name:item.name,
        })
    })

    return (
        <Fragment>
            <MetaData title={`ALL ORDERS - Admin`} />
           <div className="dashboard">
            <SideBar/>
            <div className='productListContainer'>
                <h1 id='productListHeading'>All Orders</h1>


                <DataGrid
                rows={rows}
                columns={columns}

                pageSize={10}

                disableSelectionOnClick

                className='productListTable'

                autoHeight/>
                
            </div>
           </div>

        </Fragment>
    );
};

export default OrderList;