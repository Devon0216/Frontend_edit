const Help = () => {

    let content = (
        <section>
            {/* Explanation of the project's background */}
            <h1 className="sectionHeading">Help documentation:</h1>
            <p> 
                You are acting as a facilitator or a coach of a Design Thinking workshop. 
                This tool is to help you to better manage the workshop, with usage of a Miro shared whiteboard.
                You are interacting with a Miro shared whiteboard, so you have to authorise through Miro first to use this application.
            </p>
            <br></br>

            {/* Explanation of the sticky notes feature */}
            <h1 className="sectionHeading">Sticky Notes feature:</h1>
            <p> 
                Get Participants Notes: You can view the sticky notes contents(added by workshop participants) on the Miro board.
                <br></br>
                Save sticky ntoes to workshop: You can save sticky notes to the current workshop. (can be viewed in Past Workshop page)
                <br></br>
                Summarise the notes: You can summarise the sticky notes contents, and save the summary to the current workshop. (can be viewed in Past Workshop page)
                <br></br>
            </p>
            <br></br>

            {/* Explanation of the agenda feature */}
            <h1 className="sectionHeading">Agenda feature:</h1>
            <p> 
                Agenda table: You have a table of agenda items, you can add, edit, delete agenda items.
                <br></br>
                Count down: You can start and pause the count down timer for the current workshop's agenda.
                <br></br>
                Retrieve agenda: You can retrieve the agenda saved to the current workshop.
                <br></br>
                Save agenda: You can save the shown agenda to the current workshop. (can be viewed in Past Workshop page)
                <br></br>
                Clear agenda: You can clear the current agenda shown.
                <br></br>
                Delete agenda: You can delete the agenda for the current workshop.
                <br></br>
            </p>
            <br></br>

            {/* Explanation of the messaging feature */}            
            <h1 className="sectionHeading">Message feature:</h1>
            <p> 
                Send a Message to selected recipients: You can select the users who you want to send message to.
                <br></br>
                Chat History: You can see the messages you sent and received.
                <br></br>
            </p>
            <br></br>

            {/* Explanation of the past workshop feature */}
            <h1 className="sectionHeading">Past workshop feature:</h1>
            <p> 
                Select a workshop: You can select a workshop to view its details.
                <br></br>
                Download workshop data: You can download a text file of the workshop data.
                <br></br>
            </p>
            <br></br>
        </section>
    )
    return content
}

export default Help