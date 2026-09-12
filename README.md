<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BankSphere | Online Banking</title>

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: "Segoe UI", Arial, sans-serif;
        }

        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --secondary: #0f172a;
            --background: #f5f7fb;
            --white: #ffffff;
            --text: #1e293b;
            --muted: #64748b;
            --border: #e2e8f0;
            --success: #16a34a;
            --danger: #dc2626;
            --warning: #f59e0b;
        }

        body {
            background: var(--background);
            color: var(--text);
        }

        /* Layout */
        .app {
            display: flex;
            min-height: 100vh;
        }

        /* Sidebar */
        .sidebar {
            width: 250px;
            background: var(--secondary);
            color: white;
            padding: 25px 15px;
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            z-index: 100;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 0 15px 30px;
            font-size: 23px;
            font-weight: 700;
        }

        .logo-icon {
            width: 38px;
            height: 38px;
            border-radius: 10px;
            background: linear-gradient(135deg, #3b82f6, #06b6d4);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }

        .nav-title {
            color: #94a3b8;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 0 15px;
            margin: 10px 0;
        }

        .nav-item {
            display: flex;
            align-items: center;
            gap: 13px;
            color: #cbd5e1;
            padding: 13px 15px;
            margin: 4px 0;
            border-radius: 9px;
            cursor: pointer;
            transition: 0.2s;
        }

        .nav-item:hover,
        .nav-item.active {
            background: #1e40af;
            color: white;
        }

        .nav-icon {
            width: 22px;
            text-align: center;
        }

        /* Main */
        .main {
            margin-left: 250px;
            width: calc(100% - 250px);
        }

        /* Header */
        header {
            height: 75px;
            background: white;
            border-bottom: 1px solid var(--border);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 35px;
        }

        .search {
            display: flex;
            align-items: center;
            gap: 10px;
            background: #f8fafc;
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 9px 13px;
            width: 300px;
        }

        .search input {
            border: none;
            outline: none;
            background: transparent;
            width: 100%;
        }

        .header-right {
            display: flex;
            align-items: center;
            gap: 22px;
        }

        .notification {
            font-size: 20px;
            cursor: pointer;
        }

        .profile {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
        }

        .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #dbeafe;
            color: #1d4ed8;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
        }

        .profile-info strong {
            display: block;
            font-size: 14px;
        }

        .profile-info span {
            font-size: 12px;
            color: var(--muted);
        }

        /* Content */
        .content {
            padding: 30px 35px;
        }

        .page-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
        }

        .page-title h1 {
            font-size: 27px;
        }

        .page-title p {
            color: var(--muted);
            margin-top: 5px;
            font-size: 14px;
        }

        .btn {
            border: none;
            border-radius: 8px;
            padding: 11px 18px;
            cursor: pointer;
            font-weight: 600;
            transition: 0.2s;
        }

        .btn-primary {
            background: var(--primary);
            color: white;
        }

        .btn-primary:hover {
            background: var(--primary-dark);
        }

        /* Cards */
        .stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 25px;
        }

        .stat-card {
            background: white;
            border: 1px solid var(--border);
            border-radius: 13px;
            padding: 20px;
        }

        .stat-top {
            display: flex;
            justify-content: space-between;
            color: var(--muted);
            font-size: 13px;
        }

        .stat-icon {
            width: 38px;
            height: 38px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 9px;
            background: #eff6ff;
            color: var(--primary);
        }

        .stat-card h2 {
            margin-top: 15px;
            font-size: 25px;
        }

        .positive {
            color: var(--success);
            font-size: 12px;
            margin-top: 6px;
        }

        /* Dashboard grid */
        .dashboard-grid {
            display: grid;
            grid-template-columns: 1.5fr 1fr;
            gap: 20px;
        }

        .panel {
            background: white;
            border: 1px solid var(--border);
            border-radius: 13px;
            padding: 22px;
        }

        .panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .panel-header h3 {
            font-size: 17px;
        }

        .link {
            color: var(--primary);
            font-size: 13px;
            cursor: pointer;
        }

        /* Accounts */
        .account {
            border-radius: 14px;
            padding: 22px;
            color: white;
            margin-bottom: 15px;
            position: relative;
            overflow: hidden;
        }

        .account:last-child {
            margin-bottom: 0;
        }

        .account-blue {
            background: linear-gradient(135deg, #1d4ed8, #2563eb, #0ea5e9);
        }

        .account-dark {
            background: linear-gradient(135deg, #111827, #334155);
        }

        .account-top {
            display: flex;
            justify-content: space-between;
        }

        .account-type {
            font-size: 12px;
            opacity: .8;
        }

        .account-number {
            font-size: 12px;
            opacity: .8;
            margin-top: 5px;
        }

        .account-balance {
            font-size: 26px;
            font-weight: 700;
            margin-top: 28px;
        }

        /* Transactions */
        .transaction {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 13px 0;
            border-bottom: 1px solid #f1f5f9;
        }

        .transaction:last-child {
            border-bottom: none;
        }

        .transaction-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .transaction-icon {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
        }

        .deposit {
            background: #dcfce7;
            color: var(--success);
        }

        .withdrawal {
            background: #fee2e2;
            color: var(--danger);
        }

        .transaction-name {
            font-size: 14px;
            font-weight: 600;
        }

        .transaction-date {
            color: var(--muted);
            font-size: 11px;
            margin-top: 3px;
        }

        .amount {
            font-size: 14px;
            font-weight: 700;
        }

        .amount.in {
            color: var(--success);
        }

        .amount.out {
            color: var(--danger);
        }

        /* Quick Actions */
        .quick-actions {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
        }

        .action {
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 18px 10px;
            text-align: center;
            cursor: pointer;
            transition: .2s;
        }

        .action:hover {
            border-color: var(--primary);
            color: var(--primary);
            background: #eff6ff;
        }

        .action-icon {
            font-size: 22px;
            margin-bottom: 7px;
        }

        .action span {
            font-size: 12px;
            font-weight: 600;
        }

        /* Modal */
        .modal {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, .55);
            align-items: center;
            justify-content: center;
            z-index: 500;
        }

        .modal.show {
            display: flex;
        }

        .modal-box {
            width: 450px;
            max-width: 90%;
            background: white;
            border-radius: 14px;
            padding: 25px;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        .close {
            border: none;
            background: none;
            font-size: 22px;
            cursor: pointer;
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-group label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 6px;
        }

        .form-group input,
        .form-group select {
            width: 100%;
            padding: 11px;
            border: 1px solid var(--border);
            border-radius: 7px;
            outline: none;
        }

        .form-group input:focus,
        .form-group select:focus {
            border-color: var(--primary);
        }

        /* Responsive */
        .mobile-menu {
            display: none;
            font-size: 23px;
            cursor: pointer;
        }

        @media (max-width: 1100px) {
            .stats {
                grid-template-columns: repeat(2, 1fr);
            }

            .dashboard-grid {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 768px) {
            .sidebar {
                transform: translateX(-100%);
                transition: .3s;
            }

            .sidebar.open {
                transform: translateX(0);
            }

            .main {
                margin-left: 0;
                width: 100%;
            }

            header {
                padding: 0 20px;
            }

            .mobile-menu {
                display: block;
            }

            .search {
                display: none;
            }

            .content {
                padding: 20px;
            }

            .stats {
                grid-template-columns: 1fr;
            }

            .profile-info {
                display: none;
            }
        }
    </style>
</head>

<body>

<div class="app">

    <!-- Sidebar -->
    <aside class="sidebar" id="sidebar">

        <div class="logo">
            <div class="logo-icon">B</div>
            BankSphere
        </div>

        <div class="nav-title">Main Menu</div>

        <div class="nav-item active" onclick="showPage('dashboard')">
            <span class="nav-icon">⌂</span>
            Dashboard
        </div>

        <div class="nav-item" onclick="showPage('accounts')">
            <span class="nav-icon">▣</span>
            My Accounts
        </div>

        <div class="nav-item" onclick="showPage('transactions')">
            <span class="nav-icon">↔</span>
            Transactions
        </div>

        <div class="nav-item" onclick="openTransfer()">
            <span class="nav-icon">⇄</span>
            Transfer Money
        </div>

        <div class="nav-title">Management</div>

        <div class="nav-item" onclick="showPage('users')">
            <span class="nav-icon">♙</span>
            Users
        </div>

        <div class="nav-item" onclick="showPage('settings')">
            <span class="nav-icon">⚙</span>
            Settings
        </div>

        <div class="nav-item" onclick="logout()">
            <span class="nav-icon">↪</span>
            Logout
        </div>

    </aside>

    <!-- Main -->
    <main class="main">

        <!-- Header -->
        <header>
            <div class="mobile-menu" onclick="toggleSidebar()">☰</div>

            <div class="search">
                🔍
                <input type="text" placeholder="Search transactions...">
            </div>

            <div class="header-right">
                <div class="notification">🔔</div>

                <div class="profile">
                    <div class="avatar">JD</div>
                    <div class="profile-info">
                        <strong>John Doe</strong>
                        <span>Premium Customer</span>
                    </div>
                </div>
            </div>
        </header>

        <!-- Content -->
        <section class="content">

            <div class="page-title">
                <div>
                    <h1>Good afternoon, John 👋</h1>
                    <p>Here's what's happening with your finances today.</p>
                </div>

                <button class="btn btn-primary" onclick="openTransfer()">
                    + Transfer Money
                </button>
            </div>

            <!-- Stats -->
            <div class="stats">

                <div class="stat-card">
                    <div class="stat-top">
                        <span>Total Balance</span>
                        <div class="stat-icon">₹</div>
                    </div>
                    <h2>₹84,250.00</h2>
                    <div class="positive">↑ 8.4% this month</div>
                </div>

                <div class="stat-card">
                    <div class="stat-top">
                        <span>Total Accounts</span>
                        <div class="stat-icon">▣</div>
                    </div>
                    <h2>3</h2>
                    <div class="positive">Active accounts</div>
                </div>

                <div class="stat-card">
                    <div class="stat-top">
                        <span>Money In</span>
                        <div class="stat-icon">↓</div>
                    </div>
                    <h2>₹32,500</h2>
                    <div class="positive">↑ 12.5% this month</div>
                </div>

                <div class="stat-card">
                    <div class="stat-top">
                        <span>Money Out</span>
                        <div class="stat-icon">↑</div>
                    </div>
                    <h2>₹18,750</h2>
                    <div style="color:#64748b;font-size:12px;margin-top:6px;">
                        This month
                    </div>
                </div>

            </div>

            <!-- Dashboard -->
            <div class="dashboard-grid">

                <!-- Left -->
                <div>

                    <div class="panel">
                        <div class="panel-header">
                            <h3>My Accounts</h3>
                            <span class="link" onclick="showPage('accounts')">
                                View all
                            </span>
                        </div>

                        <div class="account account-blue">
                            <div class="account-top">
                                <div>
                                    <div class="account-type">SAVINGS ACCOUNT</div>
                                    <div class="account-number">
                                        •••• •••• 4582
                                    </div>
                                </div>
                                <strong>VISA</strong>
                            </div>

                            <div class="account-balance">
                                ₹56,750.00
                            </div>
                        </div>

                        <div class="account account-dark">
                            <div class="account-top">
                                <div>
                                    <div class="account-type">CURRENT ACCOUNT</div>
                                    <div class="account-number">
                                        •••• •••• 9021
                                    </div>
                                </div>
                                <strong>VISA</strong>
                            </div>

                            <div class="account-balance">
                                ₹27,500.00
                            </div>
                        </div>

                    </div>

                    <br>

                    <div class="panel">

                        <div class="panel-header">
                            <h3>Recent Transactions</h3>
                            <span class="link" onclick="showPage('transactions')">
                                View all
                            </span>
                        </div>

                        <div id="transactionList">

                            <div class="transaction">
                                <div class="transaction-left">
                                    <div class="transaction-icon deposit">↓</div>
                                    <div>
                                        <div class="transaction-name">
                                            Salary Credit
                                        </div>
                                        <div class="transaction-date">
                                            Sep 10, 2026 · Savings
                                        </div>
                                    </div>
                                </div>
                                <div class="amount in">+₹30,000</div>
                            </div>

                            <div class="transaction">
                                <div class="transaction-left">
                                    <div class="transaction-icon withdrawal">↑</div>
                                    <div>
                                        <div class="transaction-name">
                                            Amazon Purchase
                                        </div>
                                        <div class="transaction-date">
                                            Sep 9, 2026 · Savings
                                        </div>
                                    </div>
                                </div>
                                <div class="amount out">-₹2,499</div>
                            </div>

                            <div class="transaction">
                                <div class="transaction-left">
                                    <div class="transaction-icon withdrawal">↑</div>
                                    <div>
                                        <div class="transaction-name">
                                            Electricity Bill
                                        </div>
                                        <div class="transaction-date">
                                            Sep 8, 2026 · Current
                                        </div>
                                    </div>
                                </div>
                                <div class="amount out">-₹1,850</div>
                            </div>

                            <div class="transaction">
                                <div class="transaction-left">
                                    <div class="transaction-icon deposit">↓</div>
                                    <div>
                                        <div class="transaction-name">
                                            Transfer Received
                                        </div>
                                        <div class="transaction-date">
                                            Sep 7, 2026 · Savings
                                        </div>
                                    </div>
                                </div>
                                <div class="amount in">+₹5,000</div>
                            </div>

                        </div>
                    </div>

                </div>

                <!-- Right -->
                <div>

                    <div class="panel">
                        <div class="panel-header">
                            <h3>Quick Actions</h3>
                        </div>

                        <div class="quick-actions">

                            <div class="action" onclick="openTransfer()">
                                <div class="action-icon">⇄</div>
                                <span>Transfer</span>
                            </div>

                            <div class="action" onclick="openDeposit()">
                                <div class="action-icon">↓</div>
                                <span>Deposit</span>
                            </div>

                            <div class="action" onclick="openWithdraw()">
                                <div class="action-icon">↑</div>
                                <span>Withdraw</span>
                            </div>

                            <div class="action" onclick="showPage('accounts')">
                                <div class="action-icon">▣</div>
                                <span>Accounts</span>
                            </div>

                        </div>
                    </div>

                    <br>

                    <div class="panel">

                        <div class="panel-header">
                            <h3>Account Overview</h3>
                        </div>

                        <div style="margin-bottom:18px;">
                            <div style="display:flex;justify-content:space-between;font-size:13px;">
                                <span>Monthly Income</span>
                                <strong>₹32,500</strong>
                            </div>

                            <div style="height:8px;background:#e2e8f0;border-radius:10px;margin-top:8px;">
                                <div style="height:100%;width:78%;background:#2563eb;border-radius:10px;"></div>
                            </div>
                        </div>

                        <div>
                            <div style="display:flex;justify-content:space-between;font-size:13px;">
                                <span>Monthly Expenses</span>
                                <strong>₹18,750</strong>
                            </div>

                            <div style="height:8px;background:#e2e8f0;border-radius:10px;margin-top:8px;">
                                <div style="height:100%;width:45%;background:#f59e0b;border-radius:10px;"></div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>

        </section>

    </main>
</div>


<!-- Transfer Modal -->
<div class="modal" id="transferModal">

    <div class="modal-box">

        <div class="modal-header">
            <h3>Transfer Money</h3>
            <button class="close" onclick="closeModal('transferModal')">
                ×
            </button>
        </div>

        <form onsubmit="makeTransfer(event)">

            <div class="form-group">
                <label>From Account</label>
                <select id="fromAccount" required>
                    <option value="">Select account</option>
                    <option>Savings ••••4582</option>
                    <option>Current ••••9021</option>
                </select>
            </div>

            <div class="form-group">
                <label>To Account ID</label>
                <input
                    type="text"
                    id="toAccount"
                    placeholder="Enter destination account ID"
                    required
                >
            </div>

            <div class="form-group">
                <label>Amount</label>
                <input
                    type="number"
                    id="transferAmount"
                    placeholder="₹ 0.00"
                    min="1"
                    step="0.01"
                    required
                >
            </div>

            <div class="form-group">
                <label>Description</label>
                <input
                    type="text"
                    id="transferDescription"
                    placeholder="Payment description"
                >
            </div>

            <button class="btn btn-primary" style="width:100%;">
                Send Money
            </button>

        </form>

    </div>
</div>


<!-- Deposit Modal -->
<div class="modal" id="depositModal">

    <div class="modal-box">

        <div class="modal-header">
            <h3>Make Deposit</h3>
            <button class="close" onclick="closeModal('depositModal')">
                ×
            </button>
        </div>

        <form onsubmit="makeTransaction(event, 'DEPOSIT')">

            <div class="form-group">
                <label>Account</label>
                <select required>
                    <option>Savings ••••4582</option>
                    <option>Current ••••9021</option>
                </select>
            </div>

            <div class="form-group">
                <label>Amount</label>
                <input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="₹ 0.00"
                    required
                >
            </div>

            <div class="form-group">
                <label>Description</label>
                <input
                    type="text"
                    placeholder="Deposit description"
                >
            </div>

            <button class="btn btn-primary" style="width:100%;">
                Deposit Money
            </button>

        </form>

    </div>
</div>


<!-- Withdraw Modal -->
<div class="modal" id="withdrawModal">

    <div class="modal-box">

        <div class="modal-header">
            <h3>Withdraw Money</h3>
            <button class="close" onclick="closeModal('withdrawModal')">
                ×
            </button>
        </div>

        <form onsubmit="makeTransaction(event, 'WITHDRAWAL')">

            <div class="form-group">
                <label>Account</label>
                <select required>
                    <option>Savings ••••4582</option>
                    <option>Current ••••9021</option>
                </select>
            </div>

            <div class="form-group">
                <label>Amount</label>
                <input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="₹ 0.00"
                    required
                >
            </div>

            <div class="form-group">
                <label>Description</label>
                <input
                    type="text"
                    placeholder="Withdrawal description"
                >
            </div>

            <button class="btn btn-primary" style="width:100%;">
                Withdraw Money
            </button>

        </form>

    </div>
</div>


<script>

    function toggleSidebar() {
        document.getElementById("sidebar").classList.toggle("open");
    }

    function openTransfer() {
        document.getElementById("transferModal").classList.add("show");
    }

    function openDeposit() {
        document.getElementById("depositModal").classList.add("show");
    }

    function openWithdraw() {
        document.getElementById("withdrawModal").classList.add("show");
    }

    function closeModal(id) {
        document.getElementById(id).classList.remove("show");
    }

    window.onclick = function(event) {
        if (event.target.classList.contains("modal")) {
            event.target.classList.remove("show");
        }
    }

    function makeTransfer(event) {

        event.preventDefault();

        const toAccount =
            document.getElementById("toAccount").value;

        const amount =
            document.getElementById("transferAmount").value;

        const description =
            document.getElementById("transferDescription").value;

        /*
         * Connect this request to:
         *
         * POST /api/transfers
         */

        /*
        fetch("http://localhost:5000/api/transfers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fromAccountId: "...",
                toAccountId: toAccount,
                amount: amount,
                description: description
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        });
        */

        alert(
            "Transfer of ₹" + amount +
            " to account " + toAccount +
            " initiated successfully!"
        );

        closeModal("transferModal");
        event.target.reset();
    }


    function makeTransaction(event, type) {

        event.preventDefault();

        const amount = event.target.querySelector(
            'input[type="number"]'
        ).value;

        /*
         * Connect this request to:
         *
         * POST /api/transactions
         *
         * Example body:
         *
         * {
         *   accountId: "...",
         *   transactionType: "DEPOSIT",
         *   amount: amount,
         *   description: "..."
         * }
         */

        alert(
            type === "DEPOSIT"
                ? "Deposit of ₹" + amount + " successful!"
                : "Withdrawal of ₹" + amount + " successful!"
        );

        event.target.closest(".modal").classList.remove("show");
        event.target.reset();
    }


    function showPage(page) {

        const pageNames = {
            dashboard: "Dashboard",
            accounts: "My Accounts",
            transactions: "Transactions",
            users: "Users",
            settings: "Settings"
        };

        if (page === "dashboard") {
            location.reload();
            return;
        }

        alert(
            pageNames[page] +
            " page selected. Connect this section to your API."
        );
    }


    function logout() {

        if (confirm("Are you sure you want to logout?")) {

            /*
             * If authentication is added later:
             *
             * localStorage.removeItem("token");
             * location.href = "/login.html";
             */

            alert("Logged out successfully.");
        }
    }


    /*
     * =========================================================
     * BANKSPHERE API CONNECTION EXAMPLES
     * =========================================================
     *
     * Users:
     * GET    /api/users
     * POST   /api/users
     * GET    /api/users/:id
     * PUT    /api/users/:id
     * DELETE /api/users/:id
     *
     * Accounts:
     * GET    /api/accounts
     * POST   /api/accounts
     * GET    /api/accounts/:id
     * GET    /api/accounts/user/:userId
     * GET    /api/accounts/:id/balance
     *
     * Transactions:
     * GET    /api/transactions
     * POST   /api/transactions
     * GET    /api/transactions/:id
     * GET    /api/transactions/account/:accountId
     *
     * Transfers:
     * GET    /api/transfers
     * POST   /api/transfers
     * GET    /api/transfers/:id
     * GET    /api/transfers/account/:accountId
     *
     * =========================================================
     */

</script>

</body>
</html>

