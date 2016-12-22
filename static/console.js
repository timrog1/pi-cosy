"use strict";
angular.module("console", [])
    .directive("currentTemps", ($timeout, $http) => ({ 
            template: `<div class="currentTemps">
                <section>
                    <i class="icon-target"></i>
                    <div class="inline">
                        <h1 class="current-main inline">{{status.target.current | number : 0}}°C</h1>
                        <i ng-if="status.relay" class="fa fa-fire"></i>
                        <span class="button-strip">
                            <button ng-click="changeTarget(-1)"><i class="fa fa-thermometer-empty"></i></button><button ng-click="changeTarget(+1)"><i class="fa fa-thermometer-full"></i></button>
                        </span> 
                    </div>
                </section>
                <section>
                    <i class="icon-watch"></i>
                    <div class="inline">
                        until {{ status.target.next[0] | date : 'H:mm' }} 
                        (then {{ status.target.next[1] | number : 0}}°C)
                        <button ng-click="changeTime(-30)"><i class="fa fa-minus-circle"></i></button>                        
                        <button ng-click="changeTime(30)"><i class="fa fa-plus-circle"></i></button>                        
                        <button ng-click="clear()"><i class="fa fa-undo"></i></button>
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

                scope.changeTarget = increment => {
                    let target = scope.status.target;
                    target.current += increment;
                    let overrideDate = new Date((new Date().getTime()) + 60*60*1000);
                    $http.put("/schedule/override", [ overrideDate, target.current ]);
                }

                scope.changeTime = increment => {
                    let o = scope.status.schedule.override;
                    let ms = increment * 60000;
                    o[0] = new Date(~~(new Date(o[0]) / ms + 1) * ms);
                    $http.put("/schedule/override", o);
                }

                scope.clear = () => $http.delete("/schedule/override");

                scope.hasOverride = override => override && Date.parse(override[0]) > new Date();

                refresh(); 
            }
    }));