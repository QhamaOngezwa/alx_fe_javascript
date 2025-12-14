const displayQuote = document.querySelector("#quoteDisplay");
const newQuoteButton = document.querySelector("#newQuote");
const addQuoteButton = document.querySelector("#addQuote");
const newQuoteText = document.querySelector("#newQuoteText");
const newQuoteCategory = document.querySelector("#newQuoteCategory");
const quotes = [
  {
    text: "The best way to get started is to quit talking and begin doing.",
    category: "Motivational",
  },
  {
    text: "Don't let yesterday take up too much of today.",
    category: "Inspirational",
  },
  {
    text: "It's not whether you get knocked down, it's whether you get up.",
    category: "Resilience",
  },
  {
    text: "If you are working on something exciting, it will keep you motivated.",
    category: "Motivational",
  },
  {
    text: "Success is not in what you have, but who you are.",
    category: "Success",
  },
];

//Function to show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  displayQuote.innerHTML = `"${randomQuote.text}" - <em>${randomQuote.category}</em>`;
}
//Function to add new quote
function createAddQuoteForm() {
  const quoteText = newQuoteText.value.trim();
  const quoteCategory = newQuoteCategory.value.trim();

  if (quoteText !== "" && quoteCategory !== "") {
    const newQuote = document.createElement("div");
    newQuote.appendChild(document.createTextNode(`"${quoteText}" - `));
    const categoryEm = document.createElement("em");
    categoryEm.appendChild(document.createTextNode(quoteCategory));
    newQuote.appendChild(categoryEm);
    quotes.push({ text: quoteText, category: quoteCategory });
    newQuoteText.value = "";
    newQuoteCategory.value = "";
    alert("New quote added successfully!");
  } else {
    alert("Please enter both quote text and category.");
  }
}

function saveQuotesToLocalStorage() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}
function loadQuotesFromLocalStorage() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes.length = 0;
    quotes.push(...JSON.parse(storedQuotes));
  }
}

loadQuotesFromLocalStorage();

const exportButton = document.querySelector("#exportQuotes");

function exportQuotesToJSON() {
  const jsonData = JSON.stringify(quotes, null, 2); // pretty format

  const blob = new Blob([jsonData], { type: "application/json" });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url); // cleanup
}

exportButton.addEventListener("click", exportQuotesToJSON);

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

const categoryFilter = document.getElementById("categoryFilter");

function populateCategories() {
  const categories = new Set(quotes.map((quote) => quote.category));
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

//filter quotes function to update displayed quotes based on selected category
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((quote) => quote.category === selectedCategory);
  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    displayQuote.innerHTML = `"${randomQuote.text}" - <em>${randomQuote.category}</em>`;
  } else {
    displayQuote.innerHTML = "No quotes available for this category.";
  }
}

async function fetchQuotesFromAPI() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();

    // Convert API posts into quote-like objects
    const apiQuotes = data.slice(0, 5).map((post) => ({
      text: post.title,
      category: "API",
    }));

    // Merge with existing quotes
    quotes.push(...apiQuotes);

    saveQuotesToLocalStorage();
    populateCategories();

    console.log("Quotes fetched from API");
  } catch (error) {
    console.error("Error fetching quotes:", error);
  }
}

async function postQuoteToServer(quote) {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(quote),
  });

  const data = await response.json();
  console.log("Server response:", data);
}

// function syncQuotes(){
//   fetchQuotesFromServer();
// }

//Event listener for new quote button
newQuoteButton.addEventListener("click", showRandomQuote);
//Event listener for add quote button
addQuoteButton.addEventListener("click", createAddQuoteForm);
