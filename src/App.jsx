import { BrowserRouter, Route, Routes } from "react-router-dom"
import Body from "./components/Body"
import Login from "./pages/Login/Login"
import { Provider } from "react-redux"
import appStore from "./redux/appStore"
import Feed from "./pages/Feed/Feed"
import Profile from "./pages/Profile/Profile"
import Error from "./components/Error"
import Signup from "./pages/Signup/Signup"
import PasswordChange from "./pages/PasswordChange/PasswordChange"
import RequestedProfileView from "./pages/Profile/RequestedProfileView"

function App() {
  return (
    <>
        <Provider store={appStore}>
            <BrowserRouter>
            <Routes>
                <Route path="/" element={<Body />}>
                    <Route index element={<Feed />}/>
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/passwordchange" element={<PasswordChange />} />
                    <Route path="/requested/profile/view/:id" element={<RequestedProfileView />} />
                </ Route>
                <Route path="/*" element={<Error error={{status: 404, statusText: "Page Not Found"}}/>}/>
            </Routes>
            </BrowserRouter>
        </Provider>
    </>
  )
}

export default App
