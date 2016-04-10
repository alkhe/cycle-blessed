import blessed from 'blessed';
import { Observable as $ } from 'rx';

let makeTermDriver = screen => {
	let root = h('element', { keyable: true, clickable: true, children: [] });
	screen.append(root);

	return vt$ => {
		vt$.forEach(vt => {
			// TODO implement diffing
			// blessed only performs simple diffing
			// problem visible in `example/input.js`
			// don't use blessed textarea for now;
			// implement custom inputs as in `example/writer.js`
			root.children = [];
			root.append(vt);
			screen.render();
		});

		// cached listeners for each event
		let rootListeners = {},
			globalListeners = {};

		return {
			on: event => rootListeners[event]
				? rootListeners[event]
				: rootListeners[event] = $.create(o =>
					void root.on(event, (...args) => o.onNext(args))
				),
			onGlobal: event => globalListeners[event]
				? globalListeners[event]
				: globalListeners[event] = $.create(o =>
					void screen.on(event, (...args) => o.onNext(args))
				)
		};
	}
}

let makeScreenDriver = screen => command$ =>
	command$.map(c => c(screen));

// turns non-arrays into singleton arrays
// turns strings into text nodes
// TODO support nested arrays
let fixChildren = children =>
	(Array.isArray(children) ? children : [children])
		.map(child => (child === Object(child))
			? child
			: text({ content: String(child) }))

let h = (name, options = {}, children = []) =>
	blessed[name]({
		...options,
		children: (options.children || []).concat(fixChildren(children))
	});

let factory = name => (...args) => h(name, ...args);

let [
	box, element, text,
	layout,
	form, textarea, button
] = [
	'box', 'element', 'text',
	'layout',
	'form', 'textarea', 'button'
].map(factory);

export {
	makeTermDriver,
	makeScreenDriver,
	h, factory,
	box, element, text,
	layout,
	form, textarea, button
}
