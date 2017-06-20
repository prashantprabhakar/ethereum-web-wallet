'use strict'

var contract = require('./contractDetails');


var web3_extended = require('web3_extended');
var path = require('path');
var absolutePath =  path.relative('./','/home/gemini/.ethereum/geth.ipc');
var TransactionService = require('./../services/transaction.service');
var Transaction = require('./../models/transaction.model');
console.log(absolutePath);
var options = {
  //host : absolutePath,	
  host: ' http://localhost:8013',
  ipc : false,
  personal: true, 
  admin: false,
  debug: false
};

var web3 = web3_extended.create(options);
var contractAddress= "0xA9c6a4DD152da7D9A8AA1d6A9b5Cfd8C2f5cdE18";
var owner=contract.owner;

exports.checkEthBalance = function(req, res) {
	console.log("check balanace");
	console.log(req.body);
	var accountAddr = req.body.accountAddress;	
	if(isAddress(accountAddr)==false){
		console.log("This address is not valid");
		//return res.json({error:true ,  message: "Invalid address"});
		res.json({"success":"false","data":[{"message":"Inavlid address"}]});
		return res;

	}
	var ethBalance=web3.eth.getBalance(accountAddr).toNumber(); 
	res.json({"success":"true","data":[{"balance": ethBalance}]});
	//return res.json({error:"false", balance: ethBalanceethBalance, message:"Success"});
	console.log(ethBalance);
	return res;
}

exports.checkCoinBalance = function(req, res) {
	console.log("check balanace");
	var accountAddr = req.body.accountAddress;
	res.header('Access-Control-Allow-Origin', '*');
	if(isAddress(accountAddr)==false){
		console.log("This address is not valid");
		return res.json({"success":"false","data":[{"message":"Inavlid address"}]});
	}
	var coinBalance=contract.balanceOf(accountAddr).toNumber(); 	    		
	console.log(coinBalance);
	return res.json({"success":"true","data":[{balance: coinBalance}]});
	//return "success";
}

exports.transferEther = function(req, res) {
	console.log("Inside transfer Ether function");
	var to=req.body.recipientAddress;
	var from= req.body.senderAddress;
	var amount=req.body.transferAmount;
	var passphrase=req.body.passphrase;
	res.header('Access-Control-Allow-Origin', '*');

    // verify Sender's address
    if(isAddress(from)==false){
    	console.log("Inavlid Sender's address");
    	res.json({"success":"false",data:[{"message":"Inavlid Sender's address"}]});
    	return res;
    }

	// verify reciever's address
	if(isAddress(to)==false){
		console.log("Inavlid Recipient's address");
		res.json({success:"false","data":[{"message":"Inavlid Recipient's address"}]});
		return res
	}

	console.log("Ethers in sending account are "+eth)

	// unlock account
	web3.personal.unlockAccount(from,passphrase, function(_error,_resp){
		if(_error){
			console.log("Error in unlocking account");
			res.json({"success":"false","data":[{"message":"Incorrect Password"}]});
			return res;
		}
		else{
				//web3.eth.sendTransaction({to:to, from:from, value:web3.toWei(amount,"ether")},function( _erro,_respo){
					web3.eth.sendTransaction({to:to, from: from, value:web3.toWei(amount,"ether")}, function(err1, resp1){
						if(err1){
							console.log("Error is "+err1);
						// check if error is due to low balance
						if(err1=="Error: Insufficient funds for gas * price + value"){
							res.json({success:"false","data":[{"message":"Insufficient funds"}]});
							return res;
						}						
						else{													
							err1=err1.toString().replace("Error:","");  // err1 is object -- convert it to string						
							console.log("The error message after replacement is "+err1)
							res.json({success:"false","data":[{"message":err1}]});
							return res;
						}

					}
					else{						
						console.log("Transaction is="+resp1);
						res.json({"success":"true","data":[{transactionId:resp1}]});
						return res;
					}
			});// send Transaction callback ends here;
				}
	}); // unlock accnt callback ends here
}

exports.transferCoin = function(req, res) {
	debugger;
	console.log("transfer");
	var to=req.body.recipientAddress;
	var from= req.body.senderAddress;
	var amount=req.body.amount;
	var passphrase=req.body.passphrase;

	if(isAddress(from)==false){
		console.log("Inavlid Sender's address");
		res.json({"success":"false","data":[{"message":"Inavlid Sender's address"}]});
		return res;
	}
	if(isAddress(to)==false){
		console.log("Inavlid Recipient's address");
		res.json({"success":"false","data":[{"message":"Inavlid Recipient's address"}]});
		return res;
	}


	//check if from Address has ethers
	var eth = web3.eth.getBalance(from).toNumber();
	if(eth===0){
		res.json({"success":"false","data":[{"message":"Low ether balance"}]});
		return res;
	}

	//web3.personal.unlockAccount(from,passphrase);
	web3.personal.unlockAccount(from,passphrase, function(_error,_resp){
		if(_error){
			console.log("Error");
			console.log(_error);
			res.json({"success":"false","data":[{"message":"Incorrect Password"}]});
			return res;
		}
		else{
			var callData=contract.transfer.getData(to,amount);
			var estimatedGas=checkThrow(from,callData);
			console.log("Estimated Gas="+estimatedGas);
			if(!estimatedGas)
			{
				console.log("Intrinsic gas low");
				res.json({"success":"false","data":[{"message":"Intrinsic Gas too low"}]});
				return res;
			}
			else{
				var tx=contract.transfer(to, amount, {from: from});
				console.log("Transaction hash is: "+tx+" . Now we'll save it to DB");
				saveTransaction(tx);
				//watchTransaction();
				res.json({"success":"true", "data":[{"transactionHash":tx}]});
				return res;
			}// estimates gas ends
		}
	});
} // function transfer coin ends here

// Mint Token	
exports.mintCoin = function(req, res){
	console.log("Mint fn s=from server");
	var toAddress = req.body.toAddress;
	var mintAmount = req.body.mintAmount;
	//var fromAddress = web3.eth.coinbase;
	var passphrase = req.body.passphrase;
	contract.owner(function(_err, _resp1){
		if(_err){
			res.json({"success":"false","data":[{"message":"Error in getting owner's address"}]});
			return res;
		}
		else{
			var fromAddress = _resp1;
			// check if addresses are valid
			if(isAddress(fromAddress)==false){
				console.log("Inavlid Coinbase address");
				res.json({"success":"false","data":[{"message":"Inavlid Coinbase address"}]});
				return res;
			}
			if(isAddress(toAddress)==false){
				console.log("Inavlid Recipient's address");
				res.json({"success":"false","data":[{"message":"Inavlid Recipient's address"}]});
				return res;
			}
			//check if from Address has ethers
			var eth = web3.eth.getBalance(fromAddress).toNumber();
			if(eth===0){
				res.json({"success":"false","data":[{"message":"Low ether balance"}]});
				return res;
			}
			web3.personal.unlockAccount(fromAddress,passphrase, function(_error,_resp){
				if(_error){
					console.log("Error");
					console.log(_error);
					res.json({"success":"false","data":[{"message":"Incorrect Password"}]});
					return res;
				}
				else{
					var callData=contract.mintToken.getData(toAddress,mintAmount);
					var estimatedGas=checkThrow(fromAddress,callData);
					console.log("Estimated Gas="+estimatedGas);
					if(!estimatedGas)
					{
						console.log("Intrinsic gas low");
						res.json({"success":"false","data":[{"message":"Intrinsic Gas too low"}]});
						return res;
					}
					else{

						var tx=contract.mintToken(toAddress, mintAmount, {from: fromAddress});
						console.log("Transaction hash is: "+tx+" . Now we'll save it to DB");
						saveTransaction(tx);
						//watchTransaction();
						res.json({"success":"true", "data":[{"transactionHash":tx}]});
						return res;
					}// estimates gas ends
				}
			});
		}
	})
}// function ends here

exports.setPrices = function(req, res) {
	debugger
	console.log("setting prices");
	var sellPrice =req.body.sellPrice;
	var buyPrice = req.body.buyPrice;
	var passphrase=req.body.passphrase;
	var from;
	contract.owner(function(err, _res){
		if(err) {
			console.log("Error in getting contract owner");
		}
		else{
			var from = _res;
			//web3.personal.unlockAccount(from,passphrase);
			//check if from Address has ethers
			var eth = web3.eth.getBalance(from).toNumber();
			if(eth===0){
				res.json({"success":"false","data":[{"message":"Low ether balance"}]});
				return res;
			}
			web3.personal.unlockAccount(from,passphrase, function(_error,_resp){
				if(_error){
					console.log("Error");
					console.log(_error);
					res.json({"success":"false","data":[{"message":"Incorrect Password"}]});
					return res;
				}
				else{
					// test this
					var callData=contract.transfer.getData(sellPrice,buyPrice);
					var estimatedGas=checkThrow(from,callData);
					console.log("Estimated Gas="+estimatedGas);
					if(!estimatedGas)
					{
						console.log("Intrinsic gas low");
						res.json({"success":"false","data":[{"message":"Intrinsic Gas too low"}]});
						return res;
					}
					else{
						var tx=contract.setPrices(sellPrice, buyPrice, {from: from});
						console.log("Transaction hash is: "+tx+" . Now we'll save it to DB");
						saveTransaction(tx);
						//watchTransaction();
						res.json({"success":"true", "data":[{"transactionHash":tx}]});
						return res;
					}// estimates gas ends
				}
			});
		}
	});
} // function ends here

// Sell Coin
exports.sellCoin = function(req, res){
	var fromAddress = req.body.from;
	var amount=req.body.amount;
	var passphrase = req.body.passphrase;
	if(isAddress(fromAddress)==false){
		console.log("Inavlid Coinbase address");
		res.json({"success":"false","data":[{"message":"Inavlid Coinbase address"}]});
		return res;
	}
	//check if from Address has ethers
	var eth = web3.eth.getBalance(fromAddress).toNumber();
	if(eth===0){
		res.json({"success":"false","data":[{"message":"Low ether balance"}]});
		return res;
	}
	web3.personal.unlockAccount(fromAddress,passphrase, function(_error,_resp){
		if(_error){
			console.log("Error");
			console.log(_error);
			res.json({"success":"false","data":[{"message":"Incorrect Password"}]});
			return res;
		}
		else{
			var callData=contract.mintToken.getData(amount);
			var estimatedGas=checkThrow(fromAddress,callData);
			console.log("Estimated Gas="+estimatedGas);
			if(!estimatedGas)
			{
				console.log("Intrinsic gas low");
				res.json({"success":"false","data":[{"message":"Intrinsic Gas too low"}]});
				return res;
			}
			else{
				var tx=contract.sell(amount, {from: fromAddress});
				console.log("Transaction hash is: "+tx+" . Now we'll save it to DB");
				saveTransaction(tx);
				//watchTransaction();
				res.json({"success":"true", "data":[{"transactionHash":tx}]});
				return res;
			}// estimates gas ends
		}
	});
}

// Buy Coin
exports.buyCoin = function(req, res){
	var fromAddress = req.body.from;
	var amount=web3.toWei(req.body.ether,"ether");
	var passphrase = req.body.passphrase;
	if(isAddress(fromAddress)==false){
		console.log("Inavlid Coinbase address");
		res.json({"success":"false","data":[{"message":"Inavlid Coinbase address"}]});
		return res;
	}
	//check if from Address has ethers
	var eth = web3.eth.getBalance(fromAddress).toNumber();
	if(eth===0){
		res.json({"success":"false","data":[{"message":"Low ether balance"}]});
		return res;
	}
	web3.personal.unlockAccount(fromAddress,passphrase, function(_error,_resp){
		if(_error){
			console.log("Error");
			console.log(_error);
			res.json({"success":"false","data":[{"message":"Incorrect Password"}]});
			return res;
		}
		else{
			var callData=contract.buy.getData();
			var estimatedGas=checkThrow(fromAddress,callData);
			console.log("Estimated Gas="+estimatedGas);
			if(!estimatedGas)
			{
				console.log("Intrinsic gas low");
				res.json({"success":"false","data":[{"message":"Intrinsic Gas too low"}]});
				return res;
			}
			else{
				var tx=contract.buy({from:fromAddress, value:amount});
				console.log("Transaction hash is: "+tx+" . Now we'll save it to DB");
				saveTransaction(tx);
				//watchTransaction();
				res.json({"success":"true", "data":[{"transactionHash":tx}]});
				return res;
			}// estimates gas ends
		}
	});
}

exports.getTransactions = function(req, res){
	console.log("getting transactions");
	var skipRows = req.body.skipRows;
	var limit = req.body.limit;
	var status = req.body.status;
	debugger;
	TransactionService.getAllTransactions(skipRows,limit,status,function(resp){
		if(!resp.success){
			console.log("Error occured in getting transactions");
		}
		else{
			console.log("succesfully recieved transactions");
			debugger;
			return res.json({"success":"true","data":[{"result":resp}]});
		}
	})
	/*debugger;
	Transaction.find(function(err,result){
		if(err) console.log("Error in getting transaction: "+err);
		else{
			console.log(JSON.stringify(result));
			return res.json({"success":"true","data":[{"result":result}]});
		}
	})*/
}

// saving transaction details to database.
function saveTransaction(tx){
	TransactionService.saveTransaction(tx, function(resp){
		if(!resp.error){
			console.log("Resp from db : "+JSON.stringify(resp));
		//return res.json({"success":false,"data":[{"message":"Inavlid Sender's address"}]});	
		}
		else{
			console.log("transaction could not be saved");
			//return res.json({error:"true","message":""})
			//return res.json({"success":false,"data":[{"message":"Inavlid Sender's address"}]});
		}
	});
} // save Transaction ends here

// check transaction status without DB.
exports.checkTransactionStatus = function(req,res){
	var transactionId = req.body.transactionid;
	console.log(transactionId);
	try{
		var txReciept = web3.eth.getTransactionReceipt(transactionId);
		if(txReciept == null || txReciept == undefined)
			return res.json({"success":"true", "data":[{"transactionStatus":"Pending"}]});
		else
			return res.json({"success":"true", "data":[{"transactionStatus":"Pending"}]});
		}
	catch(e) {
		 console.log("invalid tx receipt: " + e);
		 return res.json({"success":"false","data":[{"message":"Incorrect transaction hash"}]});

	}	
}

exports.createNewAccount = function (req, res){
	var passphrase = req.body.passphrase;
	var accountAddress = web3.personal.newAccount(passphrase, function(_error,_res){
		if(_error){
			return res.json({"success":"true","data":[{"message":"Error in creating account."}]});
		}
		else{
			return res.json({"success":"false","data":[{accountAddress:_res}]});
			//return res.json({"success":"true","data":[{accountAddress:accountAddress}]});
		}
	});
	//return res.json({error : false , "message" : accountAddress});
}

exports.countTransactions = function (req, res){
	var status = req.body.status;
	debugger;
	TransactionService.countTransactions(status, function(resp){
		if(!resp.success){
			console.log("Error occured in getting transactions count");
			return res.json({"success":"false","data":[{"message":"Error occured in getting transactions count"}]});
		}
		else{
			console.log("Total transactions = "+resp.data);
			return res.json({"success":"true","data":[{"result":resp}]});
		}
	})
}

// another approach to checkTransaction status - V3
// this function will update status fo all pending transactions. You can call this function after every n seconds and it will update the db.
function watchTransaction(){
	console.log("Watching Transactions");	
	Transaction.find({"status":"PENDING"}, function(err, res){
		if(!err){
			//for(var tx in res.transactionid){
			for ( var i=0; i < res.length; i++){
				var tx= res[i].transactionid;
				// performn this for each trannsaction in pending pool
				var blockNumber = web3.eth.getTransaction(tx).blockNumber;
				//if(blockNumber- web3.eth.blockNumber > 0){
				if(blockNumber!= null){
					// make status to confirmed
					Transaction.update({transactionid:tx}, {status:"Success"},function(_err1, _resp1){
						console.log("Transaction: "+tx+" status updated succesfully." )
					});
				}
			}; // for each ends here
		}
	});
} // watch transaction ends here*/

// calling watch Transaction function every 13 seconds
var interval = setInterval(watchTransaction, 13000);

var isAddress = function (address) {
	// function isAddress(address) {
		if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // check if it has the basic requirements of an address
        return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        // If it's all small caps or all all caps, return "true
        return true;
    } else {
        // Otherwise check each case
        return isChecksumAddress(address);
    }
}

var isChecksumAddress = function (address) {
    // Check each case
    address = address.replace('0x','');
    var addressHash = web3.sha3(address.toLowerCase());
    for (var i = 0; i < 40; i++ ) {
        // the nth letter should be uppercase if the nth digit of casemap is 1
        if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
        	return false;
        }
    }
    return true;
}

// function checks if contract function executes properly or throws
function checkThrow(frm,callData){
	var estimatedGas=web3.eth.estimateGas({from:frm,to:contractAddress,data:callData});
	console.log(estimatedGas);
	if(estimatedGas==50000000){
		//alert("intrinsic gas too low");
		return false;
	}

	else return estimatedGas;
}


// function check transaction status
/*exports.checkTransactionStatus = function(req, res) {
	var transactionId = req.body.transactionid;
	console.log(transactionId);
	//check if transaction Hash is correct
	try {
 		 web3.eth.getTransactionReceipt(transactionId);
 		 //check transaction id in database
		Transaction.find({transactionid : transactionId}, function(err, transaction) {
		console.log(transaction);
			// if transaction is found in database : returm it's status
			if(transaction.length >0){
				console.log("Transaction found in database");
				return res.json({"success":"true","data":[{"transactionStatus":transaction[0].status}]});
			}
			// if transaction not found in database: look for transaction status from blockchain
			else{
				var blockNumber = web3.eth.getTransaction(transactionId).blockNumber;
				if(blockNumber == null){
					return res.json({"success":"true", "data":[{"transactionStatus":"Pending"}]});
				}
				else{
					return res.json({"success":"true", "data":[{"transactionStatus":"Success"}]});
				}
			}
			
		});
		}
	catch(e) {
  		 console.log("invalid tx receipt: " + e);
  		 return res.json({"success":"false","data":[{"message":"Incorrect transaction hash"}]});

		}
}
*/

// this is working code
/*exports.checkTransactionStatus= function(req, res){
	var transactionId = req.body.transactionid;
	console.log(transactionId);
	var blockNumber = web3.eth.getTransaction(transactionId).blockNumber;
	if(blockNumber == null )
		return res.json({"success":"true", "data":[{"transactionStatus":"Pending"}]});
	else
		return res.json({"success":"true", "data":[{"transactionStatus":"Success"}]});
	console.log(obj);
	/*var status = obj[transactionId];
	console.log(status);
	return res.json({"success":"true", data:[{"transactionStatus":status}]})*/
//}
			

/*
function watchTransaction(tx){
	console.log("Transaction ID : "+tx);
	contract.Transfer(function(err,result){
		if(!err){
			if(result.transactionHash==tx){
				console.log("success");
				Transaction.findOne({transactionid : tx} , function(err, transaction) {
					console.log("Trans updating : "+JSON.stringify(transaction));
					if(err){
						return "Error";
					}
					if(transaction != null && transaction != undefined){
						transaction.update({status : "success"}, function(_err, _resp) {
							return "Status updated";
						});
					}
				});				
			}
		}
	});
}
*/


// watching transaction v2
// watches transaction based on events. // depends on contract code
// the function needs to be executed continuously
// not yet tested
/*function watchTransaction(){
	console.log("Watching tx");
	contract.Transfer(function(error, resp){
		if(error){
			console.log("Error in watching transaction");
		}
		else if (resp.blockNumber != null){  // perfom any operation only if transaction is  mined
			var tx= resp.transactionHash;
				console.log("transaction that is been watched is: "+tx);
				Transaction.findOne({transactionid:tx},function(_err, _resp){
					if(_err){
						console.log("No matching tx found");
					}
					if(_resp != null && _resp != undefined){
						Transaction.update({transactionid:tx}, {status:"Success"},function(_err1, _resp1){
							console.log("Transaction: "+tx+" status updated succesfully." )
						})
					}

		}) // tx.find one ends here

	} // else ends here

})
}*/

