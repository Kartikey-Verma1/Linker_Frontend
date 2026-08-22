import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addRequests, removeRequest } from "../../redux/requestsSlice";
import { fetchReview, fetchConnectionData, fetchRequestData, fetchInterestData, fetchWithdraw } from "../../utils/fetchData";
import { useNavigate } from "react-router-dom";
import { addConnections, pushConnection } from "../../redux/connectionsSlice";
import { addInterests, removeInterest } from "../../redux/interestsSlice";
const Requests = () => {
    const [page, setPage] = useState(1);

    const item1ref = useRef(null);
    const item2ref = useRef(null);
    const carouselref = useRef(null);

    const navigate = useNavigate();
    const requests = useSelector((store)=>store.requests);
    const connections = useSelector((store)=>store.connections);
    const interests = useSelector((store)=>store.interests);
    const dispatch = useDispatch();

    const requestData = async ()=>{
        try{
            const requests = await fetchRequestData();
            dispatch(addRequests(requests));
        } catch (err){
            const {status, statusText, data} = err?.response
            if(status === 401) return navigate("/login");
            else return navigate("/*", {state: {status, statusText, data}});
        }
    }

    const interestData = async ()=>{
        try{
            const interests = await fetchInterestData();
            dispatch(addInterests(interests))
        } catch(err){
            const {status, statusText, data} = err?.response
            if(status === 401) return navigate("/login");
            else return navigate("/*", {state: {status, statusText, data}});
        }
    }
    
    useEffect(()=>{
        if(requests.length <= 0){
            requestData();
        }
        if(interests.length <= 0){
            interestData();
        }
    },[]);

    const handleReject = async (_id, elementId)=>{
        try{
            await fetchReview({status: "rejected", _id});
            dispatch(removeRequest({_id: elementId}));
        } catch (err) {
            console.log(err);
            const {status, statusText, data} = err?.response
            if(status === 401) return navigate("/login");
            else return navigate("/*", {state: {status, statusText, data}});
        }
    }
    const handleAccept = async (element)=>{
        try{
            const acceptedUser = element?.senderId;
            if(!acceptedUser) return;

            await fetchReview({status: "accepted",_id: element?.senderId?._id});

            dispatch(removeRequest({_id: element?._id}));

            if(connections === null){
                try{
                    const fetchedConnections = await fetchConnectionData();
                    dispatch(addConnections(fetchedConnections));
                } catch (err){
                    const {status, statusText, data} = err?.response
                    if(status === 401) return navigate("/login");
                    else return navigate("/*", {state: {status, statusText, data}});
                }
            } else {
                console.log(acceptedUser);
                dispatch(pushConnection(acceptedUser));
            }
        } catch (err) {
            const {status, statusText, data} = err?.response
            if(status === 401) return navigate("/login");
            else return navigate("/*", {state: {status, statusText, data}});
        }
    }
    const handleWithdraw = async (_id, elementId)=>{
        try{
            await fetchWithdraw(_id);
            dispatch(removeInterest({_id: elementId}));
        } catch (err) {
            console.log(err);
            const {status, statusText, data} = err?.response
            if(status === 401) return navigate("/login");
            else return navigate("/*", {state: {status, statusText, data}});
        }
    }
    const handlescroll = (e)=>{
        const ref = carouselref.current;
        const p = Math.round(ref.scrollLeft/ref.offsetWidth) + 1;
        setPage(p);
    }
    return (
        <div className="drawer-side  backdrop-blur-xs">
            <label className="drawer-overlay"
                htmlFor="my_drawer" 
                aria-label="close sidebar" >
            </label>
            <div className="menu bg-base-200 min-h-full w-90 p-4" onScroll={()=>{console.log("hehehe")}}>
                <div className="text-right">
                    <label className="drawer-overlay cursor-pointer max-w-min px-2"
                        htmlFor="my_drawer" 
                        aria-label="close sidebar">Close ❯
                    </label>
                </div>
                <h2 className="text-center text-lg font-bold pb-2 border-b border-gray-500/70">Requests</h2>
                <div className="flex gap-1 bg-base-300 rounded-xl mt-1 p-1">
                    <button onClick={()=>{
                        item1ref.current?.scrollIntoView({behaviour: "smooth"});
                        setPage(1)}
                    } className={`py-2 flex-1/2 text-center rounded-xl hover:bg-base-100 ${page === 1 ? "bg-base-100": ""}`}>Received</button>
                    
                    <button onClick={(e)=>{
                        item2ref.current?.scrollIntoView({behaviour: "smooth"});
                        setPage(2)}
                    } className={`py-2 flex-1/2 text-center rounded-xl hover:bg-base-100 ${page === 2 ? "bg-base-100" : ""}`}>Sent</button>
                </div>
                <div ref={carouselref} onScroll={handlescroll} className="carousel w-full mt-1">
                    <ul ref={item1ref} className="carousel-item min-w-full min-h-93 flex flex-col">
                        {requests && requests.length > 0 ?
                            requests.map((element)=>{
                                const elementId = element?._id;
                                const {_id, photourl, firstName, lastName} = element?.senderId;
                                return (
                                <li key={_id} className="min-w-full">
                                    <div className="flex items-center justify-between">
                                        <label className="drawer-overlay cursor-pointer"
                                            htmlFor="my_drawer" 
                                            aria-label="close sidebar" >
                                            <div className="flex items-center gap-2" onClick={()=>{navigate(`/requested/profile/view/${_id}`)}}>
                                                <div className="w-10 rounded-full overflow-hidden max-h-fit">
                                                    <img
                                                        alt="user photo"
                                                        src={photourl} />
                                                </div>
                                                <p className="max-h-fit">{`${firstName} ${lastName}`}</p>
                                            </div>
                                        </label>
                                        <div className="flex items-center max-h-min max-w-fit gap-x-2">
                                            <button className="max-h-fit btn btn-error" onClick={()=>{
                                                handleReject(_id, elementId)}}>
                                                    Reject
                                            </button>
                                            <button className="max-h-fit btn btn-success" onClick={()=>{
                                                handleAccept(element)}}>
                                                    Accept
                                            </button>
                                        </div>
                                    </div>
                                </li>)
                            }) :
                            <div className="min-h-full min-w-full text-center">
                                <p>No request found!☹️</p>
                            </div>
                        }
                    </ul>
                    <ul ref={item2ref} className="carousel-item min-w-full min-h-93 flex flex-col">
                        {interests.length > 0 ?
                        interests.map((element)=>{
                            const elementId = element?._id;
                            const {_id, photourl, firstName, lastName} = element?.receiverId;
                            return (
                                <li key={_id} className="min-w-full">
                                    <div className="flex items-center justify-between">
                                        <label className="drawer-overlay cursor-pointer"
                                            htmlFor="my_drawer" 
                                            aria-label="close sidebar" >
                                            <div className="flex items-center gap-2" onClick={()=>{navigate(`/requested/profile/view/${_id}`)}}>
                                                <div className="w-10 rounded-full overflow-hidden max-h-fit">
                                                    <img
                                                        alt="user photo"
                                                        src={photourl} />
                                                </div>
                                                <p className="max-h-fit">{`${firstName} ${lastName}`}</p>
                                            </div>
                                        </label>
                                        <button className="max-h-fit btn btn-info" onClick={()=>{handleWithdraw(_id, elementId)}}>
                                            Withdraw
                                        </button>
                                    </div>
                                </li>
                            )
                        }):
                            <div className="min-h-full min-w-full my-1 text-center">
                                <p>No request found!☹️</p>
                            </div>
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Requests