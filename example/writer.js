import { run } from '@cycle/core';
import blessed from 'blessed';
import { makeTermDriver, box } from '../src';

let screen = blessed.screen({ smartCSR: true, useBCE: true, title: 'Writer' });

let HelloBox = text => box({
	top: 'center', left: 'center',
	width: 'shrink', height: 'shrink',
	tags: true,
	content: `{bold}${ text }{/bold}`,
	border: {
		type: 'line',
		fg: 'blue'
	}
});

run(({ term: { on } }) => {
	let text$ = on('keypress').pluck(0).scan((a, x) => a + x, '').startWith('');
	return {
		term: text$.map(HelloBox),
		exit: on('key C-c')
	}
}, {
	term: makeTermDriver(screen),
	exit: exit$ => exit$.forEach(::process.exit)
});
