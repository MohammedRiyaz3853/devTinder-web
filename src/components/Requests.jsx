import { useEffect, useState } from "react"
import axios from "axios"
import { BASE_URL, DEFAULT_PHOTO } from "../utils/constants"

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", { withCredentials: true });
      setRequests(res.data.connectionRequests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reviewRequest = async (status, requestId) => {
    console.log("Sending review:", status, requestId); // Should be 24 chars like 672a1b2c...
    try {
        await axios.post(`${BASE_URL}/request/reviewConnectionRequest/${status}/${requestId}`, {}, { withCredentials: true });
        setRequests(prev => prev.filter(r => r._id !== requestId));
    } catch (err) {
        console.error("Review failed:", err.response?.data);
        alert(err.response?.data?.message || "Failed");
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  if (loading) return <div className="flex justify-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>

  return (
    <div className="max-w-[600px] mx-auto p-6">
      <h1 className="text-[22px] font-semibold tracking-tight mb-6 text-base-content">Requests • {requests.length}</h1>

      {requests.length === 0 ? (
        <div className="bg-base-100 border border-base-300 rounded-[16px] p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-3 text-xl">📭</div>
          <p className="font-medium text-base-content">No pending requests</p>
          <p className="text-sm text-base-content/60 mt-1">When someone is interested in you, they'll appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(req => {
            const user = req.fromUserId;
            return (
              <div key={req._id} className="bg-base-100 border border-base-300 rounded-[16px] p-4 flex items-center gap-4">
                <img src={user.photoUrl || DEFAULT_PHOTO} className="w-14 h-14 rounded-full object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-[15px] text-base-content">{user.firstName} {user.lastName}</h3>
                  <p className="text-xs text-base-content/60 line-clamp-1 mt-0.5">{user.about || "No bio"}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => reviewRequest("rejected", req._id)} className="px-4 py-2 rounded-full border border-base-300 text-sm hover:bg-base-200 text-base-content">Reject</button>
                  <button onClick={() => reviewRequest("accepted", req._id)} className="px-4 py-2 rounded-full bg-neutral text-neutral-content text-sm hover:bg-neutral/90">Accept</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Requests
