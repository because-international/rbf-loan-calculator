import React, { useState, useEffect } from 'react';
import { calculateSolvedValue, formatValue, getMonthlyPayment, getRepaymentYears, getEffectiveAnnualRate } from './calculator.js';

const RBFCalculator = () => {
  // Helper function to determine color class based on factor rate
  const getFactorRateColorClass = (factorRate) => {
    return factorRate <= 1 ? 'text-red-600 font-bold' : 'text-gray-800';
  };

  const [values, setValues] = useState({
    factorRate: 1.5,
    amountReceived: 5000,
    revenueShareRate: 5,
    repaymentPeriod: 24,
    profitMargin: 16,
    annualRevenue: 22000
  });

  const [solveFor, setSolveFor] = useState('repaymentPeriod');

  // Derived values that are always calculated
  const derivedValues = {
    repaymentObligation: values.amountReceived * values.factorRate,
    costOfCapital: (values.amountReceived * values.factorRate) - values.amountReceived
  };

  // All variables for display purposes
  const variables = {
    factorRate: { label: 'Factor Rate (multiplier)', suffix: 'x', step: 0.1 },
    amountReceived: { label: 'Amount Received', prefix: '$', step: 100 },
    repaymentObligation: { label: 'Repayment Obligation', prefix: '$', step: 100 },
    costOfCapital: { label: 'Cost of Capital', prefix: '$', step: 100 },
    revenueShareRate: { label: 'Revenue Share Rate', suffix: '%', step: 0.5 },
    repaymentPeriod: { label: 'Repayment Period', suffix: ' months', step: 1 },
    profitMargin: { label: 'Annual Profit Margin', suffix: '%', step: 1 },
    annualRevenue: { label: 'Annual Revenue', prefix: '$', step: 1000 }
  };

  // Variables that can be solved for (excluding derived values)
  const solvableVariables = {
    factorRate: { label: 'Factor Rate (multiplier)', suffix: 'x', step: 0.1 },
    amountReceived: { label: 'Amount Received', prefix: '$', step: 100 },
    revenueShareRate: { label: 'Revenue Share Rate', suffix: '%', step: 0.5 },
    repaymentPeriod: { label: 'Repayment Period', suffix: ' months', step: 1 },
    profitMargin: { label: 'Annual Profit Margin', suffix: '%', step: 1 },
    annualRevenue: { label: 'Annual Revenue', prefix: '$', step: 1000 }
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

  // Combine state values with derived values for calculations
  const calculationValues = { ...values, ...derivedValues };
  const solvedValue = calculateSolvedValue(calculationValues, solveFor);

  // Update the solved value in our state for consistency
  useEffect(() => {
    // Only update state for solvable variables, not derived values
    if (solvableVariables[solveFor]) {
      setValues(prev => ({
        ...prev,
        [solveFor]: solvedValue
      }));
    }
  }, [solveFor, solvedValue]);

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
              <label htmlFor="solveForSelect" className="block text-lg font-medium text-gray-700 mb-3">
                What would you like to solve for?
              </label>
              <select
                id="solveForSelect"
                value={solveFor}
                onChange={(e) => handleSolveForChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.entries(solvableVariables).map(([key, variable]) => (
                  <option key={key} value={key}>
                    {variable.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Input Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {Object.entries(variables).map(([key, variable]) => {
                // Determine if this is a derived value (always calculated)
                const isDerivedValue = key === 'repaymentObligation' || key === 'costOfCapital';
                // Determine if this is the currently solved value
                const isSolvedValue = key === solveFor;

                // For derived values, we always show them as calculated
                // For other values, follow the existing logic
                const showAsCalculated = isDerivedValue || isSolvedValue;

                // For derived values, use the derived value; for others, use state value or solved value
                const displayValue = isDerivedValue
                  ? derivedValues[key]
                  : (isSolvedValue ? solvedValue : values[key]);

                return (
                  <div key={key} className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    isSolvedValue ? (key === 'factorRate' && values.factorRate <= 1 ? 'bg-red-50 border-red-300 shadow-md' : 'bg-green-50 border-green-300 shadow-md') : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <label
                        htmlFor={showAsCalculated ? `calculated-${key}` : `input-${key}`}
                        className="font-medium text-gray-700"
                      >
                        {variable.label}
                      </label>
                      {isSolvedValue && (
                        <span className={`${
                          key === 'factorRate' && values.factorRate <= 1
                            ? 'bg-red-500'
                            : 'bg-green-500'
                        } text-white text-xs px-2 py-1 rounded-full`}>
                          CALCULATED
                        </span>
                      )}
                    </div>

                    {showAsCalculated ? (
                      <div
                        id={`calculated-${key}`}
                        className="text-2xl font-bold text-gray-800"
                        role="status"
                        aria-live="polite"
                        data-testid={`calculated-${key}`}
                      >
                        {formatValue(key, displayValue)}
                      </div>
                    ) : (
                      <input
                        id={`input-${key}`}
                        type="number"
                        value={values[key]}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        step={variable.step}
                        className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Summary Information */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Loan Summary</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Monthly Payment</div>
                  <div className="text-xl font-bold text-gray-800">
                    ${Math.round(getMonthlyPayment(values)).toLocaleString()}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Repayment Period</div>
                  <div className="text-xl font-bold text-gray-800">
                    {getRepaymentYears(calculationValues.repaymentPeriod)} years
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Total Cost of Capital</div>
                  <div className="text-xl font-bold text-gray-800">
                    ${Math.round(derivedValues.costOfCapital).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">Calculation Details:</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Monthly Revenue: ${Math.round(values.annualRevenue / 12).toLocaleString()}</li>
                  <li>Monthly Payment: {values.revenueShareRate}% of monthly revenue</li>
                  <li>Factor Rate: <span className={getFactorRateColorClass(values.factorRate)}>{values.factorRate}</span>x (pay back <span className={getFactorRateColorClass(values.factorRate)}>{values.factorRate}</span>x borrowed amount)</li>
                  <li>Effective Annual Rate: {(getEffectiveAnnualRate(calculationValues.factorRate, calculationValues.repaymentPeriod) || 0).toFixed(1)}%</li>
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
