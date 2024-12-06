const lookupButton = document.getElementById("lookupButton");
const pincodeInput = document.getElementById("pincode");
const errorMessage = document.getElementById("errorMessage");
const loader = document.getElementById("loader");
const resultsContainer = document.getElementById("results");
const pincodeHeader = document.getElementById("pincodeHeader");
const message = document.getElementById("message");
const filterInput = document.getElementById("filter");
const postOfficesGrid = document.getElementById("postOfficesGrid");

let postOffices = [];

function showLoader() {
  loader.style.display = "block";
}

function hideLoader() {
  loader.style.display = "none";
}

function showError(messageText) {
  errorMessage.textContent = messageText;
}

function clearError() {
  errorMessage.textContent = "";
}

function displayPostOffices(data) {
  postOfficesGrid.innerHTML = "";

  data.forEach((office) => {
    const card = document.createElement("div");
    card.classList.add("post-office-card");

    card.innerHTML = `
      <h3>${office.Name}</h3>
      <p><strong>Branch Type:</strong> ${office.BranchType}</p>
      <p><strong>Delivery Status:</strong> ${office.DeliveryStatus}</p>
      <p><strong>District:</strong> ${office.District}</p>
      <p><strong>Division:</strong> ${office.Division}</p>
    `;

    postOfficesGrid.appendChild(card);
  });
}


function filterPostOffices() {
  const query = filterInput.value.toLowerCase();
  const filtered = postOffices.filter((office) =>
    office.Name.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    postOfficesGrid.innerHTML = "<p>Couldn’t find the postal data you’re looking for…</p>";
  } else {
    displayPostOffices(filtered);
  }
}



lookupButton.addEventListener("click", () => {
  const pincode = pincodeInput.value.trim();

  // Validate pincode:-

  if (!/^\d{6}$/.test(pincode)) {
    showError("Please enter a valid 6-digit pincode.");
    return;
  }

  clearError();
  showLoader();

  // Fatch API Use :-
  fetch(`https://api.postalpincode.in/pincode/${pincode}`)
    .then((response) => response.json())
    .then((data) => {
      hideLoader();

      if (data[0].Status === "Error") {
        showError("No details found for this pincode.");
        return;
      }

      postOffices = data[0].PostOffice;
      pincodeHeader.textContent = `Pincode: ${pincode}`;
      message.textContent = `Message: Number of PinCode(s) found: ${postOffices.length}`;
      pincodeHeader.style.display = "block";
      message.style.display = "block";
      filterInput.style.display = "block";

      displayPostOffices(postOffices);

    })
    .catch((error) => {
      hideLoader();
      showError("An error occurred while fetching data.");
    });
});



filterInput.addEventListener("input", filterPostOffices);
