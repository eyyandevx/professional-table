const spinner = document.getElementById('spinner');
const table = document.getElementById('data-table');
const tableBody = document.getElementById('table-body');
const pagination = document.getElementById('pagination');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageNumber = document.getElementById('page-number');

let data = [];
let shortedData = [];
let currentPage = 1;
const rowsPerPage = 10;
let shortDirection = {};

//fatch data from Apis
async function fatchData() {
    spinner.style.display = "flex";
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = await fetch('https://randomuser.me/api/?results=50');
        const json = await response.json();
        data = json.results;
        shortedData = [...data];
        displayTable(shortedData);
        updateButtons();
    } catch (error) {
        console.log('Error fetching data:', error);
    } finally {
        spinner.style.display = "none";
        table.style.display = "table";
        pagination.style.display = "block";
    }
}

//display table data
function displayTable(dataToDisplay) {
    tableBody.innerText = '';
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedItems = dataToDisplay.slice(start, end);

    paginatedItems.forEach(user => {
        const row =
            `<tr>
            <td data-label="Name">${user.name.first} ${user.name.last}</td>
            <td data-label="Email">${user.email}</td>
            <td data-label="Username">${user.login.username}</td>
            <td data-label="Country">${user.location.country}</td>
        </tr>`;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

//sort table by column index
function shortTable(columnIndex) {
    clearShortIcon();
    if (!shortDirection[columnIndex]) {
        shortDirection[columnIndex] = "asc";
    }
    shortedData = [...data].sort((a, b) => {
        let valA, valB;
        switch (columnIndex) {
            case 0:
                valA = `${a.name.first} ${a.name.last}`;
                valB = `${b.name.first} ${b.name.last}`;
                break;
            case 1:
                valA = a.email;
                valB = b.email;
                break;
            case 2:
                valA = a.login.username;
                valB = b.login.username;
                break;
            case 3:
                valA = a.location.country;
                valB = b.location.country;
                break;
        }
        if (shortDirection[columnIndex] === 'desc') {
            return valB.localeCompare(valA);
        } else {
            return valA.localeCompare(valB);
        }
    });
    shortDirection[columnIndex] = shortDirection[columnIndex] === "asc" ? "desc" : "asc";
    updateSortIcon(columnIndex, shortDirection[columnIndex]);
    displayTable(shortedData);
}

//clear short icons for all column
function clearShortIcon() {
    for (let i = 0; i < 4; i++) {
        const icon = document.getElementById(`icon-${i}`);
        icon.className = "fas fa-sort";
    }
}
//update the sort icon
function updateSortIcon(columnIndex, direction) {
    const icon = document.getElementById(`icon-${columnIndex}`);
    icon.className = direction === 'asc' ? "fas fa-sort-down" : "fas fa-sort-up";
}

//previous page
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayTable(shortedData);
        updateButtons();
    }
}

//next page
function nextPage() {
    if (currentPage * rowsPerPage < shortedData.length) {
        currentPage++;
        displayTable(shortedData);
        updateButtons();
    }
}

//upsate pagintion buttons
function updateButtons() {
    pageNumber.innerText = currentPage;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage * rowsPerPage >= shortedData.length;
}

//startup
fatchData();


//dark mode
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

//check if dark mode is preferred or previously chosen
const isDarkMode = localStorage.getItem('dark-mode') === 'true';

//set intial mode
if (isDarkMode) {
    body.classList.add('dark-mode');
    themeToggle.innerText = "Light Mode";
}

//toggle dark mode and update text
themeToggle.addEventListener('click', () => {
    body.style.transition = "background-color 0.3s, color 0.3s";
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        themeToggle.innerText = "Dark Mode";
        localStorage.setItem('dark-mode', 'false');
    } else {
        body.classList.add('dark-mode');
        themeToggle.innerText = "Light Mode";
        localStorage.setItem('dark-mode', 'true');
    }
});
