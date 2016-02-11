/*************************************************************************/
var mainControllers = angular.module("mainControllers",[]);

mainControllers.controller("MainController",["$scope",function($scope){
	$scope.today = new Date();
}])

/*************************************************************************/

var userControllers = angular.module("userControllers",[]);

userControllers.controller("UserListController",
	["$scope","UserResource","$filter",
		function($scope,UserResource,$filter){
			
			$("#main").addClass('hide');
			$("#progress").removeClass("hide");

			var orderBy = $filter('orderBy');
			var filerBy = $filter('filter');

			// Valores por los cuales se pueden ordenar
			$scope.validOptions = [
				{id: "name", value: "name"},
				{id: "username", value: "username" },
				{id: "email", value: "email"},
				{id: "phone", value: "phone"},
				{id: "city", value: "address.city"},
				{id: "company", value: "company.name"}
			];

			$scope.predicate = "name"; // valor de ordenacion por defecto
			$scope.reverse = false; // Ordenar de forma ascendente
			$scope.usersPerPage = 3; // users que se muestran por pagina
			$scope.currentPage = 1; // Pagina actual


			// Funcion para filtrar la busqueda
			$scope.filter = function(){
				// Si la busqueda esta vacia o el arreglo de users que paso por algun filtro
				// actualmente esta vacio se debe cargar de nuevo todos los users
				if($scope.search == "" || $scope.users.length==0)
				{
					$scope.users = $scope.allUsers;
				}
				// Se filtra el arreglo
				$scope.users = filerBy($scope.users, $scope.search);
				$scope.order(); // Se ordena el array de users
				// Se crea un array del tamanio del numero de paginas
				$scope.numPageArray = new Array($scope.numPages()); 
				$scope.numPageValor = $scope.numPages(); // Cantidad de paginas
				$scope.changePage(1); // Moverse a la primera pagina
			}

			// Funcion para ordenar el arreglo de users
			$scope.order = function(){
				$scope.users = orderBy($scope.users, $scope.predicate, $scope.reverse);
			}

			// Funcion para moverse entre paginas
			$scope.changePage = function(newPage){
				// Si la pagina nueva es menor que 1 o mayor que la cantidad de paginas
				// o si la cantidad de paginas a mostrar es menor a 1
				if(newPage < 1 || newPage > $scope.numPageValor || $scope.usersPerPage < 1)
					return false;
				// Se agrega un animacion a los users a menos que se haga una busqueda
				
				if($scope.search == null || $scope.search == ""){
					if(newPage > $scope.currentPage){
						$("#users-container").animateCss("slideInRight");
					}
					else{
						$("#users-container").animateCss("slideInLeft");
					}
				}
				$scope.currentPage = newPage; // Se modifica el valor de pagina actual
				// Se modifica el valor en donde empiezan a mostrarse los users
				// Ej: a * b - b = b ( a - 1 )
				// newPage = 3
				// $scope.usersPerPage = 5
				// $scope.usersBegin = 3 * 5 - 5 = 10
				$scope.usersBegin = $scope.usersPerPage * (newPage - 1);
			}

			// Funcion para calcular el numero de paginas
			$scope.numPages = function () {
				return Math.ceil($scope.users.length / $scope.usersPerPage);
			}

			// Funcion para determinar si la pagina actual es la primera pagina
			$scope.isFirstPage = function(){
				return $scope.currentPage == 1;
			}

			// Funcion para determinar si la pagina enviada es la pagina actual
			$scope.isSelect = function(page){
				return $scope.currentPage == page;
			}

			// Funcion para determinar si la pagina actual es la ultima pagina
			$scope.isLastPage = function(){
				return $scope.currentPage == $scope.numPageValor;
			}

			$scope.isOrderBy =  function(value){
				return $scope.predicate == value;
			}

			$scope.orderTable = function(header){
				$scope.reverse = ($scope.predicate === header) ? !$scope.reverse : false;
				$scope.predicate = header;
				$scope.icon_order = ($scope.reverse)? 'arrow_drop_down' : 'arrow_drop_up';
				$scope.filter();
			}

			$scope.message = function(){
				sum = $scope.usersBegin + parseInt($scope.usersPerPage);
				if (sum > $scope.users.length)
					sum = $scope.users.length;

				return "Displaying "
					+ ($scope.usersBegin + 1)
					+ " - " 
					+ (sum)
					+ " of " 
					+ $scope.users.length
					+ " results"
			}

			// Metodo para obtener el array de users a partir de la url
			UserResource.query(function(data) {
				// Se cargan todos los users
				$scope.allUsers = $scope.users = data; 
				$scope.filter(); // Filtrar los users
				$("#progress").addClass("hide");
				$("#main").removeClass('hide').animateCss("fadeInUp");
			})
		}
	]
);

/*************************************************************************/

userControllers.controller("UserShowController",
	["$scope","$routeParams","UserResource",
		function($scope,$routeParams,UserResource){
			$("#main").addClass('hide');
			$("#progress").removeClass("hide");
			UserResource.get({id: $routeParams.id},function(user){
				$("#progress").addClass("hide");
				$("#main").removeClass('hide').animateCss("fadeInUp");
				$scope.user = user;
			});
		}
	]
);

/*************************************************************************/

userControllers.controller("UserEditController",
	["$scope","$routeParams","UserResource","$location",
		function($scope,$routeParams,UserResource,$location){
			$("#main").addClass('hide');
			$("#progress").removeClass("hide");
			$scope.title = "Edit user"
			$scope.submit = function(){
				console.log("submit");
				UserResource.update({id: $scope.user.id},{data: $scope.user}).
					$promise.
						then(function(data){
								console.log(data);
								$location.path("/users/"+$scope.user.id);
							},function(data){
								console.log(data);
							}
						);
			}
			UserResource.get({id: $routeParams.id}).
				$promise.
					then(function(data){
							$("#progress").addClass("hide");
							$("#main").removeClass('hide').animateCss("fadeInUp");
							$scope.user = data;
						},function(data){
							$("#progress").addClass("hide");
							$("#no-found").removeClass("hide");
						}
					);
		}
	]
);
/*
userControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams',
  function($scope, $routeParams) {
    $scope.phoneId = $routeParams.phoneId;
  }]);
  */