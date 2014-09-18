app.controller('eventsController', ['$scope', '$resource', function ($scope, $resource){
	var Event = $resource('/api/event');
	console.log("api event resource");
	Event.query(function(results){
		$scope.events = results;	
	});
	$scope.events = []
/*
	$scope.createMeetup = function(){
		var ev = new Event();
		ev.$save(function(result){
			$scope.events.push(result);
		});
		// $scope.events.push({ name: $scope.eventName});
		// $scope.eventName=''; 
		
	}*/
}]);
