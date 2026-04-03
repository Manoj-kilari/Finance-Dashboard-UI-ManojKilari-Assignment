// Animation and micro-interaction utilities

import React from 'react';

// CSS animation classes
export const ANIMATION_CLASSES = {
  // Fade animations
  FADE_IN: 'fade-in',
  FADE_OUT: 'fade-out',
  FADE_IN_UP: 'fade-in-up',
  FADE_IN_DOWN: 'fade-in-down',
  FADE_IN_LEFT: 'fade-in-left',
  FADE_IN_RIGHT: 'fade-in-right',
  
  // Slide animations
  SLIDE_IN_UP: 'slide-in-up',
  SLIDE_IN_DOWN: 'slide-in-down',
  SLIDE_IN_LEFT: 'slide-in-left',
  SLIDE_IN_RIGHT: 'slide-in-right',
  
  // Scale animations
  SCALE_IN: 'scale-in',
  SCALE_OUT: 'scale-out',
  SCALE_UP: 'scale-up',
  SCALE_DOWN: 'scale-down',
  
  // Bounce animations
  BOUNCE_IN: 'bounce-in',
  BOUNCE_OUT: 'bounce-out',
  BOUNCE: 'bounce',
  
  // Rotation animations
  ROTATE_IN: 'rotate-in',
  ROTATE_OUT: 'rotate-out',
  SPIN: 'spin',
  
  // Pulse animations
  PULSE: 'pulse',
  HEARTBEAT: 'heartbeat',
  
  // Loading animations
  LOADING_DOTS: 'loading-dots',
  LOADING_SPINNER: 'loading-spinner',
  LOADING_PULSE: 'loading-pulse',
  
  // Hover effects
  HOVER_LIFT: 'hover-lift',
  HOVER_SCALE: 'hover-scale',
  HOVER_GLOW: 'hover-glow',
  HOVER_SHAKE: 'hover-shake',
  
  // Interaction animations
  CLICK_RIPPLE: 'click-ripple',
  SUCCESS_SHAKE: 'success-shake',
  ERROR_SHAKE: 'error-shake',
};

// Animation durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
};

// Animation timing functions
export const ANIMATION_EASING = {
  LINEAR: 'linear',
  EASE: 'ease',
  EASE_IN: 'ease-in',
  EASE_OUT: 'ease-out',
  EASE_IN_OUT: 'ease-in-out',
  CUBIC_BEZIER: 'cubic-bezier(0.4, 0, 0.2, 1)',
  BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

// Generate CSS keyframes
export const generateKeyframes = (name: string, keyframes: Record<string, any>): string => {
  const keyframeString = Object.entries(keyframes)
    .map(([percentage, styles]) => {
      const styleString = Object.entries(styles)
        .map(([property, value]) => `${property}: ${value}`)
        .join('; ');
      return `${percentage} { ${styleString} }`;
    })
    .join('\n');
  
  return `
    @keyframes ${name} {
      ${keyframeString}
    }
  `;
};

// Common keyframe definitions
export const KEYFRAMES = {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  fadeOut: {
    '0%': { opacity: '1' },
    '100%': { opacity: '0' },
  },
  slideInUp: {
    '0%': { transform: 'translateY(100%)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  slideInDown: {
    '0%': { transform: 'translateY(-100%)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  scaleIn: {
    '0%': { transform: 'scale(0)', opacity: '0' },
    '100%': { transform: 'scale(1)', opacity: '1' },
  },
  bounce: {
    '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
    '40%, 43%': { transform: 'translate3d(0, -30px, 0)' },
    '70%': { transform: 'translate3d(0, -15px, 0)' },
    '90%': { transform: 'translate3d(0, -4px, 0)' },
  },
  pulse: {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.05)' },
    '100%': { transform: 'scale(1)' },
  },
  spin: {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
  shake: {
    '0%, 100%': { transform: 'translateX(0)' },
    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
    '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
  },
  heartbeat: {
    '0%': { transform: 'scale(1)' },
    '14%': { transform: 'scale(1.3)' },
    '28%': { transform: 'scale(1)' },
    '42%': { transform: 'scale(1.3)' },
    '70%': { transform: 'scale(1)' },
  },
};

// Animation controller class
export class AnimationController {
  private static instance: AnimationController;
  private activeAnimations: Map<string, Animation> = new Map();
  private animationStyles: HTMLStyleElement | null = null;

  static getInstance(): AnimationController {
    if (!AnimationController.instance) {
      AnimationController.instance = new AnimationController();
    }
    return AnimationController.instance;
  }

  constructor() {
    this.injectAnimationStyles();
  }

  // Inject animation styles into the document
  private injectAnimationStyles() {
    if (typeof document === 'undefined') return;
    
    this.animationStyles = document.createElement('style');
    this.animationStyles.id = 'animation-styles';
    
    let css = '';
    
    // Generate keyframes
    Object.entries(KEYFRAMES).forEach(([name, keyframes]) => {
      css += generateKeyframes(name, keyframes);
    });
    
    // Generate utility classes
    css += this.generateUtilityClasses();
    
    this.animationStyles.textContent = css;
    document.head.appendChild(this.animationStyles);
  }

  // Generate CSS utility classes
  private generateUtilityClasses(): string {
    return `
      .fade-in { animation: fadeIn ${ANIMATION_DURATIONS.NORMAL}ms ${ANIMATION_EASING.EASE_OUT}; }
      .fade-out { animation: fadeOut ${ANIMATION_DURATIONS.NORMAL}ms ${ANIMATION_EASING.EASE_IN}; }
      .slide-in-up { animation: slideInUp ${ANIMATION_DURATIONS.NORMAL}ms ${ANIMATION_EASING.EASE_OUT}; }
      .slide-in-down { animation: slideInDown ${ANIMATION_DURATIONS.NORMAL}ms ${ANIMATION_EASING.EASE_OUT}; }
      .scale-in { animation: scaleIn ${ANIMATION_DURATIONS.NORMAL}ms ${ANIMATION_EASING.BOUNCE}; }
      .bounce { animation: bounce ${ANIMATION_DURATIONS.SLOW}ms ${ANIMATION_EASING.BOUNCE}; }
      .pulse { animation: pulse ${ANIMATION_DURATIONS.SLOW}ms ${ANIMATION_EASING.EASE_IN_OUT} infinite; }
      .spin { animation: spin ${ANIMATION_DURATIONS.SLOW}ms ${ANIMATION_EASING.LINEAR} infinite; }
      .shake { animation: shake ${ANIMATION_DURATIONS.NORMAL}ms ${ANIMATION_EASING.EASE_IN_OUT}; }
      .heartbeat { animation: heartbeat ${ANIMATION_DURATIONS.SLOW}ms ${ANIMATION_EASING.EASE_IN_OUT} infinite; }
      
      .hover-lift { transition: transform ${ANIMATION_DURATIONS.FAST}ms ${ANIMATION_EASING.EASE_OUT}; }
      .hover-lift:hover { transform: translateY(-2px); }
      
      .hover-scale { transition: transform ${ANIMATION_DURATIONS.FAST}ms ${ANIMATION_EASING.EASE_OUT}; }
      .hover-scale:hover { transform: scale(1.05); }
      
      .hover-glow { transition: box-shadow ${ANIMATION_DURATIONS.FAST}ms ${ANIMATION_EASING.EASE_OUT}; }
      .hover-glow:hover { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
      
      .click-ripple { position: relative; overflow: hidden; }
      .click-ripple::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: translate(-50%, -50%);
        transition: width ${ANIMATION_DURATIONS.NORMAL}ms, height ${ANIMATION_DURATIONS.NORMAL}ms;
      }
      .click-ripple:active::after {
        width: 300px;
        height: 300px;
      }
      
      .loading-dots span {
        animation: pulse 1.4s infinite ease-in-out both;
      }
      .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
      .loading-dots span:nth-child(2) { animation-delay: -0.16s; }
      .loading-dots span:nth-child(3) { animation-delay: 0s; }
      
      .success-shake { animation: shake ${ANIMATION_DURATIONS.NORMAL}ms ${ANIMATION_EASING.EASE_IN_OUT}; background-color: #10b981; }
      .error-shake { animation: shake ${ANIMATION_DURATIONS.NORMAL}ms ${ANIMATION_EASING.EASE_IN_OUT}; background-color: #ef4444; }
    `;
  }

  // Animate element with Web Animations API
  animateElement(
    element: Element,
    keyframes: Keyframe[] | PropertyIndexedKeyframes,
    options?: KeyframeAnimationOptions
  ): Animation {
    const animation = element.animate(keyframes, {
      duration: ANIMATION_DURATIONS.NORMAL,
      easing: ANIMATION_EASING.EASE_OUT,
      ...options,
    });
    
    const animationId = `${element.tagName}-${Date.now()}`;
    this.activeAnimations.set(animationId, animation);
    
    animation.addEventListener('finish', () => {
      this.activeAnimations.delete(animationId);
    });
    
    return animation;
  }

  // Fade in element
  fadeIn(element: Element, duration?: number): Promise<void> {
    return new Promise((resolve) => {
      this.animateElement(
        element,
        [
          { opacity: 0, transform: 'translateY(10px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: duration || ANIMATION_DURATIONS.NORMAL }
      ).addEventListener('finish', () => resolve());
    });
  }

  // Fade out element
  fadeOut(element: Element, duration?: number): Promise<void> {
    return new Promise((resolve) => {
      this.animateElement(
        element,
        [
          { opacity: 1, transform: 'translateY(0)' },
          { opacity: 0, transform: 'translateY(-10px)' },
        ],
        { duration: duration || ANIMATION_DURATIONS.NORMAL }
      ).addEventListener('finish', () => resolve());
    });
  }

  // Slide element up
  slideInUp(element: Element, duration?: number): Promise<void> {
    return new Promise((resolve) => {
      this.animateElement(
        element,
        [
          { transform: 'translateY(100%)', opacity: 0 },
          { transform: 'translateY(0)', opacity: 1 },
        ],
        { duration: duration || ANIMATION_DURATIONS.NORMAL }
      ).addEventListener('finish', () => resolve());
    });
  }

  // Scale element
  scaleIn(element: Element, duration?: number): Promise<void> {
    return new Promise((resolve) => {
      this.animateElement(
        element,
        [
          { transform: 'scale(0)', opacity: 0 },
          { transform: 'scale(1)', opacity: 1 },
        ],
        { duration: duration || ANIMATION_DURATIONS.NORMAL, easing: ANIMATION_EASING.BOUNCE }
      ).addEventListener('finish', () => resolve());
    });
  }

  // Shake element for error/success feedback
  shake(element: Element, type: 'success' | 'error' = 'error'): void {
    element.classList.add(`${type}-shake`);
    setTimeout(() => {
      element.classList.remove(`${type}-shake`);
    }, ANIMATION_DURATIONS.NORMAL);
  }

  // Add ripple effect to click
  addRippleEffect(element: HTMLElement): void {
    element.classList.add('click-ripple');
    element.addEventListener('click', this.createRipple);
  }

  // Create ripple effect
  private createRipple = (event: MouseEvent) => {
    const button = event.currentTarget as HTMLElement;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, ANIMATION_DURATIONS.NORMAL);
  };

  // Stop all animations
  stopAllAnimations(): void {
    this.activeAnimations.forEach(animation => animation.cancel());
    this.activeAnimations.clear();
  }

  // Get active animations count
  getActiveAnimationsCount(): number {
    return this.activeAnimations.size;
  }
}

// React hook for animations
export const useAnimation = () => {
  const controller = AnimationController.getInstance();
  
  const animate = React.useCallback((
    element: Element | undefined,
    animation: 'fadeIn' | 'fadeOut' | 'slideInUp' | 'scaleIn' | 'shake',
    options?: { duration?: number; type?: 'success' | 'error' }
  ) => {
    if (!element) return Promise.resolve();
    
    switch (animation) {
      case 'fadeIn':
        return controller.fadeIn(element, options?.duration);
      case 'fadeOut':
        return controller.fadeOut(element, options?.duration);
      case 'slideInUp':
        return controller.slideInUp(element, options?.duration);
      case 'scaleIn':
        return controller.scaleIn(element, options?.duration);
      case 'shake':
        controller.shake(element, options?.type);
        return Promise.resolve();
      default:
        return Promise.resolve();
    }
  }, []);
  
  const addRippleEffect = React.useCallback((element: HTMLElement | undefined) => {
    if (element) {
      controller.addRippleEffect(element);
    }
  }, []);
  
  return { animate, addRippleEffect };
};

// React hook for staggered animations
export const useStaggeredAnimation = (
  elements: (Element | undefined)[],
  animation: 'fadeIn' | 'slideInUp' | 'scaleIn',
  staggerDelay: number = 100
) => {
  const { animate } = useAnimation();
  
  React.useEffect(() => {
    elements.forEach((element, index) => {
      if (element) {
        setTimeout(() => {
          animate(element, animation);
        }, index * staggerDelay);
      }
    });
  }, [elements, animation, staggerDelay, animate]);
};

// Intersection observer for scroll animations
export const useScrollAnimation = (
  elementRef: React.RefObject<Element>,
  animation: 'fadeIn' | 'slideInUp' | 'scaleIn',
  threshold: number = 0.1
) => {
  const { animate } = useAnimation();
  const [hasAnimated, setHasAnimated] = React.useState(false);
  
  React.useEffect(() => {
    const element = elementRef.current;
    if (!element || hasAnimated) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          animate(element, animation);
          setHasAnimated(true);
        }
      },
      { threshold }
    );
    
    observer.observe(element);
    
    return () => observer.disconnect();
  }, [elementRef, animation, threshold, animate, hasAnimated]);
};

// Export singleton instance
export const animationController = AnimationController.getInstance();

export default {
  ANIMATION_CLASSES,
  ANIMATION_DURATIONS,
  ANIMATION_EASING,
  KEYFRAMES,
  AnimationController,
  useAnimation,
  useStaggeredAnimation,
  useScrollAnimation,
  animationController,
};
