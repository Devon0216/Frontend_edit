import axios from "axios";

// Workshop function to create a new workshop with given user ID and workshop name, by calling the server API
export const createWorkshopAPI = async (userID, workshopname) => {
    const options = {
        'method': 'POST',
        'url': `https://whiteboarddj-server.onrender.com/workshops`,
        'headers': {
            'content-type': 'application/json'
        },
        data: {
            User: userID,
            workshopname: workshopname
        }
    };
    
    try {
        const result = await axios(options);
        return result;
    } catch (e) {
        return JSON.parse(e.request.responseText).message
    }
}

// Workshop function to get a workshop with given workshop name, by calling the server API
export const getWorkshopByNameAPI = async ( workshopname) => {
    const options = {
        'method': 'POST',
        'url': `https://whiteboarddj-server.onrender.com/workshops/workshopByName`,
        'headers': {
            'content-type': 'application/json'
        },
        data: {
            workshopname: workshopname
        }
    };
    
    try {
        const result = await axios(options);
        return result;
    } catch (e) {
        console.log(e)
        return JSON.parse(e.request.responseText).message
    }
}

// Workshop function to update a workshop with given workshop ID, user ID and notes, by calling the server API
export const updateWorkshopAPI = async (workshopID, userID, notes) => {
    const options = {
        'method': 'PATCH',
        'url': `https://whiteboarddj-server.onrender.com/workshops`,
        'headers': {
            'content-type': 'application/json'
        },
        data: {
            id: workshopID,
            User: userID,
            Note: notes
        }
    };
    
    try {
        const result = await axios(options);
        return result;
    } catch (e) {
        console.log(e);
    }
}



