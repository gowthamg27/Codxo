document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const totalAmount = document.getElementById('total-amount');

    let expenses = [];

    form.addEventListener('submit', addExpense);

    function addExpense(e) {
        e.preventDefault();

        const description = document.getElementById('description').value;
        const amount = parseFloat(document.getElementById('amount').value);

        if (description.trim() === '' || isNaN(amount)) {
            alert('Please enter valid description and amount');
            return;
        }

        const expense = { description, amount };

        fetch('/api/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(expense),
        })
        .then(response => response.json())
        .then(data => {
            expenses.push(data);
            updateUI();
            form.reset();
        })
        .catch(error => console.error('Error:', error));
    }

    function updateUI() {
        expenseList.innerHTML = '';
        let total = 0;

        expenses.forEach(expense => {
            const expenseEl = document.createElement('div');
            expenseEl.classList.add('expense-item');
            expenseEl.innerHTML = `
                <span>${expense.description}</span>
                <span>$${expense.amount.toFixed(2)}</span>
            `;
            expenseList.appendChild(expenseEl);
            total += expense.amount;
        });

        totalAmount.textContent = total.toFixed(2);
    }

    // Fetch existing expenses on page load
    fetch('/api/expenses')
        .then(response => response.json())
        .then(data => {
            expenses = data;
            updateUI();
        })
        .catch(error => console.error('Error:', error));
});