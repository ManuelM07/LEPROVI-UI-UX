# Let's Program Visually - LEPROVI

With LEPROVI we can program visually, through nodes, which we can convert to code for languages such as Python and JavaScript. 
To use LEPROVI, you must use its api:
[LEPROVI-api](https://github.com/ManuelM07/LEPROVI-api)

# Run app

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

# Use of LEPROVI

## Types of nodes

| node | value | # input | input | # output | output 
| :--- | :--- | :--- | :--- | :--- | :--- |
| Assign | var name [a-z]+ | 1 | any node | 1 | value
| Comparison Operators | A comparison operator | 0 | N/A | 1 | value
| Else | number/string/function | 1 | node if | 1 | value
| For | number/string/function | 1 | number (inicio) | 1 | value 
| | | 2 | number (fin) | |
| If | number/string/function | 1 | number/string | 1 | value
| | | 2 | node ComOp | 2 | If -> Else
| | | 3 | number/string | |
| Math Operations | type operation & value | 1 | number | 1 | operation result
| | | 2 | number | | |
| Number | number | 0 | N/A | 1 | value
| Print | N/A | 1 | any node | 0 | input value
| String | string | 0 | N/A | 1 | value
| String Operations | type operation | 1 | string | 1 | value

A node should have only the inputs and outputs listed above.
For the correct operation of the application, you must correctly follow the rules in the table above.
