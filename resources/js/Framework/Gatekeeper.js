import SessionStore from './SessionStore.js';
import AuthApi from '../API/AuthApi.js';
import EventBusFactory from '../Framework/EventBusFactory.js';


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
        this.eventBus = EventBusFactory.getInstance()
            .get('session');
        this._onSignOut();
    }

    _onSignOut() {
        this.eventBus.once('sign out', () => {
            document.cookie="raxxla_auth=false;expires=" + new Date(0).toGMTString()
            window.location.reload();
        });
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
