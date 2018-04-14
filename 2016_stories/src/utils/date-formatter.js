const formatSpecifiers = {
    Y: 'Year',
    b: 'MonthName',
    m: 'MonthNumber',
    d: 'DayOfMonth',
    H: 'Hours',
    M: 'Minutes',
    S: 'Seconds'
};

const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

function zeropad(num) {
    let s = '' + num;
    return s.length > 1 ? s : '0' + s;
}

export default class DateFormatter {
    constructor(format) {
        this._fmt = format;
    }

    /**
     * Formats given date based on format.
     * Complies partly to strftime().
     * @see http://www.cplusplus.com/reference/ctime/strftime/ for reference
     */
    format(dateObj) {
        return this._fmt.replace(/%(\w)/g, (token, spec) => {
            const method = 'get' + formatSpecifiers[spec];
            if (method in this) {
                return this[method](dateObj);
            }
            return token;
        })
    }

    getYear(dateObj) {
        return dateObj.getFullYear();
    }
    getMonthNumber(dateObj) {
        return zeropad(dateObj.getMonth() + 1);
    }
    getMonthName(dateObj) {
        return monthNames[dateObj.getMonth()];
    }
    getDayOfMonth(dateObj) {
        return zeropad(dateObj.getDate());
    }
    getHours(dateObj) {
        return zeropad(dateObj.getHours());
    }
    getMinutes(dateObj) {
        return zeropad(dateObj.getMinutes());
    }
    getSeconds(dateObj) {
        return zeropad(dateObj.getSeconds());
    }
}
