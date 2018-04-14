var airports = {
	cache: {},

	get: function airports_get (code, cb) {
		if (airports.cache[code]) {
			setTimeout(function () {
				cb(null, airports.cache[code]);
			}, 0);
			return;
		}
		return $.ajax("/airports/" + code + ".json", {
			success: function (data, status, jqXHR) {
				airports.cache[code] = data;
				cb(null, data);
			},
			error: function (jqXHR, textStatus, errorThrown) {
				cb(new Error(errorThrown), null);
			}
		});
	},
	set: function airports_set (code, data, done) {
		$.ajax("/airports/" + code + ".json", {
			type: "PATCH",
			contentType: "application/json",
			data: JSON.stringify(data),

			success: function (responseText, status, jqXHR) {
				done(null, responseText);
			},
			error: function (jqXHR, textStatus, errorThrown) {
				done(new Error(errorThrown), null);
			}
		});
	}
};

$(document).ajaxStart(function () { $("#throbber").show(); });
$(document).ajaxStop(function () { $("#throbber").hide(); });

function Histry (storage) {
	if (!(this instanceof Histry)) { return new Histry(storage); }
	var that = this;
	var history = storage.getItem("history");
	this.items = history ? JSON.parse(history) : [];

	this.save = function Histry_save () {
		storage.setItem("history", JSON.stringify(this.items));
		$(that).trigger("update");
	};

	var initRequests = [];
	$(this.items).each(function (idx, item) {
		initRequests.push(airports.get(item.code, function (err, content) {
			$.extend(that.items[idx], content);
		}));
	});
	$.when.apply($, initRequests).then(function () {
		$(hst).trigger("update");
	});
}

$.extend(Histry.prototype, {
	add: function Histry_add (code, data) {
		var dt = JSON.stringify(new Date());
		this.items.unshift({
			created_at: dt.substring(1, dt.length - 1),
			code: code,
			name: data.name,
			lat: data.lat,
			lon: data.lon,
			tz: data.tz
		});
		this.save();
	},
	pull: function Histry_remove (code) {
		var l = this.items.length;
		while (l--) {
			if (code == this.items[l].code) {
				this.items.splice(l, 1);
			}
		}
		this.save();
	},
	edit: function Histry_update (code, data) {
		var l = this.items.length;
		while (l--) {
			if (code == this.items[l].code) {
				$.extend(this.items[l], data);
			}
		}
		this.save();
	},
	render: function Histry_render ($node) {
		var $tpl = $("#tpl_row").html(), tpl = "";
		$(this.items).each(function (idx, item) { tpl += Mustache.render($tpl, item); });
		$("tbody", $node).empty().html(tpl);
		$("tfoot", $node).toggle(!this.items.length);
	}
});

var hst = new Histry(localStorage);

$("#search .code").on("input", function (e) {
	if (this.value.match(/[^A-Z]/)) { this.value = this.value.replace(/[^A-Z]/g, ''); }
});

$("#search").on("submit", function (e) {
	e.preventDefault();
	var $code = $(".code", e.target), code = $code.val();
	airports.get(code, function (err, content) {
		if (err) {
			$("#errors").text(err).parent().removeClass("hidden");
		} else {
			hst.add(code, content);
			$("#errors").parent().addClass("hidden");
		}
	});
	hst.pull(code);
});

$("#history").on("focus", "td[contenteditable]", function (e) {
	var t = e.target, $t = $(t), v = $t.text();
	$t.data('focused', true);
	switch ($t.data('fieldName')) {
	case 'name':
		$t.data('prevVal', v).data('match', v).text(v);
		break;
	case 'lat':
	case 'lon':
		var match = /\((-?[\d\.]+)\)/.exec(v);
		$t.data('prevVal', v).data('match', match[1]).text(match[1]);
		break;
	case 'tz':
		var match = /UTC([-+]\d+)/.exec(v);
		$t.data('prevVal', v).data('match', match[1]).text(match[1]);
		break;
	}
});

$("#history").on("blur", "td[contenteditable]", function (e) {
	var t = e.target, $t = $(t), $row = $t.parent(),
	k = $t.data("fieldName"), v = $t.text(), patch = {};
	patch[k] = v;
	if (!$t.data("focused")) { return; }
	if ($t.data("match") == v) {
		$t.text($t.data("prevVal"));
		return;
	}
	$t.data("focused", false);
	$t.addClass("text-muted");
	var code = $row.data("airportCode");
	airports.set(code, patch, function (err, content) {
		if (err) {
			hst.render($("#history"));
			$("#errors").text(err).parent().removeClass("hidden");
		} else {
			hst.edit(code, content);
			$("#errors").parent().addClass("hidden");
		}
	});
});

$("#history").on("click", "button", function (e) {
	var t = e.target, $t = $(t), $row = $t.parents("tr");
	$row.hide('slow', function () {
		hst.pull($row.data('airportCode'));
	});
});

$(hst).on("update", function () {
	hst.render($("#history"));
});

