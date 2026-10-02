import { BrowserRouter, Routes, Route } from "react-router-dom"
import Signup from "./components/Signup";
import Login from "./components/Login"
import Body from "./components/Body"
import Profile from "./components/Profile"
import { Provider } from "react-redux"
import appStore from "./utils/appStore"
import Feed from "./components/Feed"
import EditProfile from "./components/EditProfile"
import Requests from "./components/Requests"
import Connections from "./components/Connections"

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <Routes>
        
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          
          <Route path="/" element={<Body />}>
            <Route path="/" element={<Feed />} />
            
            
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/connections" element={<Connections />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}
export default App