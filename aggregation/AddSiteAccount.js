var path = require('path');
var mainApp = require(path.resolve('MainApp.js'));
var globalApp = require(path.resolve('Global.js'));
var configApp = require(path.resolve('Config.js'));
var PKI = require(path.resolve('util/PKI_Library.js'));
var request = require('request');
var readlineSync = require('readline-sync');
var async = require('async');
function AddSiteAccount(isPkiEnabled) {
	console.log('------------AddSiteAccount-----------');
	globalApp.properties.options.url = configApp.properties.baseURL
			+ globalApp.properties.siteURL + '/16441';
	globalApp.properties.options.method = globalApp.properties.get;
	globalApp.properties.options.headers.Authorization = 'userSession='
			+ globalApp.properties.userSessionToken + ', cobSession='
			+ globalApp.properties.cobSessionToken;
	request(
		globalApp.properties.options, function(error, response, body) {
			if (error) {
				return console.log('Error:', error);
			}
			if (!error && response.statusCode == 200) {
				var gsonParser2 = JSON.parse(body);
				if (isPkiEnabled == 1) {
					gsonParser2.provider[0]['loginForm']['row'][0].field[0]['value'] = PKI
							.encrypt("DAPI.site16441.7");
					gsonParser2.provider[0]['loginForm']['row'][1].field[0]['value'] = PKI
							.encrypt("site16441.1");
				} else {
					gsonParser2.provider[0]['loginForm']['row'][0].field[0]['value'] = "DAPI.site16441.7";
					gsonParser2.provider[0]['loginForm']['row'][1].field[0]['value'] = "site16441.1";
				}
				console.log(JSON.stringify(gsonParser2));
				AddSiteAccountForGivenJson(gsonParser2);
			}
			//mainApp.MainApp();
		}
	)
}

function AddSiteAccountForGivenJson(gsonParser2) {
	globalApp.properties.options.url = configApp.properties.baseURL
							+ globalApp.properties.siteURL
							+ '/'
							+ gsonParser2.provider[0].id;
	globalApp.properties.options.method = globalApp.properties.post;
	globalApp.properties.options.headers.Authorization = 'userSession='
			+ globalApp.properties.userSessionToken
			+ ', cobSession='
			+ globalApp.properties.cobSessionToken;
	var reqBody = 'providerParam=' + JSON.stringify(gsonParser2);
	globalApp.properties.options.form = reqBody;
	request(
			globalApp.properties.options,
			function(error, response, body) {
				if (error) {
					return console.log('Error:', error);
				}
				if (!error && response.statusCode == 201) {
					var gsonParser3 = JSON.parse(body);
					globalApp.properties.options.url = configApp.properties.baseURL
							+ globalApp.properties.refreshURL
							+ '/'
							+ gsonParser3.providerAccountId;
					globalApp.properties.options.method = globalApp.properties.get;
					globalApp.properties.options.headers.Authorization = 'userSession='
							+ globalApp.properties.userSessionToken
							+ ', cobSession='
							+ globalApp.properties.cobSessionToken;
					globalApp.properties.options.form = '';
					flag = '';
					console
							.log('\tProviderAccountID \t     RefreshStatus');
					async
							.whilst(
									function() {
										return flag != 'REFRESH_COMPLETED';
									},
									function(next) {
										request(
												globalApp.properties.options,
												function(
														error,
														response,
														body) {
													if (!error
															&& response.statusCode == 200
															&& body.length != 0) {
														var gson = JSON
																.parse(body);
														console
																.log('\t'
																		+ gson.providerAccountId
																		+ ' \t   '
																		+ gson.refreshInfo.refreshStatus);
														flag = gson.refreshInfo.refreshStatus;
													}
													next();
												});
									}, function(err) {
										mainApp.MainApp();
									});
				}
			}
	)
}

exports.AddSiteAccount = AddSiteAccount
