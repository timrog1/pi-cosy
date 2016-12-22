"use strict";
angular.module("console", [])
    .directive("currentTemps", ($timeout, $http) => ({ 
            template: `<div class="currentTemps">
                <section>
                    <i class="icon-target"></i>
                    <h1 class="inline current-main full-buttons">
                        <button ng-click="changeTarget(-1)" class="minus"><i class="icon-circle-minus"></i></button>
                        <button ng-click="changeTarget(+1)" class="plus"><i class="icon-circle-plus"></i></button>
                        {{status.target.current | number : 0}}°C
                        <i ng-if="status.relay" class="fa fa-fire"></i>                        
                    </h1>
                </section>
                <section ng-class="{override: hasOverride(status.schedule.override)}">
                    <i class="icon-clock"></i>
                    <div class="inline">
                        until 
                        <button ng-click="changeTime(-30)"><i class="icon-rewind"></i></button>                        
                        {{ status.target.next[0] | date : 'H:mm' }} 
                        <button ng-click="changeTime(30)"><i class="icon-fast-forward"></i></button>                        
                        then {{ status.target.next[1] | number : 0}}°C
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
                function refresh()
                {
                  $http.get("/status")
                        .success(s => scope.status = s)
                        .finally(() => $timeout(refresh, 1000))
                }

                function override(endTime, temp) {
                    scope.status.schedule.override = [ endTime, temp ];
                    $http.put("/schedule/override", [ endTime, temp ]);
                }

                scope.changeTarget = increment => {
                    let target = scope.status.target;
                    target.current += increment;
                    let overrideDate = new Date((new Date().getTime()) + 60*60*1000);
                    override(overrideDate, target.current);
                }

                scope.changeTime = increment => {
                    let target = scope.status.target
                    let ms = increment * 60000;
                    target.next[0] = new Date(~~(new Date(target.next[0]) / ms + 1) * ms);
                    override(target.next[0], target.current);
                }

                scope.clear = () => {
                    delete scope.status.schedule.override;
                    $http.delete("/schedule/override");
                };

                scope.hasOverride = override => override && Date.parse(override[0]) > new Date();

                refresh(); 
            }
    }));