import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth";

export class Choice {
    constructor() {
        this.quizzes = [];
        this.testResults = null;
        this.init();
    }

    async init() {
        try {
            const result = await CustomHttp.request(config.host + '/tests');
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }
                this.quizzes = result

            }
        } catch (e) {
            return console.log(e)
        }
        const userInfo = Auth.getUserInfo();
        if (userInfo) {

            try {
                const results = await CustomHttp.request(config.host + '/tests/results?userId=' + userInfo.userId);
                if (results) {
                    if (results.error) {
                        throw new Error(results.error);
                    }
                    this.testResults = results
                }
            } catch (e) {
                return console.log(e)
            }
        }

        this.processQuizzes();
    }

    processQuizzes() {
        const choiceOptionsElement = document.getElementById('choice-options');
        if (this.quizzes && this.quizzes.length > 0) {
            this.quizzes.forEach(quiz => {
                const that = this;
                const choiceOptionElement = document.createElement('div');
                choiceOptionElement.className = 'choice-option';
                choiceOptionElement.setAttribute('data-id', quiz.id)
                choiceOptionElement.onclick = function () {
                    that.chooseQuiz(this)
                }
                const choiceOptionTextElement = document.createElement('div');
                choiceOptionTextElement.className = 'choice-option-text';
                choiceOptionTextElement.innerText = quiz.name;

                const choiceOptionArrowElement = document.createElement('div');
                choiceOptionArrowElement.className = 'choice-option-arrow';

                const result = this.testResults.find(item => item.testId === quiz.id);
                if (result) {
                    const choiceOptionResultElement = document.createElement('div');
                    choiceOptionResultElement.className = 'choice-option-result';
                    choiceOptionResultElement.innerHTML = '<div>Результат</div><div>' + result.score +
                        '/' + result.total + '</div>';
                    choiceOptionElement.appendChild(choiceOptionResultElement);
                }

                const choiceOptionImageElement = document.createElement('img');
                choiceOptionImageElement.setAttribute('src', 'images/arrow.png');
                choiceOptionImageElement.setAttribute('alt', 'Стрелка');

                choiceOptionArrowElement.appendChild(choiceOptionImageElement);
                choiceOptionElement.appendChild(choiceOptionTextElement);
                choiceOptionElement.appendChild(choiceOptionArrowElement);

                choiceOptionsElement.appendChild(choiceOptionElement)
            })
        }
    }

    chooseQuiz(element) {
        const dataId = element.getAttribute('data-id')
        if (dataId) {
            location.href = '#/test?id=' + dataId;
        }
    }
}
