(function () {
	'use strict'

	const compile = (source, options) => {
		const stack = []

		const compiled = source.split('').map((char, index) => {
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

		return (input) => execute(compiled, input, options)
	}

	const execute = (compiled, input, { memorySize, iterationsMax }) => {
		const memory = new Uint8Array(memorySize)
		const output = []
		let pointer = 0
		let programCounter = 0
		let inputPointer = 0
		let iterations = 0

		while (programCounter < compiled.length) {
			const instruction = compiled[programCounter]

			const { opcode } = instruction

			if (opcode < 4) {
				if (opcode < 2) {
					if (opcode === 0) {
						memory[pointer]++
					} else {
						memory[pointer]--
					}
				} else {
					if (opcode === 2) {
						pointer++
						if (pointer >= memorySize) {
							return {
								output,
								memory,
								error: 'pointer out of bounds'
							}
						}
					} else {
						pointer--
						if (pointer < 0) {
							return {
								output,
								memory,
								error: 'pointer out of bounds'
							}
						}
					}
				}
			} else {
				if (opcode < 6) {
					if (opcode === 4) {
						output.push(memory[pointer])
					} else {
						memory[pointer] = input[inputPointer]
						inputPointer++
					}
				} else {
					if (opcode === 6) {
						if (memory[pointer] === 0) {
							programCounter = instruction.to
						}
					} else {
						if (memory[pointer] > 0) {
							programCounter = instruction.to
						}

						iterations++
						if (iterations > iterationsMax) {
							return {
								output,
								memory,
								error: 'timeout'
							}
						}
					}
				}
			}

			programCounter++
		}

		return { output, memory }
	}

	window.bf = window.bf || {}
	window.bf.imp = window.bf.imp || {}
	window.bf.imp.binarySearch = {
		name: 'binary-search',
		compile
	}
})()