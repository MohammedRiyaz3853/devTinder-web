import { useDispatch, useSelector } from 'react-redux'
import { addFeed, removeUserFromFeed } from '../utils/feedSlice'
import { BASE_URL } from '../utils/constants'
import axios from 'axios'
import { useEffect, useState, useMemo } from 'react'
import UserCard from './UserCard'
import { DEFAULT_PHOTO } from '../utils/constants'




const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const user = useSelector((store) => store.user);
  const [interestFilter, setInterestFilter] = useState(() => {
    const saved = localStorage.getItem("devTinder_interests");
    return saved ? JSON.parse(saved) : [];
  });

  const getFeed = async () => {
    try {
      const res = await axios.get(BASE_URL + "/feed", { withCredentials: true });
      dispatch(addFeed(res.data.data || []));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) getFeed();
  }, [user]);

  // Listen for interest changes from NavBar (via localStorage event + custom event)
  useEffect(() => {
    const handler = () => {
      const saved = localStorage.getItem("devTinder_interests");
      setInterestFilter(saved ? JSON.parse(saved) : []);
    };
    window.addEventListener("devTinder_interests_changed", handler);
    window.addEventListener("storage", handler);
    // Poll localStorage every 1s for same-tab updates
    const interval = setInterval(handler, 500);
    return () => {
      window.removeEventListener("devTinder_interests_changed", handler);
      window.removeEventListener("storage", handler);
      clearInterval(interval);
    }
  }, []);

  // Sort feed by matching interests
  const sortedFeed = useMemo(() => {
    if (!feed) return null;
    if (interestFilter.length === 0) return feed;

    return [...feed].sort((a, b) => {
      const aSkills = (a.skills || []).map(s => s.toLowerCase());
      const bSkills = (b.skills || []).map(s => s.toLowerCase());
      const aMatch = interestFilter.filter(f => aSkills.some(s => s.includes(f.toLowerCase()) || f.toLowerCase().includes(s))).length;
      const bMatch = interestFilter.filter(f => bSkills.some(s => s.includes(f.toLowerCase()) || f.toLowerCase().includes(s))).length;
      return bMatch - aMatch; // higher matches first
    });
  }, [feed, interestFilter]);

  const handleSwipe = async (status, swipeUser) => {
    const userId = swipeUser._id;
    try {
      await axios.post(`${BASE_URL}/request/sendConnectionRequest/${status}/${userId}`, {}, { withCredentials: true });
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error(err.response?.data);
    }
  };

  if (feed === null) return <div className="flex justify-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>

  if (!sortedFeed || sortedFeed.length === 0) {
    return (
      <div className="flex flex-col items-center mt-20 gap-4">
        <h1 className="text-2xl font-bold opacity-60">No new users found! 🥲</h1>
        {interestFilter.length > 0 && <p className="text-sm text-base-content/60">Try clearing filters to see more devs</p>}
      </div>
    )
  }

  const currentUser = sortedFeed[0];
  const safeUser = {
   ...currentUser,
    photoUrl: currentUser?.photoUrl && !currentUser?.photoUrl.includes('ongcvidesh.com')
     ? currentUser?.photoUrl
      : DEFAULT_PHOTO
  };

  const matchCount = interestFilter.length > 0 ? 
    interestFilter.filter(f => (safeUser.skills || []).map(s => s.toLowerCase()).some(s => s.includes(f.toLowerCase()))).length : 0;

  return (
    <div className="flex flex-col items-center mt-6">
      {interestFilter.length > 0 && (
        <div className="mb-4 flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-base-100 border border-base-300">🎯 Filtering: {interestFilter.join(", ")}</span>
          {matchCount > 0 && <span className="px-3 py-1 rounded-full bg-green-500 text-white">✓ {matchCount} match{matchCount>1?"es":""} on this profile</span>}
        </div>
      )}
      <UserCard key={safeUser._id} user={safeUser} onSwipe={handleSwipe} />
      <p className="text-[11px] text-base-content/40 mt-4">{sortedFeed.length} devs in queue {interestFilter.length>0 ? "• sorted by your interests" : ""}</p>
    </div>
  )
}
export default Feed
