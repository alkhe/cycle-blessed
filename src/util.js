export let isObject = a => a === Object(a);
export let singleton = a => Array.isArray(a) ? a : [a];
