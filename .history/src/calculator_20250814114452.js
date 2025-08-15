// Calculator functions for Revenue Based Finance calculations

export const calculateSolvedValue = (values, solveFor) => {
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

export const formatValue = (key, value) => {
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

  const variable = variables[key];
  const formattedValue = key === 'factorRate' ? value.toFixed(2) :
                        key.includes('Rate') || key === 'profitMargin' ? value.toFixed(1) :
                        key === 'repaymentPeriod' ? Math.round(value) :
                        Math.round(value);

  return `${variable.prefix || ''}${formattedValue}${variable.suffix || ''}`;
};

export const getMonthlyPayment = (values) => {
  const monthlyRevenue = values.annualRevenue / 12;
  return monthlyRevenue * (values.revenueShareRate / 100);
};

export const getRepaymentYears = (repaymentPeriod) => {
  return (repaymentPeriod / 12).toFixed(1);
};

export const getEffectiveAnnualRate = (factorRate, repaymentPeriod) => {
  if (repaymentPeriod === 0) return 0;
  return ((Math.pow(factorRate, 12/repaymentPeriod) - 1) * 100);
};
