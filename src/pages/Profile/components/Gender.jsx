import { useState } from "react"
import { FaEdit, FaGenderless, FaMars, FaVenus } from "react-icons/fa";

const Gender = ({edit, data, editCall}) => {
    const handleGender = async (e) => {
        if(e.currentTarget.value === data){
            document.activeElement.blur();
            return;
        }
        await editCall({gender: e.currentTarget.value || null});
        document.activeElement.blur();
    }
    return (
        <div className="border border-gray-500 rounded-md p-3 bg-base-100 flex-1/2">
            <div className="flex items-center">
                <p className="text-lg font-bold max-w-fit">Gender</p>
                <div className="dropdown dropdown-center">
                    {edit ? <div tabIndex={0} role="button" className="ml-3.5 cursor-pointer">
                        <div className="rounded-full text-xs">
                            <FaEdit />
                        </div>
                    </div>: <></>}
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
                (data)?
                    (data === "male"?
                        <span className="flex items-center gap-2"><FaMars /> Male</span>:
                        (data === "female" ?
                            <span className="flex items-center gap-2"><FaVenus /> Female</span>:
                            <span className="flex items-center gap-2"><FaGenderless />Others</span>)):
                    <span>N/A</span>
            }</p>
        </div>
    )
}

export default Gender