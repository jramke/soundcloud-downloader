console.log('ext running');

// document.addEventListener("DOMContentLoaded", function () {
//     const btnAction = document.getElementById("btnAction");
//     btnAction.addEventListener("click", async function () {
//         getTrack();
//     });
// });

async function getTrack() {
    try {
      const response = await fetch("http://localhost:8080/download", {
        method: "GET",
        // headers: {
        //   "Content-Type": "application/json",
        // },
        // body: JSON.stringify({ track: 'imtenpi/snowflake' }),
      });
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }