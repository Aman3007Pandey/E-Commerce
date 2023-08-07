import React,{useEffect,Fragment} from 'react';
import { Link } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import Loader from '../layout/Loader/Loader';
import "./Profile.css";
import MetaData from '../layout/MetaData';


const Profile = ({history}) => {
    
    const {loading,isAuthenticated,user}=useSelector(state=>state.user);

    useEffect(()=>{

        if(!isAuthenticated)
        {
            history.push("/login");
        }
    },[isAuthenticated,history]);

    return (
        <Fragment>
            {loading?<Loader/>:
            <Fragment>
            <MetaData title={`${user.name} Profile`}/>
            <div className='profileContainer'>
            <div>
              <h1>My Profile</h1>
              <img src={user.avatar.url} alt={user.name} />
              <Link to="/me/update">Edit Profile</Link>
            </div>
            <div>
                 <div>
                <h4>Full Name</h4>
                <p>{user.name}</p>
              </div>
              <div>
                <h4>Email</h4>
                <p>{user.email}</p>
              </div>
              <div>
                <h4>Joined On</h4>
                <p>{String(user.createdAt).substr(0, 10)}</p>
              </div>

              <div>
                <Link to="/orders">My Orders</Link>
                <Link to="/password/update">Change Password</Link>
              </div>

            </div>
            </div>
            </Fragment>}
        </Fragment>
    );
};

export default Profile;
