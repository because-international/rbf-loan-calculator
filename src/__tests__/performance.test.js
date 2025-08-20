import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock window.location
const mockWindowLocation = {
  origin: 'http://localhost:3000',
  pathname: '/',
  search: '',
  href: 'http://localhost:3000/'
};

// Mock the calculator functions to avoid complex calculations
jest.mock('../calculator', () => ({
  calculateSolvedValue: jest.fn(() => 82),
  formatValue: jest.fn((key, value) => {
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

    const variable = variables[key];
    if (!variable) return ''; // Return empty string if key not found

    const formattedValue = value.toFixed(2);

    return `${variable.prefix || ''}${formattedValue}${variable.suffix || ''}`;
  }),
  getMonthlyPayment: jest.fn(() => 91.67),
  getRepaymentYears: jest.fn(() => '6.8'),
  getEffectiveAnnualRate: jest.fn(() => 12.5)
}));

// Mock the urlHandler functions
jest.mock('../urlHandler', () => ({
  updateUrlWithoutReload: jest.fn(),
  parseUrlParams: jest.fn(() => ({})),
  updateUrlParams: jest.fn(() => 'http://localhost:3000/?factorRate=1.5&amountReceived=5000')
}));

// Import App after mocks are set up
const App = require('../App').default;

describe('Performance Tests', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock window.location
    delete window.location;
    window.location = mockWindowLocation;

    // Set up the parseUrlParams mock to return default values
    const urlHandler = require('../urlHandler');
    urlHandler.parseUrlParams.mockImplementation(() => ({
      solveFor: 'repaymentPeriod'
    }));
  });

  test('should handle rapid input changes without excessive re-renders', () => {
    render(<App />);

    // Get the amount received input
    const amountReceivedInput = screen.getByLabelText('Amount Received ($)');

    // Track the number of times updateUrlWithoutReload is called
    const initialCallCount = jest.mocked(require('../urlHandler').updateUrlWithoutReload).mock.calls.length;

    // Simulate rapid typing
    fireEvent.change(amountReceivedInput, { target: { value: '10000' } });
    fireEvent.change(amountReceivedInput, { target: { value: '15000' } });
    fireEvent.change(amountReceivedInput, { target: { value: '20000' } });
    fireEvent.change(amountReceivedInput, { target: { value: '25000' } });
    fireEvent.change(amountReceivedInput, { target: { value: '30000' } });

    // Allow time for debouncing
    jest.runAllTimers();

    // Check that updateUrlWithoutReload was called a reasonable number of times
    const finalCallCount = jest.mocked(require('../urlHandler').updateUrlWithoutReload).mock.calls.length;
    const callsDuringTest = finalCallCount - initialCallCount;

    // With debouncing, we should have fewer calls than the number of input changes
    expect(callsDuringTest).toBeLessThan(5);
  });

  test('should handle solveFor changes with throttling', () => {
    render(<App />);

    // Get the solveFor select
    const solveForSelect = screen.getByRole('combobox');

    // Track the number of times updateUrlWithoutReload is called
    const initialCallCount = jest.mocked(require('../urlHandler').updateUrlWithoutReload).mock.calls.length;

    // Simulate rapid solveFor changes
    fireEvent.change(solveForSelect, { target: { value: 'factorRate' } });
    fireEvent.change(solveForSelect, { target: { value: 'amountReceived' } });
    fireEvent.change(solveForSelect, { target: { value: 'revenueShareRate' } });
    fireEvent.change(solveForSelect, { target: { value: 'repaymentPeriod' } });

    // Allow time for throttling
    jest.runAllTimers();

    // Check that updateUrlWithoutReload was called a reasonable number of times
    const finalCallCount = jest.mocked(require('../urlHandler').updateUrlWithoutReload).mock.calls.length;
    const callsDuringTest = finalCallCount - initialCallCount;

    // With throttling, we should have fewer calls than the number of changes
    expect(callsDuringTest).toBeLessThan(4);
  });

  test('should maintain acceptable performance with repeated interactions', () => {
    render(<App />);

    // Get elements
    const amountReceivedInput = screen.getByLabelText('Amount Received ($)');
    const solveForSelect = screen.getByRole('combobox');

    // Track performance
    const startTime = performance.now();

    // Simulate multiple interactions
    for (let i = 0; i < 50; i++) {
      fireEvent.change(amountReceivedInput, { target: { value: `${10000 + i * 100}` } });
      if (i % 10 === 0) {
        fireEvent.change(solveForSelect, { target: { value: 'factorRate' } });
        fireEvent.change(solveForSelect, { target: { value: 'amountReceived' } });
      }
    }

    // Allow time for debouncing and throttling
    jest.runAllTimers();

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    // Should complete in a reasonable time (less than 100ms for 50 interactions)
    expect(totalTime).toBeLessThan(100);
  });
});
