import './CompStyles/Task.css'
import addButton from '../assets/add.svg'
import axios from "axios";
import {useState} from "react";
import { v4 as uuidv4 } from "uuid";

function TaskAdd() {
    const [title] = useState(' ');
    const [description] = useState(' ');

        const handleTaskAdd = async () => {
            try {
                const taskId = uuidv4();
                await axios.post('http://localhost:3001/addtask', { taskId, title, description });
            } catch (error) {
                console.error('Error adding task:', error);
            }

        };
    return (
        <div className={'task-container'}>
            <button className={'add-button'} onClick={handleTaskAdd}>
                <img src={addButton} alt={'add-button'}/>
            </button>
            <h3>Add task</h3>
        </div>
    )
}

export default TaskAdd;
