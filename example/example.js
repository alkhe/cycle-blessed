import { run } from '@cycle/core';
import blessed from 'blessed';
import { makeTermDriver, makeScreenDriver, box } from '../src';

let screen = blessed.screen({ smartCSR: true });

let HelloBox = text => box({
	top: 'center', left: 'center',
	width: 'shrink', height: 'shrink',
	tags: true,
	border: {
		type: 'line',
		fg: 'blue'
	}
}, `{bold}${ text }{/bold}`);

run(({ screen: { on } }) => {
	let text$ = on('keypress').scan((a, x) => a + x, '').startWith('');
	return {
		term: text$.map(HelloBox),
		exit: on('key C-c')
	}
}, {
	term: makeTermDriver(screen),
	screen: makeScreenDriver(screen),
	exit: exit$ => exit$.forEach(::process.exit)
});
