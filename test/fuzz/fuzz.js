(function () {
	'use strict'

	const { imp } = bf

	const generateCommand = (() => {
		const commands = '+-><.[]'

		return () => commands[Math.floor(Math.random() * commands.length)]
	})()

	function generateProgram () {
		const lengthMax = 20
		const nestingMax = 2
		const length = Math.floor(Math.random() * lengthMax)

		let source = ''
		let parens = 0

		while (source.length < length || parens > 0) {
			const command = generateCommand()

			if (command === '[') {
				if (parens > nestingMax) {
					continue
				} else {
					parens++
				}
			} else if (command === ']') {
				if (parens === 0) {
					continue
				} else {
					parens--
				}
			}

			source += command
		}

		return source
	}

	function arrayEquals (a, b) {
		if (a.length !== b.length) {
			return false
		}

		for (let i = 0; i < a.length; i++) {
			if (!Object.is(a[i], b[i])) {
				return false
			}
		}

		return true
	}

	function outcomeEquals (a, b) {
		if (a.error || b.error) {
			return a.error === b.error
		}

		return arrayEquals(a.memory, b.memory) &&
			arrayEquals(a.output, b.output)
	}

	function run ({ compile }, source) {
		const options = { memorySize: 8, iterationsMax: 1000 }
		const compiled = compile(source, options)
		return compiled([])
	}

	function compare (source) {
		const names = Object.keys(imp)
		const first = imp[names[0]]
		const firstResult = run(first, source)

		for (let i = 1; i < names.length; i++) {
			const candidate = imp[names[i]]
			const candidateResult = run(candidate, source)

			if (!outcomeEquals(firstResult, candidateResult)) {
				const errorText = `${first.name} and ${candidate.name} do not agree on ${source}`
				console.error(errorText)
				console.error('memory', firstResult.memory, 'output', firstResult.output)
				console.error('memory', candidateResult.memory, 'output', candidateResult.output)
				throw new Error(errorText)
			}
		}
	}

	function test () {
		const runs = 100

		for (let i = 0; i < runs; i++) {
			compare(generateProgram())
		}

		console.log('done; ran', runs, 'samples')
	}

	test()
})()