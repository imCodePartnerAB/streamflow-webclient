'use strict';

angular.module('sf').directive('sidebarCase', function () {
  return {
    restrict: 'A',
    scope: {},
    templateUrl: 'components/sidebar/sidebar-case.html',
    link: function (scope) {
      scope.caze = scope.$parent.caze;
      scope.notes = scope.$parent.notes;

      scope.showCaseInfo = false;

      scope.showCaseInfoPopUp = function () {
        scope.showCaseInfo = true;
      };
    }
  };
});

