import { run } from '@cycle/xstream-run';
import blessed from 'blessed';
import { makeTermDriver, box } from '../src';
import { view, key } from '../src/transform';

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
	let text$ = on('*keypress', view(1))
		.fold((str, char) => str + char, '');

	return {
		term: text$.map(HelloBox),
		exit: on('*keypress', key('C-c'))
	}
}, {
	term: makeTermDriver(screen),
	exit: exit$ => exit$.addListener({
		next: ::process.exit,
		error: ::process.exit,
		complete: ::process.exit
	})
});
