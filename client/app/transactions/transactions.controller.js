'use strict';

angular.module('myApp.transactions', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/transactions', {
    templateUrl: 'transactions/transactions.html',
    controller: 'transactionsCtrl'
  });
}])

.controller('transactionsCtrl', ['$scope','$http', '$uibModal', '$uibModalStack', function($scope, $http, $uibModal, $uibModalStack) {
	//get data from mongo db and display here	
    $scope.currentPage = 1;    
	$scope.getTransactions = function(req, res){
        var y = $scope.totalTransactions();
		var config = {
        	headers: {
            	'Content-Type': 'application/json'
            }     
        };
        // '_skipRows': (($scope.currentPage-1)*5),
        var data = {           
            'skipRows' : (($scope.currentPage-1)*5),
            'limit' : 5,
            'status' : $scope.status
        }
        $http.post('http://localhost:7000/eth/getTransactions',data,config)
        	.then(function successcallback(resp){                
        		console.log(resp);
        		$scope.transactions = resp.data.data[0].result.data;
        		console.log($scope.transactions);
        	},
        	function errorcallback(resp){
        		console.log("Error in getiing data from server: "+JSON.stringify(resp));
        	});
	};

    $scope.totalTransactions = function(req, resp) {
        var config = {
            headers: {
                'Content-Type': 'application/json'
            }     
        };
        var data = {
            'status': $scope.status
        };
        $http.post('http://localhost:7000/eth/countTransactions',data, config)
            .then(function successcallback(resp){
                console.log(resp);
                if(resp.data.success){
                    $scope.transactionCount = resp.data.data[0].result.data;
                    console.log($scope.transactionCount);
                }
                else{
                    console.log(resp.data.message);
                }                
            },
            function errorcallback(resp){
                console.log("Error in getiing data from server: "+JSON.stringify(resp));
            });
    }

    $scope.pageChanged = function(){
        console.log("Page clicked: "+$scope.currentPage);
        var z = $scope.getTransactions();
    }

	var x= $scope.getTransactions();
}]);