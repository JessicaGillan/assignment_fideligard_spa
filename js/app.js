var fideligard = angular.module('fideligard', ['ui.router'])

fideligard.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('portfolio');

    $stateProvider
    .state('index', {
      url: '/',
      abstract: true,
      views: {
        'date-picker@': {
          template: 'date panel'
          // templateUrl: 'js/templates/date-picker.html'
        },
        'stock-panel@': {
          template: 'stock panel'
          // templateUrl: 'js/templates/stock-panel.html'
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
        url: 'trade',
        views: {
          'main-panel@': {
            template: 'trade main panel'
          },
        }
      })
}]);