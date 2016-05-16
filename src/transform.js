export let id = i =>
	s => s.filter(([el]) => el.options.id === i);

export let view = (...v) =>
	s => v.reduce((s, k) => s.map(x => x[k]), s);

export let key = k =>
	s => s.filter(([,,ek]) => ek.full === k);

export let constant = c =>
	s => s.mapTo(c);

export let init = (...i) =>
	s => s.startWith(...i);

export let toggle = i =>
	s => s.reduce(a => !a, !i);
