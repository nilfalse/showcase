export default class Page {
    constructor(router) {
        this.router = router;
        this.app = router.getApp();
        this.log = new Function;

        router.once('dispose', () => this.dispose());
    }

    dispose() {
        this.log('disposed');
    }
}
