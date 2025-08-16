/**
 * URL Handler for the RBF Calculator share feature
 * Handles synchronization of calculator values with URL parameters
 */

/**
 * Updates the URL with the current calculator values
 * @param {Object} values - The current calculator values
 * @param {string} solveFor - The current solveFor value
 * @returns {string} The updated URL with parameters
 */
export const updateUrlParams = (values, solveFor = null) => {
  // Create a URLSearchParams object with all the values
  const params = new URLSearchParams();

  // Add all values to the parameters
  Object.entries(values).forEach(([key, value]) => {
    // Only add defined values
    if (value !== undefined && value !== null) {
      params.set(key, value);
    }
  });

  // Add solveFor parameter if provided
  if (solveFor) {
    params.set('solveFor', solveFor);
  }

  // Return the full URL with parameters
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
};

/**
 * Parses URL parameters and returns them as an object
 * @returns {Object} The parsed parameters
 */
export const parseUrlParams = () => {
  // Get the search parameters from the current URL
  const params = new URLSearchParams(window.location.search);
  const result = {};

  // Convert parameters to appropriate types
  for (const [key, value] of params.entries()) {
    // Try to convert to number if possible, otherwise keep as string
    const numValue = Number(value);
    result[key] = isNaN(numValue) ? value : numValue;
  }

  return result;
};

/**
 * Updates the browser's URL without reloading the page
 * @param {Object} values - The current calculator values
 * @param {string} solveFor - The current solveFor value
 */
export const updateUrlWithoutReload = (values, solveFor = null) => {
  const newUrl = updateUrlParams(values, solveFor);

  // Update the browser's URL using the History API
  if (window.history && window.history.replaceState) {
    window.history.replaceState({}, '', newUrl);
  }
};
