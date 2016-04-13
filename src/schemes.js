export let toggle = s => s.scan(a => !a);
export let idempotent = i => s => s.map(() => i);
