# cycle-blessed
[Cycle.js](http://cycle.js.org/) drivers for [Blessed](https://github.com/chjj/blessed).

**`example/example.js`**:
![http://i.imgur.com/NE2AcK4.gif](http://i.imgur.com/NE2AcK4.gif)

## Installing

```sh
$ npm i -S cycle-blessed
```

## Getting Started

```js
import { run } from '@cycle/core';
import blessed from 'blessed';
import { makeTermDriver, makeScreenDriver, box } from 'cycle-blessed';
import { Observable as $ } from 'rx';

let screen = blessed.screen({ smartCSR: true });
screen.title = 'Hello, World!';

let PlainText = text => box({ border: { type: 'line', fg: 'blue' } }, text);

run(({ screen: { on } }) => {
	return {
		term: $.just(PlainText('Hello, World!')),
		exit: on('key C-c')
	}
}, {
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

Produces an object containing a stream creator `on`.

#####`on(event) => Observable`

Takes all events supported by the Blessed `EventEmitter`.

```js
on('key a').forEach(() => console.log('pressed [a]'))
```

###`h(name, options, content) => Element`

Creates a Blessed Element.

```js
h('box', {} , 'Hello!');
```

###`factory(name) => (options, content) => Element`

Creates a helper function.

```js
let box = factory('box');

box({}, 'Hello!');
```

###`box(options, content) => Element`

A convenient export of `factory('box')`.
