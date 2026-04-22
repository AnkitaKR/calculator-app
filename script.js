class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.currentValue = '';
        this.previousValue = '';
        this.operator = null;
        this.shouldResetDisplay = false;

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Button click events
        document.querySelectorAll('.btn-number').forEach(btn => {
            btn.addEventListener('click', (e) => this.appendNumber(e.target.dataset.number));
        });

        document.querySelectorAll('.btn-operator').forEach(btn => {
            btn.addEventListener('click', (e) => this.setOperator(e.target.dataset.operator));
        });

        document.querySelector('[data-action="equals"]').addEventListener('click', () => this.calculate());
        document.querySelector('[data-action="clear"]').addEventListener('click', () => this.clear());
        document.querySelector('[data-action="delete"]').addEventListener('click', () => this.delete());
        document.querySelector('[data-action="percent"]').addEventListener('click', () => this.percent());

        // Keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    appendNumber(num) {
        // Prevent multiple decimal points
        if (num === '.' && this.currentValue.includes('.')) {
            return;
        }

        // Start new calculation if operator was just pressed
        if (this.shouldResetDisplay) {
            this.currentValue = '';
            this.shouldResetDisplay = false;
        }

        this.currentValue += num;
        this.updateDisplay();
    }

    setOperator(op) {
        // If no current value, don't set operator
        if (this.currentValue === '') {
            return;
        }

        // If operator already set and new value entered, calculate first
        if (this.operator !== null && !this.shouldResetDisplay) {
            this.calculate();
        }

        this.previousValue = this.currentValue;
        this.operator = op;
        this.shouldResetDisplay = true;
    }

    calculate() {
        // Can't calculate without operator or values
        if (this.operator === null || this.previousValue === '' || this.currentValue === '') {
            return;
        }

        let result;
        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);

        switch (this.operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    this.currentValue = 'Error';
                    this.updateDisplay();
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }

        // Round to avoid floating point errors
        result = Math.round(result * 100000000) / 100000000;

        this.currentValue = result.toString();
        this.operator = null;
        this.previousValue = '';
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    percent() {
        if (this.currentValue === '') {
            return;
        }

        let value = parseFloat(this.currentValue);
        value = value / 100;
        this.currentValue = value.toString();
        this.updateDisplay();
    }

    delete() {
        this.currentValue = this.currentValue.toString().slice(0, -1);
        this.updateDisplay();
    }

    clear() {
        this.currentValue = '';
        this.previousValue = '';
        this.operator = null;
        this.shouldResetDisplay = false;
        this.updateDisplay();
    }

    updateDisplay() {
        this.display.value = this.currentValue || '0';
    }

    handleKeyboard(e) {
        // Number keys
        if (e.key >= '0' && e.key <= '9') {
            this.appendNumber(e.key);
        }

        // Decimal point
        if (e.key === '.') {
            e.preventDefault();
            this.appendNumber('.');
        }

        // Operators
        if (e.key === '+') {
            e.preventDefault();
            this.setOperator('+');
        }

        if (e.key === '-') {
            e.preventDefault();
            this.setOperator('-');
        }

        if (e.key === '*') {
            e.preventDefault();
            this.setOperator('*');
        }

        if (e.key === '/' || e.key === 'Divide') {
            e.preventDefault();
            this.setOperator('/');
        }

        // Equals
        if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            this.calculate();
        }

        // Backspace for delete
        if (e.key === 'Backspace') {
            e.preventDefault();
            this.delete();
        }

        // Escape for clear
        if (e.key === 'Escape') {
            e.preventDefault();
            this.clear();
        }
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
