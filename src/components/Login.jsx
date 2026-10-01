import React, { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

const Login = () => {
  const [showPass, setShowPass] = useState(false)
  const [email, setEmail] = useState("Virat@gmail.com")
  const [password, setPassword] = useState("Virat@123")
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault() // stop page reload
    try {
      const res = await axios.post(
        BASE_URL+ "/login",
        { 
          emailId: email,      // if your backend expects emailId, change to emailId: email
          password: password 
        },
        { withCredentials: true }
        
      )
      // console.log("Success:", res.data)
      dispatch(addUser(res.data));
      return navigate("/"); 
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message)
    }
  }

  return (
    <div className="flex justify-center items-center px-4 py-16">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl border border-base-200">
        <div className="card-body p-8">
          
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-3 text-primary-content text-xl">
              🔒
            </div>
            <h2 className="text-2xl font-bold">Welcome back</h2>
            <p className="text-sm opacity-60 mt-1">Login to your account</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            
            {/* Email */}
            <div className="w-full">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" 
                className="input input-bordered w-full" 
                required 
              />
            </div>

            {/* Password */}
            <div className="w-full">
              <div className="flex justify-between items-center">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <a className="label-text-alt link link-hover text-xs">Forgot?</a>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input input-bordered w-full pr-16"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs"
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full mt-2 " onClick = {handleLogin}>
              Login
            </button>

            <div className="divider text-xs opacity-50 my-1">OR</div>

            <button type="button" className="btn btn-outline w-full">
              Continue with Google
            </button>

            <p className="text-center text-sm mt-2">
              Don't have an account? <a className="link link-primary font-semibold">Sign up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login