(function () {
	'use strict'

	const specs = [
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
	]

	const imps = [bf.imp.functions, bf.imp.switch, bf.imp.transpiler]

	function run ({ compile, execute }, source) {
		const options = { memorySize: 16 }
		const compiled = compile(source, options)
		return execute(compiled, [], options)
	}

	beforeEach(() => {
		jasmine.addMatchers(bfTest.CustomMatchers)
	})

	imps.forEach((imp) => {
		describe(imp.name, () => {
			specs.forEach(([source, memory, output]) => {
				it(source, () => {
					const result = run(imp, source)

					expect(result.memory).toStartWith(memory)
					expect(result.output).toStartWith(output)
				})
			})
		})
	})
})()