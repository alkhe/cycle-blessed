import blessed from 'blessed';
import { Observable as $ } from 'rx';

let makeTermDriver = screen => vt$ =>
	vt$.forEach(vt => {
		screen.children = [];
		screen.append(vt);
		screen.render();
	});

let makeScreenDriver = screen => command$ => {
	command$.map(c => c(screen));
	return {
		on: event => $.create(o => {
			screen.on(event, x => o.onNext(x));
			return () => {};
		})
	};
};

let h = (name, options, content) => blessed[name]({ ...options, content });

let factory = name => (...args) => h(name, ...args);

let box = factory('box');

export {
	makeTermDriver,
	makeScreenDriver,
	h, factory, box
}
