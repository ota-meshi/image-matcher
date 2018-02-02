# image-matcher

[![npm](https://img.shields.io/npm/l/image-matcher.svg)](https://www.npmjs.com/package/image-matcher)
[![npm](https://img.shields.io/npm/v/image-matcher.svg)](https://www.npmjs.com/package/image-matcher)
[![npm](https://img.shields.io/npm/dm/image-matcher.svg)](https://www.npmjs.com/package/image-matcher)
[![npm](https://img.shields.io/npm/dy/image-matcher.svg)](https://www.npmjs.com/package/image-matcher)
[![npm](https://img.shields.io/npm/dt/image-matcher.svg)](https://www.npmjs.com/package/image-matcher)  
[![NPM](https://nodei.co/npm/image-matcher.png?downloads=true&stars=true)](https://www.npmjs.com/package/image-matcher)


# Unit Testing

image-matcher allows you to test Canvas and other image. image-matcher provide Jasmine matchers.  
can set a tolerance and perform comparison test.

```js
toImageMatch(expected, {
	tolerance = 0, // accepts tolerance in pixels
	delta = 0, // the maximum delta between color distance
	blurLevel = 0, // blur test level
} = {})
```

# examples 

* [jasmine-example](https://ota-meshi.github.io/image-matcher/examples/jasmine-example.html)  
* [mocha-example](https://ota-meshi.github.io/image-matcher/examples/mocha-example.html)  


# Supported
jasmine >= 2.0.4
