import blessed from 'blessed';
import { Observable as $ } from 'rx';

let isObject = a => a === Object(a);

let singleton = a => Array.isArray(a) ? a : [a];

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

		let makeComplexEvent = (stream, { id, view, key, scheme }) => [
				[id, s => s.filter(([el]) => el.options.id === id)],
				[view, s => s.pluck(...singleton(view))],
				[key, s => s.filter(([,,k]) => k.full === key)],
				[scheme, scheme]
			]
			.filter(([x]) => x !== undefined)
			.reduce((x, [,f]) => f(x), stream);

		let makeEvent = node => {
			// cached listeners
			let listeners = {};

			return event => {
				let complex = isObject(event);

				// if event is an object, then get the type
				// otherwise the event itself is the type
				let eventName = complex
					? (event.local
						? event.type
						: `element ${ event.type }`)
					: event;

				// if listener exists, just take that
				// otherwise create a new listener
				let stream = listeners[eventName]
					? listeners[eventName]
					: listeners[eventName] = $.create(o =>
						void node.on(eventName, (...args) => o.onNext(args))
					);

				// if event is an object, apply the modifiers
				// otherwise just return the raw listener

				return complex
					? makeComplexEvent(stream, event)
					: stream;
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

export * as schemes from './schemes';
