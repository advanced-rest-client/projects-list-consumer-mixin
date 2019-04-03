import {PolymerElement} from '../../../@polymer/polymer/polymer-element.js';
import {ProjectsListConsumerMixin} from '../projects-list-consumer-mixin.js';
import {html} from '../../../@polymer/polymer/lib/utils/html-tag.js';
/**
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @appliesMixin ProjectsListConsumerMixin
 */
class TestElement extends ProjectsListConsumerMixin(PolymerElement) {
  static get template() {
    return html`
    <style></style>
`;
  }

  static get is() {
    return 'test-element';
  }
}
window.customElements.define(TestElement.is, TestElement);
