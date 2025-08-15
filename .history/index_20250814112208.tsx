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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Revenue Based Finance Calculator</h1>

      {/* Solve For Selection */}
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">What would you like to solve for?</h2>
        <select
          value={solveFor}
          onChange={(e) => handleSolveForChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg text-lg"
        >
          {Object.entries(variables).map(([key, variable]) => (
            <option key={key} value={key}>{variable.label}</option>
          ))}
        </select>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {Object.entries(variables).map(([key, variable]) => (
          <div key={key} className={`p-4 rounded-lg border-2 ${key === solveFor ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'}`}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {variable.label}
              {key === solveFor && <span className="text-green-600 font-bold"> (CALCULATED)</span>}
            </label>
            {key === solveFor ? (
              <div className="p-3 bg-green-100 rounded border text-lg font-semibold text-green-800">
                {formatValue(key, solvedValue)}
              </div>
            ) : (
              <input
                type="number"
                value={values[key]}
                onChange={(e) => handleInputChange(key, e.target.value)}
                step={variable.step}
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          </div>
        ))}
      </div>

      {/* Summary Information */}
      <div className="bg-gray-100 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Loan Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-600">Monthly Payment</div>
            <div className="text-lg font-semibold">${Math.round(getMonthlyPayment()).toLocaleString()}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-600">Repayment Period</div>
            <div className="text-lg font-semibold">{getRepaymentYears()} years</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-600">Total Cost of Capital</div>
            <div className="text-lg font-semibold">${Math.round(values.loanFee).toLocaleString()}</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded">
          <h4 className="font-semibold mb-2">Calculation Notes:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Monthly Revenue: ${Math.round(values.annualRevenue / 12).toLocaleString()}</li>
            <li>• Monthly Payment: {values.revenueShareRate}% of monthly revenue</li>
            <li>• Factor Rate: {values.factorRate}x (you pay back {values.factorRate}x what you borrowed)</li>
            <li>• Effective Annual Rate: {((Math.pow(values.factorRate, 12/values.repaymentPeriod) - 1) * 100).toFixed(1)}%</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RBFCalculator;
