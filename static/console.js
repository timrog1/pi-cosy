"use strict";
const operations = require("./operations");
angular.module("console", [])
    .directive("currentTemps", ($timeout, $http) => ({ 
            template: `<div class="currentTemps">
                <section>
                    <h1 class="inline current-main full-buttons">
                        <button ng-click="decTarget()" class="minus"><i class="icon-circle-minus"></i></button>
                        <button ng-click="incTarget()" class="plus"><i class="icon-circle-plus"></i></button>
                        {{status.target.current | number : 0}}°C<i class="relay-on"></i>                        
                    </h1>
                </section>
                <section ng-class="{override: hasOverride(status.schedule.override)}">
                    <i class="icon-clock"></i>
                    <div class="inline">
                        until 
                        <button ng-click="decTime()"><i class="icon-rewind"></i></button>                        
                        {{ status.target.until | date : 'Hmm' }} 
                        <button ng-click="incTime()"><i class="icon-fast-forward"></i></button>                        
                        then {{ status.target.nowAndNext[1][1] | number : 0}}°C
                        <button class="clear" ng-click="clear()"><i class="icon-reload"></i></button>
                    </div>
                </section>
                <section>
                    <i class="icon-thermometer"></i>
                    <div class="inline">
                    {{status.inside | number : 1}}°C
                    </div> 
                </section>
                <section class="current-outside">
                    <i class="icon-cloud"></i>
                    {{status.outside | number : 1}}°C
                </section>
               </div>
	       `, 
            link: scope => {
                let pendingOverride = null;

                function refresh()
                {
                    (
                        pendingOverride ?
                            $http.put("/schedule/override", pendingOverride).success(_ => pendingOverride = null) :
                            $http.get("/status").success(s => scope.status = s)
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