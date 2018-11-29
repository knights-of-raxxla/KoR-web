import CookieHelper from '../Helpers/CookieHelper.js';
import $ from 'jquery';
import env from '../env.js';

export default class API {
    constructor() {
        this.$ = $;
        this.ajax = $.ajax;
    }
    getCookie() {
        return CookieHelper.getCookie('raxxla_auth');
    }

    getApiUrl() {
        return env.api_url;
    }

    appendToApiUrl(str) {
        return this.getApiUrl() + str;
    }
}
