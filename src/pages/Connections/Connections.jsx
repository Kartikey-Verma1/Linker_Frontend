import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConnectionData } from "../../utils/fetchData";
import { useNavigate } from "react-router-dom";
import { addConnections } from "../../utils/connectionsSlice";

const Connections = () => {
    const connections = useSelector((store)=>store.connections);
    const dispatch = useDispatch();
    const [connectionList, setConnectionList] = useState([]);
    
    const navigate = useNavigate();
    useEffect(()=>{
        if(!connections){
            (async function (){
                try{
                    const fetchedData = await fetchConnectionData();
                    dispatch(addConnections(fetchedData));
                    setConnectionList(fetchedData);
                } catch (err){
                    const {status, statusText, data} = err?.response
                    if(status === 401) return navigate("/login");
                    else return navigate("/*", {state: {status, statusText, data}});
                }
            })();
        }
        else {
            setConnectionList(connections);
        }
    }, [connections]);

    return (
        <div className="drawer-side backdrop-blur-xs">
            <label className="drawer-overlay"
                htmlFor="my_drawer" 
                aria-label="close sidebar">
            </label>
            <div className="menu bg-base-200 min-h-full w-90 p-4">
                <div className="text-right">
                    <label className="drawer-overlay cursor-pointer max-w-min px-2"
                        htmlFor="my_drawer" 
                        aria-label="close sidebar">Close ❯
                    </label>
                </div>
                <h2 className="text-center text-lg font-bold pb-2 border-b border-gray-500/70">Connections</h2>
                <ul className="mt-1">
                    {connectionList.length != 0 ?
                        connectionList.map((element)=>{
                            const {_id, photourl, firstName, lastName} = element;
                            return (
                            <label className="drawer-overlay" 
                            htmlFor="my_drawer"
                            aria-label="close sidebar"
                            key={_id}>
                                <li 
                                onClick={()=>{navigate(`/requested/profile/view/${_id}`)}}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 rounded-full overflow-hidden max-h-fit">
                                                <img
                                                    alt="user photo"
                                                    src={photourl} />
                                            </div>
                                            <p className="max-h-fit">{`${firstName} ${lastName}`}</p>
                                        </div>
                                        <button className="cursor-pointer">❯</button>
                                    </div>
                                </li>
                            </label>)
                        }) :
                        <div className="min-h-full min-w-full text-center">
                            <p>No connection found!☹️</p>
                        </div>
                    }
                </ul>
            </div>
        </div>
    )
}

export default Connections