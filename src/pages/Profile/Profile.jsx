import { useDispatch, useSelector } from "react-redux"
import { FaEdit, FaMars, FaVenus, FaGenderless, FaCheck, FaTimes, FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import { addUser, removeUser } from "../../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import ShimmerProfile from "../../components/ShimmerProfile";
import { FaCakeCandles } from "react-icons/fa6";
import { fetchDeleteProfile, fetchEdit, fetchUserData } from "../../utils/fetchData";
import SkillsDraggableEditable from "../../components/SkillsDraggableEditable";
import { DragDropProvider } from "@dnd-kit/react";

const Profile = () => {
    const [dragIndex, setDragIndex] = useState(null);

    const [showWarning, setShowWarning] = useState(true);

    const [errorMessageName, setErrorMessageName] = useState("");
    const [errorMessageAbout, setErrorMessageAbout] = useState("");
    const [errorMessageSkill, setErrorMessageSkill] = useState("");
    const [errorMessageAge, setErrorMessageAge] = useState("");
    // For edit logic
    // making useState hook to render the edit field when button clicked
    const [isClicked, setIsClicked] = useState({
        name: false,
        about: false,
        skills: false,
        age: false
    });

    // making useState hook for getting the value of the fields
    const [formData, setFormData] = useState({
        firstName : "",
        lastName: "",
        about: "Hey there! I am on Linker.",
        newSkill: "",
        age: NaN
    }); 

    const setData = (data)=>{
        setFormData({
            firstName: data.firstName,
            lastName: data.lastName || "",
            about: data.about || "",
            newSkill: "",
            age: data.age
        })
    }

    const editCall = async (dataToPass)=>{
        try{
            const changedData = await fetchEdit(dataToPass);
            dispatch(addUser(changedData));
        } catch(err){
            const {status, statusText, data} = err?.response
            if(status === 401){
                setErrorMessageName("")
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

    const handleChange = (field, value)=>{
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }
    const handleToggle = (field, value)=>{
        setIsClicked(prev=>({
            ...prev,
            [field]: value
        }));
    } 
    // onclick function calls
    const handleName = async (e) => {
        e.preventDefault();
        if(e.currentTarget.value === "cancel"){
            setFormData(prev => ({
                ...prev,
                firstName: user.firstName,
                lastName: user.lastName || ""
            }));
            handleToggle("name", false);
            setErrorMessageName("");
            return;
        } else {
            if(formData.firstName === user.firstName && formData.lastName === user.lastName){
                handleToggle("name", false);
                return;
            }
            else if(formData.firstName.length < 4 || (formData.lastName.length < 4 && formData.lastName.length > 0)){
                setErrorMessageName("Length of first name or last name should be more than 4")
                return;
            }
            else{
                let lastName = null;
                if(formData.lastName.length >= 4) lastName = formData.lastName;
                const dataToPass = {firstName: formData.firstName, lastName};
                await editCall(dataToPass);
                handleToggle("name", false);
                setErrorMessageName("");
            }
            
        }
    }
    const handleAbout = async (e) => {
        e.preventDefault();
        if(e.currentTarget.value === "cancel"){
            setFormData(prev => ({
                ...prev,
                about: user.about
            }));
            handleToggle("about", false);
            setErrorMessageAbout("");
            return;
        }
        if(formData.about === user.about){
            handleToggle("about", false);
            return;
        }
        if(formData.about.length > 200){
            setErrorMessageAbout("Max number of letters allowed is 200");
            return;
        }
        const dataToPass = {about: formData.about || null};
        await editCall(dataToPass);
        setErrorMessageAbout("");
        handleToggle("about", false);
    }
    const handleSkillsRemove = async (index) => {
        const updatedList = user.skills.filter((element, i)=> i != index);
        await editCall({skills: updatedList});
    }
    const handleSkillsAdd = async (e) => {
        e.preventDefault();
        if(formData.newSkill.length <= 0) return;
        if(formData.newSkill.length > 20){
            setErrorMessageSkill("Size of skill should be less than 20");
            return;
        }
        const dataToPass = [...user.skills, formData.newSkill];
        await editCall({skills: dataToPass});
        setErrorMessageSkill("");
        setFormData(prev => ({
            ...prev,
            newSkill: ""
        }));
        handleToggle("skills", false);
    }
    const handleGender = async (e) => {
        if(e.currentTarget.value === user.gender){
            document.activeElement.blur();
            return;
        }
        await editCall({gender: e.currentTarget.value || null});
        document.activeElement.blur();
    }
    const handleAge = async (e) => {
        e.preventDefault();
        if(e.currentTarget.value == "cancel"){
            setFormData(prev => ({
                ...prev,
                age: user.age
            }));
            handleToggle("age", false);
            setErrorMessageAge("");
            return;
        }
        if(formData.age === user.age){
            handleToggle("age", false);
            return;
        }
        if(formData.age < 16){
            setErrorMessageAge("Sorry, You are too young to work!");
            return;
        }
        if(formData.age > 70){
            setErrorMessageAge("Sorry, You are too old to work!");
            return;
        }
        await editCall({age: formData.age});
        setErrorMessageAge("");
        handleToggle("age", false);
        return;
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
                setErrorMessageName("")
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
    const handleDragEnd = async (e) => {
        const targetIndex = e.operation.target.index;
        if(targetIndex === dragIndex) return;
        const updatedSkills = [...user.skills];
        const [item] = updatedSkills.splice(parseInt(dragIndex), 1);
        updatedSkills.splice(parseInt(targetIndex), 0, item);

        await editCall({skills: updatedSkills});
    }
    const handleDragStart = async(e) => {
        const id = e.operation.target.index;
        setDragIndex(id);
    }

    // logic to fetch data and rendering it, first checking that if it is present than if present than adding it to redux store otherwise fetching data than adding to store.
    const [flagData, setFlagData] = useState(false); // for shimmer.

    const user = useSelector((store)=>store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
        if(!user){
            (async () => {
                try{
                    const user = await fetchUserData();
                    dispatch(addUser(user));
                    setData(user);
                    setFlagData(true);
                } catch (err) {
                    const {status, statusText, data} = err?.response
                    if(status === 401) return navigate("/login");
                    else return navigate("/*", {state: {status, statusText, data}});
                }
            })();
        } else {
            setFlagData(true);
            setData(user);
        }
    }, []);

    return (
        <div className="min-w-full max-h-fit p-5 pt-10">
            {flagData ? 
            <div className="card lg:card-side bg-base-200 shadow-[0_0_12px_rgba(147,197,253,0.3)] max-w-3xl mx-auto">
                <div className="card-body justify-between">
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-7 items-center mb-3">
                            <label className="avatar"
                                htmlFor="my_modal_photo">
                                <figure className="max-w-30 min-w-17 rounded-full cursor-pointer">
                                    <img
                                    src={user.photourl}
                                    alt="Profile" />
                                </figure>
                            </label>
                            <input type="checkbox" id="my_modal_photo" className="modal-toggle" />
                            <div className="modal" role="dialog">
                                <div className="modal-box p-0 max-w-fit max-h-fit">
                                    <div className="max-w-sm">
                                        <img className="aspect-16/18 object-cover"
                                            src={user.photourl}
                                            alt="profile photo" />
                                    </div>
                                    <label htmlFor="my_modal_photo" className="p-1 px-2 rounded-full text-gray-500 font-bold cursor-pointer bg-base-100/15 hover:bg-gray-800 absolute right-1 top-1">✕</label>
                                </div>
                            </div>
                            {/* Name */}
                            {!isClicked.name ?
                                // showing name
                                (<p className="card-title text-2xl my-4">{`${formData.firstName} ${formData.lastName}`} 
                                    <button className="cursor-pointer text-xs mx-4" onClick={()=>handleToggle("name", true)}>
                                        <FaEdit />
                                    </button>
                                </p>) :
                                // editing name
                                (<div>
                                    <form className="card-title text-2xl mt-4 flex flex-wrap" onSubmit={handleName}>
                                        <div className="flex gap-3">
                                            <fieldset>
                                                <input className="input validator outline-0" 
                                                    type="text" 
                                                    placeholder="First Name"
                                                    required
                                                    value={formData.firstName} 
                                                    onChange={(e)=>{handleChange("firstName", e.target.value)}}/>
                                            </fieldset>
                                            <fieldset>
                                                <input className="input validator outline-0" 
                                                    type="text" 
                                                    placeholder="Last Name"
                                                    value={formData.lastName} 
                                                    onChange={(e)=>{handleChange("lastName", e.target.value)}}/>
                                            </fieldset>
                                        </div>
                                        <button className="text-sm cursor-pointer btn btn-sm btn-ghost" 
                                            value="cancel"
                                            type="button"
                                            onClick={handleName}>
                                            <FaTimes />
                                        </button>
                                        <button className="text-sm cursor-pointer btn btn-sm btn-ghost" 
                                            value="save"
                                            type="submit">
                                            <FaCheck />
                                        </button>
                                    </form>
                                    <p className="text-rose-400">{errorMessageName}</p>
                                </div>)
                            }
                        </div>

                        {/* About */}
                        <div className="border border-gray-500 rounded-md p-3 bg-base-100">
                        {!isClicked.about ?
                            (<div>
                                <p className="text-lg font-bold">About 
                                    <button className="cursor-pointer text-xs mx-4" onClick={()=>handleToggle("about", true)}>
                                        <FaEdit />
                                    </button>
                                </p>
                                <p className="py-2">{formData.about}</p>
                            </div>) :
                            
                                (<div>
                                    <form onSubmit={handleAbout}>
                                        <div className="flex items-center gap-2">
                                            <p className="text-lg font-bold max-w-fit">About</p>
                                            <button className="text-sm cursor-pointer btn btn-sm btn-ghost" 
                                                value="cancel"
                                                type="button"
                                                onClick={handleAbout}>
                                                <FaTimes />
                                            </button>
                                            <button className="text-sm cursor-pointer btn btn-sm btn-ghost" 
                                                value="save"
                                                type="submit">
                                                <FaCheck />
                                            </button>
                                        </div>
                                        <p className="text-rose-400">{errorMessageAbout}</p>
                                        <fieldset>
                                            <textarea className="input outline-0 mt-2 p-1 px-3 w-full h-20 resize-none whitespace-pre-wrap bg-base-200"
                                                placeholder="Hey there! I am on Linker." 
                                                defaultValue={formData.about || "Hey there! I am on Linker."}
                                                wrap="soft"
                                                onChange={(e)=>{handleChange("about", e.target.value)}}
                                            />
                                        </fieldset>
                                    </form>
                                </div>)
                            }
                            
                        </div>

                        {/* Skills :- used loop to load all skills with design */}
                        <div className="border border-gray-500 rounded-md p-3 bg-base-100 ">
                            <p className="text-lg font-bold">Skills</p>
                            <div>
                                <DragDropProvider onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
                                    <ul className="flex flex-wrap" id="drag_context">
                                        {user.skills.map((element, index) => (
                                            <SkillsDraggableEditable key={element} element={element} handleSkillsRemove={handleSkillsRemove} index={index} />
                                        ))}
                                    </ul>
                                </DragDropProvider>
                                {user?.skills.length < 20 ?
                                <><div className="text-right">
                                    <label htmlFor="my_modal_6" className="btn max-h-min max-w-min mt-2 p-1 px-3 rounded-md bg-base-300" onClick={()=>{handleToggle("skills", true)}}><FaPlus/>Add</label>
                                </div>

                                <input className="modal-toggle" 
                                    type="checkbox" 
                                    checked={isClicked.skills} 
                                    readOnly/>
                                <div className="modal " role="dialog"onKeyDown={(e)=>{
                                        if(e.key == "Enter") handleSkillsAdd(e);
                                    }}>
                                    <div className="modal-box bg-base-200/70 backdrop-blur-xs w-xs">
                                        <h3 className="text-lg font-bold">Enter Your New Skill</h3>
                                        <input  className="input outline-0 w-full my-3" 
                                        type="text"
                                        value={formData.newSkill}
                                        onChange={(e)=>{handleChange("newSkill", e.target.value)}}/>
                                        <p className="text-rose-400">{errorMessageSkill}</p>
                                        <div className="modal-action">
                                            <label  className="btn" 
                                            htmlFor="my_modal_6"
                                            onClick={()=>{
                                                handleChange("newSkill", "");
                                                setErrorMessageSkill("");
                                                handleToggle("skills", false)}}><FaTimes />
                                            </label>
                                            <label  className="btn" 
                                            htmlFor="my_modal_6"
                                            onClick={handleSkillsAdd}
                                            ><FaCheck />
                                            </label>
                                        </div>
                                    </div>
                                </div></> : 
                                <></>}
                            </div>
                        </div>
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
                        {/* age and gender in one div */}
                        <div className="flex gap-3">
                            {/* Gender div */}
                            <div className="border border-gray-500 rounded-md p-3 bg-base-100 flex-1/2">
                                <div className="flex items-center">
                                    <p className="text-lg font-bold max-w-fit">Gender</p>
                                    <div className="dropdown dropdown-center">
                                        <div tabIndex={0} role="button" className="ml-3.5 cursor-pointer">
                                            <div className="rounded-full text-xs">
                                                <FaEdit />
                                            </div>
                                        </div>
                                        <ul
                                            tabIndex="-1"
                                            className="menu menu-sm dropdown-content bg-base-200/70 backdrop-blur-xs rounded-box z-1 mt-3 w-52 p-2 border border-gray-500">
                                            <li><button className="text-sm my-0.5" type="button" value="male" onClick={handleGender}><FaMars />Male</button></li>
                                            <li><button className="text-sm my-0.5" type="button" value="female" onClick={handleGender}><FaVenus />Female</button></li>
                                            <li><button className="text-sm my-0.5" type="button" value="others" onClick={handleGender}><FaGenderless />Others</button></li>
                                            <li><button className="text-sm my-0.5" type="button" value={null} onClick={handleGender}>Prefer not to disclose</button></li>
                                        </ul>
                                    </div>
                                </div>
                                <p className="py-2">{
                                    (user?.gender)?
                                        (user?.gender === "male"?
                                            <span className="flex items-center gap-2"><FaMars /> Male</span>:
                                            (user?.gender === "female" ?
                                                <span className="flex items-center gap-2"><FaVenus /> Female</span>:
                                                <span className="flex items-center gap-2"><FaGenderless />Others</span>)):
                                        <span>N/A</span>
                                }</p>
                            </div>

                            {/* Age div */}
                            <div className="border border-gray-500 rounded-md p-3 bg-base-100 flex-1/2">
                                {!isClicked.age ?
                                    (<div>
                                        <div className="flex">
                                            <p className="text-lg font-bold max-w-fit">Age</p> 
                                            <button className="cursor-pointer text-xs ml-3.5" onClick={()=>handleToggle("age", true)}>
                                                <FaEdit />
                                            </button>
                                        </div>
                                        
                                        <p className="py-2 flex items-center gap-2"><FaCakeCandles /> {formData.age}</p>
                                    </div>) :
                                    (<div>
                                        <form onSubmit={handleAge}>
                                            <div className="flex items-center gap-2">
                                                <p className="text-lg font-bold max-w-fit mr-1">Age</p>
                                                <div className="flex gap-2">
                                                    <button className="text-sm cursor-pointer btn btn-sm btn-ghost p-1"
                                                        value="cancel"
                                                        type="button"
                                                        onClick={handleAge}>
                                                        <FaTimes />
                                                    </button>
                                                    <button className="text-sm cursor-pointer btn btn-sm btn-ghost p-1"
                                                        value="save"
                                                        type="submit">
                                                        <FaCheck />
                                                    </button>
                                                </div>
                                                
                                            </div>
                                            
                                            <fieldset className="flex items-center gap-2">
                                                <input className="input outline-0 h-7 mt-1.5 w-20 bg-base-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                    type="number"
                                                    defaultValue={formData.age} 
                                                    onChange={(e)=>{handleChange("age", e.target.value)}}/>
                                                    <p className="text-rose-400">{errorMessageAge}</p>
                                            </fieldset>
                                        </form>
                                    </div>)
                                }
                                    
                            </div>
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