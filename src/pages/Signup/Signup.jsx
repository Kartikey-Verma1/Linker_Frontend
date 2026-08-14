import { useState } from "react";
import { FaCheck, FaEye, FaEyeSlash, FaPlus, FaTimes} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { fetchAddProfile } from "../../utils/fetchData";

const Signup = () => {
    const [isClickedSkills, setIsClickedSkills] = useState(false);

    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [ageError, setAgeError] = useState("");
    const [errorMessageSkill, setErrorMessageSkill] = useState("");
    const [aboutError, setAboutError] = useState("");
    const [passwordMatchError, setPasswordMatchError] = useState("");
    
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        age: NaN,
        gender: "male",
        newSkill: "",
        skills: [],
        about: "Hey there! I am on Linker.",
        email: "",
        password: "",
        confirmPassword: "",
        passwordType: "password"
    });

    const navigate = useNavigate();

    const firstPageNextHandler = (e)=>{
        setFirstNameError("");
        setLastNameError("");
        setAgeError("");
        let hasherror = false;
        if(form.firstName === ""){
            hasherror = true;
            setFirstNameError("This field is required!");
        } 
        if(form.firstName.length < 4 || form.firstName.length > 15){
            hasherror = true;
            setFirstNameError("Length can be only 4 to 15 characters");
        }
        if(form.lastName.length > 0 && (form.lastName.length < 4 || form.lastName.length > 15)){
            hasherror = true;
            setLastNameError("Length can be only 4 to 15 characters");
        }
        if(form.age > 70 || form.age < 16 || !form.age){
            hasherror = true;
            if(form.age > 70) setAgeError("You are too aged to work!");
            else if(form.age < 16) setAgeError("You are too young to work!");
            else setAgeError("Required");
        }
        if(hasherror) e.preventDefault();
        return;
    }
    const setfield = (field, value)=>{
        setForm(prev=>({
            ...prev,
            [field]: value
        }));
    }
    const handleSkillsRemove = (index)=>{
        const updatedList = form.skills.filter((element, i)=> i != index);
        setfield("skills", updatedList);
    }
    const handleSkillsAdd = (e)=>{
        e.preventDefault();
        if(form.newSkill.length <= 0) return;
        if(form.newSkill.length > 20){
            setErrorMessageSkill("Size of skill should be less than 20");
            return;
        }
        setfield("skills", [...form.skills, form.newSkill]);
        setIsClickedSkills(false);
        setfield("newSkill", "");
        setErrorMessageSkill("");
    }
    const swapPasswordType = ()=>{
        if(form.passwordType === "password") setfield("passwordType", "text");
        else setfield("passwordType", "password");
    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if(!form.email){
            return;
        }
        if(form.password !== form.confirmPassword){
            setPasswordMatchError("Both passwords must match!");
            return;
        }
        try{
            const responseData = await fetchAddProfile({
                firstName: form.firstName, 
                lastName: form.lastName, 
                email: form.email, 
                password: form.password, 
                age: form.age, 
                gender: form.gender, 
                skills: form.skills, 
                about: form.about
            });

            alert(responseData.message);
            return navigate("/login");
        } catch (err) {
            const {status, statusText, data} = err?.response;
            if(status === 423 || status === 409){
                alert(data?.message);
                return;
            }
            else return navigate("/*", {state: {status, statusText, data}});
        }
    }
    return (
        <div className="min-h-min min-w-full">
            <div className="mx-auto my-10 max-w-fit bg-base-200 border border-base-300 rounded-box pt-3 shadow-[0_0_10px_rgba(147,197,253,0.3)]">
                <p className="text-xl font-bold mx-auto text-center">Signup</p>
                <div className="carousel flex max-w-xs overflow-hidden">
                    <form className="fieldset flex flex-col justify-between bg-base-200 rounded-box w-2xs p-4 carousel-item" id="slide1">
                        <div>
                            <p className="text-lg font-bold">Personal Information:</p>
                            <fieldset className="fieldset">
                                <label className="label">First Name</label>
                                <input className="input validator outline-0" 
                                    type="text" 
                                    placeholder="First Name" 
                                    required 
                                    minLength="4"
                                    maxLength="16"
                                    autoComplete="given-name"
                                    value={form.firstName}
                                    onChange={(e)=>{setfield("firstName", e.target.value)}}/>
                                <p className="text-rose-400">{firstNameError}</p>
                            </fieldset>

                            <fieldset className="fieldset">
                                <label className="label">Last Name</label>
                                <input className="input validator outline-0" 
                                    type="text" 
                                    placeholder="Last Name" 
                                    autoComplete="family-name"
                                    value={form.lastName}
                                    onChange={(e)=>{setfield("lastName", e.target.value)}}/>
                                <p className="text-rose-400">{lastNameError}</p>
                            </fieldset>

                            <fieldset className="fieldset">
                                <span className="label">Gender</span>
                                <label className="select validator outline-0">
                                    <select>
                                        <option onClick={()=>{setfield("gender", "male")}}>Male</option>
                                        <option onClick={()=>{setfield("gender", "female")}}>Female</option>
                                        <option onClick={()=>{setfield("gender","others")}}>Others</option>
                                        <option onClick={()=>{setfield("gender", null)}}>Prefer not to say</option>
                                    </select>
                                </label>
                            </fieldset>
                            
                            <label className="fieldset">
                                <span className="label">Age</span>
                                <input className="input validator outline-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                                    type="number"
                                    placeholder="Age"
                                    value={form.age}
                                    required 
                                    min="16"
                                    max="70"
                                    autoComplete="bday-year"
                                    onChange={(e)=>{setfield("age", e.target.value)}}/>
                                <p className="text-rose-400">{ageError}</p>
                            </label>

                        </div>

                        <a  className="btn btn-info mt-4" href="#slide2" onClick={firstPageNextHandler}>Next</a>
                    </form>
                    <form className="fieldset bg-base-200 rounded-box w-2xs p-4 max-h-full carousel-item flex flex-col justify-between" id="slide2">
                        <div>
                            <p className="text-lg font-bold">Professional Information:</p>
                            <fieldset className="fieldset">
                                <label className="label">About</label>
                                <textarea className="validator input min-h-28 rounded-md outline-0 resize-none whitespace-pre-wrap p-2"
                                    placeholder="Hey there! I am on Linker." 
                                    defaultValue={form.about || "Hey there! I am on Linker."}
                                    wrap="soft"
                                    maxLength="200"
                                    onChange={(e)=>{
                                        if(e.target.value.length >= 200)setAboutError("Maximum number of characters allowed is 200");
                                        else setAboutError("");
                                        setfield("about", e.target.value);
                                    }}>
                                </textarea>
                                <p className="text-rose-400">{aboutError}</p>

                            </fieldset>

                            <label className="label mt-3">Your Skills</label>
                            <div className="flex flex-wrap gap-2 border border-gray-500/60 rounded-md p-2 bg-base-100 mt-1 min-h-30 max-h-30 overflow-y-scroll no-scrollbar" >{
                                form.skills.map((element, index) => (
                                    <p key={index}  className="max-w-fit max-h-min py-1 px-3 rounded-md bg-base-300 relative">
                                        {element} 
                                        <button className="absolute cursor-pointer right-0 top-0 -translate-y-1/2 translate-x-1/2"
                                        type="button"
                                        value="cancel"
                                        onClick={(e)=>{handleSkillsRemove(index)}}>
                                            <FaTimes />
                                        </button>
                                    </p>
                                ))}
                                {form.skills.length < 20 ?
                                <><label htmlFor="my_modal_6" className="btn max-h-min max-w-min py-1 px-3 rounded-md bg-base-300" onClick={()=>{setIsClickedSkills(true)}}><FaPlus/></label>

                                <input type="checkbox" checked={isClickedSkills} readOnly className="modal-toggle" />
                                <div className="modal " role="dialog"onKeyDown={(e)=>{
                                        if(e.key == "Enter") handleSkillsAdd(e);
                                    }}>
                                    <div className="modal-box bg-base-200/70 backdrop-blur-xs w-xs">
                                        <h3 className="text-lg font-bold">Enter Your New Skill</h3>
                                        <input  className="input outline-0 w-full my-3" 
                                        type="text"
                                        value={form.newSkill}
                                        onChange={(e)=>{setfield("newSkill", e.target.value)}}/>
                                        <p className="text-rose-400">{errorMessageSkill}</p>
                                        <div className="modal-action">
                                            <label  className="btn" 
                                            htmlFor="my_modal_6"
                                            onClick={()=>{
                                                setfield("newSkill", "")
                                                setErrorMessageSkill("")
                                                setIsClickedSkills(false)}}><FaTimes />
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
                        <div className="flex min-w-2xs gap-6">
                            <a href="#slide1" className="btn btn-neutral mt-4 flex-1/2">Previous</a>
                            <a className="btn btn-info mt-4 flex-1/2" href="#slide3">Next</a>
                        </div>
                        
                    </form>
                    <form className="fieldset bg-base-200 rounded-box w-2xs p-4 max-h-full carousel-item flex flex-col justify-between" 
                        id="slide3" 
                        method="post"
                        autoComplete="on"
                        onSubmit={handleSubmit}>
                        <div>
                            <p className="text-lg font-bold">Authentication:</p>
                            <fieldset className="fieldset" >
                                <label className="label">Email</label>
                                <input  className="input validator outline-0" 
                                    type="email" 
                                    placeholder="Email" 
                                    required 
                                    value={form.email}
                                    pattern="^(?=.*@.*\.).+$"
                                    autoComplete="username"
                                    onChange={(e)=>{setfield("email", e.target.value)}}/>
                                <p className="validator-hint hidden m-0">Enter valid email!</p>
                            </fieldset>

                            <fieldset className="fieldset">
                                <span className="label">Password</span>
                                <div className="input validator relative outline-0">
                                    <input 
                                        type={form.passwordType} 
                                        placeholder="Password" 
                                        required 
                                        value={form.password}
                                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$"
                                        minLength="8"
                                        name="password"
                                        autoComplete="new-password"
                                        onChange={(e)=>{setfield("password", e.target.value)}}/>
            
                                    <button 
                                        type="button"
                                        onClick={swapPasswordType}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-400">
                                            {form.passwordType ==="password" ? <FaEye /> : <FaEyeSlash />}
                                    </button>
                                </div>
                                <span className="validator-hint hidden my-0">Required</span>
                            </fieldset>

                            <fieldset className="fieldset">
                                <span className="label">Confirm Password</span>
                                <input  className="input validator outline-0" type="password" 
                                    placeholder="Confirm Password"
                                    value={form.confirmPassword} 
                                    required 
                                    name="confirm-password"
                                    autoComplete="new-password"
                                    onChange={(e)=>{setfield("confirmPassword", e.target.value)}}/>
                                <span className="validator-hint hidden m-0">Required</span>
                            </fieldset>
                            <p className="text-rose-400">{passwordMatchError}</p>

                        </div>
                        <div className="flex gap-6">
                            <a className="btn btn-neutral mt-4 flex-1/2" href="#slide2">Previous</a>
                            <button className="btn btn-info mt-4 flex-1/2" type="submit">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup