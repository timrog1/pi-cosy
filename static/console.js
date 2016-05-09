"use strict";
angular.module("console", [])
    .directive("currentTemps", ($interval, $http) => ({ 
            template: `<div class="currentTemps">
                Hello. 
                <div class="current-main">{{status.inside | number : 1}}°C</div>
                <div class="current-target">{{status.target | number : 1}}°C</div>
                <div class="current-outside">{{status.outside | number : 1}}°C</div>
               </div>`,
            link: scope => {
				$interval(() => $http.get("/status").success(s => scope.status = s), 1000);
            }
    }));
    