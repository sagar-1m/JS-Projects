// add a event listener to the document object to load the tasks from local storage when the page is loaded

document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addTaskButton = document.getElementById("add-task");
  const taskList = document.getElementById("task-list");

  // get the tasks from local storage and parse the JSON string to convert it back to an array  (if there are no tasks in local storage, set tasks to an empty array)
  let tasks = JSON.parse(localStorage.getItem("tasks")) || "[]";

  //use the forEach method to iterate over the tasks array and call the renderTask function for each task
  tasks.forEach((task) => renderTask(task));

  // add an event listener to the addTaskButton  to handle the click event  and create a new task object when the button is clicked
  addTaskButton.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    if (taskText === "") {
      return;
    }

    // create a new task object with the task text and a unique id  (using Date.now() to generate a unique id)  and isCompleted set to false  (as the task is not completed when it is created)
    const newTask = {
      id: Date.now(),
      text: taskText,
      isCompleted: false,
    };

    // add the new task to the tasks array  and log the tasks array to the console  to verify that the task was added successfully  (you can check the console in the browser)  and clear the input field after adding the task to the array  (using taskInput.value = "")
    tasks.push(newTask);
    saveTasks(); // save the tasks to local storage
    renderTask(newTask); // render the new task on the page
    taskInput.value = ""; // clear the input field
    console.log(tasks);
  });

  // function to render a task  (this function will be used to display the tasks on the page) (the task object is passed as an argument to the function)  (the function will create a new list item element for the task and append it to the task list)  (the task text will be displayed inside the list item element)
  function renderTask(task) {
    const li = document.createElement("li"); // create a new list item element  (using document.createElement("li"))  (the list item element will be used to display the task on the page)  (the task text will be displayed inside the list item element)
    li.setAttribute("data-id", task.id); // set the data-id attribute of the list item element to the task id  (using li.setAttribute("data-id", task.id))  (the data-id attribute is used to identify the task in the list)
    if (task.isCompleted) {
      // check if the task is completed  (using task.isCompleted)  (if the task is completed, add the "completed" class to the list item element)  (the "completed" class is used to style the completed tasks)
      li.classList.add("completed");
    }
    li.innerHTML = `
      <span>${task.text}</span>
      <button class="delete-task">Delete</button>
    `; // set the innerHTML of the list item element to display the task text and a delete button  (using li.innerHTML)  (the task text will be displayed inside a span element and the delete button will be displayed as a button element)  (the delete button is used to delete the task from the list)

    li.addEventListener("click", (event) => {
      // add a click event listener to the list item element  (using li.addEventListener("click"))  (the event parameter is used to access the event object)  (the event object contains information about the event, such as the target element that was clicked)
      if (event.target.tagName === "LI") {
        // check if the target element that was clicked is the list item element  (using event.target.tagName)  (if the target element is the list item element, toggle the "completed" class on the list item element)  (the "completed" class is used to style the completed tasks)
        li.classList.toggle("completed");
        const taskId = task.id; // get the task id from the data-id attribute of the list item element  (using task.id)  (the task id is used to identify the task in the tasks array)
        const taskIndex = tasks.findIndex((task) => task.id === taskId); // find the index of the task in the tasks array  (using tasks.findIndex())  (the task id is used to identify the task in the tasks array)
        tasks[taskIndex].isCompleted = !tasks[taskIndex].isCompleted;
        saveTasks(); // save the tasks to local storage
      } else if (event.target.classList.contains("delete-task")) {
        const taskId = task.id;
        const taskIndex = tasks.findIndex((task) => task.id === taskId);
        tasks.splice(taskIndex, 1);
        saveTasks();
        li.remove(); // remove the list item element from the task list  (using li.remove())  (the list item element will be removed from the page when the delete button is clicked)
      }
    });
    taskList.appendChild(li); // append the list item element to the task list  (using taskList.appendChild(li))  (the list item element will be displayed on the page when it is appended to the task list)
  }

  // function to save tasks to local storage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  // JSON.stringify() is used to convert the tasks array to a string before saving it to local storage.(localStorage.setItem() is used to save the tasks array to local storage with the key "tasks")  (the key "tasks" is used to identify the tasks array in local storage)
});
