import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../redux/userSlice.js";
import { fetchChangePassword, fetchUserData } from "../../utils/fetchData.js";

const PasswordChange = () => {
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmNewPass, setConfirmNewPass] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((store)=>store.user);
    
    useEffect(()=>{
        if(!user){
            (async () => {
                try{
                    const user = await fetchUserData();
                    dispatch(addUser(user));
                } catch (err){
                    const {status, statusText, data} = err?.response
                    if(status === 401) return navigate("/login");
                    else return navigate("/*", {state: {status, statusText, data}});
                }
            })();
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            if(newPass != confirmNewPass){
                setErrorMessage("Confirm password should be same as new password");
                return;
            }
            const fetchedData = await fetchChangePassword({
                password: oldPass, 
                newPassword: newPass, 
                confirmNewPassword: confirmNewPass
            });
            alert(fetchedData.message);
            setOldPass("");
            setNewPass("");
            setConfirmNewPass("");
            setErrorMessage("");
            navigate("/profile");
        } catch (err) {
            const {status, statusText, data} = err?.response;
            if(status == 422){
                setErrorMessage(data.message);
                return;
            }
            if(status === 401){
                alert("User must be logged in to change password!");
                setOldPass("");
                setNewPass("");
                setConfirmNewPass("");
                setErrorMessage("");
                navigate("/login");
            }  
            else return navigate("/*", {state: {status, statusText, data}});
        }
    }
    return (
        <div className="min-w-full h-fit">
            <div className="mt-5 mx-8">
                <Link to="/profile" className="rounded-full px-3.5 py-2 hover:bg-base-200">❮</Link>
            </div>
            {user ? (<form className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 shadow-[0_0_12px_rgba(147,197,253,0.3)] my-10 mx-auto" onSubmit={handleSubmit}>
                <p className="text-xl font-bold mx-auto">Password Change</p>
                <fieldset className="fieldset">
                    <label className="label">Old Password</label>
                    <input className="input validator outline-0" 
                        type="password"  
                        placeholder="Old Password" 
                        value={oldPass} 
                        required 
                        onChange={(e)=>{setOldPass(e.target.value)}}/>
                    <p className="validator-hint hidden m-0">Required</p>
                </fieldset>

                <label className="fieldset">
                    <span className="label">New Password</span>
                    <input className="input validator outline-0" 
                        type="password"  
                        placeholder="New Password" 
                        value={newPass} 
                        required 
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$"
                        onChange={(e)=>{setNewPass(e.target.value)}}/>
                    <span className="validator-hint hidden m-0">Must include uppercase, lowercase, number, and special character</span>
                </label>
                <label className="fieldset">
                    <span className="label">Confirm New Password</span>
                    <input className="input validator outline-0" 
                        type="password"  
                        placeholder="Confirm New Password" 
                        value={confirmNewPass} 
                        required 
                        onChange={(e)=>{setConfirmNewPass(e.target.value)}}/>
                    <span className="validator-hint hidden m-0">Required</span>
                </label>
                <p className="text-rose-400">{errorMessage}</p>
                <button className="btn btn-neutral mt-4" type="submit">Submit</button>
            </form>): 
            <div className="rounded-box mx-auto my-7 w-xs h-86 skeleton shadow-[0_0_12px_rgba(147,197,253,0.3)]"></div>}
        </div>
    )
}

export default PasswordChange