[![Published on NPM](https://img.shields.io/npm/v/@advanced-rest-client/projects-list-consumer-mixin.svg)](https://www.npmjs.com/package/@advanced-rest-client/projects-list-consumer-mixin)

[![Build Status](https://travis-ci.org/advanced-rest-client/projects-list-consumer-mixin.svg?branch=stage)](https://travis-ci.org/advanced-rest-client/projects-list-consumer-mixin)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/advanced-rest-client/projects-list-consumer-mixin)


# projects-list-consumer-mixin

A mixin with common methods for (legacy) projects list.

It is intended to be used in ARC components for saved requests list and for saved editor dialog.

## API components

This components is a part of [API components ecosystem](https://elements.advancedrestclient.com/)

## Usage

### Installation
```
npm install --save @advanced-rest-client/projects-list-consumer-mixin
```

### In a LitElement

```js
import { LitElement, html } from 'lit-element';
import { ProjectsListConsumerMixin } from '@advanced-rest-client/projects-list-consumer-mixin/projects-list-consumer-mixin.js';

class SampleElement extends ProjectsListConsumerMixin(LitElement) {
  render() {
    return html`
    ${(this.projects || []).map((project) => html`...`)}
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

## Development

```sh
git clone https://github.com/advanced-rest-client/projects-list-consumer-mixin
cd projects-list-consumer-mixin
npm install
```

## Running the tests
```sh
npm test
```
