(function () {
	'use strict'

	const compile = (() => {
		const mapping = new Map([
			['+', () => ({ opcode: 0 })],
			['-', () => ({ opcode: 1 })],
			['>', () => ({ opcode: 2 })],
			['<', () => ({ opcode: 3 })],
			['.', () => ({ opcode: 4 })],
			[',', () => ({ opcode: 5 })],
			['[', (stack, index) => {
				const command = { opcode: 6, to: -1 }
				stack.push({ index, command })
				return command
			}],
			[']', (stack, index) => {
				const pair = stack.pop()
				pair.command.to = index
				return { opcode: 7, to: pair.index }
			}]
		])

		return (source) => {
			const stack = []

			return source.split('').map((char, index) =>
				mapping.get(char)(stack, index)
			)
		}
	})()

	const execute = (compiled, input, options) => {
		const memory = new Uint8Array(options.memorySize)
		const output = []
		let pointer = 0
		let programCounter = 0
		let inputPointer = 0
		let error = null

		const mapping = [
			() => { memory[pointer]++ },
			() => { memory[pointer]-- },
			() => { pointer++ },
			() => {
				pointer--
				if (pointer < 0) {
					error = 'pointer out of bounds'
				}
			},
			() => { output.push(memory[pointer]) },
			() => {
				memory[pointer] = input[inputPointer]
				inputPointer++
			},
			({ to }) => {
				if (memory[pointer] === 0) {
					programCounter = to
				}
			},
			({ to }) => {
				if (memory[pointer] > 0) {
					programCounter = to
				}
			}
		]

		while (programCounter < compiled.length) {
			const command = compiled[programCounter]

			mapping[command.opcode](command)

			if (error) {
				return { output, memory, error }
			}

			programCounter++
		}

		return { output, memory }
	}

	window.bf = window.bf || {}
	window.bf.imp = window.bf.imp || {}
	window.bf.imp.functions = {
		name: 'functions',
		compile,
		execute
	}
})()