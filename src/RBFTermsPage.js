import React from 'react';

const RBFTermsPage = ({ onBackToCalculator }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with back button */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <button
              onClick={onBackToCalculator}
              className="flex items-center text-white hover:text-blue-200 transition-colors duration-200 mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Calculator
            </button>
            <h1 className="text-3xl font-bold text-center">Because International RBF Terms and Example</h1>
            <p className="text-center mt-2 opacity-90">An example of revenue based financing terms and a glossary</p>
          </div>

          <div className="p-6">
            {/* Introduction */}
            <div className="mb-8">
              <p className="text-gray-700 mb-4">
                Revenue Based Financing (RBF) works when the company's profit margin percentage is well known, stable, and higher than the Revenue Share agreed to by the company and the lender. We can see this in the simple example below.
              </p>
            </div>

            {/* Example Section */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Example</h2>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Repayment Cap (Factor Rate)</div>
                    <div className="text-xl font-bold text-gray-800">1.2x</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Upfront Capital (Loan Amount)</div>
                    <div className="text-xl font-bold text-gray-800">$12,000 USD</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">Revenue Share Rate</div>
                    <div className="text-xl font-bold text-gray-800">5%</div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-4">
                In this example, if the unit economics of the company include a profit margin (revenue over and above all costs and expenses) of anything greater than or equal to 5%, this means the company will be able to repay their loan successfully.
              </p>

              <p className="text-gray-700 mb-4">
                If the company's profit margin per unit is less than 5%, the company will be unable to pay back their loan with revenues, and thus would not be a good candidate for this set of terms. In this case, it would be a good option to see if the option to modify the Revenue Share Rate to something less than the company's profit margin per unit, ideally to a point where the company still has some profit margin over and above the loan payment so that the company is not cash flow constrained.
              </p>

              <p className="text-gray-700 mb-4">
                Note, once again, there is no interest rate with an RBF loan. The Repayment Cap (Factor Rate) is used in lieu of interest rates to allow for a flexible repayment schedule based on monthly revenue.
              </p>

              <p className="text-gray-700 mb-4">
                For the purposes of this example, let's assume the company's margin is 10% so, we've made the loan.
              </p>

              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <div className="font-bold text-gray-800 mb-2">Company's Margin: 10%</div>
              </div>

              <p className="text-gray-700 mb-4">
                Now, based on this, let's look at what happens month by month in all different kinds of scenarios.
              </p>
            </div>

            {/* Monthly Scenarios */}
            <div className="mb-10">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Month 1: The typical month.</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                <li>Sales revenue: $2,500 USD</li>
                <li>Expenses: $2,250 USD (10%)</li>
                <li>Profit/Loss before loan payment: $250 USD (profit)</li>
                <li>Rev Share Rate (see above): 5% of Revenue ($2,500 x 5%) = $125 USD</li>
                <li>Profit/Loss after loan payment: $125 USD (profit)</li>
                <li>Loan left to repay: ($12,000 - $125) = $11,875 USD</li>
              </ul>
              <p className="text-gray-700 mb-6">
                Let's say this month is a typical one. Sales come in at $2500 USD. Expenses are also typical at $2250. Based on the sales revenue ($2,500) and the Revenue Share Rate agreed upon in the loan (5%), the company will pay Because International $2,500 x 5% = $125 USD. This will leave the company $125 in profit this month.
              </p>

              <h3 className="text-xl font-bold text-gray-800 mb-4">Month 2: The no-revenue month.</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                <li>Sales revenue: $0 USD</li>
                <li>Expenses: $1,000 USD</li>
                <li>Profit/Loss before loan payment: -$1,000 USD (loss)</li>
                <li>Rev Share Rate: 5% of Revenue ($0 x 5%) = $0 USD</li>
                <li>Profit/Loss after loan payment: -$1,000 USD (loss)</li>
                <li>Loan left to repay: ($11,875 USD from previous month - $0 payment) = $11,875 USD</li>
              </ul>
              <p className="text-gray-700 mb-6">
                This month, some factors (political unrest, natural disaster, infrastructure disruption, etc) prohibited the company from making any money at all. Because the payment is calculated as a percentage of the revenue, and there was no revenue this month, there is no payment required this month.
              </p>

              <h3 className="text-xl font-bold text-gray-800 mb-4">Month 3: The break-even month.</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                <li>Sales revenue: $1,000 USD</li>
                <li>Expenses: $1,000 USD</li>
                <li>Profit/Loss before loan payment: $0 USD (break even)</li>
                <li>Rev Share Rate: 5% of Revenue ($1,000 x 5%) = $50 USD</li>
                <li>Profit/Loss after loan payment: -$50 USD (loss)</li>
                <li>Loan left to repay: ($11,875 USD from previous month - $50 payment) = $11,825 USD</li>
              </ul>
              <p className="text-gray-700 mb-6">
                In month 3, there were higher expenses than are normal, but there was some revenue recovery. In this very rare case, there would be a payment of $50 required because payments are based on the <em>revenue</em>, not the <em>profit</em> the company makes. These situations should be extremely rare if the company's profit margin is healthy, which is why an RBF loan should only be agreed upon by companies with reasonable profit margins, and why the Revenue Share Rates should be significantly less than the average profit margin. In fact, to mitigate this risk even further, it would be best if the agreed-upon Revenue Share Rates for companies in cyclical industries are lower than the lowest margin experienced in the past 24 months. This buffer mitigates risks of low revenue / high expense months, which otherwise would put the company into a bad financial cash position.
              </p>

              <h3 className="text-xl font-bold text-gray-800 mb-4">Month 4: The big revenue month.</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-4">
                <li>Sales revenue: $10,000 USD</li>
                <li>Expenses: $6,000 USD</li>
                <li>Profit/Loss before loan payment: $4,000 USD (profit)</li>
                <li>Rev Share Rate: 5% of Revenue ($10,000 x 5%) = $500 USD</li>
                <li>Profit/Loss after loan payment: $3,500 USD (profit)</li>
                <li>Loan left to repay: ($11,825 USD from previous month - $500 payment) = $11,325 USD</li>
              </ul>
              <p className="text-gray-700">
                In month 4, sales came back fast and furious. It's a great month, and expenses were kept in check, so the company was able to profit $4,000 USD over and above expenses before any payments to Because. With a Revenue Share Rate of 5% and revenue of $10,000, the company pays $500 to Because this month. Now, if the company believes they are on such solid footing that they want to pay more on the loan, they can feel free to do so without any prepayment penalties. Every payment reduces the principal of the loan since the loan amount is set for the entire duration and never increases.
              </p>
            </div>

            {/* Glossary Section */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Glossary / Structure</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Upfront Capital (Loan Amount)</h3>
                  <p className="text-gray-700">
                    The RBF provider (Because International) gives a lump sum of capital to the company. The amount is usually determined by a multiple of the company's monthly or annual revenue. Upfront Capital (Loan Amount) is inclusive of the Repayment Cap (Factor Rate).
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Revenue Share Rate</h3>
                  <p className="text-gray-700">
                    In return, the company agrees to pay the RBF provider a fixed percentage of its gross monthly revenue. This percentage, or "revenue share rate," can vary, but it's typically in the range of 1% - 10% per month, and should be set below the company's profit margin.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Repayment Cap (Factor Rate)</h3>
                  <p className="text-gray-700">
                    This is a crucial element that distinguishes RBF from a traditional loan. The total amount the company repay is capped at a pre-agreed multiple of the initial investment. This multiple, often called a "factor rate," is usually between 1.04x to 2.5x the original principal. Once the company has repaid this total amount, the agreement is complete, and no further payments are required. For example, a 1.3x cap on a $10,000 loan means the company will repay a total of $13,000. In this case, the Upfront Capital (Loan Amount) is $13,000, while the Repayment Cap (Factor Rate) is $3,000.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">No Fixed Repayment Schedule</h3>
                  <p className="text-gray-700">
                    Unlike a traditional loan with a fixed monthly payment, RBF payments are tied directly to the company's revenue (not profit). This means that in high-revenue months, the payment is larger, and the loan is paid off faster. In low-revenue months, the payment is smaller, easing the financial burden of the business.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">No Collateral or Equity Dilution</h3>
                  <p className="text-gray-700">
                    A major advantage of RBF is that it's typically unsecured, meaning it doesn't require a personal guarantee or collateral. It's also non-dilutive, as the company doesn't have to give up any ownership or control to the RBF provider. In lieu of collateral, the business is generally required to be in business for a certain period of time, have a revenue minimum, a profit margin minimum (unit economics understanding), and be generally growing revenues for the past 3-12 months.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Duration</h3>
                  <p className="text-gray-700">
                    There is no fixed term, as the repayment period depends on the company's revenue. Faster revenue growth means a shorter repayment period.
                  </p>
                </div>
              </div>
            </div>

            {/* Factor Rates Section */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">How are Factor Rates Typically Determined?</h3>
              <p className="text-gray-700 mb-4">
                It's important to understand what goes into the initial determination of a factor rate. Because International assess several key factors to set the rate, which is essentially how we price the risk of the loan:
              </p>

              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>
                  <strong>Financial Health and Stability:</strong> The company's monthly and annual regular, stable revenue, gross margins, and customer churn rate. A healthier, more stable business with high growth prospects gets a lower factor rate.
                </li>
                <li>
                  <strong>Industry and Business Model:</strong> Industries with predictable, recurring revenue are considered less risky than those with volatile or seasonal revenue, which can influence the factor rate.
                </li>
                <li>
                  <strong>Company History:</strong> How long the company has been in business, its repayment history, financial literacy, financial statement accuracy over time, and the experience of the founding team.
                </li>
                <li>
                  <strong>Credit History:</strong> While RBF is less credit-score-dependent than traditional loans, a strong credit history, especially with the same lender (Because International) over time, can still lead to better terms.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RBFTermsPage;
