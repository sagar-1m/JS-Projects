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
    taskInput.value = ""; // clear the input field
    console.log(tasks);
  });

  // function to render a task  (this function will be used to display the tasks on the page) (the task object is passed as an argument to the function)  (the function will create a new list item element for the task and append it to the task list)  (the task text will be displayed inside the list item element)
  function renderTask(task) {
    console.log(task);
  }

  // function to save tasks to local storage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  // JSON.stringify() is used to convert the tasks array to a string before saving it to local storage.(localStorage.setItem() is used to save the tasks array to local storage with the key "tasks")  (the key "tasks" is used to identify the tasks array in local storage)
});
