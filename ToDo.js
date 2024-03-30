
//variable for navBar toggle handling
let allTasksNav = document.getElementById("allTasksNav");
let summaryNav = document.getElementById("summaryNav");
let deletedNav = document.getElementById("deletedNav");

//variable for user inputs handling
let date = document.getElementById("chooseDate");
let taskName = document.getElementById("taskName");
let priority = document.getElementById("prioritySelect");

//variable for render tasks handling
let dynamicUl = document.getElementById("dynamicUl");
let taskModal = document.getElementById("taskModal");

//variable for add tasks handling
let addTaskBtn = document.getElementById("addTaskBtn");

//variable for edit handling
let addTaskModalBtn = document.getElementById("addTaskModalBtn");
let editTaskBtn = document.getElementById("editTaskBtn");

//variables for alerts handling
let taskNameP = document.getElementById("taskNameP");
let dateP = document.getElementById("dateP");
let priorityP = document.getElementById("priorityP");

// variables for summary handling
let completed = document.getElementById("dynamicCompleted");
let completedToday = document.getElementById("dynamicCompletedToday");

//variable for deleted card handling
let deletedCard = document.getElementById("deletedCard");

//global variable to toggle between edit and new tasks
let isEdit = false;
//global variable to find specific task to edit
let editTaskId = 0;

//handle local storage
localStorage["tasks"] != undefined
  ? (tasks = JSON.parse(localStorage["tasks"]))
  : (tasks = []);

localStorage["deletedTasks"] != undefined
  ? (deletedTasks = JSON.parse(localStorage["deletedTasks"]))
  : (deletedTasks = []);

//render tasks to screen
function renderTasksFunc() {
  dynamicUl.innerHTML = "";
  console.log(tasks);
  for (let i = 0; i < tasks.length; i++) {
    let str = "";
    if (tasks[i]["finishTask"]) {
      str += `<li class="list-group-item">
                <h5 class="card-title text-decoration-line-through">
                <input
                class="form-check-input checkBox"
                type="checkbox"
                checked
                value=""
                onClick="undoFinishTaskFunc(${tasks[i].taskId})"
                />
                ${tasks[i]["taskName"]}
                <div class="trashAndPencilDiv">
                <i class="bi bi-trash3 trash" onclick="deleteTaskFunc(${tasks[i].taskId})"></i>
                </div>
                </h5>`;
      str += renderPriorityFunc(tasks[i]["priority"]);
      str += renderDateFunc(tasks[i]["date"],tasks[i]["finishTask"]);
      str += `</li>`;
    } else {
      str += `<li class="list-group-item ">
                <h5 class="card-title">
                <input
                class="form-check-input checkBox"
                type="checkbox"
                value=""
                onclick="finishTaskFunc (${tasks[i].taskId})"
              />
              ${tasks[i]["taskName"]}
              <div class="trashAndPencilDiv">
               <i class="bi bi-trash3 trash" onclick="deleteTaskFunc(${tasks[i].taskId})"></i>
               <i class="bi bi-pencil pencil"
                data-bs-toggle="modal"
                data-bs-target="#taskModal"
                onclick="editTaskModalBtnFunc(${tasks[i].taskId})">
              </i>
              </div>
              </h5>`;
      str += renderPriorityFunc(tasks[i]["priority"]);
      str += renderDateFunc(tasks[i]["date"],tasks[i]["finishTask"]);
      str += `</li>`;
    }

    dynamicUl.innerHTML += str;
  }
}

//render priority
//TODO:after i show the flags to every one if they say its better then delete all the badge code
function renderPriorityFunc(priorityVal) {
  //code for badge:
  // let priorityObj = {
  //   1: ["high", "danger"],
  //   2: ["medium", "warning"],
  //   3: ["low", "info"],
  // };
  // let priority = priorityObj[`${priorityVal}`][0];
  // let priorityColor = priorityObj[`${priorityVal}`][1];
  // let str = `<h6 class="priority bg-gradient text-${priorityColor} mb-2 ">
  //                   ${priority}
  //           </h6>`;
  // return str;

  //code for flag
  let priorityObj = {
    1: ["High", "danger"],
    2: ["Medium", "warning"],
    3: ["Low", "info"],
  };
  let priorityColor = priorityObj[`${priorityVal}`][1];
  let str = `<h6><i class="bi bi-flag text-${priorityColor}" title="${
    priorityObj[`${priorityVal}`][0]
  } Priority"></i></h6>`;
  return str;
}

//render date
function renderDateFunc(date,isFinishTask) {
  let str = ` <h6 class="card-subtitle mb-2 text-body-secondary">
                  <i class="bi bi-calendar"></i>
                  ${renderTodayOrDate(date,isFinishTask)}
              </h6>`;
  return str;
}

//check if today or another date if date already pass color the text in red
function renderTodayOrDate(date,isFinishTask) {
  let todayDate = Date.parse(new Date().toDateString()); //get the date value without consider time
  let taskDate = Date.parse(new Date(date).toDateString());
  let str = "";
  todayDate == taskDate
    ? (str = `<span>Today</span>`)
    : (str = ` <span>${date}</span>`);
  if (taskDate < todayDate) {
    isFinishTask
    ? (str = `<span>${date}</span>`)
    : (str = ` <span class="datePass">${date}</span>`);
  }
  return str;
}

//render all the deleted tasks to the delete card
function renderDeletedTasksFunc() {
  deletedCard.innerHTML = "";
  console.log(deletedTasks);
  for (let i = 0; i < deletedTasks.length; i++) {
    let str = "";
    str += `<li class="list-group-item">
        <h5 class="card-title text-decoration-line-through">
          ${deletedTasks[i].taskName}
        </h5>
        <h6 class="card-subtitle mb-2 text-body-secondary">
          <i class="bi bi-calendar"></i>
          ${deletedTasks[i].date}
        </h6>
      </li>`;
    deletedCard.innerHTML += str;
  }
}

// find task index
const findIndex = (taskId) => {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i]["taskId"].indexOf(taskId) != -1) return i;
  }
};

//delete task, update local storage, render remaining tasks to screen
//if the delete is on edit task we don't need to insert task to delete tasks array
function deleteTaskFunc(taskId) {
  console.log(taskId);
  let taskIndex = findIndex(taskId);
  if (!isEdit) {
    deletedTasks.unshift(tasks[taskIndex]);
    localStorage["deletedTasks"] = JSON.stringify(deletedTasks);
    isEdit = false;
  }
  tasks.splice(taskIndex, 1);
  localStorage["tasks"] = JSON.stringify(tasks);
  renderTasksFunc();
}

//finish task, update local storage, render tasks based on there finishTask value
function finishTaskFunc(taskId) {
  let audio = new Audio("success-1-6297.mp3");
  audio.play();
  let index = findIndex(taskId);
  tasks[index]["finishTask"] = true;
  sortTasksFunction();
  localStorage["tasks"] = JSON.stringify(tasks);
  console.log(tasks);
  setTimeout(function () {
    renderTasksFunc();
  }, 302);
}

//undo finish task, update local storage, render tasks based on there finishTask value
function undoFinishTaskFunc(taskId) {
  let index = findIndex(taskId);
  tasks[index]["finishTask"] = false;
  sortTasksFunction();
  localStorage["tasks"] = JSON.stringify(tasks);
  renderTasksFunc();
}

//sort by dates and if equal by priority
function sortTasksFunction() {
  tasks.sort(function (a, b) {
    return (
      a.finishTask - b.finishTask ||
      Date.parse(a.date) - Date.parse(b.date) ||
      a.priority - b.priority
    );
  });
}

//function to change user ui from adding to edit
function editTaskModalBtnFunc(taskId) {
  let taskIndex = findIndex(taskId);
  editTaskId = taskId;
  addTaskBtn.style.display = "none";
  editTaskBtn.style.display = "block";
  isEdit = true;
  taskName.value = tasks[taskIndex].taskName;
  priority.value = tasks[taskIndex].priority;
  date.value = tasks[taskIndex].date;
}

//function for summarize
function summaryFunc() {
  let todayTa = 0;
  let todayCo = 0;
  let totalCo = 0;
  let totalTasks = tasks.length + deletedTasks.length;
  let todayDate = Date.parse(new Date().toDateString()); //get the date value without consider time
  for (let i = 0; i < tasks.length; i++) {
    let taskDate = Date.parse(new Date(tasks[i].date).toDateString());
    if (todayDate == taskDate) {
      todayTa++;
      if (tasks[i].finishTask == true) {
        todayCo++;
      }
    }
    if (tasks[i].finishTask == true) {
      totalCo++;
    }
  }
  completed.innerHTML = totalCo + "/" + tasks.length;
  completedToday.innerHTML = todayCo + "/" + todayTa;
  dynamicTotalDeleted.innerHTML = deletedTasks.length;
}

//validation for task inputs from user
const validationFunc = () => {
  let todayDate = Date.parse(new Date().toDateString()); //get the date value without consider time
  let taskDate = Date.parse(new Date(date.value).toDateString());
  let isSuccess = "true";

  if (taskDate < todayDate || isNaN(taskDate)) {
    dateP.textContent = "choose valid date";
    isSuccess = false;
  }
  if (taskName.value == "") {
    taskNameP.textContent = "choose valid name";
    isSuccess = false;
  }
  if (priority.value == "") {
    priorityP.textContent = "choose priority";
    isSuccess = false;
  }
  return isSuccess;
};

// add task, update the local storage, render tasks to screen.
// or
// handle edit task(delete the exist and add the edit one).
const addTaskFunc = () => {
  if (validationFunc()) {
    if (isEdit) {
      deleteTaskFunc(editTaskId);
    }
    let task = {
      taskId: Date.now().toString(),
      taskName: taskName.value,
      priority: priority.value,
      date: date.value,
      finishTask: false,
    };

    tasks.push(task);
    sortTasksFunction();
    localStorage["tasks"] = JSON.stringify(tasks);
    renderTasksFunc();
    location.reload();
  }
};

//clear alerts
const cleanPAlertsFunc = (p) => {
  if (p.textContent !== "") p.textContent = "";
};

//event listeners - nav bar toggle
allTasksNav.addEventListener("click", () => {
  renderTasksFunc();
  taskDiv.style.display = "block";
  summaryDiv.style.display = "none";
  deleteDiv.style.display = "none";
});

summaryNav.addEventListener("click", () => {
  summaryFunc();
  summaryDiv.style.display = "block";
  taskDiv.style.display = "none";
  deleteDiv.style.display = "none";
});
deletedNav.addEventListener("click", () => {
  renderDeletedTasksFunc();
  deleteDiv.style.display = "block";
  summaryDiv.style.display = "none";
  taskDiv.style.display = "none";
});

//event listener - add task, clear alerts
addTaskBtn.addEventListener("click", addTaskFunc);

//event listener - edit task, clear alerts
editTaskBtn.addEventListener("click", addTaskFunc);

//event listener - open modal for adding task
addTaskModalBtn.addEventListener("click", () => {
  isEdit = false;
  addTaskBtn.style.display = "block";
  editTaskBtn.style.display = "none";
  taskName.value = "";
  priority.value = "";
  date.value = "";
});

//event listeners - clear alerts
taskName.addEventListener("blur", () => {
  cleanPAlertsFunc(taskNameP);
});
date.addEventListener("blur", () => {
  cleanPAlertsFunc(dateP);
});
priority.addEventListener("blur", () => {
  cleanPAlertsFunc(priorityP);
});

//render all the tasks to the screen
renderTasksFunc();