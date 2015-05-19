/*
 *
 * Copyright 2009-2014 Jayway Products AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

angular.module('sf')
  .controller('CaseListCtrl', function($scope, $location, $routeParams, $window, projectService, $rootScope, caseService, groupByService, paginationService) {
    var initialCase = projectService.getSelected($routeParams.projectId, $routeParams.projectType, '+offset:0+limit:1');
    var pageSize = paginationService.pageSize;
    $scope.currentCases = [];
    $scope.projects = projectService.getAll();
    $scope.projectType = $routeParams.projectType;
    $scope.scroll = 0;

    $scope.showSpinner = {
      currentCases: true,
      infiniteScroll: false
    };

    $scope.getHeader = function () {
      return {
        assignments: 'Alla mina ärenden',
        inbox: 'Alla ärenden i inkorgen'
      }[$scope.projectType];
    };

    $scope.groupingOptions = groupByService.getGroupingOptions();

    // TODO
    $scope.groupBy = function(selectedGroupItem) {
      $scope.currentCases = groupByService.groupBy($scope.currentCases, initialCase, selectedGroupItem);
      $scope.specificGroupByDefaultSortExpression = groupByService.getSpecificGroupByDefault(selectedGroupItem);
    };

    $scope.showMoreItems = function() {
      if ($scope.busyLoadingData) {
        return;
      }
      $scope.busyLoadingData = true;
      $scope.showSpinner.infiniteScroll = true;

      var query =  '+offset+' + $scope.currentCases.length + '+limit+' + pageSize;
      projectService.getSelected($routeParams.projectId, $routeParams.projectType, query).promise.then(function (result) {
        $scope.currentCases = $scope.currentCases.concat(result);
        $scope.busyLoadingData = false;
        $scope.showSpinner.infiniteScroll = false;
      });
    };

    $scope.projects.promise.then(function(response){
      var projectName = _.filter(response, function(projects){
        _.each(projects, function(project){
          _.each(project, function(types){
            var url = types.href;
            if(url !== undefined){
              var id = $routeParams.projectId;
              if(url.contains(id)){
                $rootScope.projectName = projects.text;
              }
            }
          });
        }); 
      });
    });

    //Set breadcrumbs to case-owner if possible else to project id
    initialCase.promise.then(function(response){
      var owner = _.filter(response, function(sfCase){
        if(sfCase.owner.length > 0){
          return sfCase.owner;
        }
      });

      if(owner.length > 0){
        $rootScope.$broadcast('breadcrumb-updated', [
          {
            title: response[0].owner
          },
          {
            title: $routeParams.projectType,
            url: '#/projects/' + $routeParams.projectId + '/' + $routeParams.projectType
          }
        ]);
      } else {
        $rootScope.$broadcast('breadcrumb-updated', [
          {
            title: $rootScope.projectName
          },
          {
            title: $routeParams.projectType,
            url: '#/projects/' + $routeParams.projectId + '/' + $routeParams.projectType
          }
        ]);
      }

      $scope.showSpinner.currentCases = false;
    });

    var updateObject = function(itemToUpdate){
      itemToUpdate.invalidate();
      itemToUpdate.resolve();
    };

    // Event listeners
    $rootScope.$on('case-created', function(){
      updateObject($scope.currentCases);
    });
    $rootScope.$on('case-closed', function(){
      updateObject($scope.currentCases);
    });
    $rootScope.$on('case-assigned', function(){
      updateObject($scope.currentCases);
    });
    $rootScope.$on('case-unassigned', function(){
      updateObject($scope.currentCases);
    });
    $rootScope.$on('case-resolved', function(){
      updateObject($scope.currentCases);
    });
    $rootScope.$on('case-deleted', function(){
      updateObject($scope.currentCases);
    });
    $rootScope.$on('case-owner-changed', function(){
      updateObject($scope.currentCases);
    });
    $rootScope.$on('casedescription-changed', function(){
      updateObject($scope.currentCases);
    });
    // End Event listeners
  });
