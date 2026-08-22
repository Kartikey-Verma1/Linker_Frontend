import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react";
import { addUser, removeUser } from "../../redux/userSlice";
import { Link, useNavigate } from "react-router-dom";
import ShimmerProfile from "../../components/ShimmerProfile";
import { fetchDeleteProfile, fetchEdit, fetchUserData } from "../../utils/fetchData";
import Photo from "./components/Photo";
import Name from "./components/Name";
import About from "./components/About";
import Gender from "./components/Gender";
import Age from "./components/Age";
import Skills from "./components/Skills";

const Profile = () => {
    const [showWarning, setShowWarning] = useState(true);

    const editCall = async (dataToPass)=>{
        try{
            const changedData = await fetchEdit(dataToPass);
            dispatch(addUser(changedData));
        } catch(err){
            const {status, statusText, data} = err?.response
            if(status === 401){
                return navigate("/login");
            }
            if(status === 409 || status === 423){
                alert(data.message);
                return;
            }
            console.log(err.response);
            return navigate("/*", {state: {status, statusText, data}});
        }
    }
    const handleDelete = async (e) => {
        try{
            e.preventDefault();
            await fetchDeleteProfile();
            alert(`${user.firstName} ${user.lastName} your account is deleted!`);
            dispatch(removeUser());
            return navigate("/login");
        } catch(err){
            const {status, statusText, data} = err?.response
            if(status === 401){
                return navigate("/login");
            }
            if(status === 409 || status === 423){
                alert(data.message);
                return;
            }
            console.log(err.response);
            return navigate("/*", {state: {status, statusText, data}});
        }
    }


    // logic to fetch data and rendering it:- first checking that if it is present than if present than adding it to redux store otherwise fetching data than adding to store.

    const user = useSelector((store)=>store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
        if(!user){
            (async () => {
                try{
                    const user = await fetchUserData();
                    dispatch(addUser(user));
                } catch (err) {
                    const {status, statusText, data} = err?.response
                    if(status === 401) return navigate("/login");
                    else return navigate("/*", {state: {status, statusText, data}});
                }
            })();
        }
    }, []);

    return (
        <div className="min-w-full max-h-fit p-5 pt-10">
            {user ? 
            <div className="card lg:card-side bg-base-200 shadow-[0_0_12px_rgba(147,197,253,0.3)] max-w-3xl mx-auto">
                <div className="card-body justify-between">
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-7 items-center mb-3">
                            <Photo edit={true} url={user.photourl}/>
                            <Name 
                                edit={true}
                                data={{firstName: user.firstName, lastName: user.lastName}} 
                                editCall={editCall}
                            />
                        </div>

                        <About edit={true} data={user.about} editCall={editCall}/>

                        {/* Skills :- used loop to load all skills with design */}
                        <Skills edit={true} data={user.skills} editCall={editCall} />
                        {/* Warning */}
                        {showWarning ? <div role="alert" className="alert alert-warning">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>Only top 4 skills will be shown in your profile card!</span>
                            <button className="btn btn-warning max-h-fit py-1"
                                type="button" 
                                onClick={()=>{setShowWarning(false)}}>
                                    Ok
                            </button>
                        </div> : <></>}
                        <div className="flex gap-3">
                            <Gender edit={true} data={user.gender} editCall={editCall} />
                            <Age edit={true} data={user.age} editCall={editCall} />
                        </div>
                    </div>
                    {/* password change and delete account in one div */}
                    <div className="mt-2 flex justify-end gap-3">
                        {/* password change */}
                        <Link to="/passwordchange"><button className="btn btn-info max-w-40" type="button">Change Password</button></Link>
                        {/* delete account */}
                        <div>
                            <button className="btn btn-error" onClick={()=>document.getElementById('my_modal_3').showModal()}>Delete Account</button>
                            <dialog id="my_modal_3" className="modal">
                                <div className="modal-box bg-base-100/70 backdrop-blur-sm">
                                    <form method="dialog">
                                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                    </form>
                                    <h3 className="font-bold text-lg">Are You Sure?</h3>
                                    <p className="py-4">Do you want to delete your account? Type "<span className="font-bold">delete account</span>"</p>
                                    <form onSubmit={handleDelete}>
                                        <input className="input validator outline-0 w-3xs" 
                                            type="text" 
                                            required
                                            pattern="delete account"/>
                                        <p className="validator-hint">Required <br /> Must match exactly</p>
                                        <div className="text-right">
                                            <button className="btn btn-error">Delete</button>
                                        </div>
                                    </form>
                                </div>
                            </dialog>
                        </div>
                    </div>
                    
                </div>
            </div> :
            <ShimmerProfile />}
            
        </div>
    )
}

export default Profile