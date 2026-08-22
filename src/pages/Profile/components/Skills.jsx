import { useState } from "react";
import SkillsDraggableEditable from "../../../components/SkillsDraggableEditable";
import { DragDropProvider } from "@dnd-kit/react";
import { FaCheck, FaEdit, FaPlus, FaTimes } from "react-icons/fa";

const Skills = ({edit, data, editCall}) => {
    const [isClicked, setIsClicked] = useState(false);
    const [toggle, setToggle] = useState(false);
    const [newSkill, setNewSkill] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [dragIndex, setDragIndex] = useState(null);
    const [skills, setSkills] = useState(data);

    const isEqual = ()=>{
        if(data.length != skills.length) return false;
        return skills.every((val, index)=>val === data[index]);
    }
    const handleSubmit = (e)=>{
        if(e.currentTarget.value == 'cancel'){
            setSkills(data);
        } else if(!isEqual()) {
            editCall({skills: skills});
        }
        setIsClicked(false);
    }
    const handleSkillsRemove = async (index) => {
        setSkills(skills.filter((element, i)=> i != index));
    }
    const handleSkillsAdd = async (e) => {
        e.preventDefault();
        if(newSkill.length <= 0) return;
        if(newSkill.length > 20){
            setErrorMessage("Size of skill should be less than 20");
            return;
        }
        setSkills([...skills, newSkill]);
        setErrorMessage("");
        setNewSkill("");
        setToggle(false);
    }
    const handleDragEnd = async (e) => {
        const targetIndex = e.operation.target.index;
        if(targetIndex === dragIndex) return;

        const updatedSkills = [...skills];
        const [item] = updatedSkills.splice(parseInt(dragIndex), 1);
        updatedSkills.splice(parseInt(targetIndex), 0, item);
        setSkills(updatedSkills);
    }
    const handleDragStart = async(e) => {
        const id = e.operation.target.index;
        setDragIndex(id);
    }

    return (
        <div className="border border-gray-500 rounded-md p-3 bg-base-100 ">
            <div className="text-lg font-bold flex">Skills
                {edit? 
                    !isClicked ? <button className="cursor-pointer text-xs mx-4" onClick={()=>setIsClicked(true)}>
                        <FaEdit />
                    </button>: 
                    <div className="flex items-center gap-2 mx-2">
                        <button className="text-sm cursor-pointer btn btn-sm btn-ghost" 
                            value="cancel"
                            type="button"
                            onClick={handleSubmit}
                        >
                            <FaTimes />
                        </button>
                        <button className="text-sm cursor-pointer btn btn-sm btn-ghost" 
                            value="save"
                            type="button"
                            onClick={handleSubmit}
                        >
                            <FaCheck />
                        </button>
                    </div> : 
                    <></>}
            </div>
            <div>
                <DragDropProvider onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
                    <ul className="flex flex-wrap" id="drag_context">
                        {skills.map((element, index) => (
                            isClicked? 
                                <SkillsDraggableEditable key={element} element={element} handleSkillsRemove={handleSkillsRemove} index={index} />:
                                <p key={index}  className="max-w-min mr-3 mt-2 p-1 px-3 rounded-md bg-base-300 relative">{element}</p>

                        ))}
                    </ul>
                </DragDropProvider>
                {skills.length < 20 && isClicked ?
                <><div className="text-right">
                    <label htmlFor="my_modal_6" className="btn max-h-min max-w-min mt-2 p-1 px-3 rounded-md bg-base-300" onClick={()=>{setToggle(true)}}><FaPlus/>Add</label>
                </div>
        
                <input className="modal-toggle" 
                    type="checkbox" 
                    checked={toggle} 
                    readOnly/>

                <div className="modal " role="dialog"onKeyDown={(e)=>{
                    if(e.key == "Enter") handleSkillsAdd(e);
                }}>
                    <div className="modal-box bg-base-200/70 backdrop-blur-xs w-xs">
                        <h3 className="text-lg font-bold">Enter Your New Skill</h3>
                        <input  className="input outline-0 w-full my-3" 
                            type="text"
                            value={newSkill}
                            onChange={(e)=>{setNewSkill(e.target.value)}}
                        />
                        <p className="text-rose-400">{errorMessage}</p>
                        <div className="modal-action">
                            <label  className="btn" 
                            htmlFor="my_modal_6"
                            onClick={()=>{
                                setNewSkill("");
                                setErrorMessage("");
                                setToggle(false)}}><FaTimes />
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
    )
}

export default Skills