import { useEffect, useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { addRequests } from "../utils/requestsSlice";
import { fetchLogin, fetchRequestData, fetchUserData } from "../utils/fetchData";

const Login = () => {
    const [errorMessage, setErrorMessage] = useState("");    
    // password show logic
    const [passwordType, setPasswordType] = useState("password");
    const swapPasswordType = ()=>{
        if(passwordType === "password") setPasswordType("text");
        else setPasswordType("password");
    }

    // api call and user add logic
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const apiCallLogin = async (e)=>{
        e.preventDefault();
        try{
            const res = await fetchLogin({email, password});
            dispatch(addUser(res));
            setPassword("");
            setEmail("");

            (async function () {
                try{
                    const requests = await fetchRequestData(navigate);
                    dispatch(addRequests(requests));
                } catch (err){
                    const {status, statusText, data} = err?.response
                    if(status === 401) return;
                    else return navigate("/*", {state: {status, statusText, data}});
                }
            })();
            return navigate("/");
        } catch (err) {
            const {status, statusText, data} = err?.response
            if(status === 401){
                setErrorMessage(data?.message);
            }
            else return navigate("/*", {state: {status, statusText, data}});
        }
    }
    const user = useSelector((store)=>store.user);
    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[]);
    return (
        <div className="min-h-fit min-w-full">
            <form className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 my-7 mx-auto shadow-[0_0_12px_rgba(147,197,253,0.3)]">
                <p className="text-xl font-bold mx-auto">Login</p>
                <fieldset className="fieldset">
                    <label className="label">Email</label>
                    <input 
                        type="email" 
                        className="input validator outline-0" 
                        placeholder="Email" 
                        required 
                        value={email}
                        onChange={(e)=>{setEmail(e.target.value)}}/>

                    <p className="validator-hint hidden my-0">Required</p>
                </fieldset>

                <fieldset className="fieldset">
                    <span className="label">Password</span>
                    <div className="input validator relative outline-0">
                        <input 
                            type={passwordType} 
                            placeholder="Password" 
                            required 
                            value={password}
                            onChange={(e)=>{setPassword(e.target.value)}}/>

                        <button 
                            type="button"
                            onClick={swapPasswordType}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-400">
                                {passwordType ==="password" ? <FaEye /> : <FaEyeSlash />}
                        </button>
                    </div>
                        <span className="validator-hint hidden my-0">Required</span>
                </fieldset>
                <p className="text-rose-400">{errorMessage}</p>
                <button className="btn btn-info mt-4 font-bold" type="submit" onClick={apiCallLogin}>Login</button>
                <button className="btn btn-ghost mt-1" type="reset" 
                    onClick={()=>{
                        setEmail("");
                        setPassword("");
                        setErrorMessage("");
                    }}>Reset</button>
                
                <p className="m-auto">Don't you have an account till yet? <Link to="/signup" className="link link-primary">Signup</Link></p>
            </form>
        </div>
    )
}

export default Login