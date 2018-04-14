'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var formatSpecifiers = {
    Y: 'Year',
    b: 'MonthName',
    m: 'MonthNumber',
    d: 'DayOfMonth',
    H: 'Hours',
    M: 'Minutes',
    S: 'Seconds'
};

var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function zeropad(num) {
    var s = '' + num;
    return s.length > 1 ? s : '0' + s;
}

var DateFormatter = function () {
    function DateFormatter(format) {
        _classCallCheck(this, DateFormatter);

        this._fmt = format;
    }

    /**
     * Formats given date based on format.
     * Complies partly to strftime().
     * @see http://www.cplusplus.com/reference/ctime/strftime/ for reference
     */


    _createClass(DateFormatter, [{
        key: 'format',
        value: function format(dateObj) {
            var _this = this;

            return this._fmt.replace(/%(\w)/g, function (token, spec) {
                var method = 'get' + formatSpecifiers[spec];
                if (method in _this) {
                    return _this[method](dateObj);
                }
                return token;
            });
        }
    }, {
        key: 'getYear',
        value: function getYear(dateObj) {
            return dateObj.getFullYear();
        }
    }, {
        key: 'getMonthNumber',
        value: function getMonthNumber(dateObj) {
            return zeropad(dateObj.getMonth() + 1);
        }
    }, {
        key: 'getMonthName',
        value: function getMonthName(dateObj) {
            return monthNames[dateObj.getMonth()];
        }
    }, {
        key: 'getDayOfMonth',
        value: function getDayOfMonth(dateObj) {
            return zeropad(dateObj.getDate());
        }
    }, {
        key: 'getHours',
        value: function getHours(dateObj) {
            return zeropad(dateObj.getHours());
        }
    }, {
        key: 'getMinutes',
        value: function getMinutes(dateObj) {
            return zeropad(dateObj.getMinutes());
        }
    }, {
        key: 'getSeconds',
        value: function getSeconds(dateObj) {
            return zeropad(dateObj.getSeconds());
        }
    }]);

    return DateFormatter;
}();

exports.default = DateFormatter;