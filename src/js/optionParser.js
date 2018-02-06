'use strict';

const browser = require('./browser');

function merge(a, ...args) {
	const ret = {};
	for (const k in a) {
		ret[k] = a[k];
	}
	args.forEach((arg) => {
		if (!arg) {
			return;
		}
		for (const k in a) {
			const v = arg[k];
			if (typeof v !== 'undefined') {
				ret[k] = v;
			}
		}
	});
	return ret;
}

module.exports = function(
		baseOption,
		{ie, ie6, ie7, ie8, ie9, ie10, ie11, edge, chrome, firefox, safari, opera, phantomjs} = {},
		{win, ios, mac, android, linux, bsd, solaris} = {}
) {
	const osOptions = {win, ios, mac, android, linux, bsd, solaris};
	const browserOption = {ie, ie6, ie7, ie8, ie9, ie10, ie11, edge, chrome, firefox, safari, opera, phantomjs};
	const osOption = osOptions[browser.osKind || ''] || {};
	if (browser.isIE) {
		const verKey = 'ie' + browser.appIEVersion;
		return merge(baseOption, browserOption.ie, browserOption[verKey], osOption, osOption.ie, osOption[verKey]);
	} else if (browser.isStandardBrowser) {
		const key = browser.userBrowser.toLowerCase();
		return merge(baseOption, browserOption[key], osOption, osOption[key]);
	}
	return merge(baseOption, osOption);
};