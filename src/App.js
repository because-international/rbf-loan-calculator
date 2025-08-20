import React, { useState, useEffect, useRef, useMemo } from 'react';
import { calculateSolvedValue, formatValue, getMonthlyPayment, getRepaymentYears, getEffectiveAnnualRate } from './calculator.js';
import { updateUrlWithoutReload, parseUrlParams, updateUrlParams } from './urlHandler.js';
import { debounce, throttle } from './utils.js';
import RBFTermsPage from './RBFTermsPage.js';

// Variables that can be solved for (excluding derived values)
const solvableVariables = {
  factorRate: { label: 'Factor Rate (multiplier)', suffix: 'x', step: 0.1 },
  amountReceived: { label: 'Amount Received ($)', prefix: '$', step: 100 },
  revenueShareRate: { label: 'Revenue Share Rate (%)', suffix: '%', step: 0.5 },
  repaymentPeriod: { label: 'Repayment Period (months)', suffix: ' months', step: 1 },
  profitMargin: { label: 'Annual Profit Margin (%)', suffix: '%', step: 1 },
  annualRevenue: { label: 'Annual Revenue ($)', prefix: '$', step: 1000 }
};

const RBFCalculator = () => {
// Performance monitoring
  const renderCount = useRef(0);

  // Log when entering component - only in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[PERFORMANCE] App component mounted');
      return () => console.log('[PERFORMANCE] App component unmounted');
    }
  }, []);

  // Log component render - only in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      renderCount.current += 1;
      if (renderCount.current <= 20) { // Only log first 20 renders to avoid console spam
        console.log(`[PERFORMANCE] App component render #${renderCount.current}`);
      }
    }
  });
  // State to track current page (calculator or terms)
  const [currentPage, setCurrentPage] = useState('calculator');

  // Helper function to determine color class based on factor rate
  const getFactorRateColorClass = (factorRate) => {
    return factorRate <= 1 ? 'text-red-600 font-bold' : 'text-gray-800';
  };

  // Create debounced versions of functions that update state frequently
  const debouncedUpdateUrl = useMemo(() => debounce((values, solveFor) => {
    updateUrlWithoutReload(values, solveFor);
  }, 300), []);

  const throttledUpdateUrl = useMemo(() => throttle((values, solveFor) => {
    updateUrlWithoutReload(values, solveFor);
  }, 1000), []);

  // Parse URL parameters to initialize state
  const getInitialState = () => {
    const urlParams = parseUrlParams();
    const defaultValues = {
      factorRate: 1.5,
      amountReceived: 5000,
      revenueShareRate: 5,
      repaymentPeriod: 24,
      profitMargin: 16,
      annualRevenue: 22000
    };

    // Merge URL parameters with default values
    return { ...defaultValues, ...urlParams };
  };

  const [values, setValues] = useState(getInitialState());

  // New state to track raw input values
  const [inputValues, setInputValues] = useState({});

  // Initialize solveFor from URL parameters or default to 'repaymentPeriod'
  const getUrlSolveFor = () => {
    const urlParams = parseUrlParams();
    return urlParams.solveFor || 'repaymentPeriod';
  };

  const [solveFor, setSolveFor] = useState(getUrlSolveFor());

  // Derived values that are always calculated
  const derivedValues = useMemo(() => ({
    repaymentObligation: values.amountReceived * values.factorRate,
    costOfCapital: (values.amountReceived * values.factorRate) - values.amountReceived
  }), [values.amountReceived, values.factorRate]);

  // All variables for display purposes
  const variables = {
    factorRate: { label: 'Factor Rate (multiplier)', suffix: 'x', step: 0.1 },
    amountReceived: { label: 'Amount Received ($)', prefix: '$', step: 100 },
    repaymentObligation: { label: 'Repayment Obligation ($)', prefix: '$', step: 100 },
    costOfCapital: { label: 'Cost of Capital ($)', prefix: '$', step: 100 },
    revenueShareRate: { label: 'Revenue Share Rate (%)', suffix: '%', step: 0.5 },
    repaymentPeriod: { label: 'Repayment Period (months)', suffix: ' months', step: 1 },
    profitMargin: { label: 'Annual Profit Margin (%)', suffix: '%', step: 1 },
    annualRevenue: { label: 'Annual Revenue ($)', prefix: '$', step: 1000 }
  };

  const handleInputChange = (key, newValue) => {
    // Update the inputValues state with the raw input
    setInputValues(prev => ({
      ...prev,
      [key]: newValue
    }));

    // Also update the main values state for immediate calculations
    const updatedValues = {
      ...values,
      [key]: parseFloat(newValue) || 0
    };

    setValues(updatedValues);

    // Update URL parameters with debouncing to prevent excessive updates
    debouncedUpdateUrl(updatedValues, solveFor);
  };

  const handleInputBlur = (key) => {
    // When input loses focus, format the value and update both states
    const rawValue = inputValues[key] || values[key] || 0;
    const formattedValue = parseFloat(rawValue).toFixed(2);

    // Update the main values state with the formatted value
    const updatedValues = {
      ...values,
      [key]: parseFloat(formattedValue)
    };

    setValues(updatedValues);

    // Update inputValues to show the formatted value
    setInputValues(prev => ({
      ...prev,
      [key]: formattedValue
    }));

    // Update URL parameters with debouncing
    debouncedUpdateUrl(updatedValues, solveFor);
  };

  const handleInputFocus = (key) => {
    // When input gains focus, populate inputValues with current value if not already set
    if (!(key in inputValues)) {
      setInputValues(prev => ({
        ...prev,
        [key]: values[key] || 0
      }));
    }
  };

  const handleSolveForChange = (newSolveFor) => {
    setSolveFor(newSolveFor);

    // Update URL parameters with throttling
    throttledUpdateUrl(values, newSolveFor);
  };

  const handleShareClick = () => {
    // Create a merged object of current values and input values
    // For each key in values, use the input value if it exists, otherwise use the stored value
    const currentValues = { ...values };
    Object.keys(inputValues).forEach(key => {
      if (inputValues[key] !== undefined && inputValues[key] !== null) {
        // Try to parse the input value as a number, otherwise keep as string
        const parsedValue = parseFloat(inputValues[key]);
        currentValues[key] = isNaN(parsedValue) ? inputValues[key] : parsedValue;
      }
    });

    // Create a new URL with the current values and solveFor
    const currentUrl = updateUrlParams(currentValues, solveFor);

    // Copy to clipboard
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        // Show alert notification
        alert('URL copied to clipboard!');
      })
      .catch(err => {
        // Fallback for browsers that don't support clipboard API
        console.error('Failed to copy URL: ', err);
        // Create a temporary textarea to copy the URL
        const textarea = document.createElement('textarea');
        textarea.value = currentUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('URL copied to clipboard!');
      });
  };
// Function to navigate to terms page
  const navigateToTerms = () => {
    setCurrentPage('terms');
  };

  // Function to navigate back to calculator
  const navigateToCalculator = () => {
    setCurrentPage('calculator');
  };

  // Combine state values with derived values for calculations
  const calculationValues = useMemo(() => ({ ...values, ...derivedValues }), [values, derivedValues]);
  const solvedValue = useMemo(() => calculateSolvedValue(calculationValues, solveFor), [calculationValues, solveFor]);

  // Update the solved value in our state for consistency
  useEffect(() => {
    // Only update state for solvable variables, not derived values
    if (solvableVariables[solveFor]) {
      const updatedValues = {
        ...values,
        [solveFor]: solvedValue
      };

      setValues(updatedValues);

      // Also update inputValues for the solved value
      setInputValues(prev => ({
        ...prev,
        [solveFor]: solvedValue.toFixed(2)
      }));

      // Update URL parameters with throttling
      throttledUpdateUrl(updatedValues, solveFor);
    }
  }, [solveFor, solvedValue, values, throttledUpdateUrl]);

  // If we're on the terms page, render the RBFTermsPage component
  if (currentPage === 'terms') {
    return <RBFTermsPage onBackToCalculator={navigateToCalculator} />;
  }

  // Otherwise, render the calculator
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <h1 className="text-3xl font-bold text-center">Revenue Based Finance Calculator</h1>
            <p className="text-center mt-2 opacity-90">Calculate RBF loan terms and payments</p>
          </div>
          {/* How to Use Information */}
          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <h3 className="font-bold text-gray-800 mb-2">How to Use:</h3>
            <p className="text-gray-600 mb-3">
              Select the variable you want to calculate from the dropdown above, then enter values for all other fields.
              The calculator will automatically compute your selected variable and show a detailed summary below.
            </p>
            <button
              onClick={navigateToTerms}
              className="text-blue-600 hover:text-blue-800 font-medium underline"
            >
              Learn more about RBF terms and examples
            </button>
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
                        value={inputValues[key] !== undefined ? inputValues[key] : (values[key] || 0)}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        onBlur={() => handleInputBlur(key)}
                        onFocus={() => handleInputFocus(key)}
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Loan Summary</h2>
                <button
                  onClick={handleShareClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                >
                  Share
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Estimated Monthly Payment</div>
                  <div className="text-xl font-bold text-gray-800">
                    ${getMonthlyPayment(values).toFixed(2)}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Repayment Period (months)</div>
                  <div className="text-xl font-bold text-gray-800">
                    {getRepaymentYears(calculationValues.repaymentPeriod)} years
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500 mb-1">Total Cost of Capital</div>
                  <div className="text-xl font-bold text-gray-800">
                    ${derivedValues.costOfCapital.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">Calculation Details:</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Monthly Revenue: ${(values.annualRevenue / 12).toFixed(2)}</li>
                  <li>Estimated Monthly Payment: {values.revenueShareRate}% of monthly revenue</li>
                  <li>Factor Rate: <span className={getFactorRateColorClass(values.factorRate)}>{formatValue('factorRate', values.factorRate)}</span> (pay back <span className={getFactorRateColorClass(values.factorRate)}>{formatValue('factorRate', values.factorRate)}</span> borrowed amount)</li>
                  <li>Effective Annual Rate of Return: {(getEffectiveAnnualRate(calculationValues.factorRate, calculationValues.repaymentPeriod) || 0).toFixed(2)}%</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RBFCalculator;
