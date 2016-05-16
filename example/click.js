import { run } from '@cycle/xstream-run';
import blessed from 'blessed';
import { makeTermDriver, button } from '../src';
import { id, key, constant } from '../src/transform';

let screen = blessed.screen({ smartCSR: true, useBCE: true, title: 'Click' });

let ClickableBox = clicked => button({
	top: 'center', left: 'center',
	width: 20, height: 3,
	align: 'center', valign: 'middle',
	tags: true,
	content: `{bold}${ clicked ? 'Clicked' : 'Click Me!' }{/bold}`,
	fg: 'white',
	bg: clicked ? '#e66' : '#6e6',
	id: 'Button',
	mouse: true
});

run(({ term: { on } }) => {
	let clicks$ = on('*press', [id('Button'), constant(true)])
		.startWith(false);

	return {
		term: clicks$.map(ClickableBox),
		exit: on('*keypress', key('C-c'))
	};
}, {
	term: makeTermDriver(screen),
	exit: exit$ => exit$.addListener({
		next: ::process.exit,
		error: ::process.exit,
		complete: ::process.exit
	})
});
