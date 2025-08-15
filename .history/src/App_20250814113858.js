import React, { useState, useEffect } from 'react';

const RBFCalculator = () => {
  const [values, setValues] = useState({
    factorRate: 1.5,
    loanPrinciple: 5000,
    loanAmount: 7500,
    loanFee: 2500,
    revenueShareRate: 5,
    repaymentPeriod: 24,
    profitMargin: 16,
    annualRevenue: 22000
  });

  const [solveFor, setSolveFor] = useState('repaymentPeriod');

  const variables = {
    factorRate: { label: 'Factor Rate (multiplier)', suffix: 'x', step: 0.1 },
    loanPrinciple: { label: 'Loan Principle', prefix: '$', step: 100 },
    loanAmount: { label: 'Total Loan Amount', prefix: '$', step: 100 },
    loanFee: { label: 'Loan Fee', prefix: '$', step: 100 },
    revenueShareRate: { label: 'Revenue Share Rate', suffix: '%', step: 0.5 },
    repaymentPeriod: { label: 'Repayment Period', suffix: ' months', step: 1 },
    profitMargin: { label: 'Annual Profit Margin', suffix: '%', step: 1 },
    annualRevenue: { label: 'Annual Revenue', prefix: '$', step: 1000 }
  };

  const calculateSolvedValue = () => {
    const monthlyRevenue = values.annualRevenue / 12;
    const monthlyPayment = monthlyRevenue * (values.revenueShareRate / 100);

    switch (solveFor) {
      case 'factorRate':
        if (values.repaymentPeriod === 0 || monthlyPayment === 0) return 0;
        const totalRepayment = monthlyPayment * values.repaymentPeriod;
        return values.loanPrinciple > 0 ? totalRepayment / values.loanPrinciple : 0;

      case 'loanPrinciple':
        return values.loanAmount / values.factorRate;

      case 'loanAmount':
        return values.loanPrinciple * values.factorRate;

      case 'loanFee':
        return values.loanAmount - values.loanPrinciple;

      case 'revenueShareRate':
        if (values.repaymentPeriod === 0 || values.annualRevenue === 0) return 0;
        const requiredMonthlyPayment = values.loanAmount / values.repaymentPeriod;
        return (requiredMonthlyPayment / monthlyRevenue) * 100;

      case 'repaymentPeriod':
        if (monthlyPayment === 0) return 0;
        return values.loanAmount / monthlyPayment;

      case 'profitMargin':
        // This is independent - would need additional business logic
        return values.profitMargin;

      case 'annualRevenue':
        if (values.revenueShareRate === 0 || values.repaymentPeriod === 0) return 0;
        const requiredMonthlyRev = values.loanAmount / values.repaymentPeriod;
        return (requiredMonthlyRev / (values.revenueShareRate / 100)) * 12;

      default:
        return 0;
    }
  };

  const formatValue = (key, value) => {
    const variable = variables[key];
    const formattedValue = key === 'factorRate' ? value.toFixed(2) :
                          key.includes('Rate') || key === 'profitMargin' ? value.toFixed(1) :
                          key === 'repaymentPeriod' ? Math.round(value) :
                          Math.round(value);

    return `${variable.prefix || ''}${formattedValue}${variable.suffix || ''}`;
  };

  const handleInputChange = (key, newValue) => {
    setValues(prev => ({
      ...prev,
      [key]: parseFloat(newValue) || 0
    }));
  };

  const handleSolveForChange = (newSolveFor) => {
    setSolveFor(newSolveFor);
  };

  const solvedValue = calculateSolvedValue();

  // Update the solved value in our state for consistency
  useEffect(() => {
    setValues(prev => ({
      ...prev,
      [solveFor]: solvedValue
    }));
  }, [solveFor, solvedValue]);

  const getMonthlyPayment = () => {
    const monthlyRevenue = values.annualRevenue / 12;
    return monthlyRevenue * (values.revenueShareRate / 100);
  };

  const getRepaymentYears = () => {
    return (values.repaymentPeriod / 12).toFixed(1);
  };

  const getEffectiveAnnualRate = () => {
    if (values.repaymentPeriod === 0) return 0;
    return ((Math.pow(values.factorRate, 12/values.repaymentPeriod) - 1) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <h1 className="text-3xl font-bold text-center">Revenue Based Finance Calculator</h1>
            <p className="text-center mt-2 opacity-90">Calculate RBF loan terms and payments</p>
          </div>

          <div className="p-6">
            {/* Solve For Selection */}
            <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
              <label className="block text-lg font-medium text-gray-700 mb-3">
                What would you like to solve for?
              </label>
              <select
                value={solveFor}
                onChange={(e) => handleSolveForChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.entries(variables).map(([key, variable]) => (
                  <option key={key} value={key}>
                    {variable.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Input Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {Object.entries(variables).map(([key, variable]) => (
                <div key={key} className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  key === solveFor ? 'bg-green-50 border-green-300 shadow-md' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <label className="font-medium text-gray-700">
                      {variable.label}
                    </label>
                    {key === solveFor && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        CALCULATED
                      </span>
                    )}
                  </div>

                  {key === solveFor ? (
                    <div className="text-2xl font-bold text-gray-800">
                      {formatValue(key, solvedValue)}
                    </div>
                  ) : (
                    <input
                      type="number"
                      value={values[key]}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      step={variable.step}
                      className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Summary Information */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Loan Summary</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Monthly Payment</div>
                  <div className="text-xl font-bold text-gray-800">
                    ${Math.round(getMonthlyPayment()).toLocaleString()}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Repayment Period</div>
                  <div className="text-xl font-bold text-gray-800">
                    {getRepaymentYears()} years
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Total Cost of Capital</div>
                  <div className="text-xl font-bold text-gray-800">
                    ${Math.round(values.loanFee).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">Calculation Details:</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Monthly Revenue: ${Math.round(values.annualRevenue / 12).toLocaleString()}</li>
                  <li>Monthly Payment: {values.revenueShareRate}% of monthly revenue</li>
                  <li>Factor Rate: {values.factorRate}x (pay back {values.factorRate}x borrowed amount)</li>
                  <li>Effective Annual Rate: {getEffectiveAnnualRate().toFixed(1)}%</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <h3 className="font-bold text-gray-800 mb-2">How to Use:</h3>
            <p className="text-gray-600">
              Select the variable you want to calculate from the dropdown above, then enter values for all other fields.
              The calculator will automatically compute your selected variable and show a detailed summary below.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RBFCalculator;
