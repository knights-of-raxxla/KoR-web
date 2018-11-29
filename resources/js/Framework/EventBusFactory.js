/**
 * Factory des event managers
 * Permet de typer les events bus managers sur la
 * base de l'eventEmitter de Nodejs
 * @pattern Singleton - voir en bas
 * @auteur leo
 */
var events = require("events");
var moment = require("moment");
class EventBusFactory {

    constructor() {
        this.events = events;
        this._moment = moment;
        this._store = [];
    }

    get(key) {
        return this._findOrCreate(key);
    }

    /**
     * Renvoie une liste de toute les instances
     * enregistrées
     */
    list() {
        let instances = [];
        for (let EventHandler of this._store){
            let p = {
                name : EventHandler.name,
                created_at : EventHandler.created_at
            };
            instances.push(p);
        }
        return instances;
    }

    _createNew() {
        return new this.events();
    }

    _findOrCreate(key) {
        // find
        for (let EventHandler of this._store) {
            if (EventHandler.name == key) {
                return EventHandler.instance;
            }
        }
        // orCreate
        let instance = this._createNew();
        let newHandler = {
            name : key,
            instance : instance,
            created_at : this._moment()
        };

        this._store.push(newHandler);
        return newHandler.instance;
    }
}

var instance;
var instantiator = {
    getInstance : function(events, moment) {
        if (!instance) {
            instance = new EventBusFactory(events, moment);
        }
        return instance;
    }
};


export default instantiator;
