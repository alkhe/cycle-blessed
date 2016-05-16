import blessed from 'blessed';
import $ from 'xstream';
import { isObject, singleton } from './util';

let nop = () => {};

let makeTermDriver = screen => {
	let root = h('element', { keyable: true, clickable: true, children: [] });
	screen.append(root);

	return vt$ => {
		vt$.addListener({
			next: vt => {
				// TODO implement diffing
				// blessed only performs simple diffing
				// problem visible in `example/input.js`
				// don't use blessed textarea for now;
				// implement custom inputs as in `example/writer.js`
				root.children = [];
				root.append(vt);
				screen.render();
			},
			error: nop,
			complete: nop
		});

		let makeEvent = node => {
			// cached listeners
			let listeners = {};

			return (eventString, transform = []) => {
				let nested = eventString[0] === '*';

				// if event is an object, then get the type
				// otherwise the event itself is the type
				let eventName = nested
					? `element ${ eventString.slice(1) }`
					: eventString;

				// if listener exists, just take that
				// otherwise create a new listener
				let stream = listeners[eventName]
					? listeners[eventName]
					: listeners[eventName] = $.create({
						start: sub => node.on(eventName, (...args) => sub.next(args)),
						stop: nop
					});

				// if event is an object, apply the transforms
				// otherwise just return the raw listener
				return singleton(transform).reduce((s, f) => f(s), stream);
			};
		};

		return {
			on: makeEvent(root),
			onGlobal: makeEvent(screen)
		};
	}
}

let makeScreenDriver = screen => command$ =>
	command$.map(c => c(screen));

// turns non-arrays into singleton arrays
// turns strings into text nodes
// TODO support nested arrays
let fixChildren = children =>
	singleton(children)
		.map(child => isObject(child)
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

export * as t from './transform';
