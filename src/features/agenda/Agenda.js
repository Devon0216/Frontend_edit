import axios from "axios";

// Agenda function to create a Miro's text field acting as the application's timer with given Miro access token, the board ID and the content for the text component, by calling the Miro API
export const createTimerAPI = async (access_token, boardID, content) => {
    const options = {
        'method': 'POST',
        'url': `https://api.miro.com/v2/boards/${boardID}/texts`,
        'headers': {
            'Authorization': `Bearer ${access_token}`,
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        data: {
            "data": {
                "content": `${content}`
            },
            "style": {
                "fontSize": "300"
            }
        }
    };
    
    try {
        const result = await axios(options);
        return result;
    } catch (e) {
        console.log(e);
    }
}

// Agenda function to get a Miro's text field acting as the application's timer with given Miro access token, the board ID and the text component's ID, by calling the Miro API
export const getTimerAPI = async (access_token, boardID, itemID) => {
    const options = {
        'method': 'GET',
        'url': `https://api.miro.com/v2/boards/${boardID}/items/${itemID}`,
        'headers': {
            'Authorization': `Bearer ${access_token}`,
            'accept': 'application/json',
        },
        data: {

        }
    };
    
    try {
        const result = await axios(options);
        return result;
    } catch (e) {
        console.log(e);
    }
}

// Agenda function to update a Miro's text field acting as the application's timer with given Miro access token, the board ID, the text component's ID and the new content for the text component, by calling the Miro API
export const updateTimerAPI = async (access_token, boardID, itemID, content) => {
    const options = {
        'method': 'PATCH',
        'url': `https://api.miro.com/v2/boards/${boardID}/texts/${itemID}`,
        'headers': {
            'Authorization': `Bearer ${access_token}`,
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        data: {
            "data": {
                "content": `${content}`
            },
            "style": {
                "fontSize": "300",
                "color": "#fa0505"
            }
        }
    };
    
    try {
        const result = await axios(options);
        return result;
    } catch (e) {
        console.log(e);
    }
}

// Agenda function to add agenda to the current workshop database given the workshop ID and the agenda, by calling the server API
export const addAgendaAPI = async (workshopID, workshopAgenda) => {
    const options = {
        'method': 'PATCH',
        'url': `https://whiteboarddj-server.onrender.com/workshops/userworkshop`,
        'headers': {
            'content-type': 'application/json'
        },
        data: {
            id: workshopID,
            workshopAgenda: workshopAgenda
        }
    };
    
    try {
        const result = await axios(options);
        return result;
    } catch (e) {
        console.log(e);
    }
}

// Agenda function to delete the agenda for the current workshop database given the workshop ID, by calling the server API
export const deleteAgendaAPI = async (workshopID) => {
    const options = {
        'method': 'DELETE',
        'url': `https://whiteboarddj-server.onrender.com/workshops/userworkshop`,
        'headers': {
            'content-type': 'application/json'
        },
        data: {
            id: workshopID
        }
    };
    
    try {
        const result = await axios(options);
        return result;
    } catch (e) {
        console.log(e);
    }
}