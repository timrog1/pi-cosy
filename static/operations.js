"use strict";
const timeIncrement = 30 * 60000;
const incrementTemperatureDuration = 60 * 60000;
const tempAtTime = (changes, time) => changes.filter(([d]) => d <= time).map(([_, t]) => t).reverse()[0];

const scheduleOps = {  
    time: { 
        increment: ([now, ...next]) => {
                const increment = (nextDate, units) => new Date(~~(new Date(nextDate) / timeIncrement + 1) * timeIncrement);
                let nextTime = increment(next[0], 1);
                let nextTemp = tempAtTime(next, nextTime) || now[1];
                return [now, [nextTime, nextTemp], ...next.filter(([d, _]) => d > nextTime)];
        },
        decrement: ([now, next, ...rest]) => {
                const decrement = (nextDate, units) => new Date(~~(new Date(nextDate - 1) / timeIncrement) * timeIncrement);
                let newTime = decrement(next[0], 0);
                return newTime > now[0]
                    ? [now, [newTime, next[1]], ...rest] 
                    : [[now[0], next[1]], ...rest];
        }
    },
    temp: { 
        increment: ([[nowTime, nowTemp], ...rest]) => {
            let endTime = new Date(1*nowTime + incrementTemperatureDuration);
            let endTemp = tempAtTime(rest, endTime) || nowTemp;
            rest = rest.filter(([d]) => d > endTime);
            return [ [nowTime, nowTemp + 1], [ endTime, endTemp ], ...rest ];
        },
        decrement: ([[nowTime, nowTemp], ...rest]) => [[nowTime, nowTemp - 1], ...rest]
    }
};

module.exports = scheduleOps;