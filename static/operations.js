"use strict";
const timeIncrement = 30 * 60000;
const incrementTemperatureDuration = 60 * 60000;
const coerce = (flag, newValue) => flag === undefined ? newValue : flag;
const scheduleOps = {  
    time: { 
        increment: (override, now) => {
                let until = new Date(~~(override.until / timeIncrement + 1) * timeIncrement);
                return { until, now: override.now, temporary: coerce(override.temporary, false)  };
        },
        decrement: (override, now) => {
                let until = new Date(~~((override.until - 1) / timeIncrement) * timeIncrement);
                until = until < now ? now : until;
                return { until, now: override.now, temporary: coerce(override.temporary, false) };
        }
    },
    temp: { 
        increment: (override, now) => {
            let until = override.temporary===undefined ? new Date(1*now + incrementTemperatureDuration) : override.until;
            return {until, now: override.now + 1, temporary: coerce(override.temporary, true)};
        },
        decrement: (override, now) => ({ until: override.until, now: override.now - 1, temporary: coerce(override.temporary, true)})
    }
};

module.exports = scheduleOps;