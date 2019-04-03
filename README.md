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

### In a Polymer 3 element

```js
import {PolymerElement, html} from './node_modules/@polymer/polymer/polymer-element.js';
import {ProjectsListConsumerMixin} from './node_modules/@advanced-rest-client/projects-list-consumer-mixin/projects-list-consumer-mixin.js';

class SampleElement extends ProjectsListConsumerMixin(PolymerElement) {
}
customElements.define('sample-element', SampleElement);
```

### Installation

```sh
git clone https://github.com/advanced-rest-client/projects-list-consumer-mixin
cd api-url-editor
npm install
npm install -g polymer-cli
```

### Running the demo locally

```sh
polymer serve --npm
open http://127.0.0.1:<port>/demo/
```

### Running the tests
```sh
polymer test --npm
```
