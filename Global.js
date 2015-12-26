exports.properties = {
		headers  :  {
			'User-Agent':            'Mozilla/5.0',
			'Content-Type':          'application/json',
			'encoding':				 'utf8'
		},
		options  :  {
			url: '',
			method:  '',
			headers: '',
			form:  ''
		},
		userSessionToken : '',
		cobSessionToken : '',
		post : 'POST',
		get : 'GET',
		put : 'PUT',
		cobrandLoginURL : 'cobrand/login',
		userLoginURL : 'user/login',
		siteURL : 'providers',
		accountURL : 'accounts',
		investmentOptionsURL : 'accounts/investmentPlan/investmentOptions',
		investmentOptionsAssetClassificationURL : 'accounts/investmentPlan/investmentOptions?include=assetClassification',
		statementsURL : 'statements',
		transactionsURL : 'transactions',
		holdingsURL : 'holdings',
		holdingsAssetClassificationURL : 'holdings?include=assetClassification',
		holdingsAssetClassificationFilterURL : 'holdings?include=assetClassification&assetClassification.classificationType=COUNTRY&assetClassification.classificationValue<>US',
		portfolioSummaryURL : 'portfolio/assetSummary',
		portfolioSummaryDetailsURL : 'portfolio/assetSummary?include=details',
		refreshURL : 'refresh'
}  