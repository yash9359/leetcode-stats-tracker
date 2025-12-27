document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-btn");
  const usernameInput = document.getElementById("user-input");
  const statsContainer = document.querySelector(".stats-container");
  const easyProgressCircle = document.querySelector(".easy-progress");
  const mediumProgressCircle = document.querySelector(".medium-progress");
  const hardProgressCircle = document.querySelector(".hard-progress");
  const mediumLabel = document.getElementById("medium-label");
  const easyLabel = document.getElementById("easy-label");
  const hardLabel = document.getElementById("hard-label");
  const cardStatsContainer = document.querySelector(".stats-card");

  // return true or false based on regex
  function validateUsername(username) {
    if (username.trim() === "") {
      alert("Username Should not be empty");
      return false;
    }
    const regex = /^[a-z0-9][a-z0-9-]{1,13}[a-z0-9]$/;
    const isMatching = regex.test(username);
    if (!isMatching) {
      alert("Invalid Username");
    }
    return isMatching;
  }

  function updateProgress(solved, total, label, circle) {
    const progressDegree = (solved / total) * 100;
    circle.style.setProperty("--progress-degree", `${progressDegree}%`);
    label.textContent = `${solved}/${total}`;
  }

  function disPlayUserData(data) {

    statsContainer.style.display ="block";


    const totalQues = data.totalQuestions;
    const totalEasyQues = data.totalEasy;
    const totalMediumQues = data.totalMedium;
    const totalHardQues = data.totalHard;

    const solvedTotalQues = data.totalSolved;
    const solvedTotalEasyQues = data.easySolved;
    const solvedTotalMediumQues = data.mediumSolved;
    const solvedTotalHardQues = data.hardSolved;

    updateProgress(
      solvedTotalEasyQues,
      totalEasyQues,
      easyLabel,
      easyProgressCircle
    );
    updateProgress(
      solvedTotalMediumQues,
      totalMediumQues,
      mediumLabel,
      mediumProgressCircle
    );
    updateProgress(
      solvedTotalHardQues,
      totalHardQues,
      hardLabel,
      hardProgressCircle
    );

    const cardData = [
      { label: "Overall Ranking", value: data.ranking },
      { label: "AcceptanceRate", value: data.acceptanceRate },
      { label: "ContributionPoints", value: data.contributionPoints },
      { label: "Reputation", value: data.reputation },
    ];

    console.log("card ka data: ", cardData);

    cardStatsContainer.innerHTML = cardData.map(
        data =>{
            return `
            <div class = "card" >
            <h4>${data.label}</h4>
            <p>${data.value}</p>
            </div>`
        }
    ).join("")

  }

  async function fetchUserDetails(username) {
    const url = `https://leetcode-stats-api.herokuapp.com/${username}`;

    try {
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;
      

      const responnce = await fetch(url);
      if (!responnce.ok) {
        throw new Error("Unable to fetch User details");
      }
      const data = await responnce.json();
      console.log("logging data: ", data);

      disPlayUserData(data);

    } catch (error) {
      statsContainer.innerHTML = error.message;
    } finally {
      searchButton.textContent = "Search";
      searchButton.disabled = false;
    }
  }

  searchButton.addEventListener("click", function () {
    const username = usernameInput.value;
    if (validateUsername(username)) {
      fetchUserDetails(username);
    }
  });
});
