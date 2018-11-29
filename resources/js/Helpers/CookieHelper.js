import _ from 'lodash';

export default class CookieHelper {
    static getCookie(pointer) {
        let cookies = document.cookie;
        for (let cpl of cookies.split(';')) {
            let spl = cpl.slit('=');
            let key = spl[0] || "";
            if (key.trim() === pointer) return spl[1];
        }
        return undefined;
    }
}
