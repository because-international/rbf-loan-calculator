# RBF Terms Page Implementation Plan

## Overview

Create a new page for the RBF terms and example content with navigation between the calculator and terms page using React state.

## Component Structure

1. **RBFTermsPage.js** - New component for displaying RBF terms and examples
2. **Modified App.js** - Add navigation state and toggle between pages

## Implementation Steps

### 1. Create RBFTermsPage Component

- Convert markdown content to JSX with proper styling
- Use same color scheme and styling as main calculator
- Add "Back to Calculator" link at top
- Ensure mobile responsiveness

### 2. Modify App.js

- Add state to track current page (calculator or terms)
- Implement toggle function between pages
- Add navigation link in "How to" section

### 3. Styling Consistency

- Use same color palette (blue-600, indigo-700 gradients, etc.)
- Match font sizes and spacing
- Ensure responsive design

## Navigation Implementation

- Use React state (`currentPage`) to track active page
- Toggle between 'calculator' and 'terms'
- Add link in "How to" section: "Learn more about RBF terms and examples"
- Add "Back to Calculator" link at top of terms page

## File Structure

```
src/
├── App.js (modified)
├── RBFTermsPage.js (new)
└── ... (existing files)
```

## Code Changes

### App.js Changes

1. Import RBFTermsPage component
2. Add `currentPage` state (default: 'calculator')
3. Add navigation toggle function
4. Add link in "How to" section
5. Conditional rendering based on `currentPage`

### RBFTermsPage.js Structure

1. Header with "Back to Calculator" link
2. Main content area with converted markdown
3. Consistent styling with calculator
4. Responsive design

## Testing

1. Verify navigation works correctly
2. Check styling consistency
3. Test mobile responsiveness
4. Ensure all links function properly
