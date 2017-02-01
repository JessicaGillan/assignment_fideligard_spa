var fideligard = angular.module('fideligard', ['ui.router', 'scrollable-table'])
// allow DI for use in controllers, unit tests
fideligard.constant('_', window._)
  // use in views, ng-repeat="x in _.range(3)"
fideligard.run(function ($rootScope, $state) {
     $rootScope._ = window._;
     $rootScope.goToState = function(state) { $state.go(state); };
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
          templateUrl: 'js/templates/portfolio-panel.html',
          controller: 'PortfolioPanelCtrl'
        }
      }})
      .state('index.transactions', {
        url: 'transactions',
        views: {
          'main-panel@': {
            templateUrl: 'js/templates/transaction-panel.html',
            controller: 'TransactionPanelCtrl'
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
