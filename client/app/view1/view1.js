'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl',function($scope, $http) {
	//var Web3 = require('web3');
	var web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider("http://localhost:8012"));

    var contractABI=web3.eth.contract([ { "constant": false, "inputs": [ { "name": "newSellPrice", "type": "uint256" }, { "name": "newBuyPrice", "type": "uint256" } ], "name": "setPrices", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string", "value": "Coin1" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256", "value": "400000" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "name": "", "type": "uint8", "value": "2" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "sellPrice", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "standard", "outputs": [ { "name": "", "type": "string", "value": "Token 0.1" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "target", "type": "address" }, { "name": "mintedAmount", "type": "uint256" } ], "name": "mintToken", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "buyPrice", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address", "value": "0x62720366ef403c9891e2bfbd5358ee3c8a57b113" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string", "value": "coin1" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "buy", "outputs": [], "payable": true, "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "frozenAccount", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_extraData", "type": "bytes" } ], "name": "approveAndCall", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" }, { "name": "", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "amount", "type": "uint256" } ], "name": "sell", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "target", "type": "address" }, { "name": "freeze", "type": "bool" } ], "name": "freezeAccount", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "type": "function" }, { "inputs": [ { "name": "initialSupply", "type": "uint256", "index": 0, "typeShort": "uint", "bits": "256", "displayName": "initial Supply", "template": "elements_input_uint", "value": "400000" }, { "name": "tokenName", "type": "string", "index": 1, "typeShort": "string", "bits": "", "displayName": "token Name", "template": "elements_input_string", "value": "Coin1" }, { "name": "decimalUnits", "type": "uint8", "index": 2, "typeShort": "uint", "bits": "8", "displayName": "decimal Units", "template": "elements_input_uint", "value": "2" }, { "name": "tokenSymbol", "type": "string", "index": 3, "typeShort": "string", "bits": "", "displayName": "token Symbol", "template": "elements_input_string", "value": "coin1" } ], "payable": false, "type": "constructor" }, { "payable": false, "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "target", "type": "address" }, { "indexed": false, "name": "frozen", "type": "bool" } ], "name": "FrozenFunds", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" } ]);

    var contract1=contractABI.at("0xdF01b2F8ec7fe32Eb1d9764407Faac1122902DE7");


    var owner=contract1.owner();
    console.log(owner);
    var coinBalance, etherBalance;
	//var x=watchTransaction();

    //check Ether Balance - done
    $scope.checkEtherBalance = function(accountAddr){        
        var data = JSON.stringify({accountAddress:accountAddr});
        var config = {
            headers: {               
                'Content-Type': 'application/json'
            }
        };
        $http.post('http://localhost:7000/eth/checkEthBalance', data,config)
            .then(function successCallback(resp){
                    console.log(resp.data);
                    if(resp.data.success== 'true'){
                        console.log(resp.data.data[0].balance);
                        $scope.etherBalance = resp.data.data[0].balance;
                        }
                    }, 
                function failureCallback(){
                    console.log('failure');
                });           
    }

    $scope.checkCoinBalance

    // watch balance - pending
    function watchBalance(accountAddr) {
        alert("clicked");
       var etherBalance , coinBalance; 
	   etherBalance=web3.eth.getBalance(accountAddr).toNumber(); 
	   coinBalance=contract1.balanceOf(accountAddr); 			
        web3.eth.filter('latest').watch(function() {
         	etherBalance=web3.eth.getBalance(accountAddr).toNumber(); 
        		coinBalance=contract1.balanceOf(accountAddr);
            });
    }

    //transfer Coin - done
    $scope.transferCoin = function(to, amount,from, passphrase){
        var data = JSON.stringify({
            senderAddress: from,
            recipientAddress: to,
            amount: amount,
            passphrase:passphrase
        });
        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        $http.post('http://localhost:7000/eth/transferCoin', data, config)
            .then(function successCallback(resp){
                console.log(resp);
                $scope.transactionHash = resp.data.data[0].transactionHash;
                }, function errorCallback(resp){
                    console.log('error');
                });    	
    }
    
	//Mint Token -- pending
    function mintToken(to,amount,passphrase){
        var data = JSON.stringify({
            toAddress: to,
            mintAmount: amount,
            passphrase: passphrase
        });
        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        $http.post('http://localhost:7000/eth/transferCoin', data, config)
            .then(function successCallback(resp){
                console.log(resp);
                $scope.transactionHash = resp.data.data[0].transactionHash;
            }, function errorCallback(resp){
                console.log('error');
            });     


    	web3.personal.unlockAccount(owner,passphrase);
    	var tx=contract1.mintToken(to,amount,{from:web3.eth.coinbase});	
    }

	//Set Prices
    function setPrices(newSellPrice, newBuyPrice,passphrase){
    	web3.personal.unlockAccount(owner,passphrase);
    	contract1.setPrices(newSellPrice, newBuyPrice, {from:frm});
    }

	//Sell coin
    function sell(amount,frm,passphrase){
    	web3.personal.unlockAccount(frm,passphrase);
    	contract1.sell(amount,{from:frm});
    }

	//buy coin
    function buy(amount,frm,passphrase){
    	web3.personal.unlockAccount(frm,passphrase);
    	amount=web3.toWei(amount,"ether");
    	contract1.buy({from:frm, value:amount});
    }

	//create new account
    $scope.createAccount = function (password){
        var data = JSON.stringify({passphrase:password});
        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        $http.post('http://localhost:7000/eth/createNewAccount', data, config)
            .then(function successCallback(resp){
                console.log(resp);
                $scope.accountAddress = resp.data.data[0].accountAddress;
                }, function errorCallback(resp){
                    console.log('error');
                });    	
    }




   var arr=[];
	 function watchTransaction(tx){
	 		
	 	contract1.Transfer(function(error,result){
	 		if(!error){	
	 			//storeTransactionHash(result.transactionHash);
				if(result.transactionHash==tx)           // to display only the transactions that are copmming through this web interface
					alert("successful");
					//console.log("Coin transfer: " + result.args.amount + " tokens were sent. Balances now are as following: \n Sender:\t" + result.args.sender);				
	 		}
	 		else{
	 			alert("transaction failed");
	 		}
	 	})
	 }


 	/*function storeTransactionHash(transHash){
 			arr.push(transHash);

 			alert("Transaction successfull.. trasnsaction hash= "+transHash);
			getTransactions();
		
 	} */

 	function getTransactions(){
 		console.log("Without duplicate:"+arr);
 		//arr1=jQuery.unique(arr);
 		document.getElementById('txhash1').innerText="array  is "+ arr ;
 	}

});