import { useNavigate, Link } from 'react-router-dom'

const openURL = async () =>  {
    window.open(`https://whiteboarddj-server.onrender.com/miro`, "_self")
}

const Welcome = () => {
    const navigate = useNavigate();


    function gotoPastWorkshop() {
        navigate('/dash/pastWorkshop')
    }

    function gotoHelp() {
        navigate('/dash/help')
    }


    const content = (
        <section className="welcome">
            <main>
                <div>
                    <h1 class="sectionHeading">Home Page!</h1>
                    <p>This application is used to interact with Miro board, to be able to do this, please authorize through Miro first, so that you can use this application properly.</p>
                    <button class="button-orange" onClick={openURL}>Authorize</button>                
                </div>

                <div>
                    <br/>
                    <br/>
                    <button class="button-orange" onClick={gotoPastWorkshop }>Past Workshop</button>
                    <br/>
                    <br/>
                    <button class="button-orange" onClick={gotoHelp}>Help</button>
                    
                </div>
            </main>

        </section>

        
    )

    return content
}
export default Welcome