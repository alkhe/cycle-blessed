import { run } from '@cycle/core';
import blessed from 'blessed';
import { makeTermDriver, box } from '../src';
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
