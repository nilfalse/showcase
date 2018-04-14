import assign from 'object-assign';
import eventEmitter from '../utils/event-emitter';


export default class Router {
    constructor(routes, app) {
        eventEmitter.mixInto(this);

        this.log = app.getLogger('nilfalse:router');
        this.notFoundRoute = null;
        this._currRoute = null;
        this._currHandler = null;
        this._app = app;
        this._routes = this._compileRoutes(routes);
    }

    start() {
        window.addEventListener('popstate', e => {
            this.log('popstate', e.state);
            this._execute(document.location);
        });
        this._execute(document.location);
    }

    getApp() {
        return this._app;
    }

    getParams() {
        return this._currRoute ? this._currRoute.params : {};
    }

    getPayload(name) {
        const payload = this._currRoute ? this._currRoute.payload : {};
        return name ? payload && payload[name] || null : payload;
    }

    emitNotFound(error) {
        this._currRoute = this.notFoundRoute;
        this.log('handling error 404');
        this.emit('route:@404', this.notFoundRoute && this.notFoundRoute.payload);
        this.emit('route', this.notFoundRoute);
        if (this.notFoundRoute) {
            this.emit('dispose');
            let page = new this.notFoundRoute.handler(this);
            page.render(error);
            this._currHandler = page;
        }
    }

    setUrl(url, { replace = false } = {}) {
        const payload = {};
        const title = {};
        const method = replace ? 'replaceState' : 'pushState';
        if (url === document.location.href) {
            return;
        }
        window.history[method](payload, title, url);
        this._execute(document.location);
    }

    _compileRoutes(routes) {
        const pathMatchRexp = /:(\w+)/ig;
        if (routes.hasOwnProperty('@404')) {
            this.notFoundRoute = {
                handler: routes['@404'].handler,
                payload: routes['@404'].payload
            };
        }
        return Object.keys(routes)
            .filter(r => r.startsWith('/'))
            .map(route => {
                const params = [];
                const rexp = route.replace(pathMatchRexp, (token, paramName, offset) => {
                    params.push(paramName);
                    return '(\\w+)';
                });

                this.log('registered', route, params.join(', '));
                return {
                    pattern: route,
                    rexp: new RegExp(/*'^' + */rexp + '$', 'i'),
                    paramsList: params,
                    handler: routes[route].handler,
                    payload: routes[route]
                };
            });
    }

    _execute(location) {
        const route = this._findMatch(location);
        const queryParams = this._parseUrlParams(location.search.substr(1));
        if (route) {
            this._currRoute = route;
            this.log('matched', route.pattern, route.params);
            this.log('query', queryParams);
            route.params = assign({}, queryParams, route.params);
            this.emit('route:' + route.pattern, route.params);
            this.emit('route', route);
            if (route.handler) {
                if ((this._currHandler instanceof route.handler)
                && 'handleRouteChange' in this._currHandler) {
                    this._currHandler.handleRouteChange();
                } else {
                    this.emit('dispose');
                    this._currHandler = new route.handler(this);
                }
            } else {
                this.log('no handler set for matched route');
            }
        } else {
            this.emitNotFound();
        }
    }

    _findMatch(loc) {
        let params = null;
        const route = this._routes.find(route => {
            params = route.rexp.exec(loc.pathname);
            return null !== params;
        });

        return route ? {
            pattern: route.pattern,
            handler: route.payload.handler,
            params: route.paramsList.reduce((state, token, idx) => {
                state[token] = params[idx + 1];
                return state;
            }, {}),
            payload: route.payload
        } : null;
    }

    _parseUrlParams(queryStr) {
		return queryStr.split("&").reduce((state, str) => {
            const [k, v] = str.split("=")
                .map(decodeURIComponent)
                .reduce((state, str) => {
                    const l = state.length;
                    if (l < 2) {
                        state.push(str);
                    } else {
                        state[l - 1] = state[l - 1] + '=' + str;
                    }
                    return state;
                }, []);
            if (k) {
                state[k] = v;
            }
            return state;
        }, {});
    }
}
