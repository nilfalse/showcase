import eventEmitter from '../utils/event-emitter';
import Router from './router';


const loggers = {};

export default class Application {

    constructor({ logger = null, routes, serviceWorker = null, name } = {}) {
        eventEmitter.mixInto(this);

        this._logger = logger;
        this.log = this.getLogger('nilfalse:app');
        this.log('init');
        this.root = null;
        this.name = name;
        this.router = new Router(routes, this);
        if (serviceWorker) {
            this._registerServiceWorker(serviceWorker.url, {
                scope: serviceWorker.scope
            });
        }
    }

    getLogger(ns) {
        if (loggers.hasOwnProperty(ns)) {
            return loggers[ns];
        }
        return loggers[ns] = this._logger ? this._logger(ns) : console.log.bind(console, ns);
    }

    inject(...services) {
        services.forEach(Service => new Service(this));
        return this;
    }

    capture(rootNode) {
        this.root = rootNode;
        this.emit('capture');
        this.router.start();
        this.log('started');
        return this;
    }

    set title(val) {
        const prefix = val ? val + ' - ' : '';
        document.title = prefix + this.name;
    }

    render(html) {
        if (!this.root) {
            throw new Error(`Application's root DOM node must have
                been captured via capture() call before render() is allowed`);
        }
        this.root.innerHTML = html;
        this.emit('render', html);
    }

    _registerServiceWorker(url, { scope }) {
        if (!('serviceWorker' in navigator)) {
            return;
        }
        navigator.serviceWorker.register(url, { scope: scope })
            .then((reg) => {
                if(reg.installing) {
                    this.log('service worker is installing');
                } else if(reg.waiting) {
                    this.log('service worker is installed');
                } else if(reg.active) {
                    this.log('service worker is active');
                }
            })
            .catch((err) => {
                // registration failed
                this.log('service worker registration failed with ', err);
            });
    }
}
