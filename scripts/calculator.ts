import "@johnlindquist/kit"

// Name: Calculator
// Description: A simple calculator to evaluate JavaScript expressions

// Global Functions
let {
    ceil, floor, round, trunc, abs, PI,
    sin, cos, tan, log, log2, log10, exp, sqrt, cbrt, pow
} = Math

// Factorial
function fact(num: number, memo: { [key: number]: number } = {}) {
    if (num in memo) return memo[num]
    if (num <= 1) return 1
    return memo[num] = num * fact(num - 1, memo)
}


let selected = await arg({
    placeholder: 'Expression ...',
    enter: 'Copy & Exit'
}, async (input) => {
    try {
        return `<p class='text-center text-xl p-2'>${evalExp(input)}</p>`
    } catch (error) {
        return "<p class='text-center text-red-600'>Invalid Expression</p>"
    }
})

if (selected) await copy(evalExp(selected))

function evalExp(input: string) {
    let value = eval(`(${input})`)
    if (typeof value == 'number') return (value % 1 != 0 ? value.toFixed(2) : value) + ''
    //@ts-ignore
    if (typeof value == 'array') return JSON.stringify(value, null, 2)
    if (typeof value == 'object') return JSON.stringify(value, null, 2)
    if (typeof value == 'function') return ''
}
