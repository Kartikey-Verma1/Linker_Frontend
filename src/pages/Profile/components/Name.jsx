import { useState } from "react";
import { FaCheck, FaEdit, FaTimes } from "react-icons/fa";

const Name = ({edit, data, editCall}) => {
    const [isClicked, setIsClicked] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [formData, setFormData] = useState({
        firstName: data.firstName,
        lastName: data.lastName
    });

    const handleChange = (field, value)=>{
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }

    const handleName = async (e) => {
        e.preventDefault();
        if(e.currentTarget.value === "cancel"){
            setFormData(({
                firstName: data.firstName,
                lastName: data.lastName || ""
            }));
            setIsClicked(false);
            setErrorMessage("");
            return;
        } else {
            if(formData.firstName === data.firstName && formData.lastName === data.lastName){
                setIsClicked(false);
                return;
            }
            else if(formData.firstName.length < 4 || (formData.lastName.length < 4 && formData.lastName.length > 0)){
                setErrorMessage("Length of first name or last name should be more than 4")
                return;
            }
            else{
                let lastName = null;
                if(formData.lastName.length >= 4) lastName = formData.lastName;
                const dataToPass = {firstName: formData.firstName, lastName};
                await editCall(dataToPass);
                setErrorMessage("");
                setIsClicked(false);
            }
        }
    }
    return (
        <>
        {!isClicked ?
            // showing name
            (<p className="card-title text-2xl my-4">{`${formData.firstName} ${formData.lastName}`} 
                {edit ? <button className="cursor-pointer text-xs mx-4" onClick={()=>setIsClicked(true)}>
                    <FaEdit />
                </button>: <></>}
            </p>) :
            // editing name
            (<div>
                <form className="card-title text-2xl mt-4 flex" onSubmit={handleName}>
                    <div className="flex gap-3 flex-col">
                        <fieldset>
                            <input className="input validator outline-0 " 
                                type="text" 
                                placeholder="First Name"
                                required
                                value={formData.firstName} 
                                onChange={(e)=>{handleChange("firstName", e.target.value)}}/>
                        </fieldset>
                        <fieldset>
                            <input className="input validator outline-0 " 
                                type="text" 
                                placeholder="Last Name"
                                value={formData.lastName} 
                                onChange={(e)=>{handleChange("lastName", e.target.value)}}/>
                        </fieldset>
                    </div>
                    <div className="flex">
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
                    </div>
                </form>
                <p className="text-rose-400">{errorMessage}</p>
            </div>)
        }
        </>
    )
}

export default Name