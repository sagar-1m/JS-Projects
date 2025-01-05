document.addEventListener("DOMContentLoaded", () => {
  // Get the elements from the DOM  that we need to interact with in the script
  const startBtn = document.getElementById("start-btn");
  const nextBtn = document.getElementById("next-btn");
  const restartBtn = document.getElementById("restart-btn");
  const questionContainer = document.getElementById("question-container");
  const questionText = document.getElementById("question-text");
  const choicesList = document.getElementById("choices-list");
  const resultContainer = document.getElementById("result-container");
  const scoreDisplay = document.getElementById("score");

  // Array of questions with question, options, and answer properties
  const questions = [
    {
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Madrid"],
      answer: "Paris",
    },
    {
      question: "What is the largest planet in our solar system?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"],
      answer: "Jupiter",
    },
    {
      question: "What is the currency of Japan?",
      options: ["Yen", "Dollar", "Euro", "Pound"],
      answer: "Yen",
    },
  ];

  let currentQuestionIndex = 0; // Variable to keep track of the current question index in the questions array
  let score = 0; // Variable to keep track of the user's score

  startBtn.addEventListener("click", startQuiz); // Add an event listener to the start button to start the quiz when the user clicks on it

  nextBtn.addEventListener("click", () => {
    currentQuestionIndex++; // Increment the currentQuestionIndex by 1 when the user clicks on the next button
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showResult();
    }
  });

  // Add an event listener to the restart button to restart the quiz when the user clicks on it
  restartBtn.addEventListener("click", () => {
    currentQuestionIndex = 0;
    score = 0;
    resultContainer.classList.add("hidden");
    startQuiz();
  });

  function startQuiz() {
    startBtn.classList.add("hidden");
    resultContainer.classList.add("hidden");
    questionContainer.classList.remove("hidden");
    showQuestion();
  }

  // Function to display the current question and choices on the screen
  function showQuestion() {
    nextBtn.classList.add("hidden");
    questionText.textContent = questions[currentQuestionIndex].question;
    choicesList.innerHTML = ""; // Clear the choices list before adding new choices
    questions[currentQuestionIndex].options.forEach((option) => {
      const choice = document.createElement("li");
      choice.textContent = option;
      choice.addEventListener("click", () => selectAnswer(option)); // Add an event listener to each choice to handle the answer selection  when the user clicks on a choice  and pass the selected option as an argument to the selectAnswer function  to check if the answer is correct

      choicesList.appendChild(choice);
    });
  }

  // Function to check if the selected answer is correct and update the score accordingly
  function selectAnswer(selectedOption) {
    const correctAnswer = questions[currentQuestionIndex].answer;
    if (selectedOption === correctAnswer) {
      score++;
    }
    nextBtn.classList.remove("hidden");
    choicesList.childNodes.forEach((choice) => {
      // want to disable the click event listener for each choice after the user has selected an answer to prevent the user from changing their answer
      choice.removeEventListener("click", () => selectAnswer(choice));

      if (choice.textContent === correctAnswer) {
        choice.classList.add("correct"); // Add a class to the correct answer choice to style it differently
      } else if (choice.textContent === selectedOption) {
        choice.classList.add("wrong"); // Add a class to the selected answer choice to style it differently
      }
    });
  }

  // Function to display the final result (score) to the user
  function showResult() {
    questionContainer.classList.add("hidden");
    resultContainer.classList.remove("hidden");
    scoreDisplay.textContent = `${score} / ${questions.length}`;
  }
});
