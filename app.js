// Application data
const accountsData = [
    {
        id: "UTMA001",
        clientName: "Smith Family - Emma",
        accountValue: 125000,
        currentIncome: 3200,
        childAge: 16,
        parentTaxBracket: 24,
        optimizationStatus: "Needs Attention",
        lastRebalance: "2024-08-15"
    },
    {
        id: "UTMA002", 
        clientName: "Johnson Family - Michael",
        accountValue: 85000,
        currentIncome: 2100,
        childAge: 14,
        parentTaxBracket: 22,
        optimizationStatus: "Optimized",
        lastRebalance: "2024-11-20"
    },
    {
        id: "UGMA003",
        clientName: "Davis Family - Sarah",
        accountValue: 250000,
        currentIncome: 6800,
        childAge: 17,
        parentTaxBracket: 32,
        optimizationStatus: "Critical",
        lastRebalance: "2024-06-10"
    }
];

const kiddieThresholds2025 = {
    taxFreeAmount: 1350,
    childRateAmount: 1350,
    parentRateThreshold: 2700,
    standardDeduction: 1350
};

const workflowPhases = [
    {
        phase: "Phase 1: Account Analysis",
        timeframe: "January-February",
        status: "completed",
        tasks: [
            { text: "Generate complete UTMA/UGMA account list", completed: true },
            { text: "Document current custodians", completed: true },
            { text: "Verify beneficiary ages", completed: true },
            { text: "Calculate unrealized gains/losses", completed: true },
            { text: "Assess income projections", completed: true }
        ]
    },
    {
        phase: "Phase 2: Tax Planning", 
        timeframe: "March-April",
        status: "completed",
        tasks: [
            { text: "Calculate tax budgets per account", completed: true },
            { text: "Identify gain realization candidates", completed: true },
            { text: "Evaluate tax-loss harvesting", completed: true },
            { text: "Document parent tax brackets", completed: true },
            { text: "Coordinate with CPAs", completed: true }
        ]
    },
    {
        phase: "Phase 3: Implementation",
        timeframe: "May-November", 
        status: "active",
        tasks: [
            { text: "Execute rebalancing transactions", completed: true },
            { text: "Realize gains to thresholds", completed: true },
            { text: "Implement tax-loss harvesting", completed: false },
            { text: "Document transactions", completed: false },
            { text: "Monitor ongoing income", completed: false }
        ]
    },
    {
        phase: "Phase 4: Year-End Review",
        timeframe: "December",
        status: "pending",
        tasks: [
            { text: "Final income calculations", completed: false },
            { text: "Execute remaining trades", completed: false },
            { text: "Prepare tax documentation", completed: false },
            { text: "Update investment policies", completed: false }
        ]
    }
];

// DOM elements
let currentTab = 'dashboard';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupTabNavigation();
    loadDashboardData();
    setupAccountAnalysis();
    setupKiddieCalculator();
    loadWorkflowPhases();
    setupReportButtons();
}

// Tab navigation
function setupTabNavigation() {
    const tabs = document.querySelectorAll('.nav__tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTab = this.getAttribute('data-tab');
            
            if (!targetTab) return;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('nav__tab--active'));
            this.classList.add('nav__tab--active');
            
            // Update active content
            tabContents.forEach(content => {
                content.classList.remove('tab-content--active');
            });
            
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('tab-content--active');
            }
            
            currentTab = targetTab;
        });
    });
}

// Dashboard functionality
function loadDashboardData() {
    // Update KPI cards
    updateKPIs();
    
    // Load accounts table
    loadAccountsTable();
}

function updateKPIs() {
    const totalAccounts = accountsData.length;
    const totalAssets = accountsData.reduce((sum, account) => sum + account.accountValue, 0);
    const optimizedAccounts = accountsData.filter(account => account.optimizationStatus === 'Optimized').length;
    const potentialSavings = calculatePotentialSavings();
    
    document.getElementById('total-accounts').textContent = totalAccounts;
    document.getElementById('total-assets').textContent = formatCurrency(totalAssets);
    document.getElementById('optimized-accounts').textContent = optimizedAccounts;
    document.getElementById('potential-savings').textContent = formatCurrency(potentialSavings);
}

function calculatePotentialSavings() {
    // Simple calculation based on excess income over thresholds
    let totalSavings = 0;
    accountsData.forEach(account => {
        if (account.currentIncome > kiddieThresholds2025.parentRateThreshold) {
            const excessIncome = account.currentIncome - kiddieThresholds2025.parentRateThreshold;
            const potentialSavings = excessIncome * (account.parentTaxBracket / 100) * 0.5; // Simplified calculation
            totalSavings += potentialSavings;
        }
    });
    return totalSavings;
}

function loadAccountsTable() {
    const tbody = document.getElementById('accounts-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    accountsData.forEach(account => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="font-mono">${account.id}</td>
            <td>${account.clientName}</td>
            <td>${formatCurrency(account.accountValue)}</td>
            <td>${formatCurrency(account.currentIncome)}</td>
            <td>${account.childAge}</td>
            <td><span class="status-badge status-badge--${getStatusClass(account.optimizationStatus)}">${account.optimizationStatus}</span></td>
            <td>${formatDate(account.lastRebalance)}</td>
        `;
        tbody.appendChild(row);
    });
}

function getStatusClass(status) {
    switch(status) {
        case 'Optimized': return 'optimized';
        case 'Needs Attention': return 'attention';
        case 'Critical': return 'critical';
        default: return 'attention';
    }
}

// Account Analysis
function setupAccountAnalysis() {
    const analyzeBtn = document.getElementById('analyze-btn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', performAnalysis);
    }
}

function performAnalysis() {
    const accountValueInput = document.getElementById('account-value');
    const currentIncomeInput = document.getElementById('current-income');
    const childAgeInput = document.getElementById('child-age');
    const parentBracketInput = document.getElementById('parent-bracket');
    
    if (!accountValueInput || !currentIncomeInput || !childAgeInput || !parentBracketInput) {
        console.error('Form inputs not found');
        return;
    }
    
    const accountValue = parseFloat(accountValueInput.value);
    const currentIncome = parseFloat(currentIncomeInput.value);
    const childAge = parseInt(childAgeInput.value);
    const parentBracket = parseInt(parentBracketInput.value);
    
    // More lenient validation - only require non-zero, non-NaN values
    if (isNaN(accountValue) || accountValue <= 0 || 
        isNaN(currentIncome) || currentIncome <= 0 || 
        isNaN(childAge) || childAge <= 0) {
        document.getElementById('analysis-results').innerHTML = '<p class="text-error">Please enter valid values for all fields.</p>';
        return;
    }
    
    const analysis = calculateTaxAnalysis(currentIncome, parentBracket, childAge);
    displayAnalysisResults(analysis, accountValue, currentIncome, childAge, parentBracket);
}

function calculateTaxAnalysis(income, parentBracket, childAge) {
    const thresholds = kiddieThresholds2025;
    let taxOwed = 0;
    let taxFree = 0;
    let childRate = 0;
    let parentRate = 0;
    
    // Calculate tax breakdown
    if (income <= thresholds.taxFreeAmount) {
        taxFree = income;
    } else if (income <= thresholds.parentRateThreshold) {
        taxFree = thresholds.taxFreeAmount;
        childRate = (income - thresholds.taxFreeAmount) * 0.10;
        taxOwed = childRate;
    } else {
        taxFree = thresholds.taxFreeAmount;
        childRate = thresholds.childRateAmount * 0.10;
        parentRate = (income - thresholds.parentRateThreshold) * (parentBracket / 100);
        taxOwed = childRate + parentRate;
    }
    
    // Calculate optimization potential
    const optimizedIncome = Math.min(income, thresholds.parentRateThreshold);
    const optimizedTax = optimizedIncome <= thresholds.taxFreeAmount ? 0 : 
                        (optimizedIncome - thresholds.taxFreeAmount) * 0.10;
    const potentialSavings = taxOwed - optimizedTax;
    
    return {
        currentTax: taxOwed,
        optimizedTax: optimizedTax,
        potentialSavings: potentialSavings,
        excessIncome: Math.max(0, income - thresholds.parentRateThreshold),
        isOptimized: income <= thresholds.parentRateThreshold
    };
}

function displayAnalysisResults(analysis, accountValue, currentIncome, childAge, parentBracket) {
    const resultsDiv = document.getElementById('analysis-results');
    if (!resultsDiv) return;
    
    let recommendationText = '';
    let recommendationClass = '';
    
    if (analysis.isOptimized) {
        recommendationText = 'This account is optimally positioned for tax efficiency. The current income level maximizes the use of favorable tax rates without triggering higher parent tax rates.';
        recommendationClass = 'text-success';
    } else {
        recommendationText = `Consider rebalancing to reduce current income by $${formatNumber(analysis.excessIncome)}. This could potentially save $${formatNumber(analysis.potentialSavings)} in taxes annually.`;
        recommendationClass = 'text-warning';
    }
    
    resultsDiv.innerHTML = `
        <div class="result-item">
            <span class="result-label">Current Tax Liability</span>
            <span class="result-value">${formatCurrency(analysis.currentTax)}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Optimized Tax Liability</span>
            <span class="result-value">${formatCurrency(analysis.optimizedTax)}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Potential Annual Savings</span>
            <span class="result-value">${formatCurrency(analysis.potentialSavings)}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Excess Income Above Threshold</span>
            <span class="result-value">${formatCurrency(analysis.excessIncome)}</span>
        </div>
        
        <div class="recommendation">
            <div class="recommendation__title">Recommendation</div>
            <p class="recommendation__text ${recommendationClass}">${recommendationText}</p>
        </div>
    `;
}

// Kiddie Tax Calculator
function setupKiddieCalculator() {
    const calculateBtn = document.getElementById('calculate-btn');
    const parentRate = document.getElementById('parent-rate');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateKiddieTax);
    }
    
    if (parentRate) {
        parentRate.addEventListener('change', function() {
            const display = document.getElementById('parent-rate-display');
            if (display) {
                display.textContent = this.value + '%';
            }
        });
    }
}

function calculateKiddieTax() {
    const incomeInput = document.getElementById('unearned-income');
    const parentRateInput = document.getElementById('parent-rate');
    
    if (!incomeInput || !parentRateInput) return;
    
    const income = parseFloat(incomeInput.value) || 0;
    const parentRate = parseInt(parentRateInput.value) || 24;
    
    if (income === 0) {
        const totalTaxEl = document.getElementById('total-tax');
        if (totalTaxEl) {
            totalTaxEl.textContent = '$0';
        }
        return;
    }
    
    const thresholds = kiddieThresholds2025;
    let totalTax = 0;
    
    if (income <= thresholds.taxFreeAmount) {
        totalTax = 0;
    } else if (income <= thresholds.parentRateThreshold) {
        totalTax = (income - thresholds.taxFreeAmount) * 0.10;
    } else {
        const childTax = thresholds.childRateAmount * 0.10;
        const parentTax = (income - thresholds.parentRateThreshold) * (parentRate / 100);
        totalTax = childTax + parentTax;
    }
    
    const totalTaxEl = document.getElementById('total-tax');
    if (totalTaxEl) {
        totalTaxEl.textContent = formatCurrency(totalTax);
    }
}

// Workflow Phases
function loadWorkflowPhases() {
    const container = document.getElementById('workflow-phases');
    if (!container) return;
    
    container.innerHTML = '';
    
    workflowPhases.forEach(phase => {
        const phaseDiv = document.createElement('div');
        phaseDiv.className = `workflow-phase workflow-phase--${phase.status}`;
        
        const tasksHtml = phase.tasks.map(task => `
            <div class="workflow-task ${task.completed ? 'workflow-task--completed' : ''}">
                <div class="workflow-task__checkbox ${task.completed ? 'workflow-task__checkbox--checked' : ''}" 
                     data-task="${task.text}">
                    ${task.completed ? '✓' : ''}
                </div>
                <div class="workflow-task__text">${task.text}</div>
            </div>
        `).join('');
        
        phaseDiv.innerHTML = `
            <div class="workflow-phase__header">
                <h3 class="workflow-phase__title">${phase.phase}</h3>
                <div class="workflow-phase__timeframe">${phase.timeframe}</div>
            </div>
            <div class="workflow-tasks">
                ${tasksHtml}
            </div>
        `;
        
        container.appendChild(phaseDiv);
    });
    
    // Add click handlers for checkboxes
    document.querySelectorAll('.workflow-task__checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', function() {
            const task = this.closest('.workflow-task');
            const isCompleted = task.classList.contains('workflow-task--completed');
            
            if (isCompleted) {
                task.classList.remove('workflow-task--completed');
                this.classList.remove('workflow-task__checkbox--checked');
                this.textContent = '';
            } else {
                task.classList.add('workflow-task--completed');
                this.classList.add('workflow-task__checkbox--checked');
                this.textContent = '✓';
            }
        });
    });
}

// Report buttons
function setupReportButtons() {
    // Use setTimeout to ensure DOM is fully loaded
    setTimeout(() => {
        const reportButtons = document.querySelectorAll('#reports .btn');
        reportButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const reportType = this.textContent.trim();
                showReportDialog(reportType);
            });
        });
    }, 100);
}

function showReportDialog(reportType) {
    alert(`${reportType} functionality would be implemented here. This would generate and download the requested report.`);
}

// Utility functions
function formatCurrency(amount) {
    if (isNaN(amount)) return '$0';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatNumber(number) {
    if (isNaN(number)) return '0';
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}