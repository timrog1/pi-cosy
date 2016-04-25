"use strict";
angular.module("console", [])
    .directive("currentTemps", () => ({ 
            template: `<div class="currentTemps">
                Hello. 
                <div class="current-main">{{temps.main}}°C</div>
                <div class="current-target">{{temps.target}}°C</div>
                <div class="current-outside">{{temps.outside}}°C</div>
               </div>`,
            link: scope => {
                scope.temps = { main: 19.5, target: 21, outside: 8 };
            }
    }));
    