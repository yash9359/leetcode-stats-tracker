document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-btn");
  const usernameInput = document.getElementById("user-input");
  const statsContainer = document.querySelector(".stats-container");
  const totalProgressCircle = document.querySelector(".total-progress");
  const easyProgressCircle = document.querySelector(".easy-progress");
  const mediumProgressCircle = document.querySelector(".medium-progress");
  const hardProgressCircle = document.querySelector(".hard-progress");
  const totalLabel = document.getElementById("total-label");
  const easyLabel = document.getElementById("easy-label");
  const mediumLabel = document.getElementById("medium-label");
  const hardLabel = document.getElementById("hard-label");
  const cardStatsContainer = document.querySelector(".stats-card");
  const mainCard = document.getElementById("main-card");

  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.z = Math.random() * 1500 + 200;
      this.radius = Math.random() * 1.6 + 0.4;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.speedZ = -(Math.random() * 1.5 + 0.3);
      this.color = ["#22c55e", "#38bdf8", "#a78bfa", "#facc15", "#ef4444"][
        Math.floor(Math.random() * 5)
      ];
      this.opacity = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.z += this.speedZ;
      if (this.z < 1 || this.x < -50 || this.x > canvas.width + 50 || this.y < -50 || this.y > canvas.height + 50) {
        this.reset();
        this.z = 1500;
      }
    }
    draw() {
      const scale = 600 / this.z;
      const sx = (this.x - canvas.width / 2) * scale + canvas.width / 2;
      const sy = (this.y - canvas.height / 2) * scale + canvas.height / 2;
      const r = this.radius * scale;
      ctx.beginPath();
      ctx.arc(sx, sy, Math.max(r, 0.2), 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity * Math.min(scale, 1);
      ctx.shadowBlur = 12;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  let mouseX = 0, mouseY = 0;
  let targetRotX = 0, targetRotY = 0;
  let currentRotX = 0, currentRotY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    targetRotY = ((mouseX - cx) / cx) * 6;
    targetRotX = ((cy - mouseY) / cy) * 4;

    document.querySelectorAll(".card").forEach((card) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", ((e.clientX - rect.left) / rect.width * 100) + "%");
      card.style.setProperty("--my", ((e.clientY - rect.top) / rect.height * 100) + "%");
    });
  });

  function tiltLoop() {
    currentRotX += (targetRotX - currentRotX) * 0.07;
    currentRotY += (targetRotY - currentRotY) * 0.07;
    mainCard.style.transform =
      `rotateX(${currentRotX}deg) rotateY(${currentRotY}deg) translateZ(0)`;
    requestAnimationFrame(tiltLoop);
  }
  tiltLoop();

  function validateUsername(username) {
    if (username.trim() === "") {
      alert("Username Should not be empty");
      return false;
    }
    const regex = /^[A-Za-z0-9][A-Za-z0-9_]{1,13}[A-Za-z0-9]$/;
    const isMatching = regex.test(username.trim());
    if (!isMatching) alert("Invalid Username");
    return isMatching;
  }

  function updateProgress(solved, total, label, circleEl) {
    const pct = total === 0 ? 0 : solved / total;
    const circumference = 2 * Math.PI * 52;
    const offset = circumference * (1 - pct);
    const ringFill = circleEl.querySelector(".ring-fill");
    ringFill.style.transition = "none";
    ringFill.style.strokeDashoffset = circumference;
    ringFill.getBoundingClientRect();
    ringFill.style.transition = "stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1)";
    ringFill.style.strokeDashoffset = offset;
    animateCounter(label, solved, total);
  }

  function animateCounter(label, target, total) {
    let current = 0;
    const duration = 1200;
    const start = performance.now();
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      current = Math.round(ease * target);
      label.textContent = `${current}/${total}`;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function disPlayUserData(data) {
    statsContainer.classList.add("show");

    const totalQues = data.totalEasy + data.totalMedium + data.totalHard;
    const totalSolved = data.easySolved + data.mediumSolved + data.hardSolved;

    updateProgress(totalSolved, totalQues, totalLabel, totalProgressCircle);
    updateProgress(data.easySolved, data.totalEasy, easyLabel, easyProgressCircle);
    updateProgress(data.mediumSolved, data.totalMedium, mediumLabel, mediumProgressCircle);
    updateProgress(data.hardSolved, data.totalHard, hardLabel, hardProgressCircle);

    const cardData = [
      { label: "Overall Ranking", value: data.ranking },
      { label: "Acceptance Rate", value: data.acceptanceRate },
      { label: "Contribution Points", value: data.contributionPoints },
      { label: "Reputation", value: data.reputation },
    ];

    cardStatsContainer.innerHTML = cardData
      .map((d, i) => {
        return `
        <div class="card" style="--card-delay: ${0.1 + i * 0.12}s">
          <h4>${d.label}</h4>
          <p>${d.value}</p>
        </div>`;
      })
      .join("");
  }

  async function fetchUserDetails(username) {
    const BASE = "https://alfa-leetcode-api.onrender.com";
    try {
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;

      const [profileRes, solvedRes, progressRes] = await Promise.all([
        fetch(`${BASE}/${username}`),
        fetch(`${BASE}/${username}/solved`),
        fetch(`${BASE}/${username}/progress`),
      ]);

      if (!profileRes.ok || !solvedRes.ok || !progressRes.ok)
        throw new Error("Unable to fetch User details");

      const [profile, solved, progress] = await Promise.all([
        profileRes.json(),
        solvedRes.json(),
        progressRes.json(),
      ]);

      const prog = progress.numAcceptedQuestions;
      const totalByDiff = {};
      ["EASY", "MEDIUM", "HARD"].forEach((d) => {
        const accepted = (prog.numAcceptedQuestions.find((q) => q.difficulty === d) || {}).count || 0;
        const failed   = (prog.numFailedQuestions.find((q) => q.difficulty === d) || {}).count || 0;
        const untouched = (prog.numUntouchedQuestions.find((q) => q.difficulty === d) || {}).count || 0;
        totalByDiff[d] = accepted + failed + untouched;
      });

      const allSub = solved.totalSubmissionNum.find((s) => s.difficulty === "All");
      const allAc = solved.acSubmissionNum.find((s) => s.difficulty === "All");
      const acceptanceRate =
        allSub && allSub.submissions > 0
          ? ((allAc.submissions / allSub.submissions) * 100).toFixed(1) + "%"
          : "N/A";

      const data = {
        totalEasy: totalByDiff["EASY"],
        totalMedium: totalByDiff["MEDIUM"],
        totalHard: totalByDiff["HARD"],
        easySolved: solved.easySolved,
        mediumSolved: solved.mediumSolved,
        hardSolved: solved.hardSolved,
        ranking: profile.ranking,
        acceptanceRate,
        contributionPoints: profile.reputation ?? "N/A",
        reputation: profile.reputation ?? 0,
      };

      disPlayUserData(data);
    } catch (error) {
      statsContainer.innerHTML = `<p style="color:#ef4444;text-align:center;padding:1rem">${error.message}</p>`;
    } finally {
      searchButton.textContent = "Search";
      searchButton.disabled = false;
    }
  }

  searchButton.addEventListener("click", function () {
    const username = usernameInput.value.trim();
    if (validateUsername(username)) fetchUserDetails(username);
  });

  usernameInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const username = usernameInput.value.trim();
      if (validateUsername(username)) fetchUserDetails(username);
    }
  });
});
