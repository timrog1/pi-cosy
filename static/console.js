"use strict";
const operations = require("./operations");
angular.module("console", [])
    .directive("currentTemps", ($timeout, $http) => ({ 
            template: `<div class="currentTemps">
                <section>
                    <h1 class="inline current-main full-buttons">
                        <button ng-click="decTarget()" class="minus"><i class="icon-circle-minus"></i></button>
                        <button ng-click="incTarget()" class="plus"><i class="icon-circle-plus"></i></button>
                        {{status.target.current | number : 0}}°C<i class="relay-on" ng-hide="status.relay">                        
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -350 744.094 1052.362"><path d="M 323.62841,162.16822 C 291.59088,388.52062 189.95857,390.58393 178.81507,507.59068 C 167.62154,625.12214 287.21189,697.63045 306.91092,702.55615 C 306.91092,702.55615 250.73113,637.5901 256.01335,582.12691 C 259.6711,543.72048 275.47784,529.81741 305.3138,487.78532 C 326.75753,457.57594 350.97356,416.12214 368.77607,354.89776 C 432.13017,410.3645 459.29816,442.63854 471.95558,509.61376 C 484.61306,576.58908 432.34488,697.01847 432.34488,697.01847 C 621.39595,554.51807 572.96427,336.98191 323.62841,162.16822 z" fill="#fff" fill-rule="evenodd" stroke-linecap="square"/></svg>
                        </i>                        
                    </h1>
                </section>
                <section ng-class="{override: hasOverride(status.schedule.override)}" class="iconic">
                    <i class="icon-clock"></i>
                    <div class="inline">
                        <nobr>until 
                        <button ng-click="decTime()"><i class="icon-rewind"></i></button>                        
                        {{ status.target.until | date : 'Hmm' }} 
                        <button ng-click="incTime()"><i class="icon-fast-forward"></i></button>
                        </nobr>
                        <nobr>then {{ status.target.nowAndNext[1][1] | number : 0}}°C
                        <button class="clear" ng-click="clear()"><i class="icon-reload"></i></button>
                        </nobr>
                    </div>
                </section>
                <section class="iconic">
                    <i class="icon-thermometer"></i>
                    <div class="inline">
                    {{status.inside | number : 1}}°C
                    </div> 
                </section>
                <section class="current-outside iconic">
                    <i class="icon-cloud"></i>
                    {{status.outside | number : 1}}°C
                </section>
               </div>
	       `, 
            link: scope => {
                let pendingOverride = null;

                let jsonDateParse = val => 
                    typeof val == "string" && Date.parse(val) > 0 ? new Date(val) : val;
                   
                let jsonFilter = json =>
                    typeof json == "object" && !Array.isArray(json) ?
                        Object.keys(json).reduce((r, k) => (r[k] = jsonFilter(json[k]), r), {}) :
                        jsonDateParse(json);

                function refresh()
                {
                    (
                        pendingOverride ?
                            $http.put("/schedule/override", pendingOverride).success(_ => pendingOverride = null) :
                            $http.get("/status").success(s => scope.status = jsonFilter(s))
                    ).finally(() => $timeout(refresh, 1000));
                }

                function modify(operator, isTempModification) {
                    let target = scope.status.target;
                    let sch = scope.status.schedule;
                    let override = sch.override || { now: target.current, until: target.until };
                    pendingOverride = sch.override = operator(override, new Date());
                    target.current = sch.override.now;
                    target.until = sch.override.until;
                }

                scope.incTarget = () => modify(operations.temp.increment, true);
                scope.decTarget = () => modify(operations.temp.decrement, true);
                scope.incTime = () => modify(operations.time.increment);
                scope.decTime = () => modify(operations.time.decrement);

                scope.clear = () => {
                    delete scope.status.schedule.override;
                    $http.delete("/schedule/override");
                };

                scope.hasOverride = override => override && new Date(override.until) > new Date();

                refresh(); 
            }
    }));