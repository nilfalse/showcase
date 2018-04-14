import assign from 'object-assign';


const eventEmitter = {
    mixInto: function(dest) {
        assign(dest, {
            _listeners: {},
            emit: this.emit,
            on: this.on,
            once: this.once,
            off: this.off,
            has: this.has
        });
    },

    emit: function emit(evt, ...payload) {
        if (!this._listeners.hasOwnProperty(evt)) {
            return false;
        }
        this._listeners[evt].forEach(cb => {
            try {
                cb(...payload);
            } catch(o_O) {}
        });
    },

    on: function on(evt, cb) {
        if (this.has(evt, cb)) {
            return false;
        }

        if (!this._listeners.hasOwnProperty(evt)) {
            this._listeners[evt] = [];
        }
        this._listeners[evt].push(cb);
        return true;
    },
    once: function once(evt, cb) {
        const callbackOnce = function(...args) {
            this.off(evt, callbackOnce);
            cb(...args);
        }.bind(this);
        this.on(evt, callbackOnce);
    },
    off: function off(evt, cb = null) {
        if (!this._listeners.hasOwnProperty(evt)) {
            return false;
        }
        if (!cb) {
            delete this._listeners[evt];
            return;
        }
        const idx = this._listeners[evt].indexOf(cb);
        if (-1 === idx) {
            return false;
        }
        this._listeners[evt].splice(idx, 1);
        return true;
    },

    has: function has(evt, cb) {
        if (!this._listeners.hasOwnProperty(evt)) {
            return false;
        }
        if (~this._listeners[evt].indexOf(cb)) {
            return true;
        }
        return false;
    }
};

export default eventEmitter;
