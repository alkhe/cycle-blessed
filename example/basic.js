import { run } from '@cycle/xstream-run';
import blessed from 'blessed';
import { makeTermDriver, box } from '../src';
import $ from 'xstream';

let screen = blessed.screen({ smartCSR: true, useBCE: true, title: 'Hello, World!' });

let BlueBox = text => box({ border: { type: 'line', fg: 'blue' } }, text);

run(({ term }) => ({
	term: $.of(BlueBox('Hello, World!')),
	exit: term.on('key C-c')
}), {
	term: makeTermDriver(screen),
	exit: exit$ => exit$.addListener({
		next: ::process.exit,
		error: ::process.exit,
		complete: ::process.exit
	})
});
