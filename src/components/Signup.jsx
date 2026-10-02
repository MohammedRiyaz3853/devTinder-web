import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

const quotes = [
  {
    text: "The best code is written with someone who challenges you to be better.",
    author: "Sarah Drasner",
    role: "VP of Developer Experience at Netlify"
  },
  {
    text: "Find your coding partner. Build 10x faster together than you ever could alone.",
    author: "Guillermo Rauch",
    role: "CEO of Vercel"
  },
  {
    text: "Great developers aren't born, they're found through great collaborations.",
    author: "Kent C. Dodds",
    role: "Software Engineer & Educator"
  }
];

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [activeQuote, setActiveQuote] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveQuote((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSignup = async () => {
    try {
      setLoading(true);
      setError("");
  
      const url =  BASE_URL + "/signup";
      const res = await axios.post(
        url,
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      navigate("/profile/edit");
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#fafafa] dark:bg-[#0a0a0a]">
      {/* LEFT - Insightful Quotes */}
      <div className="hidden lg:flex w-[55%] bg-[#111] text-white relative overflow-hidden flex-col justify-between p-12">
        {/* subtle grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`, backgroundSize: '40px 40px'}}></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-mono">{"</>"}</div>
            devTinder
          </div>
        </div>

        <div className="relative z-10 max-w-[520px]">
          <div className="mb-8">
            <p className="text-[13px] uppercase tracking-[0.2em] text-white/40 mb-6">For developers, by developers</p>
            <div className="h-[220px]">
              {quotes.map((q, i) => (
                <div key={i} className={`absolute transition-all duration-700 ${i === activeQuote ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}`}>
                  <h1 className="text-[32px] leading-[1.15] font-[550] tracking-[-0.02em]">“{q.text}”</h1>
                  <div className="mt-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-sm">{q.author[0]}</div>
                    <div>
                      <p className="text-sm font-medium">{q.author}</p>
                      <p className="text-xs text-white/50">{q.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            {quotes.map((_, i) => (
              <button key={i} onClick={() => setActiveQuote(i)} className={`h-1 rounded-full transition-all ${i === activeQuote ? "w-8 bg-white" : "w-4 bg-white/20"}`} />
            ))}
          </div>

          <div className="mt-16 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
            <div><p className="text-2xl font-semibold">12k+</p><p className="text-xs text-white/50 mt-1">Developers joined</p></div>
            <div><p className="text-2xl font-semibold">4.8/5</p><p className="text-xs text-white/50 mt-1">Average rating</p></div>
            <div><p className="text-2xl font-semibold">86%</p><p className="text-xs text-white/50 mt-1">Find partners in 7 days</p></div>
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-white/30">
          © 2026 devTinder — Built for the builders
        </div>
      </div>

      {/* RIGHT - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white dark:bg-[#0a0a0a]">
        <div className="w-full max-w-[380px]">
          <div className="lg:hidden flex items-center gap-2 text-xl font-bold mb-8">
            <div className="w-8 h-8 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-mono">{"</>"}</div>
            devTinder
          </div>

          <h2 className="text-[26px] font-semibold tracking-[-0.02em] text-[#111] dark:text-white">Create an account</h2>
          <p className="text-sm text-[#666] dark:text-white/50 mt-2">Start finding your pair programming partner today.</p>

          <div className="mt-8 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#333] dark:text-white/70">First name</label>
                <input value={firstName} onChange={(e)=>setFirstName(e.target.value)} placeholder="First Name" className="mt-1.5 w-full px-3 py-2.5 rounded-lg border border-[#e5e5e5] dark:border-white/10 bg-white dark:bg-white/[0.04] text-sm focus:outline-none focus:border-black dark:focus:border-white/30 focus:ring-1 focus:ring-black dark:focus:ring-white/20 transition" />
              </div>
              <div>
                <label className="text-xs font-medium text-[#333] dark:text-white/70">Last name</label>
                <input value={lastName} onChange={(e)=>setLastName(e.target.value)} placeholder="Last Name" className="mt-1.5 w-full px-3 py-2.5 rounded-lg border border-[#e5e5e5] dark:border-white/10 bg-white dark:bg-white/[0.04] text-sm focus:outline-none focus:border-black dark:focus:border-white/30 transition" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[#333] dark:text-white/70">Work email</label>
              <input value={emailId} onChange={(e)=>setEmailId(e.target.value)} placeholder="you@company.com" className="mt-1.5 w-full px-3 py-2.5 rounded-lg border border-[#e5e5e5] dark:border-white/10 bg-white dark:bg-white/[0.04] text-sm focus:outline-none focus:border-black dark:focus:border-white/30 transition" />
            </div>

            <div>
                <label className="text-xs font-medium text-[#333] dark:text-white/70">Password</label>
                <div className="relative mt-1.5">
                    <input
                    type={showPass? "text" : "password"}
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full px-3 py-2.5 pr-10 rounded-lg border border-[#e5e5e5] dark:border-white/10 bg-white dark:bg-white/[0.04] text-sm focus:outline-none focus:border-black dark:focus:border-white/30 transition"
                    />
                    <button
                    type="button"
                    onClick={()=>setShowPass(!showPass)}
                    className="absolute right-3 top-2.5 text-[#888] hover:text-black dark:hover:text-white text-sm"
                    >
                    {showPass? "🙈" : "👁️"}
                    </button>
                </div>
                <p className="text-[11px] text-[#888] mt-1.5">Must contain at least 8 characters, 1 uppercase, 1 number.</p>
            </div>

            {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</div>}

            <button onClick={handleSignup} disabled={loading} className="w-full mt-2 py-2.5 rounded-lg bg-[#111] dark:bg-white text-white dark:text-black text-sm font-medium hover:bg-black dark:hover:bg-white/90 disabled:opacity-50 transition">
              {loading ? "Creating account..." : "Create account"}
            </button>

            <p className="text-center text-xs text-[#888] mt-4">
              Already have an account? <Link to="/login" className="text-[#111] dark:text-white font-medium underline underline-offset-4">Log in</Link>
            </p>

            <p className="text-[11px] text-[#999] text-center leading-relaxed mt-6">
              By creating an account, you agree to our <span className="underline">Terms</span> and <span className="underline">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
