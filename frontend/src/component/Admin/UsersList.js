import React ,{Fragment,useEffect,useState}from 'react';
import {DataGrid} from "@material-ui/data-grid";
import './ProductList.css';
import {useSelector,useDispatch} from "react-redux";

import {getAllUsers,clearErrors,deleteUser } from "../../actions/userAction";
import {Link} from "react-router-dom";
import {useAlert} from "react-alert";
import { Button } from '@material-ui/core';
import MetaData from "../layout/MetaData";
import {Edit,Delete} from "@material-ui/icons";
import SideBar from "./Sidebar";
import { DELETE_USER_RESET } from '../../constants/userConstansts';

const UsersList = ({history}) => {
    
    const dispatch =useDispatch();
    const alert=useAlert();

    const {error,users} =useSelector(state=>state.allUsers);

    const {error:deleteError,isDeleted,message}=useSelector(state=>state.profile);
    
    const deleteUserHandler=(id)=>{
        dispatch(deleteUser(id));
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
            alert.show('User Deleted Successfully');
            history.push("/admin/dashboard");
            dispatch({type:DELETE_USER_RESET});
        }
        dispatch(getAllUsers());

    },[history,dispatch,error,alert,isDeleted,deleteError,message]);
    

    const columns=[
        {field:"id",headerName:"User ID",minWidth:200,flex:0.5},

        {
      field: "email",
      headerName: "Email",
      minWidth: 330,
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 0.5,
    },

    {
      field: "role",
      headerName: "Role",
      type: "number",
      minWidth: 150,
      flex: 0.3,
      cellClassName:(params)=>{
        return params.getValue(params.id,"role")==="admin"?"greenColor":"redColor";
      }
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
                    <Link to={`/admin/user/${params.getValue(params.id,"id")}`}>
                        <Edit/>
                    </Link>
                    <Button onClick={()=>deleteUserHandler(params.getValue(params.id,"id"))}>
                    <Delete/>
                </Button>
                </Fragment>
                
            )
        }
    }

    ];


    const rows=[];

    users && users.forEach((item)=>{
        rows.push({
            id:item._id,
            stock:item.Stock,
            price:item.price,
            name:item.name,
        })
    })

    return (
        <Fragment>
            <MetaData title={`ALL USERS - Admin`} />
           <div className="dashboard">
            <SideBar/>
            <div className='productListContainer'>
                <h1 id='productListHeading'>All USERS</h1>


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

export default UsersList;