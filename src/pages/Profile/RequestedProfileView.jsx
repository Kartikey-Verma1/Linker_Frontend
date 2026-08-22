import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaGenderless, FaMars, FaVenus } from "react-icons/fa";
import { FaCakeCandles } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeed, fetchInterestData, fetchRequest, fetchRequestedUser, fetchReview, fetchUserData, fetchWithdraw } from "../../utils/fetchData";
import { addUser } from "../../redux/userSlice";
import ShimmerProfile from "../../components/ShimmerProfile";
import { addFeed, removeFeedUser } from "../../redux/feedSlice";
import { addInterests, pushInterest, removeInterest } from "../../redux/interestsSlice";
import { removeRequest } from "../../redux/requestsSlice";
import { pushConnection, removeConnection } from "../../redux/connectionsSlice";
import Name from "./components/Name";
import Photo from "./components/Photo";
import About from "./components/About";
import Gender from "./components/Gender";
import Age from "./components/Age";
import Skills from "./components/Skills";
const RequestedProfileView = () => {
    const user = useSelector((store)=>store.user);
    const connections = useSelector((store)=>store.connections);
    const requests = useSelector((store)=>store.requests);
    const interests = useSelector((store)=>store.interests);
    const feed = useSelector((store)=>store.feed);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {id} = useParams();
    const [requestedData, setRequestedData] = useState(null);
    const [buttonCode, setButtonCode] = useState(0);
    // button status codes
    // 1. send-request 
    // 2. accept, reject 
    // 3. withdraw-request
    // 4. message, remove-connection

    const getStatus = ()=>{
        const interaction = requestedData?.interaction;

        if(!interaction){
            setButtonCode(1);
            return; 
        }
        const {senderId, receiverId, status} = interaction;

        if(["ignored", "withdrawn", "rejected"].includes(status)){
            setButtonCode(1);
            return;
        }
        if(status === "accepted"){
            setButtonCode(4);
            return;
        }
        if(status === "interested"){
            if(senderId === user?._id){
                setButtonCode(3);
                return;
            }
            if(receiverId === user?._id){
                setButtonCode(2);
                return;
            }
        }
    };

    const requestedUser = async ()=>{
        try{
            const fetchedData = await fetchRequestedUser(id);
            setRequestedData(fetchedData);
        } catch (err) {
            console.log(err);
            const {status, statusText, data} = err?.response
            if(status === 401) return navigate("/login");
            else return navigate("/*", {state: {status, statusText, data}});
        }
    };

    const userData = async ()=>{
        try{
            const fetchedData = await fetchUserData();
            dispatch(addUser(fetchedData));
        } catch (err) {
            const {status, statusText, data} = err?.response
            if(status === 401) return navigate("/login");
            else return navigate("/*", {state: {status, statusText, data}});
        }
    };

    const handleInterested = async ()=>{
        try{
            if(feed && feed.length > 0){
                console.log("hehehe");
                if(feed.length === 1){
                    const lastId = feed[feed.length - 1]._id;
                    const fetchedFeed = await fetchFeed(lastId);
                    dispatch(addFeed(fetchedFeed));
                }
                dispatch(removeFeedUser({_id: id}));
            }
            const fetchedData = await fetchRequest({status: "interested", _id: id});
            if(interests && interests.length <= 0){
                const fetchedInterests = await fetchInterestData();
                dispatch(addInterests(fetchedInterests));
            } else {
                const data = {
                    _id: fetchedData._id,
                    receiverId: {
                        _id: requestedData._id,
                        firstName: requestedData.firstName,
                        lastName: requestedData.lastName,
                        photourl: requestedData.photourl
                    },
                    status: "interested"
                }
                dispatch(pushInterest(data));
            }
            setButtonCode(3);
        } catch (err) {
            const {status, statusText, data} = err?.response
            if(status === 401) return navigate("/login");
            else return navigate("/*", {state: {status, statusText, data}});
        }
    };

    const handleAccept = async ()=>{
        try{
            await fetchReview({status: "accepted", _id: id});
            if(requests && requests.length > 0){
                dispatch(removeRequest({_id: requestedData.interaction._id}));
            }
            if(connections && connections.length > 0){
                const data = {
                    _id: id,
                    firstName: requestedData.firstName,
                    lastName: requestedData.lastName,
                    photourl: requestedData.photourl
                }
                dispatch(pushConnection(data));
            }
            setButtonCode(4);
        } catch (err) {
            console.log(err);
            const {status, statusText, data} = err?.response
            if(status === 401) return navigate("/login");
            else return navigate("/*", {state: {status, statusText, data}});
        }
    };

    const handleReject = async ()=>{
        try{
            await fetchReview({status: "rejected", _id: id});
            if(requests && requests.length > 0){
                dispatch(removeRequest({_id: requestedData.interaction._id}));
            }
            setButtonCode(1);
        } catch (err) {
            console.log(err);
            const {status, statusText, data} = err?.response
            if(status === 401) return navigate("/login");
            else return navigate("/*", {state: {status, statusText, data}});
        }
    };

    const handleWithdraw = async ()=>{
        try{
            await fetchWithdraw(id);
            if(interests && interests.length > 0){
                dispatch(removeInterest({_id: requestedData.interaction._id}));
            }
            setButtonCode(1);
        } catch (err) {
            const {status, statusText, data} = err?.response
            if(status === 401) return navigate("/login");
            else return navigate("/*", {state: {status, statusText, data}});
        }
    };

    const handleConnectionRemoval = async ()=>{
        try{
            await fetchWithdraw(id);
            if(connections && connections.length > 0){
                dispatch(removeConnection({_id: id}));
            }
            setButtonCode(1);
        } catch (err) {
            const {status, statusText, data} = err?.response
            if(status === 401) return navigate("/login");
            else return navigate("/*", {state: {status, statusText, data}});
        }
    }

    useEffect(()=>{
        if(!user){
            userData();
        }
        requestedUser();
    },[id]);
    useEffect(()=>{
        if(user && requestedData) getStatus();
    }, [requestedData, user]);
    return (
        <div className="min-w-full max-h-fit p-5 pt-10">
            {requestedData?.firstName ? 
            <div className="card lg:card-side bg-base-200 shadow-[0_0_12px_rgba(147,197,253,0.3)] max-w-3xl mx-auto flex flex-col">
                <div className="card-body flex flex-col gap-3">
                    <div className="flex gap-7 items-center mb-3">
                        <Photo edit={false} url={requestedData.photourl} />
                        <Name 
                            edit = {false} 
                            data = {{firstName: requestedData.firstName, lastName: requestedData.lastName}}
                            editCall={null}
                        />
                    </div>
                
                
                    <About edit={false} data={requestedData.about} editCall={null}/>

                    <Skills edit={false} data={requestedData.skills} editCall={null} />
                    
                    <div className="flex gap-2">
                        <Gender edit={false} data={requestedData.gender} editCall={null} />
                        <Age edit={false} data={requestedData.age} editCall={null} />
                    </div>

                    <div className="mt-2 text-right gap-3">
                        {
                            buttonCode === 1?
                                <div>
                                    <button className="btn btn-success" 
                                        onClick={()=>{
                                            setButtonCode(0);
                                            handleInterested();
                                        }}>Send Request</button>
                                </div> :
                            buttonCode === 2 ?
                                <div>
                                    <button className="btn btn-success mr-3"
                                        onClick={()=>{
                                            setButtonCode(0);
                                            handleAccept();
                                        }}>Accept</button>
                                    <button className="btn btn-error" 
                                        onClick={()=>{
                                            setButtonCode(0);
                                            handleReject();
                                        }}>Reject</button>
                                </div> :
                            buttonCode === 3 ?
                                <div>
                                    <button className="btn btn-info" 
                                        onClick={()=>{
                                            setButtonCode(0);
                                            handleWithdraw();
                                        }}>Withdraw Request</button>
                                </div> :
                            buttonCode === 4 ?
                                <div>
                                    <button className="btn btn-info" 
                                        onClick={()=>{
                                            setButtonCode(0);
                                            handleConnectionRemoval();
                                        }}>Remove Connection</button>
                                </div> :
                            <div>
                                <button className="w-23 h-10 skeleton rounded-xl"></button>
                            </div>
                        }
                    </div>
                </div>
            </div> : 
            <ShimmerProfile />}
        </div>
    )
}

export default RequestedProfileView;