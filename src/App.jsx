import { BrowserRouter,Routes,Route } from "react-router-dom"
import Login from "./components/Login"
import Body from "./components/Body"
import Profile from "./components/Profile"
import { Provider } from "react-redux"
import appStore from "./utils/appStore"
import Feed from "./components/Feed"
import EditProfile from "./components/EditProfile"

function App() {
  

  return (
    <>
    <Provider store = {appStore} >
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = {<Body />}>
            <Route path = "/" element = {<Feed />} />
            <Route path = "/login" element = {<Login />} />
            <Route path="/profile/edit" element={<EditProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </Provider>
    </>
  )
}

export default App
