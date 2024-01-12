import {UrlManager} from "../utils/url-manager.js";
import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class RightAnswers {
    constructor() {
        this.userData = null;
        this.quiz = null;
        this.routeParams = UrlManager.getQueryParams();
        this.userInfo =Auth.getUserInfo();
        this.init();
    }

    async init() {
        if (!this.userInfo) {
            location.href = '#/';
        }
        if (this.routeParams.id) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + this.userInfo.userId)
                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    this.quiz = result;
                    this.showAnswers();
                }
            } catch (e) {
                console.log(e)
            }
        }
    }

    showAnswers() {
        const answersElement = document.getElementById('answers');
        const rightAnswersPreTitleElement = document.getElementById('right-answers-pre-title');
        rightAnswersPreTitleElement.innerText = this.quiz.test.name;
        const rightAnswersAuthorElement = document.getElementById('author');
        rightAnswersAuthorElement.innerHTML = `Тест выполнил <span>${this.userInfo.fullName}, ${this.userInfo.email}</span>`;

        this.quiz.test.questions.forEach((item, index) => {
            const rightAnswersBlock = document.createElement('div');
            rightAnswersBlock.className = 'right-answers-block';

            const rightAnswersBlockTitle = document.createElement('div');
            rightAnswersBlockTitle.className = 'common-question-title';
            rightAnswersBlockTitle.classList.add('right-answers-block-title');
            rightAnswersBlockTitle.innerHTML = `<span>Вопрос ${item.id}:</span> ${item.question}`;

            const rightAnswersBlockOptions = document.createElement('div');
            rightAnswersBlockOptions.className = 'common-question-options';

            item.answers.forEach(answer => {
                const answerElement = document.createElement('div');
                answerElement.className = 'common-question-option';

                const inputId = `answer-${answer.id}`;
                const inputElement = document.createElement('input');
                inputElement.className = 'option-answer';
                inputElement.setAttribute('type', 'radio');
                inputElement.setAttribute('id', inputId);
                inputElement.setAttribute('readonly', 'readonly');
                inputElement.setAttribute('disabled', 'disabled');

                const labelElement = document.createElement('label');
                labelElement.setAttribute('for', inputId);
                labelElement.innerText = answer.answer;

                if (answer.hasOwnProperty('correct')) {
                    inputElement.setAttribute('checked', 'checked')
                    if (answer.correct) {
                        inputElement.classList.add('right');
                        labelElement.classList.add('right');
                    } else {
                        inputElement.classList.add('wrong');
                        labelElement.classList.add('wrong');
                    }
                }

                answerElement.appendChild(inputElement);
                answerElement.appendChild(labelElement);
                rightAnswersBlockOptions.appendChild(answerElement);
            })

            rightAnswersBlock.appendChild(rightAnswersBlockTitle);
            rightAnswersBlock.appendChild(rightAnswersBlockOptions);

            answersElement.appendChild(rightAnswersBlock);
        })
    }
}
