import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock the calculator functions to avoid complex calculations in UI tests
jest.mock('../calculator', () => ({
  calculateSolvedValue: jest.fn(() => 82),
  formatValue: jest.fn((key, value) => {
    // Debug log to see what's being called
    console.log(`formatValue called with key: ${key}, value: ${value}`);
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
    console.log(`variable for key ${key}:`, variable);
    const formattedValue = key === 'factorRate' ? value.toFixed(2) :
                          key.includes('Rate') || key === 'profitMargin' ? value.toFixed(1) :
                          key === 'repaymentPeriod' ? Math.round(value) :
                          Math.round(value);

    console.log(`formattedValue: ${formattedValue}`);
    const result = `${variable.prefix || ''}${formattedValue}${variable.suffix || ''}`;
    console.log(`result: ${result}`);
    return result;
  }),
  getMonthlyPayment: jest.fn(() => 91.67),
  getRepaymentYears: jest.fn(() => '6.8'),
  getEffectiveAnnualRate: jest.fn(() => 12.5)
}));

describe('RBFCalculator App', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Revenue Based Finance Calculator')).toBeInTheDocument();
  });

  test('displays all input fields', () => {
    render(<App />);

    expect(screen.getByLabelText('Factor Rate (multiplier)')).toBeInTheDocument();
    expect(screen.getByLabelText('Loan Principle')).toBeInTheDocument();
    expect(screen.getByLabelText('Total Loan Amount')).toBeInTheDocument();
    expect(screen.getByLabelText('Loan Fee')).toBeInTheDocument();
    expect(screen.getByText('Repayment Period', { selector: 'label' })).toBeInTheDocument();
    expect(screen.getByLabelText('Annual Profit Margin')).toBeInTheDocument();
    expect(screen.getByLabelText('Annual Revenue')).toBeInTheDocument();
  });

  test('allows changing the solveFor variable', () => {
    render(<App />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'factorRate' } });

    expect(select.value).toBe('factorRate');
  });

  test('displays calculated value for the selected variable', () => {
    render(<App />);

    // The repaymentPeriod should be calculated by default
    // Let's debug what's actually being rendered
    try {
      const repaymentPeriodDiv = screen.getByTestId('calculated-repaymentPeriod');
      console.log('repaymentPeriodDiv textContent:', repaymentPeriodDiv.textContent);
      console.log('repaymentPeriodDiv innerHTML:', repaymentPeriodDiv.innerHTML);

      // Check that the calculated value is displayed correctly
      expect(repaymentPeriodDiv).toHaveTextContent('82 months');
      expect(repaymentPeriodDiv).toHaveClass('text-2xl font-bold text-gray-800');
    } catch (error) {
      console.log('Available elements with test ids:');
      const allElements = screen.getAllByTestId(/.*/);
      allElements.forEach(element => {
        console.log(`  ${element.getAttribute('data-testid')}: ${element.textContent}`);
      });
      throw error;
    }
  });

  test('allows input changes for non-calculated variables', () => {
    render(<App />);

    const loanPrincipleInput = screen.getByLabelText('Loan Principle');
    fireEvent.change(loanPrincipleInput, { target: { value: '10000' } });

    expect(loanPrincipleInput.value).toBe('10000');
  });

  test('displays loan summary information', () => {
    render(<App />);

    expect(screen.getByText('Loan Summary')).toBeInTheDocument();
    expect(screen.getByText('Monthly Payment')).toBeInTheDocument();
    expect(screen.getByText('Repayment Period', { selector: 'div.text-sm.text-gray-500.mb-1' })).toBeInTheDocument();
    expect(screen.getByText('Total Cost of Capital')).toBeInTheDocument();
  });

  test('displays calculation details', () => {
    render(<App />);

    expect(screen.getByText('Calculation Details:')).toBeInTheDocument();
    expect(screen.getByText(/Monthly Revenue/)).toBeInTheDocument();
    expect(screen.getByText(/Monthly Payment: \d+%/)).toBeInTheDocument();
    expect(screen.getByText(/Factor Rate: \d+\.?\d*x/)).toBeInTheDocument();
    expect(screen.getByText(/Effective Annual Rate/)).toBeInTheDocument();
  });
});
