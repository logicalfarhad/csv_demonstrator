// historyModule.js

// Initialize history as an empty array
const history = [];

// Function to get the current history
function getHistory() {
  return history;
}

// Function to update the history
function updateHistory(entry) {
  history.push(entry);
}

function emptyHistory() {
  history.length = 0
}

// Export the functions
module.exports = {
  getHistory,
  updateHistory,
  emptyHistory
};
