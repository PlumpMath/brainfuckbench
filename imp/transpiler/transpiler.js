(function () {
	'use strict'

	const ITERATIONS_MAX = 1000

	function compile (source, { memorySize }) {
		const header = `var m = new Uint8Array(${memorySize});\nvar p = 0;\nvar s = 0;\nvar o = [];`
		const footer = 'return { output: o, memory: m }'
		const mapping = new Map([
			['+', 'm[p]++;'],
			['-', 'm[p]--;'],
			['>', `p++;\nif (p >= ${memorySize}) { return { output: o, memory: m, error: "pointer out of bounds" }; }`],
			['<', 'p--;\nif (p < 0) { return { output: o, memory: m, error: "pointer out of bounds" }; }'],
			['.', 'o.push(m[p]);'],
			[',', 'm[p] = input[ip]; ip++;'],
			['[', `while (m[p]) {\ns++;\nif (s > ${ITERATIONS_MAX}) {\nreturn { output: o, memory: m, error: "timeout" };\n}`],
			[']', '}']
		])

		const commands = source.split('')
		const translated = commands.map((char) => mapping.get(char))
		const body = translated.join('\n')

		const jsSource = `${header}${body}${footer}`

		return new Function('input', jsSource)
	}

	function execute (compiled, input) {
		return compiled(input)
	}

	window.bf = window.bf || {}
	window.bf.imp = window.bf.imp || {}
	window.bf.imp.transpiler = {
		name: 'transpiler',
		compile,
		execute
	}
})();