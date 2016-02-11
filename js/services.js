var userServices = angular.module('userServices',['ngResource'])
.service("UserResource",["$resource",function($resource){
	return $resource("http://jsonplaceholder.typicode.com/users/:id",{id: "@id"},{ 'update': { method:'PUT'}})
}]);