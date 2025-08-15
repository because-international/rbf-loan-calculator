import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock the calculator functions to avoid complex calculations in UI tests
jest.mock('../calculator', () => ({
  calculateSolvedValue: jest.fn(() => 82),
  formatValue: jest.fn((key, value) => {
    console.log('formatValue called with:', key, value);
    const suffixes = {
      factorRate: 'x',
      amountReceived: '',
      loanAmount: '',
      loanFee: '',
      revenueShareRate: '%',
      repaymentPeriod: ' months',
      profitMargin: '%',
      annualRevenue: ''
    };
    const prefixes = {
      amountReceived: '$',
      loanAmount: '$',
      loanFee: '$',
      annualRevenue: '$'
    };

    // Match the actual formatValue implementation
    const formattedValue = key === 'factorRate' ? value.toFixed(2) :
                             key.includes('Rate') || key === 'profitMargin' ? value.toFixed(1) :
                             key === 'repaymentPeriod' ? Math.round(value) :
                             Math.round(value);

    const result = `${prefixes[key] || ''}${formattedValue}${suffixes[key] || ''}`;
    console.log('formatValue returning:', result);
    return result;
  }),
  getMonthlyPayment: jest.fn(() => 91.67),
  getRepaymentYears: jest.fn(() => '6.8'),
  getEffectiveAnnualRate: jest.fn(() => 12.5)
}));

describe('Debug test', () => {
  test('check what is rendered', () => {
    render(<App />);

    // Log all elements with text content
    const allElements = screen.getAllByText(/.*/);
    console.log('All elements:');
    allElements.forEach(element => {
      if (element.textContent && element.textContent.trim()) {
        console.log(`"${element.textContent}" - class: ${element.className}`);
      }
    });

    // Try to find the repayment period element
    try {
      const repaymentPeriodElement = screen.getByText('82 months');
      console.log('Found repayment period element:', repaymentPeriodElement);
      console.log('Element class:', repaymentPeriodElement.className);
    } catch (error) {
      console.log('Could not find "82 months" element');
    }
  });
});
