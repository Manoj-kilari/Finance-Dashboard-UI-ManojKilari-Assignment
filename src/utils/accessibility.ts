// Accessibility utilities and helpers

// Keyboard navigation keys
export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
};

// ARIA roles and properties
export const ARIA_ROLES = {
  BUTTON: 'button',
  DIALOG: 'dialog',
  ALERT: 'alert',
  STATUS: 'status',
  TIMER: 'timer',
  TABLIST: 'tablist',
  TAB: 'tab',
  TABPANEL: 'tabpanel',
  GRID: 'grid',
  GRIDCELL: 'gridcell',
  ROW: 'row',
  COLUMNHEADER: 'columnheader',
  ROWHEADER: 'rowheader',
  LISTBOX: 'listbox',
  OPTION: 'option',
  COMBOBOX: 'combobox',
  MENU: 'menu',
  MENUITEM: 'menuitem',
  MENUITEMCHECKBOX: 'menuitemcheckbox',
  MENUITEMRADIO: 'menuitemradio',
  NAVIGATION: 'navigation',
  MAIN: 'main',
  BANNER: 'banner',
  CONTENTINFO: 'contentinfo',
  SEARCH: 'search',
  FORM: 'form',
  APPLICATION: 'application',
  DOCUMENT: 'document',
};

// ARIA live regions
export const ARIA_LIVE_REGIONS = {
  POLITE: 'polite',
  ASSERTIVE: 'assertive',
  OFF: 'off',
};

// Generate unique IDs for accessibility
let idCounter = 0;
export const generateAriaId = (prefix: string = 'aria'): string => {
  return `${prefix}-${++idCounter}`;
};

// Announce messages to screen readers
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Focus management utilities
export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>;
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === KEYBOARD_KEYS.TAB) {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  };
  
  element.addEventListener('keydown', handleKeyDown);
  
  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
};

// Set focus to element with announcement
export const setFocusWithAnnouncement = (element: HTMLElement, message?: string) => {
  element.focus();
  if (message) {
    announceToScreenReader(message);
  }
};

// Check if element is visible
export const isElementVisible = (element: HTMLElement): boolean => {
  return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
};

// Find next focusable element
export const findNextFocusableElement = (currentElement: HTMLElement, direction: 'next' | 'previous' = 'next'): HTMLElement | null => {
  const focusableElements = Array.from(document.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )) as HTMLElement[];
  
  const currentIndex = focusableElements.indexOf(currentElement);
  
  if (direction === 'next') {
    return focusableElements[currentIndex + 1] || null;
  } else {
    return focusableElements[currentIndex - 1] || null;
  }
};

// Keyboard navigation for custom components
export const createKeyboardNavigation = (
  container: HTMLElement,
  options: {
    orientation?: 'horizontal' | 'vertical';
    loop?: boolean;
    onSelect?: (element: HTMLElement) => void;
  } = {}
) => {
  const { orientation = 'vertical', loop = true, onSelect } = options;
  
  const selectableElements = container.querySelectorAll('[role="option"], [role="tab"], [role="menuitem"]') as NodeListOf<HTMLElement>;
  let currentIndex = 0;
  
  const handleKeyDown = (e: KeyboardEvent) => {
    let newIndex = currentIndex;
    
    switch (e.key) {
      case KEYBOARD_KEYS.ARROW_DOWN:
      case KEYBOARD_KEYS.ARROW_RIGHT:
        if (orientation === 'vertical' && e.key === KEYBOARD_KEYS.ARROW_RIGHT) return;
        if (orientation === 'horizontal' && e.key === KEYBOARD_KEYS.ARROW_DOWN) return;
        
        newIndex = currentIndex + 1;
        if (loop && newIndex >= selectableElements.length) {
          newIndex = 0;
        } else if (newIndex >= selectableElements.length) {
          return;
        }
        break;
        
      case KEYBOARD_KEYS.ARROW_UP:
      case KEYBOARD_KEYS.ARROW_LEFT:
        if (orientation === 'vertical' && e.key === KEYBOARD_KEYS.ARROW_LEFT) return;
        if (orientation === 'horizontal' && e.key === KEYBOARD_KEYS.ARROW_UP) return;
        
        newIndex = currentIndex - 1;
        if (loop && newIndex < 0) {
          newIndex = selectableElements.length - 1;
        } else if (newIndex < 0) {
          return;
        }
        break;
        
      case KEYBOARD_KEYS.HOME:
        newIndex = 0;
        break;
        
      case KEYBOARD_KEYS.END:
        newIndex = selectableElements.length - 1;
        break;
        
      case KEYBOARD_KEYS.ENTER:
      case KEYBOARD_KEYS.SPACE:
        if (onSelect) {
          onSelect(selectableElements[currentIndex]);
        }
        return;
        
      default:
        return;
    }
    
    e.preventDefault();
    selectableElements[currentIndex].setAttribute('aria-selected', 'false');
    selectableElements[newIndex].setAttribute('aria-selected', 'true');
    selectableElements[newIndex].focus();
    currentIndex = newIndex;
  };
  
  container.addEventListener('keydown', handleKeyDown);
  
  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
};

// Color contrast checker (simplified)
export const getContrastRatio = (color1: string, color2: string): number => {
  // This is a simplified version - in production, use a proper color contrast library
  const getLuminance = (color: string): number => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const sRGB = [r, g, b].map(val => {
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };
  
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

// Check if color combination meets WCAG standards
export const meetsWCAGStandard = (color1: string, color2: string, level: 'AA' | 'AAA' = 'AA'): boolean => {
  const ratio = getContrastRatio(color1, color2);
  
  if (level === 'AA') {
    return ratio >= 4.5;
  } else {
    return ratio >= 7;
  }
};

// Skip link helper
export const createSkipLink = (targetId: string, text: string = 'Skip to main content'): HTMLElement => {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = text;
  skipLink.className = 'skip-link';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: #007bff;
    color: white;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 10000;
    transition: top 0.3s;
  `;
  
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '6px';
  });
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });
  
  return skipLink;
};

// Accessibility testing helper (for development)
export const runAccessibilityAudit = (): void => {
  if (process.env.NODE_ENV !== 'development') return;
  
  console.group('🔍 Accessibility Audit');
  
  // Check for missing alt text
  const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
  if (imagesWithoutAlt.length > 0) {
    console.warn('Images without alt text:', imagesWithoutAlt);
  }
  
  // Check for missing labels on form inputs
  const inputsWithoutLabels = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
  if (inputsWithoutLabels.length > 0) {
    console.warn('Inputs without labels:', inputsWithoutLabels);
  }
  
  // Check for proper heading structure
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const headingLevels = Array.from(headings).map(h => parseInt(h.tagName[1]));
  const hasProperHeadingStructure = headingLevels.every((level, index) => {
    if (index === 0) return level === 1;
    return level <= headingLevels[index - 1] + 1;
  });
  
  if (!hasProperHeadingStructure) {
    console.warn('Improper heading structure detected');
  }
  
  // Check for keyboard accessibility
  const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusableElements.length === 0) {
    console.warn('No focusable elements found');
  }
  
  console.groupEnd();
};

export default {
  KEYBOARD_KEYS,
  ARIA_ROLES,
  ARIA_LIVE_REGIONS,
  generateAriaId,
  announceToScreenReader,
  trapFocus,
  setFocusWithAnnouncement,
  isElementVisible,
  findNextFocusableElement,
  createKeyboardNavigation,
  getContrastRatio,
  meetsWCAGStandard,
  createSkipLink,
  runAccessibilityAudit,
};
