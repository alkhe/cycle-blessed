import { run } from '@cycle/core';
import blessed from 'blessed';
import { makeTermDriver, box, schemes } from '../src';

let screen = blessed.screen({ smartCSR: true, useBCE: true, title: 'Click' });

let ClickableBox = clicked => box({
	top: 'center', left: 'center',
	width: 20, height: 3,
	align: 'center', valign: 'middle',
	tags: true,
	content: `{bold}${ clicked ? 'Clicked' : 'Click Me!' }{/bold}`,
	fg: 'white',
	bg: clicked ? '#e66' : '#6e6',
	id: 'Button',
	clickable: true
});

run(({ term: { on } }) => {
	let clicks$ = on({
		type: 'click',
		id: 'Button',
		scheme: schemes.idempotent(true)
	}).startWith(false);

	return {
		term: clicks$.map(ClickableBox),
		exit: on({ type: 'keypress', key: 'C-c' })
	};
}, {
	term: makeTermDriver(screen),
	exit: exit$ => exit$.forEach(::process.exit)
});
