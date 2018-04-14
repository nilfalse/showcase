import debounce from '../utils/debounce';
import eventEmitter from '../utils/event-emitter';


const html = prefilledValue => `
<div class="headlines-filter">
    <input type="search"
        class="headlines-filter__control"
        placeholder="Search through stories"
        value="${prefilledValue}" />
</div>
`;

const selector = 'input.headlines-filter__control';

export default class SearchFieldComponent {
    constructor(app) {
        eventEmitter.mixInto(this);
        this._app = app;
        this._node = null;
        this._value = '';
        this._onInput = debounce(this._onInput, 300, this);
        app.once('render', this._postInit.bind(this));
    }

    render(prefilledValue = '') {
        this._value = prefilledValue;
        return html(prefilledValue);
    }

    setValue(newVal) {
        if (newVal.trim() !== this._node.value.trim()) {
            this._node.value = newVal;
            this._node.setSelectionRange(this._node.value.length, this._node.value.length);
        }
        this._value = newVal;
    }

    setFocus() {
        if (!this._node) {
            return;
        }
        node.focus();
    }

    _postInit() {
        const node = this._app.root.querySelector(selector);
        if (!node) {
            return;
        }
        this._node = node;
        node.addEventListener('input', this._onInput, false);
        node.setSelectionRange(node.value.length, node.value.length);
    }

    _fire(val) {
        if (val.length) {
            this.emit('search', val);
        } else {
            this.emit('reset');
        }
    }

    _onInput(evt) {
        this._value = evt.target.value;
        this._fire(evt.target.value);
    }
}
