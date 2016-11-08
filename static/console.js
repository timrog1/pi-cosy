"use strict";
angular.module("console", [])
    .directive("currentTemps", ($timeout, $http) => ({ 
            template: `<div class="currentTemps">
                <div class="row">
                    <i class="fa fa-home"></i>
                    <h1 class="current-main inline">{{status.inside | number : 1}}°C
                    </h1>
                        <i ng-if="status.relay" class="fa fa-fire"></i>
                </div>
                <div class="current-target row">
                    <i class="fa fa-thermometer-4"></i>
                    <div class="inline">
                        {{status.target | number : 1}}°C 
                        <span class="button-strip">
                            <button ng-click="changeTarget(-1)"><i class="fa fa-thermometer-empty"></i></button><button ng-click="changeTarget(+1)"><i class="fa fa-thermometer-full"></i></button>
                        </span>
                        <span ng-if="hasOverride(status.schedule.override)">until {{status.schedule.override[0] | date : 'H:mm' }}</span>
                    </div> 
                </div>
                <div class="current-outside row">
                    <i class="fa fa-tree"></i>
                    {{status.outside | number : 1}}°C</div>
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
                    scope.status.target += increment;
                    var overrideDate = new Date((new Date().getTime()) + 60*60*1000);
                    $http.put("/schedule/override", [ overrideDate, scope.status.target ]);
                }

                scope.hasOverride = override => override && Date.parse(override[0]) > new Date();

                refresh();
            }
    }));
    