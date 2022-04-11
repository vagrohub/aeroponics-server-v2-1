import fetch from 'node-fetch';
import { dateToString } from '../../utils/date.js';
import { url } from '../../app.config.js';

const createNewExperiment = async (
    title = 'Новый эксперимент',
    description = `Создан автоматически ${dateToString(new Date())}`
) => {
     let response = await fetch(
        `${url}/experiment/new`,
        {
            method: 'POST',
            body: JSON.stringify({
                title,
                description
            }),
            headers: { 'Content-Type': 'application/json' }
        }
    );
    
    if (!response.ok) {
        throw new Error('Failed to create new experiment');
    }

    let { id } = await response.json();

    return id;
};

const excludeSensitiveData = (device) => {
    return {
        name: device.name,
        description: device.description,
        cycles: device.cycles,
        currentExperiment: device.currentExperiment,
        _id: device._id
    }
};

export {
    createNewExperiment,
    excludeSensitiveData
};