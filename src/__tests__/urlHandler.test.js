import { updateUrlParams, parseUrlParams, updateUrlWithoutReload } from '../urlHandler';

// Mock window.location
const mockWindowLocation = {
  origin: 'http://localhost:3000',
  pathname: '/',
  search: '',
  href: 'http://localhost:3000/'
};

describe('URL Handler', () => {
  beforeAll(() => {
    // Mock window.location
    delete window.location;
    window.location = mockWindowLocation;
  });

  describe('updateUrlParams', () => {
    test('should update URL with all parameters', () => {
      const values = {
        factorRate: 1.5,
        amountReceived: 5000,
        revenueShareRate: 5,
        repaymentPeriod: 24,
        profitMargin: 16,
        annualRevenue: 22000
      };

      const url = updateUrlParams(values);
      expect(url).toContain('factorRate=1.5');
      expect(url).toContain('amountReceived=5000');
      expect(url).toContain('revenueShareRate=5');
      expect(url).toContain('repaymentPeriod=24');
      expect(url).toContain('profitMargin=16');
      expect(url).toContain('annualRevenue=22000');
test('should include solveFor parameter when provided', () => {
      const values = {
        factorRate: 1.5,
        amountReceived: 5000,
        revenueShareRate: 5,
        repaymentPeriod: 24,
        profitMargin: 16,
        annualRevenue: 22000
      };

      const url = updateUrlParams(values, 'factorRate');
      expect(url).toContain('solveFor=factorRate');
    });
    });

    test('should handle decimal values correctly', () => {
      const values = {
        factorRate: 1.25,
        amountReceived: 5000.50,
        revenueShareRate: 5.75,
        repaymentPeriod: 24.5,
        profitMargin: 16.25,
        annualRevenue: 22000.75
      };

      const url = updateUrlParams(values);
      expect(url).toContain('factorRate=1.25');
      expect(url).toContain('amountReceived=5000.5');
      expect(url).toContain('revenueShareRate=5.75');
      expect(url).toContain('repaymentPeriod=24.5');
      expect(url).toContain('profitMargin=16.25');
      expect(url).toContain('annualRevenue=22000.75');
    });

    test('should handle undefined and null values gracefully', () => {
      const values = {
        factorRate: 1.5,
        amountReceived: 5000,
        revenueShareRate: undefined,
        repaymentPeriod: null,
        profitMargin: 16,
        annualRevenue: 22000
      };

      const url = updateUrlParams(values);
      expect(url).toContain('factorRate=1.5');
      expect(url).toContain('amountReceived=5000');
      expect(url).toContain('profitMargin=16');
      expect(url).toContain('annualRevenue=22000');
      expect(url).not.toContain('revenueShareRate=');
      expect(url).not.toContain('repaymentPeriod=');
    });
  });

  describe('parseUrlParams', () => {
    test('should parse all parameters correctly', () => {
      // Mock window.location.search
      window.location.search = '?factorRate=1.5&amountReceived=5000&revenueShareRate=5&repaymentPeriod=24&profitMargin=16&annualRevenue=22000';

      const expected = {
        factorRate: 1.5,
        amountReceived: 5000,
        revenueShareRate: 5,
        repaymentPeriod: 24,
        profitMargin: 16,
        annualRevenue: 22000
      };

      const result = parseUrlParams();
      expect(result).toEqual(expected);
    });

    test('should handle missing parameters gracefully', () => {
      // Mock window.location.search with missing parameters
      window.location.search = '?factorRate=1.5&amountReceived=5000';

      const result = parseUrlParams();
      expect(result.factorRate).toBe(1.5);
      expect(result.amountReceived).toBe(5000);
      expect(result.revenueShareRate).toBeUndefined();
      expect(result.repaymentPeriod).toBeUndefined();
    });

    test('should handle empty parameters', () => {
      // Mock window.location.search with no parameters
      window.location.search = '';

      const result = parseUrlParams();
      expect(result).toEqual({});
    });

    test('should parse decimal values correctly', () => {
      // Mock window.location.search with decimal values
      window.location.search = '?factorRate=1.25&amountReceived=5000.5&revenueShareRate=5.75';

      const result = parseUrlParams();
      expect(result.factorRate).toBe(1.25);
      expect(result.amountReceived).toBe(5000.5);
      expect(result.revenueShareRate).toBe(5.75);
    });
  });

  describe('updateUrlWithoutReload', () => {
    test('should update browser URL without reloading', () => {
      // Mock window.history.replaceState
      const mockReplaceState = jest.fn();
      Object.defineProperty(window, 'history', {
        value: {
          replaceState: mockReplaceState
        },
        writable: true
      });

      const values = {
        factorRate: 1.5,
        amountReceived: 5000
      };

      updateUrlWithoutReload(values);

      expect(mockReplaceState).toHaveBeenCalledWith({}, '', expect.stringContaining('factorRate=1.5'));
      expect(mockReplaceState).toHaveBeenCalledWith({}, '', expect.stringContaining('amountReceived=5000'));
    });

    test('should include solveFor parameter in URL when provided', () => {
      // Mock window.history.replaceState
      const mockReplaceState = jest.fn();
      Object.defineProperty(window, 'history', {
        value: {
          replaceState: mockReplaceState
        },
        writable: true
      });

      const values = {
        factorRate: 1.5,
        amountReceived: 5000
      };

      updateUrlWithoutReload(values, 'factorRate');

      expect(mockReplaceState).toHaveBeenCalledWith({}, '', expect.stringContaining('solveFor=factorRate'));
    });

    test('should handle browsers without history API gracefully', () => {
      // Remove history API
      Object.defineProperty(window, 'history', {
        value: undefined,
        writable: true
      });

      const values = {
        factorRate: 1.5,
        amountReceived: 5000
      };

      // Should not throw an error
      expect(() => updateUrlWithoutReload(values)).not.toThrow();
    });
  });
});
