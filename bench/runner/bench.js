(function () {
	'use strict'

	const suite = new Benchmark.Suite

	const imps = [bf.imp.functions, bf.imp.switch, bf.imp.transpiler]

	const options = {
		memorySize: 4,
		iterationsMax: 1000
	}

	const source = '++++++[>++++++[-]<-]'

	let phonyVar = 0

	imps.forEach(({ name, compile }) => {
		suite.add(`compile & run ${name}`, () => {
			const { memory } = compile(source, options)([])
			phonyVar += memory[0]
		})
	})

	imps.forEach(({ name, compile }) => {
		const compiled = compile(source, options)

		suite.add(`precompiled & run ${name}`, () => {
			const { memory } = compiled([])
			phonyVar += memory[0]
		})
	})

	suite.on('cycle', function (event) {
		console.log(String(event.target))
	})

	suite.on('complete', function () {
		console.log('Fastest is ', this.filter('fastest').map('name'));

		// have to use these values to make sure the functions don't get optimised away
		console.log('phonyVar', phonyVar)
	})

	suite.run({ async: true })
})()