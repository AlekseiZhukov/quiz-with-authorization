import {UrlManager} from "../utils/url-manager";
import {CustomHttp} from "../services/custom-http";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Result {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();

        this.init();

        document.getElementById('right-answers').onclick = this.goToRightAnswers.bind(this)
    }

    async init () {
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        }
        if (this.routeParams.id) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id +'/result?userId=' + userInfo.userId)
                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    document.getElementById('result-score').innerText = `${result.score}/${result.total}`;
                    return;
                }
            } catch (e) {
                console.log(e)
            }
        }
        location.href = '#/';
    }

    goToRightAnswers() {
        if (this.routeParams.id) {
            location.href = '#/right-answers?id=' + this.routeParams.id;
        }
    }
}
