import blessed from 'blessed';
import { Observable as $ } from 'rx';

let makeTermDriver = screen => {
	let root = h('element', { clickable: true, children: [] });
	screen.append(root);
	return vt$ =>
		vt$.forEach(vt => {
			root.children = [];
			root.append(vt);
			screen.render();
		});
}

let makeScreenDriver = screen => command$ => {
	command$.map(c => c(screen));
	return {
		on: event => $.create(o => {
			screen.on(event, x => o.onNext(x));
			return () => {};
		}),
		event: event => $.create(o => {
			screen.children[0].on(event, x => o.onNext(x));
			return () => {};
		})
	};
};

let h = (name, options, content) => blessed[name]({ ...options, content });

let factory = name => (...args) => h(name, ...args);

let box = factory('box');
let element = factory('element');

export {
	makeTermDriver,
	makeScreenDriver,
	h, factory,
	box, element
}
