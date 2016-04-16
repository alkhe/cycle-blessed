export let id = i =>
	s => s.filter(([el]) => el.options.id === i);

export let view = (...v) =>
	s => s.pluck(...v);

export let key = k =>
	s => s.filter(([,,ek]) => ek.full === k);

export let constant = c =>
	s => s.map(() => c);

export let init = (...i) =>
	s => s.startWith(...i);

export let toggle = i =>
	s => s.scan(a => !a, !i);
