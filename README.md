# cycle-blessed
[Cycle.js](http://cycle.js.org/) drivers for [Blessed](https://github.com/chjj/blessed).

**`example/writer.js`**:
![http://i.imgur.com/NE2AcK4.gif](http://i.imgur.com/NE2AcK4.gif)

## Installing

```sh
$ npm i -S cycle-blessed
```

## Getting Started

**`example/basic.js`**:
```js
import { run } from '@cycle/core';
import blessed from 'blessed';
import { makeTermDriver, makeScreenDriver, box } from '../src';
import { Observable as $ } from 'rx';

let screen = blessed.screen({ smartCSR: true, useBCE: true });
screen.title = 'Hello, World!';

let PlainText = text => box({ border: { type: 'line', fg: 'blue' } }, text);

run(({ screen: { on } }) => ({
	term: $.just(PlainText('Hello, World!')),
	exit: on('key C-c')
}), {
	term: makeTermDriver(screen),
	screen: makeScreenDriver(screen),
	exit: exit$ => exit$.forEach(::process.exit)
});
```

![http://i.imgur.com/WL4RaiN.png](http://i.imgur.com/WL4RaiN.png)

## API

###`makeTermDriver(screen) => CycleDriver`

Write-only driver.

Takes a stream of Blessed `Element`s.

###`makeScreenDriver(screen) => CycleDriver`

Takes a stream of operations to the `screen` object (e.g. `screen => screen.realloc()`).

Produces an object containing stream creators `on` and `onGlobal`.

#####`on(event) => Observable`

Takes all events supported by the Blessed `EventEmitter`. Emits events from the root element.

#####`onGlobal(event) => Observable`

Takes all events supported by the Blessed `EventEmitter`. Emits events from the `screen` object.

```js
on('key a').forEach(() => console.log('pressed [a]'))
```

###`h(name, options, content) => Element`

Creates a Blessed Element.

```js
h('box', { content: 'Hello!' });
```

###`factory(name) => (options, content) => Element`

Creates a helper function.

```js
let box = factory('box');

box({ content: 'Hello!' });
```

###`box(options, content) => Element`

A convenient export of `factory('box')`.

###`element(options, content) => Element`

A convenient export of `factory('element')`.

###`text(options, content) => Element`

A convenient export of `factory('text')`.
