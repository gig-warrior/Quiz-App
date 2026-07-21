//===============================
//BASE VARIABLES
//===============================
const base_url = "https://opentdb.com/api.php?amount=10&category=9&type=multiple";
let points = 0;

//======================================
//QUESTIONS
//======================================
let questions = [];


async function dataShow() {
    try {
        let response = await fetch(base_url);
        let data = await response.json();
        console.log(data);
        let results = data.results;

        results.forEach(eachQuizObject => {
            let quizObject = {};

            let question = eachQuizObject.question;
            let answer = eachQuizObject.correct_answer;
            let incorrect_ans = eachQuizObject.incorrect_answers;

            const randomIndex = Math.floor(Math.random()*4);
            incorrect_ans.splice(randomIndex, 0, answer);
            let options = incorrect_ans;


            quizObject["question"] = question;
            quizObject["options"] = options;
            quizObject["answer"] = answer;
            
            questions.push(quizObject);
            // console.log(quizObject);
        });

        

        // console.log(question);
        // console.log(options);
        // console.log(answer);
        
    }
    catch(error){
        console.log(error);
        alert("failed to load questions");
    }
}

// const questions = [
//     {
//         question: "what is the capital of india?",
//         options: ["delhi", "mumbai", "kolkata", "chennai"],
//         answer: "delhi"
//     },
//     {
//         question: "which language runs in browser?",
//         options: ["python", "java", "javascript", "c++"],
//         answer: "javascript"
//     },
//     {
//         question: "choli ke piche kya hai?",
//         options: ["minecraft", "watermelon", "little japan", "ninja hatori"],
//         answer: "ninja hatori"
//     },
//     {
//         question: "who is the girlfriend of GOUDA TAKEO?",
//         options: ["tomato san", "yamato san", "yamete san", "sunakawa san"],
//         answer: "yamato san"
//     },
//     {
//         question: "kis color ki chaddi pehne ho?",
//         options: ["red", "pink", "black", "white"],
//         answer: "pink"
//     }
// ];


//===========================
//countdown
//============================

const progress = document.querySelector(".progress");
const time = document.querySelector(".time");
let totalTime = 20;
let timeLeft = 20;
let interval; //<<<< ONLY STORES ID


function startTimer() {
    clearInterval(interval);

    timeLeft = totalTime;
    updateTimerUI(); //THIS STOPS DELAY AT NEXT QUESTION

    interval = setInterval(() => {
        timeLeft -= 1;

        updateTimerUI(); 

        if(timeLeft === 0) {
            clearInterval(interval);
        }

        if(timeLeft === 0) {
            showTimeupScreen();
        }
        
    }, 1000);
};

function updateTimerUI() {
    time.textContent = `00:${String(timeLeft).padStart(2, "0")}`;
    let output = (timeLeft / totalTime) * 100;
    progress.style.width = `${output}%`;
};

//===============================
//HTML DECODE ENTITIES
//===============================
function decodeHTMLEntities(text) {
    const parser = new DOMParser();
    const decoded = parser.parseFromString(text, 'text/html');
    return decoded.documentElement.textContent;
};

//===============================
//questions Show
//===============================
const questionBox = document.querySelector(".questionBox");
const optA = document.querySelector("#opt-A");
const optB = document.querySelector("#opt-B");
const optC = document.querySelector("#opt-C");
const optD = document.querySelector("#opt-D");
let ans = "";
let currQuestionIndex = 0; //main question index
let currQuestionIndex2 = 0; //to match the total question number
let answered = false;

const optBox = document.querySelectorAll(".opt-box");

function showQuestion() {
    questionBox.textContent = decodeHTMLEntities(questions[currQuestionIndex].question); 
    optA.textContent = decodeHTMLEntities(questions[currQuestionIndex].options[0]); 
    optB.textContent = decodeHTMLEntities(questions[currQuestionIndex].options[1]); 
    optC.textContent = decodeHTMLEntities(questions[currQuestionIndex].options[2]); 
    optD.textContent = decodeHTMLEntities(questions[currQuestionIndex].options[3]); 
    ans = decodeHTMLEntities(questions[currQuestionIndex].answer); 
    
    // console.log(currQuestionIndex + 1); 
    
    optBox.forEach(option => {
        option.classList.remove("correct");
        option.classList.remove("wrong");
        option.classList.remove("disable");
        answered = false;
    });
    startTimer();
}; 

//===============================
//checkbox and answer check
//===============================
let selectedOption = "";
let selectedBox = null;

optBox.forEach(option => {
    //CheckBox
    option.addEventListener("mouseenter", () => {
        optBox.forEach(opt => {
            opt.classList.remove("selected");
        });
        option.classList.add("selected");
        selectedOption = option.querySelector(".opt").textContent;
        selectedBox = option;
    });

    //ANSWER check
    option.addEventListener("click", () => {
        if(selectedOption === ans) {
            selectedBox.classList.add("correct");
            clearInterval(interval);
            points++;
        }
        else {
            selectedBox.classList.add("wrong");
            clearInterval(interval);

            optBox.forEach(option => {  //real answer show
                let chosen = option.querySelector(".opt").textContent;
                if(chosen === ans) {
                    option.classList.add("correct");
                }
            });
        }

        if(answered) return; //guard clause

        optBox.forEach(option => {
            option.classList.add("disable"); 
        });
        
        answered = true;
    });
});

//===============================
//Next Question Button
//===============================
const nextButton = document.querySelector(".next");

let isLastQuestion = false;

nextButton.addEventListener("click", () => {
    currQuestionIndex += 1;

    nextButton.classList.add("disable");

    // console.log(points);
    showResultScreen();
    showCurrQuestionNum();
    updateQuestionIndex();
    if(isLastQuestion) return; //GUARD CLAUSE
    showQuestion();
});

//===============================
//NEXT button disable till answer
//===============================
nextButton.classList.add("disable");

optBox.forEach(option => {
    option.addEventListener("click", () => {
        nextButton.classList.remove("disable");
    });
});

//===============================
//CHANGE SCREEN BASED ON ACTION
//===============================
const startingScreen = document.querySelector(".startingScreen");
const quizScreen = document.querySelector(".quizScreen");
const timeupScreen = document.querySelector(".time-upScreen");
const finalScoreScreen  = document.querySelector(".finalScoreScreen");
const loadingScreen = document.querySelector(".loadingScreen");

const startQuizButton = document.querySelector(".startQuizButton");
const restartQuizButton = document.querySelector(".restartQuizButton");
const gotoHomeButton  = document.querySelector(".gotoHomeButton");

loadingScreen.classList.add("hideLoadingScreen");
quizScreen.classList.add("hideQuizScreen");
timeupScreen.classList.add("hideTimeupScreen");
finalScoreScreen.classList.add("hideFinishScreen");

async function showLoadingScreen() {
    startingScreen.classList.add("hideStartScreen");
    loadingScreen.classList.remove("hideLoadingScreen");
    await dataShow();
    showQuizScreen();
    showQuestion();
    showCurrQuestionNum();
    updateQuestionIndex();
};
function showQuizScreen() {
    loadingScreen.classList.add("hideLoadingScreen");
    quizScreen.classList.remove("hideQuizScreen");
};
function showTimeupScreen() {
    quizScreen.classList.add("hideQuizScreen");
    timeupScreen.classList.remove("hideTimeupScreen");
};
function updateQuestionIndex() { //this UPDATES the currQuestionIndex by 1 number so it matches with the total question num
    currQuestionIndex2 = currQuestionIndex + 1;

    // console.log(currQuestionIndex2);
    // console.log(questions.length);
};
function showResultScreen() {
    if(currQuestionIndex2 === questions.length) {
        quizScreen.classList.add("hideQuizScreen");
        finalScoreScreen.classList.remove("hideFinishScreen");
        showCurrPoints();
        isLastQuestion = true;
    }
};

startQuizButton.addEventListener("click", () => {
    isLastQuestion = false;
    showLoadingScreen();
});
restartQuizButton.addEventListener("click", () => {
    isLastQuestion = false;
    showLoadingScreen();
    resetData();
    // startTimer();
    // showQuestion();
    // showCurrQuestionNum();
    // updateQuestionIndex();

    timeupScreen.classList.add("hideTimeupScreen");
    // loadingScreen.classList.remove("hideLoadingScreen");
});
gotoHomeButton.addEventListener("click", () => {
    finalScoreScreen.classList.add("hideFinishScreen");
    startingScreen.classList.remove("hideStartScreen");

    resetData();
});

//===============================
//SHOW FINAL POINTS
//===============================
const currPoints = document.querySelector("#points");

function showCurrPoints() {
    currPoints.textContent = `${points}/${questions.length}`;
};

//===============================
//RESET VARIABLES DATA
//===============================
function resetData() {
    points = 0;
    currQuestionIndex = 0;
    currQuestionIndex2 = 0;
    questions = [];
};

//===============================
//Question number show
//===============================
const currQuestionNum = document.querySelector("#currNum");

function showCurrQuestionNum() {
    currQuestionNum.textContent = `${currQuestionIndex + 1}/${questions.length}`;
};
showCurrQuestionNum();


