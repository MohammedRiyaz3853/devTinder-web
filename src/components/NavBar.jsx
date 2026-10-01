import { useSelector, useDispatch } from 'react-redux'
import { BASE_URL,DEFAULT_PHOTO } from "../utils/constants"
import axios from 'axios'
import { removeUser } from '../utils/userSlice'
import { useNavigate, Link } from 'react-router-dom'

const NavBar = () => {
  const user = useSelector(store => store.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      return navigate("/login")
    }
    catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="flex-1">
        <Link to={user ? "/" : "/login"} className="btn btn-ghost text-3xl">
          🧑🏻💻devTinder
        </Link>
      </div>
      <div className="flex gap-2">
        {user && (
          <div className="dropdown dropdown-end mx-5 flex items-center gap-3">
            <p className="font-semibold hidden md:block">Hi, {user.firstName}</p>
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                    key={user.photoUrl}
                    alt="profile"
                    src={
                      user.photoUrl && !user.photoUrl.includes('ongcvidesh.com')
                        ? user.photoUrl
                        : DEFAULT_PHOTO
                    }
                    onError={(e) => {
                      e.target.src = DEFAULT_PHOTO;
                    }}
                  />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow top-14"
            >
              <li>
                <Link to="/profile/edit" className="justify-between">
                  Profile
                  <span className="badge badge-primary">New</span>
                </Link>
              </li>
              <li><a>Settings</a></li>
              <li><a onClick={handleLogout}>Logout</a></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default NavBar