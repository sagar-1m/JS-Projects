// Global state
let currentUserData = null;
let currentRepos = [];
let languageChart = null;

// Initialize theme and event listeners
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  updateFavoritesList();
  setupEventListeners();
});

function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
}

function setupEventListeners() {
  // Theme toggle
  document
    .getElementById("theme-toggle")
    .addEventListener("click", toggleTheme);

  // Search functionality
  document
    .getElementById("extract-btn")
    .addEventListener("click", handleSearch);
  document.getElementById("username").addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
  });

  // Repository filters
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => handleRepoFilter(btn.dataset.filter));
  });

  // Repository search
  document
    .getElementById("repo-search")
    .addEventListener("input", handleRepoSearch);

  // Export button
  document
    .getElementById("export-btn")
    .addEventListener("click", exportProfileData);
}

// Theme handling
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateChartTheme();
}

// Main search handler
async function handleSearch() {
  const username = document.getElementById("username").value.trim();
  if (!username) {
    showError("Please enter a GitHub username");
    return;
  }

  try {
    showLoading(true);
    const userData = await fetchUserData(username);
    currentUserData = userData;
    await updateUI(userData);
    saveFavoriteProfile(username);
  } catch (error) {
    handleError(error);
  } finally {
    showLoading(false);
  }
}

// API calls
async function fetchUserData(username) {
  const response = await fetch(`https://api.github.com/users/${username}`);
  if (!response.ok) throw new Error(response.status);
  return response.json();
}

async function fetchUserRepos(username) {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
  );
  if (!response.ok) throw new Error(response.status);
  return response.json();
}

// UI updates
async function updateUI(userData) {
  try {
    // Update profile information
    document.getElementById("profile-img").src = userData.avatar_url;
    document.getElementById("name").textContent =
      userData.name || userData.login;
    document.getElementById("github-link").textContent = `@${userData.login}`;
    document.getElementById("github-link").href = userData.html_url;
    document.getElementById("bio").textContent =
      userData.bio || "No bio available";
    document.getElementById("joined-date").textContent = `Joined ${formatDate(
      userData.created_at
    )}`;

    // Update stats
    document.getElementById("repos").textContent =
      userData.public_repos.toLocaleString();
    document.getElementById("followers").textContent =
      userData.followers.toLocaleString();
    document.getElementById("following").textContent =
      userData.following.toLocaleString();

    // Update social info
    updateSocialInfo(userData);

    // Fetch and update repositories
    currentRepos = await fetchUserRepos(userData.login);
    updateReposList(currentRepos);

    // Create language chart
    await createLanguageChart(currentRepos);

    // Show containers
    document.querySelector(".profile-container").classList.remove("hidden");
    document.getElementById("export-btn").classList.remove("hidden");
  } catch (error) {
    console.error("Error updating UI:", error);
    showError("Error updating profile information");
  }
}

function updateSocialInfo(userData) {
  updateSocialItem("location-container", userData.location);
  updateSocialItem(
    "twitter-container",
    userData.twitter_username,
    userData.twitter_username
      ? `https://twitter.com/${userData.twitter_username}`
      : null
  );
  updateSocialItem("blog-container", userData.blog, userData.blog);
  updateSocialItem("company-container", userData.company);
}

function updateSocialItem(containerId, value, link = null) {
  const container = document.getElementById(containerId);
  const textElement = container.querySelector("span");

  if (value) {
    container.style.opacity = "1";
    if (link) {
      textElement.innerHTML = `<a href="${link}" target="_blank">${value}</a>`;
    } else {
      textElement.textContent = value;
    }
  } else {
    container.style.opacity = "0.5";
    textElement.textContent = "Not Available";
  }
}

// Repository handling
function updateReposList(repos) {
  const reposList = document.getElementById("repos-list");
  reposList.innerHTML = repos.map(createRepoCard).join("");
}

function createRepoCard(repo) {
  return `
        <div class="repo-card">
            <a href="${repo.html_url}" class="repo-name" target="_blank">
                <i class="far ${
                  repo.fork ? "fa-code-branch" : "fa-folder"
                }"></i>
                ${repo.name}
            </a>
            <p class="repo-description">${
              repo.description || "No description available"
            }</p>
            <div class="repo-stats">
                <span class="repo-stat">
                    <i class="fas fa-star"></i>
                    ${repo.stargazers_count.toLocaleString()}
                </span>
                <span class="repo-stat">
                    <i class="fas fa-code-branch"></i>
                    ${repo.forks_count.toLocaleString()}
                </span>
                ${
                  repo.language
                    ? `
                    <span class="repo-stat">
                        <i class="fas fa-circle"></i>
                        ${repo.language}
                    </span>
                `
                    : ""
                }
            </div>
        </div>
    `;
}

function handleRepoFilter(filter) {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  });

  const filteredRepos = filterRepos(filter, currentRepos);
  updateReposList(filteredRepos);
}

function filterRepos(type, repos) {
  switch (type) {
    case "sources":
      return repos.filter((repo) => !repo.fork);
    case "forks":
      return repos.filter((repo) => repo.fork);
    default:
      return repos;
  }
}

function handleRepoSearch(e) {
  const query = e.target.value.toLowerCase();
  const filteredRepos = currentRepos.filter(
    (repo) =>
      repo.name.toLowerCase().includes(query) ||
      repo.description?.toLowerCase().includes(query)
  );
  updateReposList(filteredRepos);
}

// Language chart
async function createLanguageChart(repos) {
  const languages = {};
  repos.forEach((repo) => {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
  });

  const ctx = document.getElementById("language-chart").getContext("2d");
  if (languageChart) languageChart.destroy();

  languageChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: Object.keys(languages),
      datasets: [
        {
          data: Object.values(languages),
          backgroundColor: generateColors(Object.keys(languages).length),
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "right",
          labels: {
            color: getComputedStyle(document.documentElement).getPropertyValue(
              "--text-primary"
            ),
          },
        },
      },
    },
  });
}

// Utility functions
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function generateColors(count) {
  const colors = [
    "#2ecc71",
    "#3498db",
    "#9b59b6",
    "#f1c40f",
    "#e74c3c",
    "#1abc9c",
    "#34495e",
    "#16a085",
    "#27ae60",
    "#2980b9",
  ];
  return Array(count)
    .fill()
    .map((_, i) => colors[i % colors.length]);
}

function showLoading(show) {
  const btn = document.getElementById("extract-btn");
  btn.classList.toggle("loading", show);
}

function showError(message) {
  const errorElement = document.getElementById("error-message");
  errorElement.textContent = message;
  errorElement.classList.remove("hidden");
  setTimeout(() => errorElement.classList.add("hidden"), 3000);
}

function handleError(error) {
  if (error.message === "404") {
    showError("User not found");
  } else {
    showError("Error fetching user data");
    console.error(error);
  }
}

// Favorites handling
function saveFavoriteProfile(username) {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  if (!favorites.includes(username)) {
    favorites.unshift(username);
    if (favorites.length > 5) favorites.pop(); // Keep only last 5 searches
    localStorage.setItem("favorites", JSON.stringify(favorites));
    updateFavoritesList();
  }
}

function updateFavoritesList() {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  const favoritesSection = document.getElementById("favorites-section");
  const favoritesList = document.getElementById("favorites-list");

  if (favorites.length > 0) {
    favoritesSection.classList.remove("hidden");
    favoritesList.innerHTML = favorites
      .map(
        (username) => `
            <div class="favorite-item" onclick="document.getElementById('username').value='${username}';handleSearch()">
                <img src="https://github.com/${username}.png" width="20" height="20">
                ${username}
            </div>
        `
      )
      .join("");
  } else {
    favoritesSection.classList.add("hidden");
  }
}

// Export functionality
function exportProfileData() {
  if (!currentUserData) return;

  const data = {
    name: currentUserData.name,
    login: currentUserData.login,
    bio: currentUserData.bio,
    stats: {
      repos: currentUserData.public_repos,
      followers: currentUserData.followers,
      following: currentUserData.following,
    },
    repositories: currentRepos.map((repo) => ({
      name: repo.name,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
    })),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${currentUserData.login}-github-profile.json`;
  a.click();
  URL.revokeObjectURL(url);
}
