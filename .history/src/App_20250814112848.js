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


        Revenue Based Finance Calculator

        {/* Solve For Selection */}

          What would you like to solve for?
          <select
            value={solveFor}
            onChange={(e) => handleSolveForChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.entries(variables).map(([key, variable]) => (
              {variable.label}
            ))}



        {/* Input Grid */}

          {Object.entries(variables).map(([key, variable]) => (
            <div key={key} className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              key === solveFor ? 'bg-green-50 border-green-300 shadow-md' : 'bg-gray-50 border-gray-200'
            }`}>

                {variable.label}
                {key === solveFor &&  (CALCULATED)}

              {key === solveFor ? (

                  {formatValue(key, solvedValue)}

              ) : (
                <input
                  type="number"
                  value={values[key]}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  step={variable.step}
                  className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              )}

          ))}


        {/* Summary Information */}

          Loan Summary


              Monthly Payment
              ${Math.round(getMonthlyPayment()).toLocaleString()}


              Repayment Period
              {getRepaymentYears()} years


              Total Cost of Capital
              ${Math.round(values.loanFee).toLocaleString()}




            Calculation Details:

              • Monthly Revenue: ${Math.round(values.annualRevenue / 12).toLocaleString()}
              • Monthly Payment: {values.revenueShareRate}% of monthly revenue
              • Factor Rate: {values.factorRate}x (pay back {values.factorRate}x borrowed amount)
              • Effective Annual Rate: {getEffectiveAnnualRate().toFixed(1)}%




        {/* Additional Info */}

          How to Use:

            Select the variable you want to calculate from the dropdown above, then enter values for all other fields.
            The calculator will automatically compute your selected variable and show a detailed summary below.




  );
};

export default RBFCalculator;
