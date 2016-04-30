Brainfuck implementations & benchmarks
======================================

When trying to build interpreters and emulators, there are usually several ways of implementing their main loop. 
However, it's not clear which implementation gives the best results in terms of speed - which tends to be a crucial
element.

The purpose of this project is to compare several different implementations of brainfuck and to find out which 
is the fastest one. Brainfuck is chosen because it is a small enough language to allow for multiple 
implementations without much effort.

The same techniques of writing the main loop can be applied to other interpreters and emulators.

The different implementations thus far are:

+ switch based 

This is the most common approach. The main loop looks something on the lines of:

```javascript
while (running) {
	instruction = fetchInstruction()

	switch (instruction) {
		case 0x00: // ...
		case 0x01: // ...
		case 0x02: // ...
		case 0x03: // ...
	}
}
```

+ binary-search based

This is similar to the switch based approach except that the number of comparisons
required until the correct case is found is logarithmic in the worst case. The
code that this pattern requires can reach unmanageable sizes:

```javascript
while (running) {
	instruction = fetchInstruction()

	if (instruction < 0x02) {
		if (instruction < 0x01) {
			// 0x00 ...
		} else {
			// 0x01 ...
		}
	} else {
		if (instruction < 0x03) {
			// 0x02 ...
		} else {
			// 0x03 ...
		}
	}
}
```

+ mapping/functions based

This is based on a mapping from instructions to functions. The gist of it is:

```javascript
map = {
	0x00: () => { /* ... */ }
	0x01: () => { /* ... */ }
	0x02: () => { /* ... */ }
	0x03: () => { /* ... */ }
}

while (running) {
	instruction = fetchInstruction()
	map[instruction]()	
}
```

+ using a transpiler

Some languages/machines fare well to a static recompilation. This needs a more ample compilation phase, 
but does away with the main loop altogether. In brainfuck's case `+-` trivially translate to increments
and decrements of memory cells, `><` to increments/decrements of the memory pointer and `[]` are 
rewritten as while loops and so on.