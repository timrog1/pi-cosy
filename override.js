"use strict";

const changesLaterThan = (earliest, changes) => changes.filter(([d,t]) => d > earliest);
const tempAt = (override, changes) => {
	var current = override.now;
	for(let [d,t] of changes) if (d > override.until) break; else current = t;
	return current; 
};

module.exports = {
		extract: ( [[d1, t1], [d2, t2]] ) => ({ now: t1, until: d2, temporary: false }),
		apply: ( changes, override ) => {
			let [[d1, t1], [d2, t2], ...rest] = changes;
			if (override.until <= d1) return changes;
			
			let subsequent = changesLaterThan (override.until, override.temporary ? [[d2, t2], ...rest] : rest);
			let endTemp = override.until < d2 && !override.temporary ? t2 : tempAt(override, changes);
			return [ 
				[d1, override.now], 
				[override.until, endTemp],
				...subsequent 
			];
		}
	};