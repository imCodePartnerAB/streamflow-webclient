/*
 *
 * Copyright
 * 2009-2015 Jayway Products AB
 * 2016-2018 Föreningen Sambruk
 *
 * Licensed under AGPL, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.gnu.org/licenses/agpl.txt
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';
angular.module('sf').controller('AboutCtrl', function ($scope, profileService, $rootScope, httpService) {
    $rootScope.$broadcast('breadcrumb-updated', [
        {
            title: 'Om Streamflow'
        }]);

    httpService.getRequest('static/version.html', false)
        .then(function (result) {
            var versionMatch = /(Version: )[a-z,A-Z,\d,.,-]+/.exec(result.data);
            if (versionMatch && versionMatch.length > 0 && versionMatch[0].length > 9) {
                $scope.serverVersion = versionMatch[0].substr(9);
            }
        });
});
