import API from './API.js';

export default class ExpeditionsApi extends API {

    searchSystem(like) {
        return new Promise((resolve, reject) => {
            let url = [
                this.getApiUrl(),
                'api/v1/systems/search',
                '?system=',
                like
                ].join('');
                return this.$.ajax({
                    type: 'GET',
                    url,
                    headers: {
                        'raxxla-auth': this.getCookie(),
                    }
                }).then(data => {
                    return resolve(data);
                }).fail(err => {
                    return reject(err);
                });
        });
    }
}
