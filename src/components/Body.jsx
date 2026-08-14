import { Outlet } from "react-router-dom"
import NavBar from "./NavBar"
import Footer from "./Footer"
import Requests from "../pages/Requests/Requests"
import Connections from "../pages/Connections/Connections"
import { useEffect, useState } from "react"

const Body = () => {
    const [drawerType, setDrawerType] = useState("");
    useEffect(()=>{
        const handleBack = (e)=>{
            const checkbox = document.getElementById("my_drawer");
            if(checkbox.checked) checkbox.checked = false;
        }
        window.addEventListener("popstate", handleBack);
        return ()=>{window.removeEventListener("popstate", handleBack)};
    },[]);
    return (
        <div className="drawer drawer-end">
            <input  className="drawer-toggle"
                id="my_drawer" 
                type="checkbox"/>
            <div className="min-h-screen flex flex-col drawer-content">
                <NavBar setDrawerType={setDrawerType}/>
                <div className="flex-1 relative">
                    <Outlet />
                </div>
                <Footer />
            </div>
            {drawerType === "requests" && <Request/>}
            {drawerType === "connections" && <Connections/>}
        </div>
    )
}

export default Body