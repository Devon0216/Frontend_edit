import axios from "axios";

// Sticky notes function to get all the sticky notes from a Miro board with given Miro access token and Miro board ID, by calling the Miro API
export const getStickyNotes = async (access_token, boardID) => {
    const options = {
        'method': 'GET',
        'url': `https://api.miro.com/v2/boards/${boardID}/items?limit=50&type=sticky_note`,
        'headers': {
            'Authorization': `Bearer ${access_token}`
        },
        data: {
        }
    };
    
    try {
        const result = await axios(options);
        return result;
    } catch (e) {
        return e;
    }
}

// Sticky notes function to save all the sticky notes with given workshop name and the sticky notes content, by calling the Server API
export const saveStickyNotes = async (workshop, content) => {
    const options = {
        'method': 'POST',
        'url': `https://whiteboarddj-server.onrender.com/notes`,
        'headers': {
          'Content-Type': 'application/json'
        },
        data: {
          workshop: workshop,
          content: content
        }
    };
    
    try {
        const result = await axios(options);
        return result;
    } catch (e) {
        return e;
    }
}

// Sticky notes function to delete all the sticky notes for the given workshop name, by calling the Server API
export const deleteNotesByWorkshopAPI = async (workshop) => {
    const options = {
        'method': 'DELETE',
        'url': `https://whiteboarddj-server.onrender.com/notes/workshopNotes`,
        'headers': {
          'Content-Type': 'application/json'
        },
        data: {
          workshop: workshop,
        }
    };
    
    try {
        const result = await axios(options);
        return result;
    } catch (e) {
        return e;
    }
}

// Sticky notes function to get all the frames from the Miro board with given Miro access token and the Miro board ID, by calling the Miro API
export const getFrames = async (access_token, boardID) => {
    const options = {
        'method': 'GET',
        'url': `https://api.miro.com/v2/boards/${boardID}/items?limit=50&type=frame`,
        'headers': {
          'Authorization': `Bearer ${access_token}`,
          'accept': 'application/json',
          'content-type': 'application/json'
        },
        data: {
        }
    };
    
    try {
        const result = await axios(options);
        return result;
    } catch (e) {
        return e;
    }
}

// Sticky notes function to get all the sticky notes for a frame with given Miro access token, Miro board ID and the frame ID, by calling the Miro API
export const getFrameNotes = async (access_token, boardID, frameId) => {
    const options = {
        'method': 'GET',
        'url': `https://api.miro.com/v2/boards/${boardID}/items?parent_item_id=${frameId}`,
        'headers': {
          'Authorization': `Bearer ${access_token}`,
          'accept': 'application/json',
          'content-type': 'application/json'
        },
        data: {
        }
    };
    
    try {
        const result = await axios(options);
        return result;
    } catch (e) {
        return e;
    }
}

// Sticky notes function to summarise the sticky notes with given sticky notes and the sensitivity score, by calling the Server API
export const summariseAPI = async (notes, sensitivity) => {
    const options = {
        'method': 'POST',
        'url': `https://whiteboarddj-server.onrender.com/summarise`,
        'headers': {
            'content-type': 'application/json'
        },
        data: {
            notes: notes,
            sensitivity: sensitivity
        }
    };
    
    try {
        const result = await axios(options);
        return result;
    } catch (e) {
        return e;
    }
}

// Sticky notes function to add the summary content to the workshop with given workshop ID and the summary, by calling the Server API
export const addSummaryAPI = async (workshopID, workshopSummary) => {
  const options = {
      'method': 'PATCH',
      'url': `https://whiteboarddj-server.onrender.com/workshops/workshopByName`,
      'headers': {
          'content-type': 'application/json'
      },
      data: {
          id: workshopID,
          workshopSummary: workshopSummary
      }
  };
  
  try {
      const result = await axios(options);
      return result;
  } catch (e) {
      return e;
  }
}