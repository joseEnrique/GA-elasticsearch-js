var googleapis = require('googleapis'),
    JWT = googleapis.auth.JWT,
    analytics = googleapis.analytics('v3');

var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
  host: '192.168.122.102:9200',
  log: 'trace'
});

var SERVICE_ACCOUNT_EMAIL = 'ga-607@isa2017-154510.iam.gserviceaccount.com';
var SERVICE_ACCOUNT_KEY_FILE = __dirname + '/google.pem';


var authClient = new JWT(
    SERVICE_ACCOUNT_EMAIL,
    SERVICE_ACCOUNT_KEY_FILE,
    null,
    ['https://www.googleapis.com/auth/analytics.readonly']
);

authClient.authorize(function(err, tokens) {
    if (err) {
        console.log(err);
        return;
    }

    analytics.data.ga.get({ 
        auth: authClient,
        'ids': 'ga:82818154',
        'start-date': '2016-01-19',
        'end-date': '2016-01-19',
        'metrics': 'ga:avgServerConnectionTime,ga:avgPageLoadTime,ga:avgServerResponseTime',
    }, function(err, result) {

	client.create({
		  index: 'metrics',
		  type: 'metric',
		  id: '1',
		  body: {
		    title: 'ga:avgServerConnectionTime',
		    metric: result.totalsForAllResults['ga:avgServerConnectionTime'].toString(),
		  }
		});

		client.create({
		  index: 'metrics',
		  type: 'metric',
		  id: '2',
		  body: {
		    title: 'ga:avgPageLoadTime',
		    metric: result.totalsForAllResults['ga:avgPageLoadTime'].toString(),
		  }
		});


		client.create({
		  index: 'metrics',
		  type: 'metric',
		  id: '3',
		  body: {
		    title: 'ga:avgServerResponseTime',
		    metric: result.totalsForAllResults['ga:avgServerResponseTime'].toString(),
		  }
		});

        
        console.log(result.totalsForAllResults['ga:avgPageLoadTime']);
    });
});


//https://ga-dev-tools.appspot.com/query-explorer/