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
	let text$ = on({ type: 'keypress', view: 1 })
		.scan((str, char) => str + char, '').startWith('');

	return {
		term: text$.map(HelloBox),
		exit: on({ type: 'keypress', key: 'C-c' })
	}
}, {
	term: makeTermDriver(screen),
	exit: exit$ => exit$.forEach(::process.exit)
});
