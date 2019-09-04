import { LitElement } from 'lit-element';
import { ProjectsListConsumerMixin } from '../projects-list-consumer-mixin.js';
/**
 * @customElement
 * @demo demo/index.html
 * @appliesMixin ProjectsListConsumerMixin
 */
class TestElement extends ProjectsListConsumerMixin(LitElement) {
}
window.customElements.define('test-element', TestElement);
