var path = require('path');
var  mainApp  =  require(path.resolve('MainApp.js'));
var  globalApp  =  require(path.resolve('Global.js'));
var  configApp  =  require(path.resolve('Config.js'));
var  PKI  =  require(path.resolve('util/PKI_Library.js'));  
var  request  =  require('request');  
var readlineSync = require('readline-sync');  
var async = require('async');    

function AddSiteAccountMFA(isPkiEnabled){
	console.log('------------AddSiteAccountMFA-----------');
	console.log('Adding site with Dag Site ID: 16442');
	//Setting the input parameters for Add Account API Call
	globalApp.properties.options.url = configApp.properties.baseURL + globalApp.properties.siteURL + '/16442';
	globalApp.properties.options.method = globalApp.properties.get;
	globalApp.properties.options.headers.Authorization = 'userSession='+globalApp.properties.userSessionToken+', cobSession='+globalApp.properties.cobSessionToken;
	request(globalApp.properties.options, function (error, response, body) {
		if(error) {
			return console.log('Error:', error);
		}
		if (!error && response.statusCode == 200) {
			var gsonParser2 = JSON.parse(body);
			if(isPkiEnabled) {
				gsonParser2.provider[0]['loginForm']['row'][0].field[0]['value'] = PKI.encrypt("DBmet1.site16442.1");
				gsonParser2.provider[0]['loginForm']['row'][1].field[0]['value'] = PKI.encrypt("site16442.1");
			} else {
				gsonParser2.provider[0]['loginForm']['row'][0].field[0]['value'] = "DBmet1.site16442.1";
				gsonParser2.provider[0]['loginForm']['row'][1].field[0]['value'] = "site16442.1";
			}
			console.log(JSON.stringify(gsonParser2));
			globalApp.properties.options.url = configApp.properties.baseURL + globalApp.properties.siteURL + '/16442';
			globalApp.properties.options.method = globalApp.properties.put;
			globalApp.properties.options.headers.Authorization = 'userSession='+globalApp.properties.userSessionToken+', cobSession='+globalApp.properties.cobSessionToken;
			globalApp.properties.options.form = JSON.stringify(gsonParser2);
			request(globalApp.properties.options, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					var gsonParser3 = JSON.parse(body);
					var provAccId = gsonParser3.providerAccountId;
					flag = '';
					console.log('\tProviderAccountID \t     RefreshStatus');
					async.whilst(function () {
						return flag != 'REFRESH_COMPLETED';
					},
					function (next) {
						globalApp.properties.options.url = configApp.properties.baseURL + globalApp.properties.refreshURL + '/' + provAccId;
						globalApp.properties.options.method = globalApp.properties.get;
						globalApp.properties.options.headers.Authorization = 'userSession='+globalApp.properties.userSessionToken+', cobSession='+globalApp.properties.cobSessionToken;
						globalApp.properties.options.form = '';
						request(globalApp.properties.options, function (error, response, body) {
							if(error) {
								return console.log('Error:', error);
							}
							if (!error && response.statusCode == 200 && body.length != 0) {
								var gson = JSON.parse(body);
								flag = gson.refreshInfo.refreshStatus;
								console.log('\t'+provAccId+' \t  '+gson.refreshInfo.refreshStatus);
								if(flag == 'LOGIN_FAILURE') {
									console.log('Please try again');
									mainApp.MainApp();
								} else if(gson.loginForm != undefined) {
									if(flag != 'LOGIN_FAILURE' && flag != 'LOGIN_SUCCESS') {
										if(gson.loginForm.formType == 'token') {
											gson.loginForm.row[0].field[0].value = "123456";
											var reqBody = "MFAChallenge="+JSON.stringify(gson);
											console.log('Populated loginForm: '+JSON.stringify(gson.loginForm));
											console.log('Token verification in-progress...');
											globalApp.properties.options.url = configApp.properties.baseURL + globalApp.properties.siteURL + '/' + provAccId;
											globalApp.properties.options.method = globalApp.properties.post;
											globalApp.properties.options.headers.Authorization = 'userSession='+globalApp.properties.userSessionToken+', cobSession='+globalApp.properties.cobSessionToken;
											globalApp.properties.options.form = reqBody;
											request(globalApp.properties.options, function (error, response, body) {
												if(error){
													return console.log('Error:', error);
												}
												if (!error && response.statusCode == 200) {
													console.log('\t'+provAccId+' \t  '+gson.refreshInfo.refreshStatus);
													console.log('Token verification process successfull!!!!');
												}
											})
										} else if(gson.loginForm.formType == 'questionAndAnswer') {
											if(isPkiEnabled) {
												gson.loginForm.row[0].field[0].value = PKI.encrypt("Texas");
												gson.loginForm.row[1].field[0].value = PKI.encrypt("w3schools");
											} else {
												gson.loginForm.row[0].field[0].value = "Texas";
												gson.loginForm.row[1].field[0].value = "w3schools";
											}
											var reqBody = "MFAChallenge="+JSON.stringify(gson);
											console.log('Populated loginForm: '+JSON.stringify(gson.loginForm));
											console.log('QnA verification in-progress...');
											globalApp.properties.options.url = configApp.properties.baseURL + globalApp.properties.siteURL + '/' + provAccId;
											globalApp.properties.options.method = globalApp.properties.post;
											globalApp.properties.options.headers.Authorization = 'userSession='+globalApp.properties.userSessionToken+', cobSession='+globalApp.properties.cobSessionToken;
											globalApp.properties.options.form = reqBody;
											request(globalApp.properties.options, function (error, response, body) {
												if(error) {
													return console.log('Error:', error);
												}
												if (!error && response.statusCode == 200) {
													console.log('\t'+provAccId+' \t  '+gson.refreshInfo.refreshStatus);
													console.log('QnA verification process successfull!!!!');
												}
											})
										}
									}
								}
							}
							next();
						});
					},
					function (err) {
						mainApp.MainApp();
					});
					}
				})
				}
		})
		}
		exports.AddSiteAccountMFA = AddSiteAccountMFA  
