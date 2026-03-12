const apiURL = "https://opentdb.com/api.php?amount=5&type=multiple";
let questions = [];

//Data Transformation

async function fetchQuestions() {
    const response = await fetch(apiURL);
    const data = await response.json();

    questions = data.results.map(q => {
        const answers = [
            ...q.incorrect_answers.map(ans => ({
                text: ans,
                correct: false
            })),
            {
                text: q.correct_answer,
                correct: true
            }
        ];

        // Shuffle answers
        answers.sort(() => Math.random() - 0.5);

        return {
            question: decodeHTML(q.question),
            answers: answers
        };
    });
}

const questionElement = document.getElementById("question");
const answerbuttons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

async function startQuiz(){
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    await fetchQuestions(); 
    showQuestion();
}

function decodeHTML(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function showQuestion(){
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex +1;
    questionElement.innerHTML = questionNo + "." + currentQuestion.question;

currentQuestion.answers.forEach(answer => {
    const button = document.createElement("button");
    button.innerHTML = decodeHTML(answer.text);
    button.classList.add("btn");
    answerbuttons.appendChild(button);
    if(answer.correct){
        button.dataset.correct = answer.correct;
    }

    button.addEventListener("click", selectAnswer);
})
}

function resetState(){
    nextButton.style.display = "none";
    while(answerbuttons.firstChild){
        answerbuttons.removeChild(answerbuttons.firstChild);
    }
}

function selectAnswer(e){
    const selectButton = e.target;
    const isCorrect = selectButton.dataset.correct === "true";
    if(isCorrect){
        selectButton.classList.add("correct");
    score++;}
    else{selectButton.classList.add("incorrect");}

    Array.from(answerbuttons.children).forEach(button =>
        {if(button.dataset.correct === "true"){
            button.classList.add("correct");
        } 
        button.disabled = true;}
    );
    nextButton.style.display = "block";
}


function showScore(){
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";

}
function handleNextBtn(){
   currentQuestionIndex++;
   if(currentQuestionIndex<questions.length){
    showQuestion();
   }else{
    showScore();
   }
}

nextButton.addEventListener("click", ()=>
{
    if(currentQuestionIndex<questions.length){
        handleNextBtn();

    }else{
        startQuiz();
    }
})
startQuiz();