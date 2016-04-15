import { run } from '@cycle/core';
import blessed from 'blessed';
import { makeTermDriver, form, textarea, text, button } from '../src';
import { id, view, key } from '../src/transform';
import { Observable as $ } from 'rx';

// for the unfocus bug, see `src/index.js` for more info

let screen = blessed.screen({ smartCSR: true, useBCE: true, title: 'Form Example' });

let Entry = value => textarea({
	id: 'Entry',
	mouse: true,
	inputOnFocus: true,
	top: 2, left: 'center',
	width: 20, height: 3,
	style: {
		fg: '#577',
		bg: '#cdd',
		focus: { bg: '#eef', bold: true }
	},
	padding: { left: 1, right: 1 },
	value
});

let SubmitButton = () => button({
	id: 'Submit',
	mouse: true,
	bottom: 2, left: 'center',
	width: 20, height: 3,
	content: 'Submit',
	style: {
		fg: 'white',
		bg: '#3c6',
		hover: { bg: '#3d7' },
		focus: { bold: true }
	},
	align: 'center', valign: 'middle'
});

let Result = content => text({
	bottom: -1, left: 0,
	width: '100%',
	content,
	bg: '#345',
	padding: { left: 1, right: 1 },
	align: 'center', valign: 'middle'
});

let Form = (value, result) => form({
	id: 'Form',
	top: 'center', left: 'center',
	width: 50, height: 12,
	keys: true,
	bg: '#355',
	align: 'center', valign: 'middle'
}, [Entry(value), SubmitButton(), Result(result)])

run(({ term: { on } }) => {
	let text$ = on('*keypress', [id('Entry'), view(0, 'value')])
		.startWith('Type in me!');

	let submit$ = on('*press', id('Submit'));

	let result$ = text$.sample(submit$).startWith('');

	return {
		term: $.combineLatest(text$, result$, Form),
		exit: on('*keypress', key('C-c'))
	};
}, {
	term: makeTermDriver(screen),
	exit: exit$ => exit$.forEach(::process.exit)
});
