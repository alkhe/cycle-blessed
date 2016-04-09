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
			screen.children[0].on(event, x => o.onNext(x));
			return () => {};
		}),
		onGlobal: event => $.create(o => {
			screen.on(event, x => o.onNext(x));
			return () => {};
		})
	};
};

// TODO support nested arrays
let fixChildren = children =>
	(Array.isArray(children) ? children : [children])
		.map(child => (child === Object(child))
			? child
			: text({ content: String(child) }))

let h = (name, options, children = []) =>
	blessed[name]({
		...options,
		children: (options.children || []).concat(fixChildren(children))
	});

let factory = name => (...args) => h(name, ...args);

let box = factory('box');
let element = factory('element');
let text = factory('text');

export {
	makeTermDriver,
	makeScreenDriver,
	h, factory,
	box, element, text
}
