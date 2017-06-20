'use strict'

var Transaction = require('./../models/transaction.model'),
	mongoose = require('mongoose');


var TransactionService = function(){
//exports.TransactionService = function(){
	var _self = this;

	_self.saveTransaction = function(id, cb){
		var transactionID = id;
		Transaction.create({
			transactionid : transactionID,
			status : 'Pending'
		}, function(err, transaction) {
			console.log("Error : "+err, "Transaction : "+JSON.stringify(transaction));
			if(err) { return cb({error : true, message : err}) };
			return cb({error : false, message : "Transaction Added Successfully"});
		});
	}

	/* Without pagination*/
	/*_self.getAllTransactions = function(cb){
		Transaction.find(function(err,result){
			if(err) { return cb({"success" : false, message : err}) };
			//return cb({error:false, message: success});
			return cb({"success":"true","data":result});
		});
	}*/

	/*With paginations*/
	/*_self.getAllTransactions = function(skipRows,limit,cb){
		debugger;
		var cursor = Transaction.find();
		cursor.skip(skipRows).limit(limit)
			.then(function callback(result){				
				return cb({"success":"true","data":result});
			});
	}*/

	/* With optional param*/
	_self.getAllTransactions = function(skipRows,limit,status,cb){
		var query = status ? {status:status} :{};
		var cursor = Transaction.find(query);
		cursor.skip(skipRows).limit(limit)
			.then(function callback(result){				
				return cb({"success":"true","data":result});
			});
	}

	_self.countTransactions = function(status,cb){
		var query = status ? {status: status}: {};
		Transaction.count(query, function(err, result){
			if(err){
				return cb({success : false, message : "Unable to get Transaction count"});
			}
			else{
				return cb({success : true, data:result});
			}
		});
	}
	return {
		"saveTransaction" : _self.saveTransaction,
		"getAllTransactions" : _self.getAllTransactions,
		"countTransactions" : _self.countTransactions
	}
}

/*exports.getAllTransactions = function(){
	var _self = this;
	_self.

};*/

module.exports = new TransactionService();