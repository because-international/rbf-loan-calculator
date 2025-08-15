import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock the calculator functions to avoid complex calculations in UI tests
jest.mock('../calculator', () => ({
  calculateSolvedValue: jest.fn(() => 82),
  formatValue: jest.fn((key, value) => {
    const variables = {
      factorRate: { label: 'Factor Rate (multiplier)', suffix: 'x', step: 0.1 },
      amountReceived: { label: 'Amount Received ($)', prefix: '$', step: 100 },
      repaymentObligation: { label: 'Repayment Obligation', prefix: '$', step: 100 },
      costOfCapital: { label: 'Cost of Capital', prefix: '$', step: 100 },
      revenueShareRate: { label: 'Revenue Share Rate (%)', suffix: '%', step: 0.5 },
      repaymentPeriod: { label: 'Repayment Period (months)', suffix: ' months', step: 1 },
      profitMargin: { label: 'Annual Profit Margin (%)', suffix: '%', step: 1 },
      annualRevenue: { label: 'Annual Revenue', prefix: '$', step: 1000 }
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

describe('RBFCalculator App', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Revenue Based Finance Calculator')).toBeInTheDocument();
  });

  test('displays all input fields and calculated values', () => {
    render(<App />);

    expect(screen.getByLabelText('Factor Rate (multiplier)')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount Received ($)')).toBeInTheDocument();
    // Repayment Obligation and Cost of Capital are now always calculated, so they won't have input labels
    // Instead, they should be displayed as calculated values
    expect(screen.getByText('Repayment Period (months)', { selector: 'label' })).toBeInTheDocument();
    expect(screen.getByLabelText('Annual Profit Margin (%)')).toBeInTheDocument();
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
    const repaymentPeriodDiv = screen.getByTestId('calculated-repaymentPeriod');

    // Check that the calculated value is displayed correctly
    expect(repaymentPeriodDiv).toHaveTextContent('82.00 months');
    expect(repaymentPeriodDiv).toHaveClass('text-2xl font-bold text-gray-800');
  });

  test('allows input changes for non-calculated variables', () => {
    render(<App />);

    const amountReceivedInput = screen.getByLabelText('Amount Received ($)');
    fireEvent.change(amountReceivedInput, { target: { value: '10000' } });

    expect(amountReceivedInput.value).toBe('10000.00');
  });

  test('displays loan summary information', () => {
    render(<App />);

    expect(screen.getByText('Loan Summary')).toBeInTheDocument();
    expect(screen.getByText('Monthly Payment')).toBeInTheDocument();
    expect(screen.getByText('Repayment Period (months)', { selector: 'div.text-sm.text-gray-500.mb-1' })).toBeInTheDocument();
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
