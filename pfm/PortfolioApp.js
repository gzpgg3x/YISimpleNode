var path = require('path');
var  mainApp  =  require(path.resolve('MainApp.js'));
var  globalApp  =  require(path.resolve('Global.js'));
var  configApp  =  require(path.resolve('Config.js'));
var  request  =  require('request');
var readlineSync = require('readline-sync');
var async = require('async');
function PortfolioApp(){
	
	console.log('---------------------------------------------------------------');
	console.log('Portfolio APP');
	console.log('---------------------------------------------------------------');
	console.log('1. Asset Summary');
	console.log('2. Asset Summary With Details');
	console.log('0. Exit');
	console.log('Any other key for main options');
	console.log('---------------------------------------------------------------');
	
	var selectedPortfolioOption = readlineSync.question('Enter your choice: ');
	switch (selectedPortfolioOption) {
		case '1':
			assetSummary();
			break;
		case '2':
			assetSummaryWithDetails();
			break;
		case '0':
			process.exit();
		default:
			mainApp.MainApp();
			break;
	}
}

function assetSummary(){
	//Setting the input parameters for Holdings API Call
	globalApp.properties.options.url = configApp.properties.baseURL + globalApp.properties.portfolioSummaryURL;
	globalApp.properties.options.method = globalApp.properties.get;
	globalApp.properties.options.headers.Authorization = 'userSession='+globalApp.properties.userSessionToken+', cobSession='+globalApp.properties.cobSessionToken;
	
	console.log('---------------------------------------------------------------------------');
	console.log('Asset Info : Classification Type, Classification Value, Value');
	console.log('---------------------------------------------------------------------------');
	//Invoking the Portfolio API Call
	request(globalApp.properties.options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			if(body.length > 2) {
				var gson = JSON.parse(body);
				for(var i = 0; i < gson.assetSummary.length; i++) {
					if(gson.assetSummary[i].classificationType !== undefined) {
						if(gson.assetSummary[i].value !== undefined) {
							console.log('Asset Info : ' + gson.assetSummary[i].classificationType + ', ' + gson.assetSummary[i].classificationValue + ', ' + gson.assetSummary[i].value.amount);
						}
						else {
							console.log('Asset Info : ' + gson.assetSummary[i].classificationType + ', ' + gson.assetSummary[i].classificationValue + ', 0');
						}
					}
				}
				console.log('---------------------------------------------------------------------------');
			} else {
				console.log('No data');
			}
			PortfolioApp();
		}
	})
}

function assetSummaryWithDetails(){
	//Setting the input parameters for Holdings API Call
	globalApp.properties.options.url = configApp.properties.baseURL + globalApp.properties.portfolioSummaryDetailsURL;
	globalApp.properties.options.method = globalApp.properties.get;
	globalApp.properties.options.headers.Authorization = 'userSession='+globalApp.properties.userSessionToken+', cobSession='+globalApp.properties.cobSessionToken;
	
	console.log('---------------------------------------------------------------------------');
	console.log('Asset Info : Classification Type, Classification Value, Value');
	console.log('	- Holdings : Holding Id, Account Id, Value');
	console.log('	- Account : Account Id, Cash');
	console.log('------------------------------------------------------------------');
	//Invoking the Portfolio API Call
	request(globalApp.properties.options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			if(body.length > 2) {
				var gson = JSON.parse(body);
				for(var i = 0; i < gson.assetSummary.length; i++) {
					if(gson.assetSummary[i].classificationType !== undefined) {
						if(gson.assetSummary[i].value !== undefined) {
							console.log('Asset Info : ' + gson.assetSummary[i].classificationType + ', ' + gson.assetSummary[i].classificationValue + ', ' + gson.assetSummary[i].value.amount);
						}
						else {
							console.log('Asset Info : ' + gson.assetSummary[i].classificationType + ', ' + gson.assetSummary[i].classificationValue + ', 0');
						}
						if (gson.assetSummary[i].holding !== undefined) {
							for(var j = 0; j < gson.assetSummary[i].holding.length; j++) {
								if (gson.assetSummary[i].holding[j].value !== undefined) {
									console.log('	- Holdings : ' + gson.assetSummary[i].holding[j].id + ', ' + gson.assetSummary[i].holding[j].accountId + ', ' + gson.assetSummary[i].holding[j].value.amount);
								}
							}
						}
						if (gson.assetSummary[i].account !== undefined) {
							for(var j = 0; j < gson.assetSummary[i].account.length; j++) {
								if (gson.assetSummary[i].account[j].value !== undefined) {
									console.log('	- Account : ' + gson.assetSummary[i].account[j].id + ', ' + gson.assetSummary[i].account[j].value.amount);
								}
							}
						}
					}
				}
				console.log('-------------------------------------------------------');
			} else {
				console.log('No data');
			}
			PortfolioApp();
		}
	})
}

exports.PortfolioApp = PortfolioApp