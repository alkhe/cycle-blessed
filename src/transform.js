export let id = i =>
	s => s.filter(([el]) => el.options.id === i);

export let view = (...v) =>
	s => s.pluck(...v);

export let key = k =>
	s => s.filter(([,,ek]) => ek.full === k);

export let toggle =
	s => s.scan(a => !a);

export let idempotent = i =>
	s => s.map(() => i);
