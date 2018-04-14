var http = require('http');
var Iconv = require('iconv').Iconv;
var cheerio = require('cheerio');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();

/**
 * This object makes requests to website.
 */
var gcmap = {
	// this is our cache of airports data
	data: {},

	// here will be stored array of airports which were queried but not found
	failedRequestsCache: {},

	/**
	 * Query www.gcmap.com by IATA code for latest information.
	 * Error reporting is a bit enhanced over ordinary http.request():
	 *   non-200 response will be treated as error, whilst the content is still
	 *   passed to callback.
	 */
	query: function gcmap_query(airport, cb) {
		var data,
		req = http.request({
			host: 'www.gcmap.com',
			path: '/airport/' + airport,
			encoding: null
		}, function(res) {
			res.on('data', function(chunk) {
				if (data) {
					data = Buffer.concat([data, chunk]);
				} else {
					data = chunk;
				}
			});
			res.on('end', function() {
				var err = null;
				if (200 != res.statusCode) {
					err = new Error("unexpected response code " + res.statusCode);
					err.code = 404;
				}
				cb(err, res, Iconv('iso-8859-1', 'utf8').convert(data).toString());
			});
		});

		req.on('error', function(e) { cb(e, res, null); });
		req.end();
		return req;
	},

	/**
	 * Parse gathered data into consumable chunks.
	 * Raw result of this func should be fine to send to end user.
	 */
	_parseHTML: function airports_parseHTML (html) {
		var $ = cheerio.load(html), $vcard = $('.vcard');
		var name = $vcard.find('.org').first(),
			lat = $vcard.find('.latitude').first(),
			lon = $vcard.find('.longitude').first(),
			tz = $vcard.find('.tz').first();
		return {
			name: name.text(),
			lat: lat.parent().text(),
			lon: lon.parent().text(),
			tz: tz.parent().text()
		};
	},

	/**
	 * Either get cached airport data, or query www.gcmap.com for
	 * data if cache has expired or never existed.
	 */
	get: function gcmap_get(airport, cb) {
		var data = gcmap.data[airport], now = new Date();
		if (gcmap.failedRequestsCache[airport]) {
			process.nextTick(function() { cb(gcmap.failedRequestsCache[airport], ""); });
		} else if (data && data.expires_at > now && data.content) {
			process.nextTick(function() { cb(null, data.content); });
		} else {
			gcmap.query(airport, function(err, res, html) {
				var content, twoMonthLater = new Date();
				twoMonthLater.setMonth(twoMonthLater.getMonth() + 2);
				if (err) {
					gcmap.failedRequestsCache[airport] = err;
					cb(err, html);
				} else {
					content = gcmap._parseHTML(html);
					gcmap.data[airport] = {
						queried_at: new Date(),
						expires_at: twoMonthLater,
						content: content
					};
					cb(null, content);
				}
			});
		}
	},

	/**
	 * Some kind of cache remover.
	 */
	expire: function gcmap_expire(airport, cb) {
		var data = gcmap.data[airport];
		var oneSecondAgo = new Date();
		oneSecondAgo.setSeconds(oneSecondAgo.getSeconds() - 1);
		if (data) {
			data.expires_at = oneSecondAgo;
		}
	}
};

var airports = {
	data: {},

	get: function airports_get(id, cb) {
		var airport = airports.data[id];
		if (airport) {
			process.nextTick(function() { cb(null, airport); });
			return;
		}
		gcmap.get(id, function(err, airport) {
			if (!err) { airports.data[id] = airport; }
			cb(err, airport);
		});
	},

	validate: function airports_validate(data) {
		var validated = {}, geo, tz;

		function validateGeo (geo, range) {
			var parsed = parseFloat(geo, 10);
			if (isNaN(parsed)) {
				throw new Error('could not parse float');
			}
			var sign = parsed < 0 ? -1 : 1;
			// Math.round is used to eliminate small error caused by rounding:
			// e.g. 0.2 is not the same as 0.20000000000284
			var abs = Math.abs(Math.round(parsed * 1000000.));
			if (abs > range * 1000000) {
				throw new Error('degrees must be in range of -' + range + ' to ' + range);
			}
			return { sign: sign, abs: abs, parsed: parsed };
		}

		function formatGeo (sign, abs, positive, negative) {
			var deg = Math.floor(abs / 1000000) + '°';
			var min = Math.floor(((abs / 1000000) - Math.floor(abs / 1000000)) * 60)  + "'";
			var sec = Math.floor(((((abs / 1000000) - Math.floor(abs / 1000000)) * 60) - Math.floor(((abs / 1000000) - Math.floor(abs / 1000000)) * 60)) * 100000) * 60 / 100000 + '"';
			return deg + min + sec + (sign >= 0 ? positive : negative);
		}

		if (data.name) {
			if (!/^[a-zA-Z\s\d]+$/.test(data.name)) {
				throw new Error("name must consist of latin words & numbers only");
			}
			validated.name = data.name;
		}
		if (data.lat) {
			geo = validateGeo(data.lat, 90);
			validated.lat = formatGeo(geo.sign, geo.abs, 'N', 'S') + " (" + geo.parsed + ")";
		}
		if (data.lon) {
			geo = validateGeo(data.lon, 180);
			validated.lon = formatGeo(geo.sign, geo.abs, 'E', 'W') + " (" + geo.parsed + ")";
		}
		if (data.tz) {
			tz = parseInt(data.tz, 10);
			if (isNaN(tz)) {
				throw new Error("timezone is expected to be integer offset from UTC");
			}
			validated.tz = "UTC" + (tz >= 0 ? '+' : '') + tz;
		}
		return validated;
	},

	set: function airports_set(id, data) {
		var airport = airports.data[id];
		if (!airport) {
			// The only way UI allows to update airport is through
			// editing previous searches. So keep it simple. Otherwise this
			// function would become async as we need to pull data from GCMap.
			throw new Error("try to get new airport before updating its data");
		}
		var validatedData = airports.validate(data);
		airports.data[id] = {
			name: validatedData.name || airport.name,
			lat: validatedData.lat || airport.lat,
			lon: validatedData.lon || airport.lon,
			tz: validatedData.tz || airport.tz
		};
	}
};

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(session({ secret: 'airports are funny', resave: false, saveUninitialized: false }));

app.set('views', './views');
app.engine('jade', require('jade').__express);
app.set('view engine', 'jade');

app.get('/airports/:code.json', function(req, res) {
	if (!/^[A-Z][A-Z][A-Z]$/.test(req.params.code)) {
		res.status(404).send({ error: "page not found" });
		return;
	}
	airports.get(req.params.code, function(err, content) {
		if (err) {
			if (404 == err.code) {
				res.status(404).send({ error: "specified airport not found" });
			} else {
				res.status(400).send({ error: "sorry, something went wrong" });
			}
			return;
		}
		res.send(content);
	});
});

app.patch('/airports/:code.json', function(req, res) {
	try {
		airports.set(req.params.code, req.body);
		res.redirect(303, '/airports/' + req.params.code + '.json');
	} catch (e) {
		res.status(400).send({ error: e.message });
	}
});

app.get('/', function(req, res) {
	res.render('index', { title: 'Airports Data' });
});

app.listen(3000);

