/**
 * @private
 * @property {Number} timeout
 * sauvegarde du timeout de l'instance
 */
// let _timeout;

/**
 * @private
 * @property {Number} time
 * le nombre de ms du timeout
 * 500 ms par défaut
 * @example
 * let ic = new InputChange();
 * ic.setWaitTime(500);
 * -> mettre un @change sur un input et appeler inputChange.watch()
 *  à chaque @change
 *  -> .watch() sera resolve quand le timeout sera expiré et prendra
 *  en compte les autres tentatives de recherche
 */

/**
 * @class
 * @description Permet d'avoir un delay sur un change d'un input
 */
export default class InputChange {
    constructor() {
        this._timeout = 0;
        this._time = 500;
    }
    /**
     * @setter
     * @private
     * @param {Number} time le timeout en ms
     */
    setWaitTime(time) {
        this._time = time;
    }

    /**
     * @public
     * watch un input
     * resolve quand le timeout est passé
     * @return {Promise<*, Error>} avec nada
     */
    watch() {
        return new Promise((resolve, reject) => {
            if (this._timeout) {
                this._clear();
            }
            this._timeout = setTimeout(() => {
                this._clear();
                return resolve();
            }, this._time);
        });
    }

    /**
     * clear le timeout de l'instance
     */
    _clear() {
        clearTimeout(this._timeout);
    }
}
