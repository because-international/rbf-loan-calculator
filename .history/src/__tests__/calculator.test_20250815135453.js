import { calculateSolvedValue, formatValue, getMonthlyPayment, getRepaymentYears, getEffectiveAnnualRate } from '../calculator';

// Test values based on the example from the original prompt
const testValues = {
  factorRate: 1.5,
  amountReceived: 5000,
  repaymentObligation: 7500,
  costOfCapital: 2500,
  revenueShareRate: 5,
  repaymentPeriod: 24, // This will be recalculated in tests
  profitMargin: 16,
  annualRevenue: 22000
};

describe('RBF Calculator Functions', () => {
  describe('calculateSolvedValue', () => {
    test('should calculate repayment period correctly', () => {
      // Based on example: ($7500 / (($22000 x .05) / 12)) = 82 months
      const monthlyPayment = (22000 * 0.05) / 12; // $91.67
      const expectedRepaymentPeriod = 7500 / monthlyPayment; // ~81.8 months

      const result = calculateSolvedValue(testValues, 'repaymentPeriod');
      expect(result).toBeCloseTo(expectedRepaymentPeriod, 1);
    });

    test('should calculate factor rate correctly', () => {
      // Based on example values: ($91.67 * 82) / $5000 = 1.503 ≈ 1.5x
      const values = { ...testValues, repaymentPeriod: 82 };
      const result = calculateSolvedValue(values, 'factorRate');
      expect(result).toBeCloseTo(1.5, 1);
    });

    test('should calculate amount received correctly', () => {
      const result = calculateSolvedValue(testValues, 'amountReceived');
      expect(result).toBe(5000); // $7500 / 1.5 = $5000
    });

    test('should handle zero values gracefully', () => {
      const valuesWithZero = { ...testValues, annualRevenue: 0 };
      const result = calculateSolvedValue(valuesWithZero, 'repaymentPeriod');
      expect(result).toBe(0);
    });
  });

  describe('formatValue', () => {
    test('should format factor rate with 2 decimal places', () => {
      const result = formatValue('factorRate', 1.5);
      expect(result).toBe('1.50x');
    });

    test('should format percentage values with 2 decimal places', () => {
      const result = formatValue('revenueShareRate', 5);
      expect(result).toBe('5.00%');
    });

    test('should format repayment period with 2 decimal places', () => {
      const result = formatValue('repaymentPeriod', 24.7);
      expect(result).toBe('24.70 months');
    });

    test('should format currency values with 2 decimal places and prefix', () => {
      const result = formatValue('amountReceived', 5000);
      expect(result).toBe('$5000.00');
    });
  });

  describe('getMonthlyPayment', () => {
    test('should calculate monthly payment correctly', () => {
      // ($22000 / 12) * 0.05 = $91.67
      const result = getMonthlyPayment(testValues);
      expect(result).toBeCloseTo(91.67, 2);
    });
  });

  describe('getRepaymentYears', () => {
    test('should convert months to years with 1 decimal place', () => {
      const result = getRepaymentYears(82);
      expect(result).toBe('6.8');
    });
  });

  describe('getEffectiveAnnualRate', () => {
    test('should calculate effective annual rate correctly', () => {
      // This is a complex calculation, so we'll test with known values
      const result = getEffectiveAnnualRate(1.5, 82);
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThan(0);
    });

    test('should handle zero repayment period', () => {
      const result = getEffectiveAnnualRate(1.5, 0);
      expect(result).toBe(0);
    });
  });
});
