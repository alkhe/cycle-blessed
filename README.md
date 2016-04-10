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
import { makeTermDriver, box } from 'cycle-blessed';
import { Observable as $ } from 'rx';

let screen = blessed.screen({ smartCSR: true, useBCE: true, title: 'Hello, World!' });

let PlainText = text => box({ border: { type: 'line', fg: 'blue' } }, text);

run(({ term: { on } }) => ({
	term: $.just(PlainText('Hello, World!')),
	exit: on('key C-c')
}), {
	term: makeTermDriver(screen),
	exit: exit$ => exit$.forEach(::process.exit)
});
```

![http://i.imgur.com/WL4RaiN.png](http://i.imgur.com/WL4RaiN.png)

## API

###`makeTermDriver(screen) => CycleDriver`

Takes a stream of Blessed `Element`s.

Produces an object containing stream creators `on` and `onGlobal`.

#####`on(event) => Observable`

Takes all events supported by the Blessed `EventEmitter`. Emits events from the root element.

The Observable emits an array of arguments per event (an array is necessary because of a limitation of the RxJS pipeline).

```js
on('key a').forEach(([el, ch, key]) => console.log('pressed [a]'))
```

#####`onGlobal(event) => Observable`

Takes all events supported by the Blessed `EventEmitter`. Emits events from the `screen` object. See `on`.

###`makeScreenDriver(screen) => CycleDriver`

Takes a stream of operations to the `screen` object (e.g. `screen => screen.realloc()`). Produces a stream of the operations' results.

###`h(name, options = {}, children = []) => Element`

Creates a Blessed Element. If `children` or one of its elements is a `String`, it will be converted into a `text` node.

```js
h('box', { content: 'Hello!' });
```

###`factory(name) => (options = {}, children = []) => Element`

Creates a helper function for Blessed Elemets.

```js
let box = factory('box');

box({ content: 'Hello!' });
```

###`x(options = {}, children = []) => Element`

Where `x` is any one of `box`, `element`, `text`, `layout`, `form`, `textarea`, `button`.

## TODO
- implement diffing to fix defocusing bugs
  - current workaround is to implement custom elements (not that hard)
- synthetic event API to improve event selection
