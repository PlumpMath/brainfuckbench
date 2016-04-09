(function () {
	'use strict'

	function toStartWith (util, customEqualityTesters) {
		return {
			compare (actual, expected) {
				if (actual.length < expected.length) {
					return {
						pass: false,
						message: `Expected at least ${expected.length} elements`
					};
				} else {
					const matching = expected.every((element, index) =>
						util.equals(actual[index], element)
					)

					return matching ? {
						pass: true,
						message: `Expected ${actual} not to start with ${expected}`
					} : {
						pass: false,
						message: `Expected ${actual} to start with ${expected}`
					}
				}
			}
		}
	}

	window.bfTest = window.bfTest || {}
	window.bfTest.CustomMatchers = {
		toStartWith: toStartWith
	}
})()
