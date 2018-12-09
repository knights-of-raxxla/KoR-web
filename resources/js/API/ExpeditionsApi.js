import API from './API.js';

export default class ExpeditionsApi extends API {

    createExpedition(data) {
        return new Promise((resolve, reject) => {
            let url = [
                this.getApiUrl(),
                'api/v1/expeditions',
                ].join('');
                return this.$.ajax({
                    type: 'POST',
                    data,
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

    fetchExpedition(id, offset = 0, partial = false) {
        return new Promise((resolve, reject) => {
            let url = [
                this.getApiUrl(),
                'api/v1/expedition/',
                id,
                '?offset=',
                offset,
                '&partial=',
                partial
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

    /**
     * @param {String} like search string
     * @return {Promise<Object[], Error>}
     */
    searchSystem(like, expedition) {
        return new Promise((resolve, reject) => {
            let url = [
                this.getApiUrl(),
                'api/v1/systems/search',
                '?system=',
                like
                ];
                if (expedition)
                    url.push('&expedition=' + expedition);

                url = url.join('');
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

    fetchCurrentExpeditions() {
        return new Promise((resolve, reject) => {
            let url = [
                this.getApiUrl(),
                'api/v1/expeditions/current',
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
    findExpeditionsAroundMe(data) {
        return new Promise((resolve, reject) => {
            let url = [
                this.getApiUrl(),
                'api/v1/expeditions/around',
                '?system_id=',
                data.id
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

    getSystemInfo(id) {
        return new Promise((resolve, reject) => {
            let url = [
                this.getApiUrl(),
                'api/v1/system/',
                id
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

    sendVisitableUpdate(data) {
        return new Promise((resolve, reject) => {
            let url = [
                this.getApiUrl(),
                'api/v1/visitables',
                ].join('');
                return this.$.ajax({
                    type: 'POST',
                    data,
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
