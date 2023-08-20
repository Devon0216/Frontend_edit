// function startCountdown(durationInSeconds) {
//     let remainingTime = durationInSeconds;
  
//     const interval = setInterval(() => {
//       if (remainingTime <= 0) {
//         clearInterval(interval); // Clear the interval when countdown is done
//         document.getElementById("timer").innerHTML = "expired"
//       } else {
//         if (remainingTime > 3600){
//           let hours = Math.floor(remainingTime / (60*60));
//           let minutes = Math.floor((remainingTime - 3600 * hours)/60) ;
//           let seconds = remainingTime % 60;
//           document.getElementById("timer").innerHTML =  hours + "h " + minutes + "m " + seconds + "s ";
//         }
//         else if (remainingTime > 60){
//           let hours = 0 ;
//           let minutes = Math.floor(remainingTime /60);
//           let seconds = remainingTime % 60;
//           if (minutes === 60){
//             minutes = 59
//             seconds = remainingTime / 60;
//           }
//           document.getElementById("timer").innerHTML =  hours + "h " + minutes + "m " + seconds + "s ";
//         }
//         else{
//           let hours = 0;
//           let minutes = 0;
//           let seconds = remainingTime % 60;
//           document.getElementById("timer").innerHTML =  hours + "h " + minutes + "m " + seconds + "s ";
//         }

//         remainingTime--;
//       }
//     }, 1000); // Run the interval every 1000ms (1 second)
//   }


// const Timer = () => {

//     startCountdown(3605);

//     let content = (
//         <section>
//             <h1>To view the notes content, authorize first with miro</h1>
//             <h1 id="timer">response</h1>
//         </section>

//     )

//     return content
// }

// export default Timer