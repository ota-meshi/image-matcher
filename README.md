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
toMatchImage(expected, {
	tolerance = 0, // accepts tolerance in pixels
	delta = 0, // the maximum color distance between actual and expected
	blurLevel = 0, // blur test level
} = {})
```

# CDN

```html
<script src="https://unpkg.com/image-matcher@0.1"></script>
```

# examples 

* [jasmine-example](https://ota-meshi.github.io/image-matcher/examples/jasmine-example.html)  
* [mocha-chai-example](https://ota-meshi.github.io/image-matcher/examples/mocha-chai-example.html)  


# Supported
jasmine >= 2.0.4
