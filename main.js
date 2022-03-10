var calcContainerEle = document.querySelector('#calculator-container')
calcContainerEle.addEventListener('click', e => onButtonClick(e))

var resultEle = document.querySelector('#result')

var operationSymbolMap = {
    '/': 'divide',
    '+': 'add',
    '-': 'minus',
    'x': 'multiply'
}

var curOperation, curNumber1, curNumber2
var activeOperationbtnEle

function compute(num1, num2, op) {
    var n1 = Number(num1)
    var n2 = Number(num2)
    var result
    if (op === '+') {
        result = n1 + n2
    } else if (op === '-') {
        result = n1 - n2
    } else if (op === '/') {
        result = n1 / n2
    } else {
        // must be multiply
        result = n1 * n2
    }
    return result
}

function doNumber(num) {
    var newNum
    if (curOperation) {
        curNumber2 = curNumber2 ? `${curNumber2}${num}` : num
        newNum = curNumber2
    } else {
        curNumber1 = curNumber1 ? `${curNumber1}${num}` : num
        newNum = curNumber1
    }
    resultEle.innerHTML = newNum
}

function doOperation(operation) {
    var prevOperation = curOperation

    if (curNumber2) {
        var result = compute(curNumber1, curNumber2, curOperation)
        curNumber1 = result
        curNumber2 = 0
        resultEle.innerHTML = result
    }

    curOperation = operation

    if(prevOperation) {
        var prevBtnEle = document.querySelector(`#${operationSymbolMap[prevOperation]}`)
        prevBtnEle.classList.remove('active')
    }

    activeOperationbtnEle = document.querySelector(`#${operationSymbolMap[curOperation]}`)
    activeOperationbtnEle.classList.add('active')
}

function reset(lastComputedNum) {
    console.log('lastComputedNum', lastComputedNum)
    if (activeOperationbtnEle) {
        activeOperationbtnEle.classList.remove('active')
        activeOperationbtnEle = null
    }

    if (lastComputedNum !== undefined) {
        // equal button clicked
        curNumber1 = lastComputedNum
    } else {
        // reset button clicked
        curNumber1 = null
        resultEle.innerHTML = '0'
    }

    curNumber2 = null
    curOperation = null
}

function makePosNeg() {
    if (curNumber1 || curNumber2) {
        var newNumber
        if (curNumber2) {
            newNumber = curNumber2 * -1
            curNumber2 = newNumber
        } else {
            newNumber = curNumber1 * -1
            curNumber1 = newNumber
        }
        resultEle.innerHTML = newNumber
    }
}

function makeDecimal() {
    function appendDecimal(n) {
        var nStr = n !== undefined ? n.toString() : '0'
        if (!nStr.includes('.')) {
            nStr = `${nStr}.`
        }
        return nStr
    }
    if (curOperation) {
        var nStr = appendDecimal(curNumber2)
        resultEle.innerHTML = nStr
        curNumber2 = nStr
    }   else {
        var nStr = appendDecimal(curNumber1)
        resultEle.innerHTML = nStr
        curNumber1 = nStr
        }
    }

function doEqual() {
    if (curNumber1 !== undefined && curNumber2 !== undefined && curOperation) {
        var result = compute(curNumber1, curNumber2, curOperation)
        resultEle.innerHTML = result
        activeOperationbtnEle.classList.remove('active')
        reset(result)
    }
}

function flashElement(ele) {
    var prevColor = ele.style.backgroundColor
    ele.style.backgroundColor = 'white'
    ele.style.opacity = 0.5
    setTimeout(function() {
        ele.style.backgroundColor = prevColor
        ele.style.opacity = 1
    }, 100)
}

function debug() {
    document.querySelector('#curNumber1').innerHTML = curNumber1
    document.querySelector('#curNumber2').innerHTML = curNumber2
    document.querySelector('#curOperation').innerHTML = curOperation
}

function onButtonClick(e) {
    flashElement(e.target)

    let btnClickedValue = e.target.innerHTML

    if (Number.isInteger(parseInt(btnClickedValue))) {
        doNumber(btnClickedValue)
        debug()
        return
    }

switch(btnClickedValue) {
    case 'AC':
        reset()
        break
    case '+/-':
        makePosNeg()
        break
    case '/':
        doOperation('/')
        break
    case 'x':
        doOperation('x')
        break
    case '-':
        doOperation('-')
        break
    case '+':
        doOperation('+')
        break
    case '.':
        makeDecimal()
        break
    case '=':
        doEqual()
        break
    default:
        break
        
}

debug()
}