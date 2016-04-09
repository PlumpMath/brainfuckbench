(function () {
	'use strict'

	const compile = (source) => {
		const stack = []

		return source.split('').map((char, index) => {
			switch (char) {
				case '+': return { opcode: 0 }
				case '-': return { opcode: 1 }
				case '>': return { opcode: 2 }
				case '<': return { opcode: 3 }
				case '.': return { opcode: 4 }
				case ',': return { opcode: 5 }
				case '[':
					const command = { opcode: 6, to: -1 }
					stack.push({ index, command })
					return command
				case ']':
					const pair = stack.pop()
					pair.command.to = index
					return { opcode: 7, to: pair.index }
			}
		})
	}

	const execute = (compiled, input, { memorySize, iterationsMax }) => {
		const memory = new Uint8Array(16)
		const output = []
		let pointer = 0
		let programCounter = 0
		let inputPointer = 0
		let iterations = 0

		while (programCounter < compiled.length) {
			const instruction = compiled[programCounter]

			switch (instruction.opcode) {
				case 0:
					memory[pointer]++
					break
				case 1:
					memory[pointer]--
					break
				case 2:
					pointer++
					if (pointer >= memorySize) {
						return {
							output,
							memory,
							error: 'pointer out of bounds'
						}
					}
					break
				case 3:
					pointer--
					if (pointer < 0) {
						return {
							output,
							memory,
							error: 'pointer out of bounds'
						}
					}
					break
				case 4:
					output.push(memory[pointer])
					break
				case 5:
					memory[pointer] = input[inputPointer]
					inputPointer++
					break
				case 6:
					if (memory[pointer] === 0) {
						programCounter = instruction.to
					}
					break
				case 7:
					if (memory[pointer] > 0) {
						programCounter = instruction.to
					}
					break
			}

			programCounter++

			iterations++
			if (iterations > iterationsMax) {
				return {
					output,
					memory,
					error: 'timeout'
				}
			}
		}

		return { output, memory }
	}

	window.bf = window.bf || {}
	window.bf.imp = window.bf.imp || {}
	window.bf.imp.switch = {
		name: 'switch',
		compile,
		execute
	}
})()