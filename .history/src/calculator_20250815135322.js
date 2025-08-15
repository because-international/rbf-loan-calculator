// Calculator functions for Revenue Based Finance calculations

export const calculateSolvedValue = (values, solveFor) => {
  const monthlyRevenue = values.annualRevenue / 12;
  const monthlyPayment = monthlyRevenue * (values.revenueShareRate / 100);

  switch (solveFor) {
    case 'factorRate':
      if (values.repaymentPeriod === 0 || monthlyPayment === 0) return 0;
      const totalRepayment = monthlyPayment * values.repaymentPeriod;
      return values.amountReceived > 0 ? totalRepayment / values.amountReceived : 0;

    case 'amountReceived':
      return values.repaymentObligation / values.factorRate;

    case 'revenueShareRate':
      if (values.repaymentPeriod === 0 || values.annualRevenue === 0) return 0;
      const requiredMonthlyPayment = values.repaymentObligation / values.repaymentPeriod;
      return (requiredMonthlyPayment / monthlyRevenue) * 100;

    case 'repaymentPeriod':
      if (monthlyPayment === 0) return 0;
      return values.repaymentObligation / monthlyPayment;

    case 'profitMargin':
      // This is independent - would need additional business logic
      return values.profitMargin;

    case 'annualRevenue':
      if (values.revenueShareRate === 0 || values.repaymentPeriod === 0) return 0;
      const requiredMonthlyRev = values.repaymentObligation / values.repaymentPeriod;
      return (requiredMonthlyRev / (values.revenueShareRate / 100)) * 12;

    default:
      return 0;
  }
};

export const formatValue = (key, value) => {
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

  const variable = variables[key];
  const formattedValue = value.toFixed(2);

  return `${variable.prefix || ''}${formattedValue}${variable.suffix || ''}`;
};

export const getMonthlyPayment = (values) => {
  const monthlyRevenue = values.annualRevenue / 12;
  return monthlyRevenue * (values.revenueShareRate / 100);
};

export const getRepaymentYears = (repaymentPeriod) => {
  return (repaymentPeriod / 12).toFixed(2);
};

export const getEffectiveAnnualRate = (factorRate, repaymentPeriod) => {
  if (repaymentPeriod === 0 || !factorRate || factorRate <= 0) return 0;
  const result = ((Math.pow(factorRate, 12/repaymentPeriod) - 1) * 100);
  return isNaN(result) ? 0 : result;
};
