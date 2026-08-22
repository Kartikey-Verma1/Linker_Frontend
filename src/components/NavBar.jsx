import { Link, useNavigate } from "react-router-dom";
import ThemeController from "./ThemeController";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../redux/userSlice";
import { removeAllRequests } from "../redux/requestsSlice";
import { clearConnection } from "../redux/connectionsSlice";
import { fetchLogout } from "../utils/fetchData";
import { clearFeed } from "../redux/feedSlice";

const NavBar = ({setDrawerType}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((store)=>store.user);
    const logout = async ()=>{
        try{
            dispatch(removeUser());
            dispatch(removeAllRequests());
            dispatch(clearConnection());
            dispatch(clearFeed());
            await fetchLogout();
            navigate("/login");
        } catch (err) {
            const {status, statusText, data} = err?.response
            return navigate("/*", {state: {status, statusText, data}});
        }
    }
    return (
        <div className="navbar bg-base-100 shadow-[0_0_10px_rgba(147,197,253,0.3)]">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl">Linker</Link>
            </div>
            <div className="flex mx-5 items-center justify-center gap-5">
                <ThemeController />
                {user ? 
                    <div className="flex items-center gap-2">
                        <div>{`Welcome, ${user.firstName}`}</div>
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="user photo"
                                        src={user.photourl} />
                                </div>
                            </div>
                            <ul
                                tabIndex="-1"
                                className="menu menu-sm dropdown-content bg-base-200 rounded-box z-1 mt-3 w-52 p-2 border border-gray-500">
                                <li>
                                <Link to="/profile" className="justify-between">
                                    Profile
                                </Link>
                                </li>
                                <li onClick={()=>{setDrawerType("connections")}}>
                                    <label htmlFor="my_drawer">Connections</label>
                                </li>
                                <li onClick={()=>{setDrawerType("requests")}}>
                                    <label htmlFor="my_drawer">Requests</label>
                                </li>
                                <li><div onClick={logout}>Logout</div></li>
                            </ul>
                        </div>
                    </div> : 
                    <div> 
                        <Link to="/login">Login</Link> or <Link to="/signup">Signup</Link>
                    </div>}
            </div>
        </div>
    )
}

export default NavBar;