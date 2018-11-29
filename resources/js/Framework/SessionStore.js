import _ from 'lodash';

class SessionStore {
    constructor() {
        this.store = {};
    }

    getStore() {
        return this.store;
    }

    setStoreKey(key, value) {
        _.set(this.store, key, value);
    }

    setWholeStore(store) {
        this.store = store;
    }
}

let $instance;
export default {
    getInstance(){
        if (!$instance) $instance = new SessionStore();
        return $instance;
    }
}
