import { useState } from "react"
import { FaCheck, FaEdit, FaTimes } from "react-icons/fa";

const About = ({edit, data, editCall}) => {
    const [errorMessageAbout, setErrorMessageAbout] = useState("");
    const [isClicked, setIsClicked] = useState(false);
    const [about, setAbout] = useState(data);
    const handleAbout = async (e) => {
        e.preventDefault();
        if(e.currentTarget.value === "cancel"){
            setAbout(data);
            setIsClicked(false);
            setErrorMessageAbout("");
            return;
        }
        if(about === data){
            setIsClicked(false);
            return;
        }
        if(about.length > 200){
            setErrorMessageAbout("Max number of letters allowed is 200");
            return;
        }
        const dataToPass = {about: about || null};
        await editCall(dataToPass);
        setErrorMessageAbout("");
        setIsClicked(false);
    }
    return (
        <div className="border border-gray-500 rounded-md p-3 bg-base-100">
            {!isClicked ?
                (<div>
                    <p className="text-lg font-bold">About 
                        {edit ? <button className="cursor-pointer text-xs mx-4" onClick={()=>setIsClicked(true)}>
                            <FaEdit />
                        </button>: <></>}
                    </p>
                    <p className="py-2">{about}</p>
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
                                    defaultValue={about || "Hey there! I am on Linker."}
                                    wrap="soft"
                                    onChange={(e)=>{setAbout(e.target.value)}}
                                />
                            </fieldset>
                        </form>
                    </div>)
                }
                
            </div>
    )
}

export default About