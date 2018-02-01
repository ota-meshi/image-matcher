# image-matcher



# Unit Testing

image-matcher allows you to test Canvas and other image. image-matcher provide Jasmine matchers.  
can set a tolerance and perform comparison test.

```js
toImageMatch(actual, expected, {
	tolerance = 0, // accepts tolerance in pixels
	delta = 0, // the maximum delta between
	blurLevel = 0, // blur test lebel
} = {})
```
