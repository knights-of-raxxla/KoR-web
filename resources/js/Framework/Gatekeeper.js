import SessionStore from './SessionStore.js';
import AuthApi from '../API/AuthApi.js';


const $cookie_key = 'raxxla_auth';
const $login_route = '/login';
const $public_routes = [
    '/login',
    '/reset-password'
];

export default class Gatekeeper {
    constructor() {
        this.session = SessionStore.getInstance();
        this.authApi = new AuthApi();
    }

    isOnPublicRoute() {
        let route = window.location.pathname;
        return $public_routes.indexOf(route) > -1;
    }

    hasAppCookie() {
        let cookies = document.cookie;
        let couples = cookies.split(';');
        for (let cpl in couples) {
            cpl = cpl.trim();
            let spl = cpl.split('=');
            let key = cpl[0];
            if (key === $cookie_key && cpl[1] && cpl[1].length)
                return true;
        }
        return false;
    }

    guard() {
        return new Promise((resolve, reject) => {
            if (this.isOnPublicRoute()) return resolve(true);
            return this.authApi.authenticate()
            .then(auth => {
                console.log(this.session);
                if (!auth) this.session.setWholeStore({});
                else this.session.setWholeStore(auth.session);
                return resolve(auth);
            }).catch(err => {
                return reject({err});
            })
        });
    }
}
