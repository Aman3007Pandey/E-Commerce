import React, { Fragment, useEffect } from 'react';
import {DataGrid} from "@material-ui/data-grid";
import "./MyOrders.css";
import { useSelector,useDispatch } from 'react-redux';
import { myOrders,clearErrors } from '../../actions/orderActions';

import Loader from '../layout/Loader/Loader';
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import MetaData from '../layout/MetaData';
import { Launch } from '@material-ui/icons';
import { useAlert } from 'react-alert';

const MyOrders = () => {
    
    const dispatch=useDispatch();
    const alert=useAlert();

    const {loading,error,orders}=useSelector(state=>state.myOrders);

    const {user}=useSelector(state=>state.user);

    
    const columns=[
        {field:"id",headerName:"Order ID" ,minWidth:300 ,flex:1},
        {field:"status",headerName:"Status" ,minWidth:150 ,flex:0.5,
        cellClassName:(params)=>{
            return params.getValue(params.id,"statu")==="Delivered"?"greenColor":"redColor";
        }},
        {field:"itemsQty",headerName:"items Qty" ,minWidth:150 ,flex:0.3,type:"number"},
        {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 240,
      flex: 0.5,
    },
      {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/order/${params.getValue(params.id, "id")}`}>
            <Launch />
          </Link>
        );
      },
    },
    ]
    
    const rows=[];
    

    orders &&
    orders.forEach((item, index) => {
      rows.push({
        itemsQty: item.orderItems.length,
        id: item._id,
        status: item.orderStatus,
        amount: item.totalPrice,
      });
    });

    


    useEffect(()=>{
       if(error)
       {
        alert.show('Something went wrong')

        dispatch(clearErrors());
       }

       dispatch(myOrders());
    },[dispatch,alert,error]);
    
    return (
        <Fragment>
            <MetaData title={`${user.name} Orders`}/>

            {loading?(<Loader/>):(
                <div className='myOrdersPage'>
                    <DataGrid

                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    disableSelectionOnClick

                    className='myOrdersTable'
                    autoHeight/>

                    <Typography id='myOrdersheading'>{user.name} 's Orders</Typography>
                </div>
            )}
        </Fragment>
    );
};

export default MyOrders;