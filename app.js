// Application Data
let accounts = [
    {
        accountId: "UTMA001",
        minorName: "John Smith Jr.",
        custodian: "John Smith Sr.",
        advisor: "Advisor A",
        minorAge: 12,
        currentValue: 125000,
        ytdRealizedGains: 2100,
        ytdUnrealizedGains: 15000,
        ytdIncome: 1800,
        totalUnearnedIncome: 3900,
        remainingTaxBudget: -1200,
        taxStrategy: "Loss Harvesting",
        priority: "High",
        status: "Pending Review",
        expectedDistributions: 1500,
        notes: "Exceeded threshold - need loss harvesting"
    },
    {
        accountId: "UTMA002",
        minorName: "Sarah Johnson",
        custodian: "Mary Johnson",
        advisor: "Advisor B",
        minorAge: 15,
        currentValue: 89000,
        ytdRealizedGains: 850,
        ytdUnrealizedGains: 8500,
        ytdIncome: 1200,
        totalUnearnedIncome: 2050,
        remainingTaxBudget: 650,
        taxStrategy: "Gain Harvesting",
        priority: "Medium",
        status: "Pending Review",
        expectedDistributions: 800,
        notes: "Good candidate for gain harvesting"
    },
    {
        accountId: "UTMA003",
        minorName: "Michael Davis",
        custodian: "Lisa Davis",
        advisor: "Advisor A",
        minorAge: 8,
        currentValue: 45000,
        ytdRealizedGains: 200,
        ytdUnrealizedGains: 4200,
        ytdIncome: 600,
        totalUnearnedIncome: 800,
        remainingTaxBudget: 1900,
        taxStrategy: "Gain Harvesting",
        priority: "Low",
        status: "Pending Review",
        expectedDistributions: 300,
        notes: "Low income - maximize gains"
    },
    {
        accountId: "UTMA004",
        minorName: "Emma Wilson",
        custodian: "Tom Wilson",
        advisor: "Advisor C",
        minorAge: 17,
        currentValue: 180000,
        ytdRealizedGains: 3500,
        ytdUnrealizedGains: 22000,
        ytdIncome: 2800,
        totalUnearnedIncome: 6300,
        remainingTaxBudget: -3600,
        taxStrategy: "Loss Harvesting",
        priority: "High",
        status: "Pending Review",
        expectedDistributions: 2200,
        notes: "Way over threshold - urgent action needed"
    },
    {
        accountId: "UTMA005",
        minorName: "David Brown",
        custodian: "Jennifer Brown",
        advisor: "Advisor B",
        minorAge: 10,
        currentValue: 67000,
        ytdRealizedGains: 1200,
        ytdUnrealizedGains: 6800,
        ytdIncome: 950,
        totalUnearnedIncome: 2150,
        remainingTaxBudget: 550,
        taxStrategy: "Gain Harvesting",
        priority: "Medium",
        status: "Pending Review",
        expectedDistributions: 600,
        notes: "Perfect for gain realization"
    }
];

let workflowPhases = [
    {
        phase: "Phase 1: Account Identification",
        tasks: [
            "Generate list of all UTMA/UGMA accounts across custodians",
            "Verify account owner (minor) and custodian information",
            "Confirm advisor assignments",
            "Update minor ages and verify kiddie tax applicability"
        ],
        targetDate: "January 31",
        responsible: "Operations Team",
        status: "Not Started"
    },
    {
        phase: "Phase 2: YTD Activity Review",
        tasks: [
            "Pull YTD realized gains/losses for each account",
            "Calculate YTD unrealized gains/losses by position",
            "Identify high embedded gains/losses positions",
            "Review YTD income distributions and projections"
        ],
        targetDate: "February 15",
        responsible: "Portfolio Manager",
        status: "Not Started"
    },
    {
        phase: "Phase 3: Capital Gains Distribution Review",
        tasks: [
            "Check custodian Q4 capital gains distribution notices",
            "Flag accounts with mutual funds projecting large payouts",
            "Update expected distribution amounts in tracking system"
        ],
        targetDate: "November 30",
        responsible: "Operations Team",
        status: "Not Started"
    },
    {
        phase: "Phase 4: Tax Analysis",
        tasks: [
            "Calculate current unearned income vs 2025 thresholds",
            "Determine available tax budget ($2,700 - current income)",
            "Identify gain harvesting vs loss harvesting opportunities",
            "Assess parent tax bracket impact for excess income"
        ],
        targetDate: "December 1",
        responsible: "Tax Specialist",
        status: "Not Started"
    },
    {
        phase: "Phase 5: Advisor Coordination",
        tasks: [
            "Prepare summary for advisor showing tax liability",
            "Present realization opportunities and suggested trades",
            "Obtain advisor approval for recommended strategies"
        ],
        targetDate: "December 15",
        responsible: "Advisor",
        status: "Not Started"
    },
    {
        phase: "Phase 6: Implementation",
        tasks: [
            "Execute approved tax trades (gain/loss harvesting)",
            "Confirm trade execution and settlement",
            "Log all transactions in CRM and custodian records"
        ],
        targetDate: "December 20",
        responsible: "Trading Team",
        status: "Not Started"
    },
    {
        phase: "Phase 7: Documentation",
        tasks: [
            "Record review date and strategy in CRM (Wealthbox)",
            "Save analysis and supporting docs in client Google Drive folder",
            "Update compliance log and task tracker for audit trail"
        ],
        targetDate: "December 31",
        responsible: "Compliance",
        status: "Not Started"
    }
];

const KIDDIE_THRESHOLD = 2700;
let currentEditingAccount = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    updateDashboard();
    renderAccountsTable();
    renderWorkflowTracker();
    setupFilters();
});

// Navigation
function initializeNavigation() {
    const navTabs = document.querySelectorAll('.nav__tab');
    const views = document.querySelectorAll('.view');
    
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetView = tab.dataset.tab;
            
            // Update active tab
            navTabs.forEach(t => t.classList.remove('nav__tab--active'));
            tab.classList.add('nav__tab--active');
            
            // Update active view
            views.forEach(v => v.classList.remove('view--active'));
            document.getElementById(targetView).classList.add('view--active');
        });
    });
}

// Dashboard Functions
function updateDashboard() {
    const totalAccounts = accounts.length;
    const overThreshold = accounts.filter(acc => acc.totalUnearnedIncome > KIDDIE_THRESHOLD).length;
    const pendingReviews = accounts.filter(acc => acc.status === 'Pending Review').length;
    const totalUnrealized = accounts.reduce((sum, acc) => sum + acc.ytdUnrealizedGains, 0);
    
    document.getElementById('total-accounts').textContent = totalAccounts;
    document.getElementById('over-threshold').textContent = overThreshold;
    document.getElementById('pending-reviews').textContent = pendingReviews;
    document.getElementById('total-unrealized').textContent = formatCurrency(totalUnrealized);
}

// Account Management
function renderAccountsTable() {
    const tbody = document.getElementById('accounts-table-body');
    const filteredAccounts = getFilteredAccounts();
    
    tbody.innerHTML = filteredAccounts.map(account => `
        <tr onclick="openAccountModal('${account.accountId}')">
            <td>${account.accountId}</td>
            <td>${account.minorName}</td>
            <td>${account.custodian}</td>
            <td>${account.advisor}</td>
            <td class="currency">${formatCurrency(account.currentValue)}</td>
            <td class="currency ${account.ytdRealizedGains >= 0 ? 'positive' : 'negative'}">${formatCurrency(account.ytdRealizedGains)}</td>
            <td class="currency ${account.ytdUnrealizedGains >= 0 ? 'positive' : 'negative'}">${formatCurrency(account.ytdUnrealizedGains)}</td>
            <td class="currency">${formatCurrency(account.totalUnearnedIncome)}</td>
            <td class="currency ${account.remainingTaxBudget >= 0 ? 'positive' : 'negative'}">${formatCurrency(account.remainingTaxBudget)}</td>
            <td>${account.taxStrategy}</td>
            <td><span class="status-badge status-badge--${account.priority.toLowerCase()}">${account.priority}</span></td>
            <td>${account.status}</td>
        </tr>
    `).join('');
}

function getFilteredAccounts() {
    const advisorFilter = document.getElementById('advisor-filter')?.value || '';
    const priorityFilter = document.getElementById('priority-filter')?.value || '';
    const strategyFilter = document.getElementById('strategy-filter')?.value || '';
    
    return accounts.filter(account => {
        return (!advisorFilter || account.advisor === advisorFilter) &&
               (!priorityFilter || account.priority === priorityFilter) &&
               (!strategyFilter || account.taxStrategy === strategyFilter);
    });
}

function setupFilters() {
    const filters = ['advisor-filter', 'priority-filter', 'strategy-filter'];
    filters.forEach(filterId => {
        const filter = document.getElementById(filterId);
        if (filter) {
            filter.addEventListener('change', renderAccountsTable);
        }
    });
}

// Modal Functions
function showAddAccountModal() {
    currentEditingAccount = null;
    document.getElementById('modal-title').textContent = 'Add New Account';
    clearAccountForm();
    document.getElementById('account-modal').classList.add('modal--active');
}

function openAccountModal(accountId) {
    const account = accounts.find(acc => acc.accountId === accountId);
    if (!account) return;
    
    currentEditingAccount = account;
    document.getElementById('modal-title').textContent = `Edit Account: ${accountId}`;
    populateAccountForm(account);
    document.getElementById('account-modal').classList.add('modal--active');
}

function closeAccountModal() {
    document.getElementById('account-modal').classList.remove('modal--active');
    currentEditingAccount = null;
}

function populateAccountForm(account) {
    document.getElementById('form-account-id').value = account.accountId;
    document.getElementById('form-minor-name').value = account.minorName;
    document.getElementById('form-custodian').value = account.custodian;
    document.getElementById('form-advisor').value = account.advisor;
    document.getElementById('form-minor-age').value = account.minorAge;
    document.getElementById('form-current-value').value = account.currentValue;
    document.getElementById('form-realized-gains').value = account.ytdRealizedGains;
    document.getElementById('form-unrealized-gains').value = account.ytdUnrealizedGains;
    document.getElementById('form-ytd-income').value = account.ytdIncome;
    document.getElementById('form-expected-distributions').value = account.expectedDistributions;
    document.getElementById('form-notes').value = account.notes;
    
    updateTaxAnalysis();
}

function clearAccountForm() {
    document.getElementById('account-form').reset();
    updateTaxAnalysis();
}

function updateTaxAnalysis() {
    const realizedGains = parseFloat(document.getElementById('form-realized-gains').value) || 0;
    const ytdIncome = parseFloat(document.getElementById('form-ytd-income').value) || 0;
    const expectedDistributions = parseFloat(document.getElementById('form-expected-distributions').value) || 0;
    
    const totalUnearnedIncome = realizedGains + ytdIncome + expectedDistributions;
    const remainingTaxBudget = KIDDIE_THRESHOLD - totalUnearnedIncome;
    
    let recommendedStrategy = 'N/A';
    if (remainingTaxBudget > 0) {
        recommendedStrategy = 'Gain Harvesting';
    } else if (remainingTaxBudget < 0) {
        recommendedStrategy = 'Loss Harvesting';
    }
    
    document.getElementById('total-unearned-income').textContent = formatCurrency(totalUnearnedIncome);
    document.getElementById('remaining-tax-budget').textContent = formatCurrency(remainingTaxBudget);
    document.getElementById('recommended-strategy').textContent = recommendedStrategy;
}

// Add event listeners for tax analysis updates
document.addEventListener('DOMContentLoaded', function() {
    const taxInputs = ['form-realized-gains', 'form-ytd-income', 'form-expected-distributions'];
    taxInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', updateTaxAnalysis);
        }
    });
});

function saveAccount() {
    const formData = {
        accountId: document.getElementById('form-account-id').value,
        minorName: document.getElementById('form-minor-name').value,
        custodian: document.getElementById('form-custodian').value,
        advisor: document.getElementById('form-advisor').value,
        minorAge: parseInt(document.getElementById('form-minor-age').value) || 0,
        currentValue: parseFloat(document.getElementById('form-current-value').value) || 0,
        ytdRealizedGains: parseFloat(document.getElementById('form-realized-gains').value) || 0,
        ytdUnrealizedGains: parseFloat(document.getElementById('form-unrealized-gains').value) || 0,
        ytdIncome: parseFloat(document.getElementById('form-ytd-income').value) || 0,
        expectedDistributions: parseFloat(document.getElementById('form-expected-distributions').value) || 0,
        notes: document.getElementById('form-notes').value
    };
    
    // Calculate derived fields
    formData.totalUnearnedIncome = formData.ytdRealizedGains + formData.ytdIncome + formData.expectedDistributions;
    formData.remainingTaxBudget = KIDDIE_THRESHOLD - formData.totalUnearnedIncome;
    
    if (formData.remainingTaxBudget > 0) {
        formData.taxStrategy = 'Gain Harvesting';
        formData.priority = formData.remainingTaxBudget > 1000 ? 'Low' : 'Medium';
    } else {
        formData.taxStrategy = 'Loss Harvesting';
        formData.priority = 'High';
    }
    
    formData.status = 'Pending Review';
    
    if (currentEditingAccount) {
        // Update existing account
        const index = accounts.findIndex(acc => acc.accountId === currentEditingAccount.accountId);
        if (index !== -1) {
            accounts[index] = { ...accounts[index], ...formData };
        }
    } else {
        // Add new account
        accounts.push(formData);
    }
    
    closeAccountModal();
    renderAccountsTable();
    updateDashboard();
}

// Workflow Tracker
function renderWorkflowTracker() {
    const container = document.getElementById('workflow-phases');
    
    container.innerHTML = workflowPhases.map((phase, phaseIndex) => `
        <div class="workflow-phase">
            <div class="workflow-phase__header">
                <h3 class="workflow-phase__title">${phase.phase}</h3>
                <span class="workflow-phase__status status-badge ${getStatusClass(phase.status)}">${phase.status}</span>
            </div>
            <div class="workflow-phase__meta">
                <div><strong>Target Date:</strong> ${phase.targetDate}</div>
                <div><strong>Responsible:</strong> ${phase.responsible}</div>
            </div>
            <ul class="workflow-phase__tasks">
                ${phase.tasks.map((task, taskIndex) => `
                    <li class="workflow-phase__task">
                        <div class="workflow-phase__task-checkbox ${phase.status === 'Completed' ? 'workflow-phase__task-checkbox--checked' : ''}" 
                             onclick="toggleTask(${phaseIndex}, ${taskIndex})">
                            ${phase.status === 'Completed' ? '✓' : ''}
                        </div>
                        <span>${task}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
    `).join('');
}

function getStatusClass(status) {
    switch (status) {
        case 'Completed': return 'status-badge--positive';
        case 'In Progress': return 'status-badge--medium';
        case 'Not Started': return 'status-badge--negative';
        default: return '';
    }
}

function toggleTask(phaseIndex, taskIndex) {
    const phase = workflowPhases[phaseIndex];
    if (phase.status === 'Not Started') {
        phase.status = 'In Progress';
    } else if (phase.status === 'In Progress') {
        phase.status = 'Completed';
    } else {
        phase.status = 'Not Started';
    }
    renderWorkflowTracker();
}

// Reports
function generateThresholdReport() {
    const overThresholdAccounts = accounts.filter(acc => acc.totalUnearnedIncome > KIDDIE_THRESHOLD);
    
    const reportContent = `
        <table class="report-table">
            <thead>
                <tr>
                    <th>Account ID</th>
                    <th>Minor Name</th>
                    <th>Total Unearned Income</th>
                    <th>Amount Over Threshold</th>
                    <th>Recommended Strategy</th>
                </tr>
            </thead>
            <tbody>
                ${overThresholdAccounts.map(acc => `
                    <tr>
                        <td>${acc.accountId}</td>
                        <td>${acc.minorName}</td>
                        <td class="currency">${formatCurrency(acc.totalUnearnedIncome)}</td>
                        <td class="currency negative">${formatCurrency(acc.totalUnearnedIncome - KIDDIE_THRESHOLD)}</td>
                        <td>${acc.taxStrategy}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    showReport('Threshold Exceedance Report', reportContent);
}

function generateGainsReport() {
    const reportContent = `
        <table class="report-table">
            <thead>
                <tr>
                    <th>Account ID</th>
                    <th>Minor Name</th>
                    <th>Current Value</th>
                    <th>YTD Realized Gains</th>
                    <th>YTD Unrealized Gains</th>
                    <th>Total Potential Gains</th>
                </tr>
            </thead>
            <tbody>
                ${accounts.map(acc => `
                    <tr>
                        <td>${acc.accountId}</td>
                        <td>${acc.minorName}</td>
                        <td class="currency">${formatCurrency(acc.currentValue)}</td>
                        <td class="currency ${acc.ytdRealizedGains >= 0 ? 'positive' : 'negative'}">${formatCurrency(acc.ytdRealizedGains)}</td>
                        <td class="currency ${acc.ytdUnrealizedGains >= 0 ? 'positive' : 'negative'}">${formatCurrency(acc.ytdUnrealizedGains)}</td>
                        <td class="currency">${formatCurrency(acc.ytdRealizedGains + acc.ytdUnrealizedGains)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    showReport('Unrealized Gains Summary', reportContent);
}

function generateStatusReport() {
    const statusCounts = accounts.reduce((acc, account) => {
        acc[account.status] = (acc[account.status] || 0) + 1;
        return acc;
    }, {});
    
    const advisorCounts = accounts.reduce((acc, account) => {
        acc[account.advisor] = (acc[account.advisor] || 0) + 1;
        return acc;
    }, {});
    
    const reportContent = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
            <div>
                <h4>Status Summary</h4>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(statusCounts).map(([status, count]) => `
                            <tr>
                                <td>${status}</td>
                                <td>${count}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div>
                <h4>By Advisor</h4>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>Advisor</th>
                            <th>Accounts</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(advisorCounts).map(([advisor, count]) => `
                            <tr>
                                <td>${advisor}</td>
                                <td>${count}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    showReport('Implementation Status Report', reportContent);
}

function generateComplianceReport() {
    const reportContent = `
        <table class="report-table">
            <thead>
                <tr>
                    <th>Account ID</th>
                    <th>Minor Name</th>
                    <th>Last Review Date</th>
                    <th>Strategy Implemented</th>
                    <th>Documentation Status</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>
                ${accounts.map(acc => `
                    <tr>
                        <td>${acc.accountId}</td>
                        <td>${acc.minorName}</td>
                        <td>2025-06-23</td>
                        <td>${acc.taxStrategy}</td>
                        <td>Complete</td>
                        <td>${acc.notes}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    showReport('Compliance Documentation Report', reportContent);
}

function showReport(title, content) {
    document.getElementById('report-title').textContent = title;
    document.getElementById('report-content').innerHTML = content;
    document.getElementById('report-output').style.display = 'block';
    document.getElementById('report-output').scrollIntoView({ behavior: 'smooth' });
}

function closeReport() {
    document.getElementById('report-output').style.display = 'none';
}

function exportReport() {
    alert('Export functionality would integrate with your reporting system. Report data has been prepared for download.');
}

// Utility Functions
function formatCurrency(amount) {
    if (amount === 0) return '$0';
    if (Math.abs(amount) >= 1000) {
        return '$' + (amount / 1000).toFixed(1) + 'K';
    }
    return '$' + amount.toLocaleString();
}

function startReview() {
    alert('Review process initiated. Navigate to Workflow Tracker to monitor progress.');
    document.querySelector('[data-tab="workflow-tracker"]').click();
}