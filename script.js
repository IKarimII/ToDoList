// Save all sections and tasks to localStorage
function saveToLocalStorage() {
  const sectionsData = {};

  allSections.forEach(sectionName => {
    const section = document.querySelector(`.${sectionName.replace(/\s/g, "")}`);
    const tasks = Array.from(section.querySelectorAll('.task-label')).map(task => task.textContent.trim());
    sectionsData[sectionName] = tasks;
  });

  localStorage.setItem('sectionsData', JSON.stringify(sectionsData));
}

// Load sections and tasks from localStorage
function loadFromLocalStorage() {
  const sectionsData = JSON.parse(localStorage.getItem('sectionsData'));

  if (sectionsData) {
    Object.keys(sectionsData).forEach(sectionName => {
      createSection(sectionName);
      sectionsData[sectionName].forEach(taskBody => {
        createTask(taskBody, sectionName);
      });
    });
  }
}

function saveCheckboxState() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox, index) => {
    localStorage.setItem(`checkbox${index}`, checkbox.checked)
  });
}
function loadCheckboxState() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]')
  checkboxes.forEach((checkbox, index) => {
    let storedState = localStorage.getItem(`checkbox${index}`);
    if (storedState !== null) {
      checkbox.checked = storedState === 'true';
    }
  });
}

function saveTheme() {
  localStorage.setItem('lMode',lMode);
}
function loadTheme() {
  lMode = localStorage.getItem('lMode') || 'dark';
  lightMode()
}
  
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', saveCheckboxState);
});

window.addEventListener('load', () => {
  loadCheckboxState();
  loadTheme();
  loadFromLocalStorage();
});                                                            


const modal = document.getElementById("myModal");
const submitBtn = document.getElementById("submitBtn");
const inputField = document.getElementById("userInput");

let userInput;
let mode = "section"; // Track if we're adding a section or a task
let currentSection = ""; // Track which section we are adding a task to
let allSections = [];


function getUserInput(type, sectionName = "") {
  mode = type; // 'section' or 'task'
  currentSection = sectionName; // Set the current section if creating a task

  let inputTitle = document.getElementById("input-title");
  inputTitle.innerHTML = `Enter a ${mode.charAt(0).toUpperCase() + mode.slice(1)}`;
  document.getElementsByName('textBox')[0].placeholder=`${mode.charAt(0).toUpperCase() + mode.slice(1)} name here...`;

  modal.style.display = "flex";
  inputField.focus();
}

function closeModal() {
  modal.style.display = "none";
  inputField.value = "";
}

function submitInput() {
  userInput = inputField.value;
  if (userInput) {
    if (mode === "section") {
      if (allSections.includes(userInput)) {
        alert("No duplicates allowed");
      } else {
        createSection(userInput);
        closeModal();
      }
    } else if (mode === "task") {
      createTask(userInput, currentSection);
      closeModal();
    }
  } else {
    alert("Please enter a valid value");
  }
}

function createSection(sectionName) {
  var sections = document.querySelector(".sections");

  // Create a new section (ul element)
  var section = document.createElement("ul");
  section.className = sectionName.replace(/\s/g, ""); // Remove spaces for class names

  // Create and append the section title (h2 element)
  var name = document.createElement("h2");
  name.appendChild(document.createTextNode(sectionName));
  section.append(name);

  // Create the delete section icon
  var delIcon = document.createElement('i');
  delIcon.className = 'del-section fa-solid fa-trash';

  delIcon.addEventListener('click', function () {
    if (confirm("Are you sure you want to delete this section and all its tasks?")) {
      sections.removeChild(section);
      // Optionally, remove the section from the list of allSections
      allSections = allSections.filter(sec => sec !== sectionName);
      saveToLocalStorage();
    }
  });


  // Create the add task icon
  var addIcon = document.createElement("i");
  addIcon.className = `adds ${sectionName.replace(/\s/g, "")} fa-solid fa-plus`;

  // Add an event listener to the add icon to allow task creation
  addIcon.addEventListener("click", function () {
    getUserInput("task", sectionName); // Prompt task input for this section
  });
  allSections.push(sectionName);

  section.appendChild(delIcon);
  section.appendChild(addIcon);

  sections.append(section);
  saveToLocalStorage();
}

function createTask(taskBody, sectionName) {
  var section = document.querySelector(`.${sectionName.replace(/\s/g, "")}`);

  if (!section) {
    console.error("Section not found: " + sectionName);
    return;
  }

  // Create the task (li element)
  var task = document.createElement("li");
  task.className = "task";

  // Create the task label
  var label = document.createElement("label");
  label.className = "task-label";

  // Create the checkbox
  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.name = "checkbox";

  // Append the checkbox and task body text to the label
  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(taskBody));

  // Append the label to the task
  task.appendChild(label);

  var delIcon = document.createElement('i');
  delIcon.className = 'del-task fa-solid fa-trash';

  delIcon.addEventListener('click', function () {
    section.removeChild(task);
    saveToLocalStorage();
  });
  
  task.appendChild(delIcon)

  // Append the task to the section
  section.appendChild(task);
  saveToLocalStorage();
}

// Event listener for the initial add button (to add a section)
document.querySelector(".add").addEventListener("click", function () {
  getUserInput("section");
});

// Submit with Enter key in the input field
inputField.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    submitInput();
  }
});

// Escape to close the modal
inputField.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
});

// Event listener for the submit button in the modal
submitBtn.onclick = submitInput;

let lMode = 'dark';

const sun = document.querySelector(".lumos");
const moon = document.querySelector(".nox");

function lightMode() {
  if (lMode == 'dark') {
    sun.classList.add('invisible');
    moon.classList.remove('invisible');
    lMode = 'light';

    document.querySelector('.body').classList.remove('dark');
    document.querySelector('.body').classList.add('light');


  }
  else {
    sun.classList.remove('invisible');
    moon.classList.add('invisible');
    lMode = 'dark';

    document.querySelector('.body').classList.remove('light');
    document.querySelector('.body').classList.add('dark');
  }
  saveTheme();

}

moon.addEventListener('click', lightMode)
