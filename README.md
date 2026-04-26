# LeetMetric 

A clean, minimal web app to fetch and display LeetCode user statistics using a public REST API.

👉 **Live Demo:** [leetcodemetric0999.netlify.app](https://leetcodemetric0999.netlify.app/)

[![Live Demo](https://img.shields.io/badge/Demo-Live-orange?style=flat-square)](https://leetcodemetric0999.netlify.app/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

---

## Features

- **User Search** — Fetch any LeetCode profile by username
- **Difficulty Breakdown** — Separate stats for Easy, Medium, and Hard problems
- **Circular Progress Visualization** — At-a-glance progress rings for each difficulty
- **Total Problems Solved** — Overall count alongside category-wise stats
- **Dark UI** — Clean, focused interface built for developers

---

## Screenshots

![LeetMetric Dashboard](https://github.com/user-attachments/assets/5b371eaf-250e-4d5f-85ea-cf06d6c67dfe)
![Search Results](https://github.com/user-attachments/assets/ae0cef23-7c5b-4488-b646-6eff3fbcfcee)

---

## Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **API:** [alfa-leetcode-api](https://alfa-leetcode-api.onrender.com) (public REST API)
- **Deployment:** Netlify

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/yash9359/leetcode-stats-tracker.git
cd leetcode-stats-tracker

# Open in browser — no build step needed
open index.html
```

Just open `index.html` in any browser, enter a LeetCode username, and hit search.

---

## API Reference

This project uses the [alfa-leetcode-api](https://alfa-leetcode-api.onrender.com) — a public, unofficial LeetCode REST API.

Example endpoint used:

```
GET https://alfa-leetcode-api.onrender.com/{username}
```

> **Note:** This is an unofficial third-party API. Availability depends on the API provider's uptime.

---

## Project Structure

```
leetcode-stats-tracker/
├── index.html      # App layout and structure
├── style.css       # Dark UI styles and progress ring animations
├── script.js       # API calls, data rendering, and search logic
└── README.md
```

---

## Contributing

Suggestions and improvements are welcome — feel free to open an issue or submit a pull request.

---

## Author

Made by [Yash](https://github.com/yash9359)

---

## Disclaimer

This project is for educational purposes only. It is not affiliated with or endorsed by LeetCode.
