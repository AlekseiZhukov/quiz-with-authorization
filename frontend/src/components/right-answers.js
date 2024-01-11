import {UserDataFromSessionStorage} from "../utils/userDataFromSessionStorage.js";

export class RightAnswers  {
    constructor() {
        this.userData = null;
        this.rightAnswers = null;
        this.quiz = null;
        this.userResult = null;

        this.userData = UserDataFromSessionStorage.checkUserData();
        const testId = +sessionStorage.getItem('chooseQuizId');
        this.userResult = JSON.parse(sessionStorage.getItem('userResult'));
        if (testId) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://testologia.site/get-quiz-right?id=' + testId, false);
            xhr.send();

            if (xhr.status === 200 && xhr.responseText) {
                try {
                    this.rightAnswers = JSON.parse(xhr.responseText);
                } catch (e) {
                    location.href = '#/';
                }
            } else {
                location.href = '#/';
            }

            xhr.open('GET', 'https://testologia.site/get-quiz?id=' + testId, false);
            xhr.send();
            if (xhr.status === 200 && xhr.responseText) {
                try {
                    this.quiz = JSON.parse(xhr.responseText);
                } catch (e) {
                    location.href = '#/';
                }
                document.getElementById('right-answers-pre-title').innerText = `${this.quiz.name}`;
                if (this.userData) {
                    document.getElementById('author').innerHTML = `Тест выполнил <span>${this.userData.name} ${this.userData.lastName}, ${this.userData.email}</span>`
                }
                if (this.userResult) {
                    this.showAnswers();
                } else {
                    location.href = '#/';
                }

            } else {
                location.href = '#/';
            }
        }
    }

        showAnswers () {
            const answersElement = document.getElementById('answers');

            this.quiz.questions.forEach( (item, index) => {
                const rightAnswersBlock = document.createElement('div');
                rightAnswersBlock.className = 'right-answers-block';

                const rightAnswersBlockTitle = document.createElement('div');
                rightAnswersBlockTitle.className = 'common-question-title';
                rightAnswersBlockTitle.classList.add('right-answers-block-title');
                rightAnswersBlockTitle.innerHTML = `<span>Вопрос ${index + 1}:</span> ${item.question}`;

                const rightAnswersBlockOptions = document.createElement('div');
                rightAnswersBlockOptions.className = 'common-question-options';
                rightAnswersBlockOptions.classList.add('right-answers-block-options');

                let rightAnswerNumber = this.rightAnswers.find( (itemAnswer, indexAnswer) => indexAnswer === index);
                let userAnswerNumber = this.userResult.find( userAnswer => userAnswer.questionId === item.id);

                item.answers.forEach( answer => {
                    const answerElement = document.createElement('div');
                    answerElement.className = 'common-question-option';
                    answerElement.classList.add('right-answers-block-option');
                    if (userAnswerNumber && userAnswerNumber.chosenAnswerId === rightAnswerNumber && userAnswerNumber.chosenAnswerId === answer.id) {
                        answerElement.classList.add('right');
                    } else if (userAnswerNumber && userAnswerNumber.chosenAnswerId !== rightAnswerNumber && userAnswerNumber.chosenAnswerId === answer.id) {
                        answerElement.classList.add('wrong');
                    }
                    answerElement.innerText = `${answer.answer}`;
                    rightAnswersBlockOptions.appendChild(answerElement);
                })
                rightAnswersBlock.appendChild(rightAnswersBlockTitle);
                rightAnswersBlock.appendChild(rightAnswersBlockOptions);

                answersElement.appendChild(rightAnswersBlock);
            })

        }

    }
