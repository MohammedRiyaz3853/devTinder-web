import { useEffect, useState } from "react"
import axios from "axios"
import { BASE_URL, DEFAULT_PHOTO } from "../utils/constants"
import { Link } from "react-router-dom"

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connection", { withCredentials: true });
      setConnections(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConnections(); }, []);

  if (loading) return <div className="flex justify-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>

  return (
    <div className="max-w-[720px] mx-auto p-6">
      <h1 className="text-[22px] font-semibold tracking-tight mb-6 text-base-content">Connections • {connections.length}</h1>

      {connections.length === 0 ? (
        <div className="bg-base-100 border border-base-300 rounded-[16px] p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-3 text-xl">🤝</div>
          <p className="font-medium text-base-content">No connections yet</p>
          <p className="text-sm text-base-content/60 mt-1">Accept requests or get accepted to see your dev partners here</p>
          <Link to="/" className="inline-block mt-4 px-5 py-2.5 rounded-full bg-neutral text-neutral-content text-sm">Explore Feed</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connections.map(user => (
            <div key={user._id} className="bg-base-100 border border-base-300 rounded-[20px] p-4 flex gap-4 hover:shadow-lg transition">
              <img src={user.photoUrl || DEFAULT_PHOTO} className="w-16 h-16 rounded-full object-cover shrink-0" alt="" />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-[15px] text-base-content">{user.firstName} {user.lastName}</h3>
                <p className="text-xs text-base-content/60 mt-1 line-clamp-2">{user.about || "Let's build together"}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {user.skills?.slice(0,3).map(s => (
                    <span key={s} className="text-[10px] px-2 py-1 rounded-full bg-base-200 border border-base-300 text-base-content/70">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Connections
