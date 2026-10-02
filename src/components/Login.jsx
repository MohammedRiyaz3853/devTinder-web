import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { addUser } from '../utils/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

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

const Login = () => {
  const [showPass, setShowPass] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [activeQuote, setActiveQuote] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveQuote((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault() // stop page reload
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { 
          emailId: email,
          password: password 
        },
        { withCredentials: true }
      )
      dispatch(addUser(res.data));
      return navigate("/"); 
    } catch (err) {
      setError(`Login failed: ${err.response?.data || err.message}`)
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-[#fafafa] dark:bg-[#0a0a0a]">
      {/* LEFT - Same as Signup */}
      <div className="hidden lg:flex w-[55%] bg-[#111] text-white relative overflow-hidden flex-col justify-between p-12">
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

      {/* RIGHT - Login Form - LOGIC SAME */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-white dark:bg-[#0a0a0a]">
        <div className="w-full max-w-[380px]">
          <div className="lg:hidden flex items-center gap-2 text-xl font-bold mb-8">
            <div className="w-8 h-8 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-mono">{"</>"}</div>
            devTinder
          </div>

          <h2 className="text-[26px] font-semibold tracking-[-0.02em] text-[#111] dark:text-white">Welcome back</h2>
          <p className="text-sm text-[#666] dark:text-white/50 mt-2">Login to continue building with your dev partners.</p>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            
            <div>
              <label className="text-xs font-medium text-[#333] dark:text-white/70">Work email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com" 
                className="mt-1.5 w-full px-3 py-2.5 rounded-lg border border-[#e5e5e5] dark:border-white/10 bg-white dark:bg-white/[0.04] text-sm focus:outline-none focus:border-black dark:focus:border-white/30 focus:ring-1 focus:ring-black dark:focus:ring-white/20 transition"
                required 
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-[#333] dark:text-white/70">Password</label>
                <Link to="#" className="text-[11px] text-[#888] hover:text-black dark:hover:text-white underline underline-offset-2">Forgot?</Link>
              </div>
              <div className="relative mt-1.5">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 pr-10 rounded-lg border border-[#e5e5e5] dark:border-white/10 bg-white dark:bg-white/[0.04] text-sm focus:outline-none focus:border-black dark:focus:border-white/30 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-2.5 text-[#888] hover:text-black dark:hover:text-white text-xs font-medium"
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && <p className='text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2'>{error}</p>}

            <button type="submit" className="w-full mt-2 py-2.5 rounded-lg bg-[#111] dark:bg-white text-white dark:text-black text-sm font-medium hover:bg-black dark:hover:bg-white/90 transition">
              Login
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="h-px flex-1 bg-[#e5e5e5] dark:bg-white/10"></div>
              <span className="text-[11px] text-[#999] uppercase tracking-widest">or</span>
              <div className="h-px flex-1 bg-[#e5e5e5] dark:bg-white/10"></div>
            </div>

            <button type="button" className="w-full py-2.5 rounded-lg border border-[#e5e5e5] dark:border-white/10 text-sm font-medium hover:bg-[#fafafa] dark:hover:bg-white/[0.04] transition">
              Continue with Google
            </button>

            <p className="text-center text-xs text-[#888] mt-6">
              New to devTinder? <Link to="/signup" className="text-[#111] dark:text-white font-medium underline underline-offset-4">Create Account</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
