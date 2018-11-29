import API from './API.js';

export default class AuthApi extends API {
    authenticate() {
        return new Promise((resolve, reject) => {
            let url = [
                this.getApiUrl(),
                'api/v1/user/authenticate'
                ].join('');
                return this.$.ajax({
                    type: 'POST',
                    url,
                    headers: {
                        'raxxla-auth': this.getCookie(),
                    }
                }).then(data => {
                    console.log({data});
                    return resolve(data);
                }).fail(err => {
                    return reject(err);
                });
        });
    }

    login(email, password) {
        let url = [
            this.getApiUrl(),
            'api/v1/user/login',
            '?',
            encodeURIComponent('email=' + email),
            '&',
            encodeURIComponent('password=' + password),
        ].join('');
        return new Promise((resolve, reject) => {
            this.$.ajax({
                url
            }).then(data => {
                return resolve(data);
            }).fail(err => {
                return reject(err);
            });
        });
    }

    createUser(data) {
        let url = [
            this.getApiUrl(),
            'api/v1/user/create'
        ].join('');
        return new Promise((resolve, reject) => {
            this.$.ajax({
                type: 'POST',
                url,
                data
            }).then(res => {
                console.log({res});
                return resolve(res);
            }).fail(err => {
                return reject(err);
            });
        });
    }
}

window.api = new AuthApi();
