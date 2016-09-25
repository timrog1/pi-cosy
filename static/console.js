"use strict";
angular.module("console", [])
    .directive("currentTemps", ($timeout, $http) => ({ 
            template: `<div class="currentTemps">
                Hello. 
                <div class="current-main">{{status.inside | number : 1}}°C</div>
                <div class="current-target">{{status.target | number : 1}}°C</div>
                <div class="current-outside">{{status.outside | number : 1}}°C</div>
               </div>`,
            link: scope => {
                function refresh()
                {
                    $http.get("/status")
                        .success(s => scope.status = s)
                        .then(() => $timeout(refresh, 1000));
                }

                refresh();
            }
    }));
    