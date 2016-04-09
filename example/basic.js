import { run } from '@cycle/core';
import blessed from 'blessed';
import { makeTermDriver, makeScreenDriver, box } from '..';
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
