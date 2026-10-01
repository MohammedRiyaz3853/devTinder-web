import { useDispatch, useSelector } from 'react-redux'
import { addFeed, removeUserFromFeed } from '../utils/feedSlice'
import { BASE_URL } from '../utils/constants'
import axios from 'axios'
import { useEffect } from 'react'
import UserCard from './UserCard'

const DEFAULT_PHOTO = "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  const getFeed = async () => {
    try {
      const res = await axios.get(BASE_URL + "/feed", { withCredentials: true });
      dispatch(addFeed(res.data.data || []));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getFeed(); // always fetch on mount
  }, []);

  const handleSwipe = async (status, user) => {
    const userId = user._id;
    try {
      await axios.post(`${BASE_URL}/request/sendConnectionRequest/${status}/${userId}`, {}, { withCredentials: true });
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error(err.response?.data);
    }
  };

  if (feed === null) return <div className="flex justify-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>
  
  if (feed.length === 0) {
    return (
      <div className="flex flex-col items-center mt-20 gap-4">
        <h1 className="text-2xl font-bold opacity-60">No new users found! 🥲</h1>
        <button className="btn btn-primary" onClick={getFeed}>Refresh Feed</button>
      </div>
    )
  }

  
  const safeUser = {
    ...feed[0],
    photoUrl: feed[0]?.photoUrl || DEFAULT_PHOTO
  };

  return (
    <div className="flex justify-center">
      <UserCard key={safeUser._id} user={safeUser} onSwipe={handleSwipe} />
    </div>
  )
}
export default Feed