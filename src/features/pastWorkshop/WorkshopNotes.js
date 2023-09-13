import React, { useState, useEffect } from "react";
import axios from "axios";

// Function to create a table row for the given sticky note content
const NoteItem = ({ noteContent }) => {
    return(
    <tr className="table__row user">
        <td className={`table__cell ` }>{noteContent}</td>
    </tr>
)};

const WorkshopNotes = () => {
    const [notes, setNotes] = useState([]);
    const [fetchedAgendaSession, setFetcgedAgendaSession] = useState('');

    // Sticky notes function to get all the sticky notes from a workshop with given workshop ID, by calling the server API
    const getNotesByWorkshop = async () => {
        const options = {
            'method': 'POST',
            'url': `https://whiteboarddj-server.onrender.com/notes/workshopNotes`,
            'headers': {
              'Content-Type': 'application/json'
            },
            data: {
              workshop: global.workshopID
            }
        };
        
        try {
            const result = await axios(options);
            setNotes(result.data);
            return result;
        } catch (e) {
            console.log(e);
            document.getElementById("notesError").innerHTML = JSON.parse(e.request.responseText).message
        }
    };

    // Sticky notes function to get the agenda and summary from a workshop with given workshop ID, by calling the server API
    const getyWorkshopById = async () => {
      const options = {
          'method': 'POST',
          'url': `https://whiteboarddj-server.onrender.com/workshops/workshopById`,
          'headers': {
            'Content-Type': 'application/json'
          },
          data: {
            id: global.workshopID
          }
      };
      
      try {
          const result = await axios(options);
          setFetcgedAgendaSession(result.data.workshopAgenda)
          document.getElementById("summary").innerHTML = result.data.workshopSummary;

          if (result.data.workshopAgenda === ""){
            document.getElementById("agendaError").innerHTML = "No agenda for this workshop"
          }
          if (result.data.workshopSummary === ""){
            document.getElementById("summaryError").innerHTML = "No summary for this workshop"
          }

          return result;
      } catch (e) {
          console.log(e);
      }
  };
  
    useEffect(() => {
        getNotesByWorkshop();
        getyWorkshopById();
    }, []);

    // Function to download the workshop content as a txt file
    const downloadTxt = () => {
      var textfileContent = "Notes:\n"
      for (let i = 0;i < notes.length;i++){
        textfileContent += notes[i].content + "\n"
      }
      textfileContent = textfileContent + "\nSummary: \n" + document.getElementById("summary").innerHTML + "\nAgenda: \n" + fetchedAgendaSession;
      const blob = new Blob([textfileContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'workshop.txt';
      document.body.appendChild(link);
      link.click();
      
      // Clean up after download
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  
    return (
      <section>
        <h1 id="test" className="sectionHeading" >Participants Sticky Notes: </h1>

        {/* Table to display the sticky notes */}
        <table className="table_workshop table--users">
          <thead className="table__thead">
            <tr>
              <th scope="col" className="table__th user__username">Notes List:</th>
            </tr>
          </thead>
          <tbody>
            {notes.map(note => (
                
              <NoteItem key={note._id} noteContent={note.content}/>
              
            ))}
          </tbody>
        </table>
        <p id="notesError"></p>

        {/* Display the summary and agenda information */}
        <h1 id="Summarisation" className="sectionHeading">Summary:</h1>
        <p id="summary" style={{ whiteSpace: 'pre-line' }}></p>
        <p id="summaryError"></p>
        <h1 id="agenda" className="sectionHeading">Agenda:</h1>
        <p id="agendaError"></p>
        {fetchedAgendaSession.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
        ))}

        {/* Button to download the workshop content as a txt file */}
        <p id="textfileContent"></p>
        <br></br>
        <br></br>
        <button class="button-orange" onClick={downloadTxt}>Download workshop content as txt file</button>
      </section>
    );


}
export default WorkshopNotes