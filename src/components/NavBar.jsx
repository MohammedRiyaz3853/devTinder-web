import { useSelector, useDispatch } from 'react-redux'
import { BASE_URL, DEFAULT_PHOTO } from "../utils/constants"
import axios from 'axios'
import { removeUser } from '../utils/userSlice'
import { useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ThemeToggle from "./ThemeToggle"
import InterestFilter from "./InterestFilter"

const NavBar = () => {
  const user = useSelector(store => store.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [requestCount, setRequestCount] = useState(0);

  const fetchRequestCount = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", { withCredentials: true });
      setRequestCount(res.data.connectionRequests?.length || 0);
    } catch (err) {}
  };

  useEffect(() => {
    if (user) fetchRequestCount();
    const interval = setInterval(() => { if (user) fetchRequestCount(); }, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // Notify Feed when interests change
  const handleInterestChange = (selected) => {
    window.dispatchEvent(new Event("devTinder_interests_changed"));
  };

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      return navigate("/login")
    } catch (err) { console.error(err); }
  }

  return (
    <div className="navbar bg-base-100 border-b border-base-300 px-6 sticky top-0 z-40 backdrop-blur">
      <div className="flex-1">
        <Link to="/" className="text-xl font-bold tracking-tight flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-neutral text-neutral-content flex items-center justify-center text-[12px] font-mono">{"</>"}</div>
          <span className="text-base-content">devTinder</span>
        </Link>
      </div>

      <div className="flex gap-2 items-center">
        {user ? (
          <>
            {/* NEW: Interest filter button - replaces Feed/Requests/Connections */}
            <InterestFilter onFilterChange={handleInterestChange} />

            <ThemeToggle />

            <div className="dropdown dropdown-end ml-1">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar relative">
                <div className="w-9 h-9 rounded-full ring-1 ring-base-300 overflow-hidden">
                  <img alt="profile" src={user.photoUrl || DEFAULT_PHOTO} onError={(e)=>e.target.src=DEFAULT_PHOTO} />
                </div>
                {requestCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {requestCount > 9 ? "9+" : requestCount}
                  </span>
                )}
              </div>

              <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 border border-base-300 rounded-2xl mt-3 w-64 p-2 shadow-xl z-50">
                <li className="menu-title px-4 py-2">
                  <span className="text-sm">Hi, {user.firstName} 👋</span>
                  <span className="text-[11px] text-base-content/60 truncate">{user.emailId}</span>
                </li>
                <div className="divider my-1"></div>

                {/* Requests with badge */}
                <li>
                  <Link to="/requests" className="rounded-full justify-between py-2.5">
                    <span className="flex items-center gap-2">📩 Requests</span>
                    {requestCount > 0 && <span className="badge badge-error badge-sm text-white animate-pulse">{requestCount}</span>}
                  </Link>
                </li>

                {/* Connections moved from navbar to dropdown */}
                <li><Link to="/connections" className="rounded-full py-2.5">🤝 Connections</Link></li>
                <li><Link to="/profile/edit" className="rounded-full py-2.5">👤 Edit Profile</Link></li>
                
                <div className="divider my-1"></div>
                <li><a onClick={handleLogout} className="rounded-full py-2.5 text-error">🚪 Logout</a></li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <ThemeToggle />
            <Link to="/login" className="btn btn-ghost btn-sm rounded-full">Login</Link>
            <Link to="/signup" className="btn btn-sm btn-neutral rounded-full">Sign up</Link>
          </>
        )}
      </div>
    </div>
  )
}
export default NavBar
