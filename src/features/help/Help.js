const Help = () => {

    let content = (
        <section>
            <h1 className="sectionHeading">Help documentation:</h1>
            <p> 
                You are acting as a facilitator or a coach of a Design Thinking workshop. 
                This tool is to help you to better manage the workshop, with usage of a Miro shared whiteboard.
                You are interacting with a Miro shared whiteboard, so you have to authorise through Miro first to use this application.
            </p>

            <h1 className="sectionHeading">Sticky Notes feature:</h1>
            <p> 
                Get Participants Notes: You can view the sticky notes contents(added by workshop participants) on the Miro board.
                <br></br>
                Save sticky ntoes to workshop: You can save sticky notes to the current workshop. (can be viewed in Past Workshop page)
                Summarise the notes: You can summarise the sticky notes contents, and save the summary to the current workshop. (can be viewed in Past Workshop page)
            </p>




        </section>

    )

    return content
}

export default Help