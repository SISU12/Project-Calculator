// Math operation functions
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    displayError('Cannot divide by zero!');
    return NaN;
  }
  return a / b;
}

// Get calculator element
const calculatorElement = document.querySelector('.calculator');



// Variables for calculator operation
let expression = '';
let shouldResetDisplay = false;

// Display element
const displayElement = document.getElementById('display');

// Helper functions
function updateDisplay(value) {
  displayElement.textContent = value;
}

function displayError(message) {
  updateDisplay('Error: ' + message);
}

// Event listeners for number buttons
document.querySelectorAll('.number').forEach((button) => {
  button.addEventListener('click', () => {
    if (shouldResetDisplay) {
      expression = '';
      shouldResetDisplay = false;
    }
    const digit = button.textContent;
    expression += digit;
    updateDisplay(expression);
  });
});

// Event listeners for operator buttons
document.querySelectorAll('.operator').forEach((button) => {
  button.addEventListener('click', () => {
    if (shouldResetDisplay) {
      shouldResetDisplay = false;
    }
    const operator = button.textContent;
    expression += ` ${operator} `;
    updateDisplay(expression);
  });
});

// Event listener for the equals button
document.getElementById('equals').addEventListener('click', () => {
  try {
    const result = evaluateExpression();
    const roundedResult = roundResult(result); // Round the result to handle precision

    updateDisplay(roundedResult);
    expression = String(roundedResult); // Use roundedResult for further calculations
    shouldResetDisplay = true;
  } catch (error) {
    displayError('Invalid expression');
  }
});

// Helper function to handle precision when performing calculations
function roundResult(value) {
  const precision = 4; // Set the desired precision (e.g., 4 decimal places)
  return parseFloat(value.toFixed(precision));
}





// Event listener for the clear button
document.getElementById('clear').addEventListener('click', () => {
  expression = '';
  shouldResetDisplay = false;
  updateDisplay('');
});

// Event listener for the backspace button
document.getElementById('backspace').addEventListener('click', () => {
  const currentDisplay = displayElement.textContent;
  expression = currentDisplay.slice(0, -1);
  updateDisplay(expression);
});

// Event listener for the decimal button
document.getElementById('decimal').addEventListener('click', () => {
  if (!expression.includes('.')) {
    expression += '.';
    updateDisplay(expression);
  }
});

// Helper function to evaluate the expression using Shunting Yard algorithm
function evaluateExpression() {
  const operators = {
    '+': { precedence: 1, func: add },
    '-': { precedence: 1, func: subtract },
    '*': { precedence: 2, func: multiply },
    '/': { precedence: 2, func: divide },
  };

  const outputQueue = [];
  const operatorStack = [];

  expression.split(' ').forEach((token) => {
    if (!isNaN(token)) {
      outputQueue.push(parseFloat(token));
    } else if (token in operators) {
      const operator1 = token;
      let operator2 = operatorStack[operatorStack.length - 1];
      while (
        operator2 in operators &&
        operators[operator1].precedence <= operators[operator2].precedence
      ) {
        outputQueue.push(operatorStack.pop());
        operator2 = operatorStack[operatorStack.length - 1];
      }
      operatorStack.push(operator1);
    }
  });

  while (operatorStack.length > 0) {
    outputQueue.push(operatorStack.pop());
  }

  const resultStack = [];
  outputQueue.forEach((token) => {
    if (!isNaN(token)) {
      resultStack.push(token);
    } else if (token in operators) {
      const [b, a] = [resultStack.pop(), resultStack.pop()];
      const result = operators[token].func(a, b);
      resultStack.push(result);
    }
  });

  return resultStack[0];
}