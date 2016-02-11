var app = angular.module(
	"angular-routes",
	[
		"ngRoute",
		"userServices",
		"mainControllers",
		"userControllers"
	]
);

app.config(["$routeProvider",function($routeProvider){
	$routeProvider.
		/*
		when("/", {
			templateUrl: "views/home.html",
			controller: "MainController"
		}).*/
		when("/users", {
			templateUrl: "views/users/list.html",
			controller: "UserListController"
		}).
		when("/users/:id",{
			templateUrl: "views/users/show.html",
			controller: "UserShowController"
		}).
		when("/users/:id/edit",{
			templateUrl: "views/users/_form.html",
			controller: "UserEditController"
		}).
		otherwise({
			redirectTo: "/users"
		});
}]);

app.directive("notFound", function() {
    return {
	 	restrict : "E",
        templateUrl : "views/_notFound.html"
    };
});