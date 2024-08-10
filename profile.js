document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app-container');
    const assetForm = document.getElementById('asset-form');
    const assetsList = document.getElementById('assets');
    const salaryForm = document.getElementById('salary-form');
    const breakdownList = document.getElementById('breakdown');
    const historyForm = document.getElementById('history-form');
    const historyList = document.getElementById('history-list');
    const logoutButton = document.getElementById('logout-button');

    function checkLogin() {
        if (localStorage.getItem('loggedIn') !== 'true') {
            window.location.href = 'login.html';
        }
    }

    function displayAssets() {
        const assets = JSON.parse(localStorage.getItem('assets') || '[]');
        assetsList.innerHTML = '';
        assets.forEach(asset => {
            const li = document.createElement('li');
            li.textContent = `${asset.name}: Rp ${asset.value.toLocaleString()}`;
            assetsList.appendChild(li);
        });
    }

    function updateHistoryList() {
        const monthlyHistories = JSON.parse(localStorage.getItem('monthlyHistories') || '[]');
        historyList.innerHTML = '';
        monthlyHistories.forEach(history => {
            const li = document.createElement('li');
            li.textContent = `${history.month}: Gaji Rp ${history.salaryAmount.toLocaleString()}, Tabungan Rp ${history.savingAmount.toLocaleString()}, Uang Wajib Rp ${history.debtAmount.toLocaleString()}, Makan Rp ${history.foodAmount.toLocaleString()}, Bensin Rp ${history.fuelAmount.toLocaleString()}, Uang Jajan Rp ${history.spendingAmount.toLocaleString()}, Lain-lain Rp ${history.otherAmount.toLocaleString()}, Sisa Gaji Rp ${history.remainingSalary.toLocaleString()}`;
            historyList.appendChild(li);
        });
    }

    function handleLogout() {
        localStorage.removeItem('loggedIn');
        window.location.href = 'login.html';
    }

    checkLogin(); // Memeriksa status login saat halaman dimuat
    displayAssets();
    updateHistoryList();

    assetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const assetName = document.getElementById('asset-name').value.trim();
        const assetValue = parseFloat(document.getElementById('asset-value').value);
        let assets = JSON.parse(localStorage.getItem('assets') || '[]');

        if (assetName && !isNaN(assetValue)) {
            assets.push({ name: assetName, value: assetValue });
            localStorage.setItem('assets', JSON.stringify(assets));

            const li = document.createElement('li');
            li.textContent = `${assetName}: Rp ${assetValue.toLocaleString()}`;
            assetsList.appendChild(li);
            assetForm.reset();
        }
    });

    salaryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const salaryAmount = parseFloat(document.getElementById('salary-amount').value);
        const foodPercent = parseFloat(document.getElementById('food-percent').value);
        const fuelPercent = parseFloat(document.getElementById('fuel-percent').value);
        const spendingPercent = parseFloat(document.getElementById('spending-percent').value);
        const otherPercent = parseFloat(document.getElementById('other-percent').value);
        const savingAmount = parseFloat(document.getElementById('saving-amount').value);
        const debtAmount = parseFloat(document.getElementById('debt-amount').value);

        if (!isNaN(salaryAmount) && !isNaN(foodPercent) && !isNaN(fuelPercent) && !isNaN(spendingPercent) && !isNaN(otherPercent) && !isNaN(savingAmount) && !isNaN(debtAmount)) {
            const remainingAfterSavingsAndDebt = salaryAmount - (savingAmount + debtAmount);
            const foodAmount = (foodPercent / 100) * remainingAfterSavingsAndDebt;
            const fuelAmount = (fuelPercent / 100) * remainingAfterSavingsAndDebt;
            const spendingAmount = (spendingPercent / 100) * remainingAfterSavingsAndDebt;
            const otherAmount = (otherPercent / 100) * remainingAfterSavingsAndDebt;
            const remainingSalary = salaryAmount - (savingAmount + debtAmount + foodAmount + fuelAmount + spendingAmount + otherAmount);

            breakdownList.innerHTML = `
                <li>Gaji: Rp ${salaryAmount.toLocaleString()}</li>
                <li>Tabungan: Rp ${savingAmount.toLocaleString()}</li>
                <li>Uang Wajib: Rp ${debtAmount.toLocaleString()}</li>
                <li>Makan: Rp ${foodAmount.toLocaleString()} (${foodPercent}%)</li>
                <li>Bensin: Rp ${fuelAmount.toLocaleString()} (${fuelPercent}%)</li>
                <li>Uang Jajan: Rp ${spendingAmount.toLocaleString()} (${spendingPercent}%)</li>
                <li>Lain-lain: Rp ${otherAmount.toLocaleString()} (${otherPercent}%)</li>
                <li>Sisa Gaji: Rp ${remainingSalary.toLocaleString()}</li>
            `;

            // Simpan histori bulanan
            const month = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
            const monthlyHistories = JSON.parse(localStorage.getItem('monthlyHistories') || '[]');
            monthlyHistories.push({
                month,
                salaryAmount,
                foodAmount,
                fuelAmount,
                spendingAmount,
                otherAmount,
                savingAmount,
                debtAmount,
                remainingSalary
            });
            localStorage.setItem('monthlyHistories', JSON.stringify(monthlyHistories));
            updateHistoryList();
        } else {
            alert('Masukkan nilai yang valid untuk semua input.');
        }
        salaryForm.reset();
    });

    historyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const historyMonth = document.getElementById('history-month').value.trim();
        const lastHistory = JSON.parse(localStorage.getItem('monthlyHistories') || '[]').pop();
        if (lastHistory) {
            const li = document.createElement('li');
            li.textContent = `${historyMonth}: Gaji Rp ${lastHistory.salaryAmount.toLocaleString()}, Tabungan Rp ${lastHistory.savingAmount.toLocaleString()}, Uang Wajib Rp ${lastHistory.debtAmount.toLocaleString()}, Makan Rp ${lastHistory.foodAmount.toLocaleString()}, Bensin Rp ${lastHistory.fuelAmount.toLocaleString()}, Uang Jajan Rp ${lastHistory.spendingAmount.toLocaleString()}, Lain-lain Rp ${lastHistory.otherAmount.toLocaleString()}, Sisa Gaji Rp ${lastHistory.remainingSalary.toLocaleString()}`;
            historyList.appendChild(li);
        }
        historyForm.reset();
    });

    logoutButton.addEventListener('click', handleLogout);
});
