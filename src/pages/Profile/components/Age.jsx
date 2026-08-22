import { useState } from "react"
import { FaCheck, FaEdit, FaTimes } from "react-icons/fa";
import { FaCakeCandles } from "react-icons/fa6";

const Age = ({edit, data, editCall}) => {
    const [isClicked, setIsClicked] = useState(false);
    const [age, setAge] = useState(data);
    const [errorMessageAge, setErrorMessageAge] = useState("");
    const handleAge = async (e) => {
        e.preventDefault();
        if(e.currentTarget.value == "cancel"){
            setAge(data)
            setIsClicked(false);
            setErrorMessageAge("");
            return;
        }
        if(age === data){
            setIsClicked(false);
            return;
        }
        if(age < 16){
            setErrorMessageAge("Sorry, You are too young to work!");
            return;
        }
        if(age > 70){
            setErrorMessageAge("Sorry, You are too old to work!");
            return;
        }
        await editCall({age: age});
        setErrorMessageAge("");
        setIsClicked(false);
        return;
    }
    return (
        <div className="border border-gray-500 rounded-md p-3 bg-base-100 flex-1/2">
            {!isClicked ?
                (<div>
                    <div className="flex">
                        <p className="text-lg font-bold max-w-fit">Age</p> 
                        {edit ? <button className="cursor-pointer text-xs ml-3.5" onClick={()=>setIsClicked(true)}>
                            <FaEdit />
                        </button> : <></>}
                    </div>
                    
                    <p className="py-2 flex items-center gap-2"><FaCakeCandles /> {age}</p>
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
                                defaultValue={age} 
                                onChange={(e)=>{setAge(e.target.value)}}/>
                                <p className="text-rose-400">{errorMessageAge}</p>
                        </fieldset>
                    </form>
                </div>)
            }
                
        </div>
    )
}

export default Age