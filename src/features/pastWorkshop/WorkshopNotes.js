import React, { useState, useEffect } from "react";
import axios from "axios";
// import { useNavigate } from 'react-router-dom'


var textfileContent = "";


const NoteItem = ({ noteContent }) => {
    return(
    <tr className="table__row user">
        <td className={`table__cell ` }>{noteContent}</td>
    </tr>
)};

const WorkshopNotes = () => {
    const [notes, setNotes] = useState([]);
    const [fetchedAgendaSession, setFetcgedAgendaSession] = useState('');

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
            // console.log("global.workshopID");
            // console.log(global.workshopID);
            // console.log("result.data");
            // console.log(result.data);
            setNotes(result.data);


            // console.log("notes")
            // console.log(notes)
            return result;
        } catch (e) {
            console.log(e);
            document.getElementById("notesError").innerHTML = JSON.parse(e.request.responseText).message
        }
    };

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

    const downloadTxt = () => {
      var textfileContent = "Notes:\n"
      // console.log("notes.length")
      // console.log(notes.length)
      for (let i = 0;i < notes.length;i++){
        textfileContent += notes[i].content + "\n"
      }
      textfileContent = textfileContent + "\nSummary: \n" + document.getElementById("summary").innerHTML + "\nAgenda: \n" + fetchedAgendaSession;
      // console.log("textfileContent")
      // console.log(textfileContent)
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

        <h1 id="Summarisation" className="sectionHeading">Summary:</h1>
        <p id="summary" style={{ whiteSpace: 'pre-line' }}></p>
        <p id="summaryError"></p>
        <h1 id="agenda" className="sectionHeading">Agenda:</h1>
        <p id="agendaError"></p>
        {fetchedAgendaSession.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
        ))}

        <p id="textfileContent"></p>
        <br></br>
        <br></br>
        <button class="button-orange" onClick={downloadTxt}>Download workshop content as txt file</button>
      </section>
    );


}
export default WorkshopNotes