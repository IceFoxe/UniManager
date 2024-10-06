import './CompStyles/ContentTasks.css'
import TaskAdd from './TaskAdd.tsx'
import Task from './Task.tsx'
import { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios or any other HTTP client library

function ContentTasks() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/taskget');
                setTasks(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    });

    return (
        <>
            <div className={'task-container-mini'}>
                {tasks.map((task, index) => (
                    <Task key={index} task={task} />
                ))}
                <TaskAdd />
            </div>
        </>
    );
}

export default ContentTasks;

