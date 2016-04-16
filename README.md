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

let BlueBox = text => box({ border: { type: 'line', fg: 'blue' } }, text);

run(({ term }) => ({
	term: $.just(BlueBox('Hello, World!')),
	exit: term.on('key C-c')
}), {
	term: makeTermDriver(screen),
	exit: exit$ => exit$.forEach(::process.exit)
});
```

![http://i.imgur.com/zOQknts.png](http://i.imgur.com/zOQknts.png)

## API

###`makeTermDriver(screen) => CycleDriver`

Takes a stream of Blessed `Element`s.

Produces an object containing stream creators `on` and `onGlobal`.

#####`on(event, transform = []) => Observable`

Takes all events supported by the Blessed `EventEmitter`. Emits events from the root element. Optionally, you can specify arbitrary stream transformers as `transform`. See [API/transform](#apitransform) for a list of available transformers.

All nested events in the form of `element event` can be abbreviated to `*event`.

The Observable emits an array of arguments per event (an array is necessary because of a limitation of the RxJS pipeline).

```js
on('key a').forEach(([el, ch, key]) => console.log(`pressed [${ ch }]`))
```

#####`onGlobal(event, transform = []) => Observable`

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

## API/transform

Transforms are helper functions that help to reduce boilerplate for common UI and data idioms.

###`id(i) => stream => Stream`

```js
on('*click', id('Submit'))
```

Emits all clicks on elements that have an `id` of `'Submit'`.

###`view(...v) => stream => Stream`

```js
on('*click', view(0, 'value'))
```

Emits all clicks, plucking the first element and then the `value` property.

###`key(k) => stream => Stream`

```js
on('*keypress', key('C-c'))
```

Emits all keypresses in which `'C-c'` was entered.

###`constant(i) => stream => Stream`

```js
on('*click', constant(true))
```

Emits `true` for every click.

###`init(...i) => stream => Stream`

```js
on('*keypress', init({}))
```

Emits every keypress, starting with `{}`.

###`toggle(init) => stream => Stream`

```js
on('*click', toggle(false))
```

Toggles between true and false for every click, starting with `false`.

## Examples

**example/basic.js**

![http://i.imgur.com/zOQknts.png](http://i.imgur.com/zOQknts.png)

**example/click.js**

![http://i.imgur.com/IOA1AoN.png](http://i.imgur.com/IOA1AoN.png)
![http://i.imgur.com/ai34uJT.png](http://i.imgur.com/ai34uJT.png)

**example/input.js**

![http://i.imgur.com/J1oYcuL.png](http://i.imgur.com/J1oYcuL.png)
![http://i.imgur.com/NomEesn.png](http://i.imgur.com/NomEesn.png)

**example/writer.js**

![http://i.imgur.com/vnkp0pi.png](http://i.imgur.com/vnkp0pi.png)

## TODO
- implement diffing to fix defocusing bugs
  - current workaround is to implement custom elements (not that hard)
- synthetic event API to improve event selection
