import blessed from 'blessed';
import { Observable as $ } from 'rx';

let makeTermDriver = screen => {
	let root = h('element', { clickable: true, children: [] });
	screen.append(root);

	return vt$ => {
		vt$.forEach(vt => {
			root.children = [];
			root.append(vt);
			screen.render();
		});

		// singleton listeners for each event
		let rootListeners = {},
			globalListeners = {};

		return {
			on: event => rootListeners[event]
				? rootListeners[event]
				: rootListeners[event] = $.create(o =>
					// only the first argument is passed
					// but this way properly retains argument count
					void root.on(event, (...args) => o.onNext(...args))
				),
			onGlobal: event => globalListeners[event]
				? globalListeners[event]
				: globalListeners[event] = $.create(o =>
					void root.on(event, (...args) => o.onNext(...args))
				)
		};
	}
}

let makeScreenDriver = screen => command$ =>
	command$.map(c => c(screen));

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
