import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock window.location
const mockWindowLocation = {
  origin: 'http://localhost:3000',
  pathname: '/',
  search: '',
  href: 'http://localhost:3000/'
};

// Mock the calculator functions to avoid complex calculations in UI tests
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
  parseUrlParams: jest.fn(() => ({}))
}));

describe('RBFCalculator App', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock window.location
    delete window.location;
    window.location = mockWindowLocation;

    // Mock navigator.clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn(() => Promise.resolve())
      },
      writable: true
    });
  });

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
    expect(screen.getByLabelText('Annual Revenue ($)')).toBeInTheDocument();
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

    // With the new UX, the input shows the raw value during editing
    expect(amountReceivedInput.value).toBe('10000');

    // After blur, the value should be formatted
    fireEvent.blur(amountReceivedInput);
    expect(amountReceivedInput.value).toBe('10000.00');
  });

  test('displays loan summary information', () => {
    render(<App />);

    expect(screen.getByText('Loan Summary')).toBeInTheDocument();
    expect(screen.getByText('Estimated Monthly Payment')).toBeInTheDocument();
    expect(screen.getByText('Repayment Period (months)', { selector: 'div.text-sm.text-gray-500.mb-1' })).toBeInTheDocument();
    expect(screen.getByText('Total Cost of Capital')).toBeInTheDocument();
  });

  test('displays calculation details', () => {
    render(<App />);

    expect(screen.getByText('Calculation Details:')).toBeInTheDocument();
    expect(screen.getByText(/Monthly Revenue/)).toBeInTheDocument();
    expect(screen.getByText(/Estimated Monthly Payment: \d+%/)).toBeInTheDocument();
    expect(screen.getByText(/Factor Rate: \d+\.?\d*x/)).toBeInTheDocument();
    expect(screen.getByText(/Effective Annual Rate of Return/)).toBeInTheDocument();
  });

  test('displays share button', () => {
    render(<App />);

    const shareButton = screen.getByText('Share');
    expect(shareButton).toBeInTheDocument();
    expect(shareButton).toHaveClass('bg-blue-600');
  });

  test('copies URL to clipboard when share button is clicked', () => {
    render(<App />);

    const shareButton = screen.getByText('Share');
    fireEvent.click(shareButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('http://localhost:3000/');
  });

  test('restores solveFor from URL parameters', () => {
    // Mock window.location.search with solveFor parameter
    window.location.search = '?solveFor=factorRate';

    // Update the parseUrlParams mock to return the solveFor parameter
    const urlHandler = require('../urlHandler');
    urlHandler.parseUrlParams.mockImplementation(() => ({
      solveFor: 'factorRate'
    }));

    render(<App />);

    const select = screen.getByRole('combobox');
    expect(select.value).toBe('factorRate');
  });

  test('updates URL when solveFor changes', () => {
    render(<App />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'factorRate' } });

    // Check that updateUrlWithoutReload was called with the new solveFor value
    const urlHandler = require('../urlHandler');
    expect(urlHandler.updateUrlWithoutReload).toHaveBeenCalledWith(
      expect.objectContaining({
        factorRate: 1.5,
        amountReceived: 5000,
        revenueShareRate: 5,
        repaymentPeriod: 24,
        profitMargin: 16,
        annualRevenue: 22000
      }),
      'factorRate'
    );
  });
});
