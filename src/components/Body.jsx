import { Outlet, useNavigate } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from '../utils/userSlice'
import { useEffect } from 'react'
import axios from 'axios'
const Body = () => {
  

  const dispatch = useDispatch();
  const userData = useSelector(store => store.user)
  const navigate = useNavigate();

  
  const fetchUser = async ()=>{
    if(userData) return;
    try{
      const res = await axios.get(BASE_URL + "/profile/view",
      {withCredentials : true});
      dispatch(addUser(res.data))
      
    }
    catch(err){
      if(err.status === 401){
        navigate("/login");
      }

      console.error(err);
    }
    
  }
  useEffect(() => {fetchUser()},[])
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Body