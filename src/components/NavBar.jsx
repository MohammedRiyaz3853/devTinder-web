import { useSelector,useDispatch } from 'react-redux'
import {BASE_URL} from "../utils/constants"
import axios from 'axios'
import {removeUser } from '../utils/userSlice'
import { useNavigate } from 'react-router-dom'
const NavBar = () => {

  const user = useSelector(store => store.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async ()=>{
    try{
      await axios.post(BASE_URL + "/logout",{},{withCredentials : true});
    dispatch(removeUser());
    return navigate("/login")
    }
    catch(err){
      console.error(err);
    }
  }

  return (
    <div className="navbar bg-base-300 shadow-sm">
  <div className="flex-1">
    <a className="btn btn-ghost text-3xl">🧑🏻‍💻devTinder</a>
  </div>
  <div className="flex gap-2">
    {user && (<div className="dropdown dropdown-end mx-5">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full ">
          <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      <ul
        tabIndex={-1}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li><a>Settings</a></li>
        <li><a onClick={handleLogout}>Logout</a></li>
      </ul>
    </div>)}
  </div>
</div>
  )
}

export default NavBar