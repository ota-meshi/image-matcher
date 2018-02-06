'use strict';

const browser = {};
if (typeof navigator !== 'undefined') {
	const ua = navigator.userAgent.toLowerCase();
	const ver = navigator.appVersion.toLowerCase();
 
	// IE(11以外)
	const isMSIE = (ua.indexOf('msie') > -1) && (ua.indexOf('opera') === -1);
	// IE6
	browser.isIE6 = isMSIE && (ver.indexOf('msie 6.') > -1);
	// IE7
	browser.isIE7 = isMSIE && (ver.indexOf('msie 7.') > -1);
	// IE8
	browser.isIE8 = isMSIE && (ver.indexOf('msie 8.') > -1);
	// IE9
	browser.isIE9 = isMSIE && (ver.indexOf('msie 9.') > -1);
	// IE10
	browser.isIE10 = isMSIE && (ver.indexOf('msie 10.') > -1);
	// IE11
	browser.isIE11 = (ua.indexOf('trident/7') > -1);
	// IE
	browser.isIE = isMSIE || browser.isIE11;
	// Edge
	browser.isEdge = (ua.indexOf('edge') > -1);
 
	// Google Chrome
	browser.isChrome = (ua.indexOf('chrome') > -1) && (ua.indexOf('edge') === -1);
	// Firefox
	browser.isFirefox = (ua.indexOf('firefox') > -1);
	// Safari
	browser.isSafari = (ua.indexOf('safari') > -1) && (ua.indexOf('chrome') === -1) && (ua.indexOf('phantomjs') === -1);
	// Opera
	browser.isOpera = (ua.indexOf('opera') > -1);

	browser.isPhantomjs = (ua.indexOf('phantomjs') > -1);

	let os;
	let osKind;
	if (ua.match(/Win(dows )?NT 10\.0/i)) {
		os = 'Windows 10';				// Windows 10 の処理
		osKind = 'win';
	} else if (ua.match(/Win(dows )?NT 6\.3/i)) {
		os = 'Windows 8.1';				// Windows 8.1 の処理
		osKind = 'win';
	} else if (ua.match(/Win(dows )?NT 6\.2/i)) {
		os = 'Windows 8';				// Windows 8 の処理
		osKind = 'win';
	} else if (ua.match(/Win(dows )?NT 6\.1/i)) {
		os = 'Windows 7';				// Windows 7 の処理
		osKind = 'win';
	} else if (ua.match(/Win(dows )?NT 6\.0/i)) {
		os = 'Windows Vista';				// Windows Vista の処理
		osKind = 'win';
	} else if (ua.match(/Win(dows )?NT 5\.2/i)) {
		os = 'Windows Server 2003';			// Windows Server 2003 の処理
		osKind = 'win';
	} else if (ua.match(/Win(dows )?(NT 5\.1|XP)/i)) {
		os = 'Windows XP';				// Windows XP の処理
		osKind = 'win';
	} else if (ua.match(/Win(dows)? (9x 4\.90|ME)/i)) {
		os = 'Windows ME';				// Windows ME の処理
		osKind = 'win';
	} else if (ua.match(/Win(dows )?(NT 5\.0|2000)/i)) {
		os = 'Windows 2000';				// Windows 2000 の処理
		osKind = 'win';
	} else if (ua.match(/Win(dows )?98/i)) {
		os = 'Windows 98';				// Windows 98 の処理
		osKind = 'win';
	} else if (ua.match(/Win(dows )?NT( 4\.0)?/i)) {
		os = 'Windows NT';				// Windows NT の処理
		osKind = 'win';
	} else if (ua.match(/Win(dows )?95/i)) {
		os = 'Windows 95';				// Windows 95 の処理
		osKind = 'win';
	} else if (ua.match(/iPhone|iPad/i)) {
		os = 'iOS';					// iOS (iPhone, iPod touch, iPad) の処理
		osKind = 'ios';
	} else if (ua.match(/Mac|PPC/i)) {
		os = 'Mac OS';					// Macintosh の処理
		osKind = 'mac';
	} else if (ua.match(/Android ([\.\d]+)/i)) {
		os = 'Android ' + RegExp.$1;			// Android の処理
		osKind = 'android';
	} else if (ua.match(/Linux/i)) {
		os = 'Linux';					// Linux の処理
		osKind = 'linux';
	} else if (ua.match(/^.*\s([A-Za-z]+BSD)/i)) {
		os = RegExp.$1;					// BSD 系の処理
		osKind = 'bsd';
	} else if (ua.match(/SunOS/i)) {
		os = 'Solaris';					// Solaris の処理
		osKind = 'solaris';
	} else {
		os = 'unknown';					// 上記以外 OS の処理
	}
	browser.os = os;
	browser.osKind = osKind;
	
	if (browser.isIE) {
		browser.isStandardBrowser = true;
		browser.userBrowser = 'IE';
		browser.appIEVersion = '';
		if (browser.isIE6) {
			browser.userBrowser = 'IE6';
			browser.appIEVersion = '6';
		} else
		if (browser.isIE7) {
			browser.userBrowser = 'IE7';
			browser.appIEVersion = '7';
		} else
		if (browser.isIE8) {
			browser.userBrowser = 'IE8';
			browser.appIEVersion = '8';
		} else
		if (browser.isIE9) {
			browser.userBrowser = 'IE9';
			browser.appIEVersion = '9';
		} else
		if (browser.isIE10) {
			browser.userBrowser = 'IE10';
			browser.appIEVersion = '10';
		} else
		if (browser.isIE11) {
			browser.userBrowser = 'IE11';
			browser.appIEVersion = '11';
		}
	} else
	if (browser.isEdge) {
		browser.isStandardBrowser = true;
		browser.userBrowser = 'Edge';
	} else
	if (browser.isChrome) {
		browser.isStandardBrowser = true;
		browser.userBrowser = 'Chrome';
	} else
	if (browser.isFirefox) {
		browser.isStandardBrowser = true;
		browser.userBrowser = 'Firefox';
	} else
	if (browser.isSafari) {
		browser.isStandardBrowser = true;
		browser.userBrowser = 'Safari';
	} else
	if (browser.isOpera) {
		browser.isStandardBrowser = true;
		browser.userBrowser = 'Opera';
	} else
	if (browser.isPhantomjs) {
		browser.isStandardBrowser = true;
		browser.userBrowser = 'PhantomJS';
	} else {
		browser.userBrowser = 'unknown';
	}
} else {
	browser.userBrowser = 'Node.js';
}
module.exports = browser;