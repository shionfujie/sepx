setup();

function setup() {
    addListeners();
}

var capturing = undefined
function addListeners() {
    for (const el of document.querySelectorAll("p,div,blockquote")) {
        el.addEventListener("mouseover", decorate)
        el.addEventListener("click", takeFirstSentence)
    }
}

function removeListeners() {
    for (const el of document.querySelectorAll("p,div,blockquote")) {
        el.removeEventListener("mouseover", decorate);
        el.removeEventListener("click", takeFirstSentence)
    }
}

function decorate(ev) {
    const el = ev.currentTarget
    if (capturing !== undefined) {
        capturing.style["background"] = ""
    }
    el.style["background"] = "#b3e5fc"
    capturing = el
    ev.stopPropagation()
}

function takeFirstSentence(ev) {
    const sentence = sentences(textMathSymbolsEscaped(ev.currentTarget))[0]
    ev.stopPropagation()
    if (navigator.clipboard === undefined) {
        console.debug("takeFirstSentence: clip: ", sentence)
        console.debug("takeFirstSentence: navigator.clipboard is not available")
    } else {
        navigator.clipboard.writeText(sentence);
    }
    teardown()
}

function sentences(text) {
    return text.replace(/([.!?]\s+(?=.))/g, "$1|").split(/[|]/g)
}

function textMathSymbolsEscaped(el) {
    var result = ""
    el.childNodes.forEach(n => {
        if (n.nodeType === Node.ELEMENT_NODE) {
            switch (n.className) {
                case "MathJax_Preview":
                case "MathJax":
                    result += "";
                    return
            }
            if (n.type === "math/tex") {
                result += " $" + n.textContent.trim()
                return
            }
            result += " " + n.textContent.trim()
        } else {
            result += " " + n.textContent.trim()
                .replace(/\n/g, " ")
                .replace(/\s{2,}/g, " ")
        }
    })
    return result
}

function teardown() {
    if (capturing !== undefined) {
        capturing.style["background"] = ""
    }
    removeListeners()
}