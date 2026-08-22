import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../redux/userSlice.js";
import { useEffect, useState } from "react";
import { fetchFeed, fetchRequest, fetchUserData } from "../../utils/fetchData.js";
import { addFeed, removeFrontFeed } from "../../redux/feedSlice.js";
import { FaCheck, FaTimes } from "react-icons/fa";

const Feed = () => {
    const [shimmer, setShimmer] = useState(true);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((store)=>store.user);
    const feed = useSelector((store)=>store.feed);

    const handleIgnore = async (_id) => {
        try{
            await fetchRequest({status: "ignored", _id});
            
            if(feed.length === 1){
                const lastId = feed[feed.length - 1]._id;
                const fetchedData = await fetchFeed(lastId);
                dispatch(addFeed(fetchedData));
            }

            dispatch(removeFrontFeed());
        } catch (err) {
            const {status, statusText, data} = err?.response;
            if(status === 401) return navigate("/login");
            else return navigate("/*", {state: {status, statusText, data}});
        }
    }

    const handleInterested = async (_id) => {
        try{
            await fetchRequest({status: "interested", _id});

            if(feed.length === 1){
                const lastId = feed[feed.length - 1]._id;
                const fetchedData = await fetchFeed(lastId);
                dispatch(addFeed(fetchedData));
            }

            dispatch(removeFrontFeed());
        } catch (err) {
            const {status, statusText, data} = err?.response
            if(status === 429){
                alert(data?.message);
                dispatch(removeFrontFeed());
                if(feed.length === 1){
                    const lastId = feed[feed.length - 1]._id;
                    const fetchedData = await fetchFeed(lastId);
                    dispatch(addFeed(fetchedData));
                }
                return;
            }
            if(status === 401) return navigate("/login");
            else return navigate("/*", {state: {status, statusText, data}});
        }
    }

    const userData = async () => {
        try{
            const user = await fetchUserData();
            dispatch(addUser(user));
        } catch (err){
            const {status, statusText, data} = err?.response
            if(status === 401) return navigate("/login");
            else return navigate("/*", {state: {status, statusText, data}});
        }
    }
    
    const feedData = async () => {
        try{
            setShimmer(true);
            const fetchedData = await fetchFeed();
            dispatch(addFeed(fetchedData));
            setShimmer(false);
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
    }, []);
    useEffect(()=>{
        if(user && feed.length === 0){
            feedData();
        }
    }, [user])
    return (
        <div className="min-w-full min-h-fit py-10 px-5">
            {feed.length > 0 ? 
                <div className="rounded-box overflow-hidden mx-auto shadow-[0_0_12px_rgba(147,197,253,0.3)] bg-base-100 max-w-84 relative">
                    <figure className="cursor-pointer"
                        onClick={()=>{navigate(`/requested/profile/view/${feed[0]._id}`)}}>
                        <img className="w-84 aspect-16/18 object-cover"
                        src={feed[0].photourl}
                        alt="Shoes" />
                    </figure>
                    <h2 className="m-1 p-2 text-xl font-bold max-w-fit rounded-box absolute top-0 backdrop-blur-xs bg-base-100/70">
                        {`${feed[0].firstName} ${feed[0].lastName}`}
                    </h2>
                    <div className="flex flex-col gap-2 absolute left-1 top-15">
                        {
                            feed[0]?.skills?.slice(0, 4)?.map((element, index)=>{
                                const colors = ["bg-blue-700/60", "bg-cyan-700/60", "bg-emerald-700/60", "bg-indigo-600/60"]
                                return(
                                    <p className={`rounded-field ${colors[index]} px-2 max-w-fit`} key={index}>{element}</p>
                                )
                            })
                        }
                        <p className="rounded-field bg-sky-700/70 px-2 max-w-fit">...</p>
                    </div>
                    <div className="absolute bottom-0 right-0 flex gap-1 min-w-full">
                        <button className="badge badge-outline py-1 bg-red-700/70 cursor-pointer text-white flex-1/2"
                            onClick={()=>{handleIgnore(feed[0]._id)}}>
                                Ignore <FaTimes />
                        </button>
                        <button className="badge badge-outline py-1 bg-green-700/70 cursor-pointer text-white flex-1/2"
                            onClick={()=>{handleInterested(feed[0]._id)}}>
                                Interested <FaCheck />
                        </button>
                    </div>
                </div>: 
            <>{shimmer ? 
            <div className="rounded-box mx-auto shadow-[0_0_12px_rgba(147,197,253,0.3)] h-90 max-w-84 skeleton"></div>: 
            <div className="rounded-box mx-auto shadow-[0_0_12px_rgba(147,197,253,0.3)] h-90 max-w-84 text-center py-40 text-xl">Come tomorrow to discover more</div>}</>}
        </div>
    )
}

export default Feed