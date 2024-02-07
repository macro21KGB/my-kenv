// Name: Get a math symbol

import "@johnlindquist/kit"

const allMathSymbols = {
    "espilon": "ε",
    "pi": "π",
    "theta": "θ",
    "sigma": "Σ",
    "delta": "Δ",
    "lambda": "λ",
    "gamma": "γ",
    "omega": "ω",
    "alpha": "α",
    "beta": "β",
    "zeta": "ζ",
    "rho": "ρ",
    "phi": "φ",
    "psi": "ψ",
    "chi": "χ",
    "tau": "τ",
    "mu": "μ",
    "nu": "ν",
    "sum": "∑",
    "product": "∏",
    "exponent_2": "²",
    "exponent_3": "³",
    "square_root": "√",

}


const mathSymbol = await arg("What math symbol do you want to see?", Object.keys(allMathSymbols))

clipboard.writeText(allMathSymbols[mathSymbol])