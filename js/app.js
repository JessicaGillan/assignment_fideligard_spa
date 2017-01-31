var fideligard = angular.module('fideligard', ['ui.router', 'scrollable-table'])
// allow DI for use in controllers, unit tests
fideligard.constant('_', window._)
  // use in views, ng-repeat="x in _.range(3)"
fideligard.run(function ($rootScope) {
     $rootScope._ = window._;
  });

fideligard.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('portfolio');

    $stateProvider
    .state('index', {
      url: '/',
      abstract: true,
      views: {
        'date-picker@': {
          templateUrl: 'js/templates/date-picker.html',
          controller: 'DatePickerCtrl'
        },
        'stock-panel@': {
          templateUrl: 'js/templates/stock-panel.html',
          controller: 'StockPanelCtrl',
          resolve: {
            companies:  function( yql ){
              return yql.fetchSymbols()
            }
          }
        }
      }
    })
    .state('index.portfolio', {
      url: 'portfolio',
      views: {
        'main-panel@': {
          template: 'portfolio main panel'
        }
      }})
      .state('index.transactions', {
        url: 'transactions',
        views: {
          'main-panel@': {
            template: 'transactions main panel'
          },
        }
      })
      .state('index.trade', {
        url: 'trade/:id',
        views: {
          'main-panel@': {
            templateUrl: 'js/templates/trade-panel.html',
            controller: 'TradePanelCtrl'
          },
        }
      })
}]);
