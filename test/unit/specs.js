(function () {
	'use strict'

	const specs = {
		base: [
			['', [0, 0, 0], []],
			['+', [1, 0, 0], []],
			['-', [255, 0, 0], []],
			['>', [0, 0, 0], []],
			['>+', [0, 1, 0], []],
			['>>+.+', [0, 0, 2], [1]],
			['>+<.', [0, 1, 0], [0]],
			['[]', [0, 0, 0], []],
			['+++[.-]', [0, 0, 0], [3, 2, 1]],
			['+++[>+++[.-]<-]', [0, 0, 0], [3, 2, 1, 3, 2, 1, 3, 2, 1]]
		],
		errors: [
			['<', [0, 0, 0], [], 'pointer out of bounds'],
			['>>>>', [0, 0, 0], [], 'pointer out of bounds'],
			['+[]', [], [], 'timeout'],
			['++++[>++++[-]<-]', [], []],
			['+++++[>+++++[-]<-]', [], [], 'timeout']
		]
	}

	const imps = [
		bf.imp.functions,
		bf.imp.switch,
		bf.imp.transpiler,
		bf.imp.binarySearch
	]

	function run ({ compile }, source) {
		const options = {
			memorySize: 4,
			iterationsMax: 20
		}
		const compiled = compile(source, options)
		return compiled([])
	}

	beforeEach(() => {
		jasmine.addMatchers(bfTest.CustomMatchers)
	})

	imps.forEach((imp) => {
		describe(imp.name, () => {
			Object.keys(specs).forEach((name) => {
				const subSpecs = specs[name]

				describe(name, () => {
					subSpecs.forEach(([source, memory, output, error]) => {
						it(source, () => {
							const result = run(imp, source)

							expect(result.memory).toStartWith(memory)
							expect(result.output).toStartWith(output)
							expect(result.error).toEqual(error)
						})
					})
				})
			})
		})
	})
})()