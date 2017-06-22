// import uiMask from '../lib/angular-ui-mask.js';

var timeSlots = _.range(17, 23).map(function (hour) {
  return {
    id: hour.toString(),
    hour: hour,
    name: moment(hour, 'hh').format('h:mma')
  };
});

angular.module('gameReqForm', ['pickUp.services', 'google.places', 'ui.mask'])
.controller('TimeSelectController', function($scope, $location, GameReq, sharedProps) {
    var gameReq = {};
    $scope.showInput = false;

    $scope.howTo = function() {
      $scope.showInput = !$scope.showInput;
    }
    $scope.requestGame = function() {
      console.log('requesting Game');
      gameReq.time = helpers.createGameTime($scope.data.selectedOption.hour);
      gameReq.smsNum = $scope.smsNum;
      gameReq.sport = $scope.sportInput;
      gameReq.address = $scope.ngAddress;


      console.log(gameReq);

      GameReq.requestGame(gameReq)
        .then(function (game) {
          sharedProps.set(game);
          $location.path('/games');
        })
        .catch(function (error) {
          console.error('error requesting game ', error);
        });
    };
    $scope.data = {
      model: null,
      availableOptions: timeSlots,
      selectedOption: timeSlots[0]
    };
  });