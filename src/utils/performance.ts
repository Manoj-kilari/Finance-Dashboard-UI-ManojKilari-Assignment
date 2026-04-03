// Performance monitoring and optimization utilities

import React from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentCount: number;
  memoryUsage: number;
  bundleSize: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
}

interface ComponentPerformance {
  name: string;
  renderTime: number;
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    renderTime: 0,
    componentCount: 0,
    memoryUsage: 0,
    bundleSize: 0,
  };
  
  private componentMetrics: Map<string, ComponentPerformance> = new Map();
  private observers: PerformanceObserver[] = [];
  private isMonitoring = false;

  // Start performance monitoring
  startMonitoring() {
    if (this.isMonitoring || typeof window === 'undefined') return;
    
    this.isMonitoring = true;
    this.setupObservers();
    this.measureInitialLoad();
    this.schedulePeriodicChecks();
    
    console.log('🚀 Performance monitoring started');
  }

  // Stop performance monitoring
  stopMonitoring() {
    if (!this.isMonitoring) return;
    
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.isMonitoring = false;
    
    console.log('⏹️ Performance monitoring stopped');
  }

  // Measure component render performance
  measureComponentRender(componentName: string, renderFn: () => void) {
    const startTime = performance.now();
    renderFn();
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    const existing = this.componentMetrics.get(componentName) || {
      name: componentName,
      renderTime: 0,
      renderCount: 0,
      lastRenderTime: 0,
      averageRenderTime: 0,
    };
    
    existing.renderTime += renderTime;
    existing.renderCount++;
    existing.lastRenderTime = renderTime;
    existing.averageRenderTime = existing.renderTime / existing.renderCount;
    
    this.componentMetrics.set(componentName, existing);
    
    // Warn about slow renders
    if (renderTime > 16) { // 60fps = 16ms per frame
      console.warn(`🐌 Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`);
    }
    
    return renderTime;
  }

  // Get performance report
  getPerformanceReport(): PerformanceMetrics & { components: ComponentPerformance[] } {
    return {
      ...this.metrics,
      components: Array.from(this.componentMetrics.values())
        .sort((a, b) => b.averageRenderTime - a.averageRenderTime)
        .slice(0, 10), // Top 10 slowest components
    };
  }

  // Optimize performance suggestions
  getOptimizationSuggestions(): string[] {
    const suggestions: string[] = [];
    const report = this.getPerformanceReport();
    
    // Check for slow components
    const slowComponents = report.components.filter(c => c.averageRenderTime > 10);
    if (slowComponents.length > 0) {
      suggestions.push(
        `Consider optimizing ${slowComponents.length} slow components: ` +
        slowComponents.map(c => c.name).join(', ')
      );
    }
    
    // Check memory usage
    if (this.metrics.memoryUsage > 50) { // 50MB
      suggestions.push('High memory usage detected. Consider implementing memory cleanup.');
    }
    
    // Check render frequency
    const highFrequencyComponents = report.components.filter(c => c.renderCount > 100);
    if (highFrequencyComponents.length > 0) {
      suggestions.push(
        `Components with high render frequency detected: ` +
        highFrequencyComponents.map(c => c.name).join(', ')
      );
    }
    
    // Check bundle size
    if (this.metrics.bundleSize > 1000000) { // 1MB
      suggestions.push('Large bundle size detected. Consider code splitting and tree shaking.');
    }
    
    return suggestions;
  }

  // Setup performance observers
  private setupObservers() {
    // Observe paint timing
    if ('PerformanceObserver' in window) {
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.firstContentfulPaint = entry.startTime;
          }
          if (entry.name === 'largest-contentful-paint') {
            this.metrics.largestContentfulPaint = entry.startTime;
          }
        }
      });
      
      paintObserver.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
      this.observers.push(paintObserver);
    }
    
    // Observe navigation timing
    if ('PerformanceObserver' in window) {
      const navigationObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.metrics.renderTime = navEntry.loadEventEnd - navEntry.loadEventStart;
          }
        }
      });
      
      navigationObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navigationObserver);
    }
  }

  // Measure initial load performance
  private measureInitialLoad() {
    if ('performance' in window && 'memory' in performance) {
      this.metrics.memoryUsage = (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    
    // Estimate bundle size (simplified)
    const scripts = document.querySelectorAll('script[src]');
    let totalSize = 0;
    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src && src.includes('static/js')) {
        totalSize += 50000; // Estimated 50KB per script
      }
    });
    this.metrics.bundleSize = totalSize;
  }

  // Schedule periodic performance checks
  private schedulePeriodicChecks() {
    setInterval(() => {
      this.updateMetrics();
      this.checkPerformanceThresholds();
    }, 30000); // Every 30 seconds
  }

  // Update current metrics
  private updateMetrics() {
    if ('performance' in window && 'memory' in performance) {
      this.metrics.memoryUsage = (performance as any).memory.usedJSHeapSize / 1024 / 1024;
    }
    
    this.metrics.componentCount = this.componentMetrics.size;
  }

  // Check performance thresholds and warn
  private checkPerformanceThresholds() {
    const report = this.getPerformanceReport();
    
    // Memory threshold
    if (this.metrics.memoryUsage > 100) { // 100MB
      console.warn(`⚠️ High memory usage: ${this.metrics.memoryUsage.toFixed(2)}MB`);
    }
    
    // Component performance threshold
    const verySlowComponents = report.components.filter(c => c.averageRenderTime > 50);
    if (verySlowComponents.length > 0) {
      console.error(`🔥 Very slow components detected:`, verySlowComponents);
    }
  }
}

// React performance HOC
export const withPerformanceTracking = <P extends object>(
  Component: React.ComponentType<P>,
  componentName?: string
) => {
  const WrappedComponent = (props: P) => {
    const name = componentName || (Component as any).displayName || (Component as any).name || 'Unknown';
    
    React.useEffect(() => {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        if (renderTime > 16) {
          console.warn(`🐌 ${name} render took ${renderTime.toFixed(2)}ms`);
        }
      };
    });
    
    return React.createElement(Component, props);
  };
  
  WrappedComponent.displayName = `withPerformanceTracking(${(Component as any).displayName || (Component as any).name})`;
  return WrappedComponent;
};

// Memoization helper for expensive computations
export const useMemoWithCache = <T>(
  factory: () => T,
  deps: React.DependencyList,
  cacheSize: number = 10
): T => {
  const cacheRef = React.useRef<Map<string, T>>(new Map());
  const key = JSON.stringify(deps);
  
  if (cacheRef.current.has(key)) {
    return cacheRef.current.get(key)!;
  }
  
  const result = factory();
  
  // Limit cache size
  if (cacheRef.current.size >= cacheSize) {
    const firstKey = cacheRef.current.keys().next().value;
    if (firstKey) {
      cacheRef.current.delete(firstKey);
    }
  }
  
  cacheRef.current.set(key, result);
  return result;
};

// Debounce hook for performance optimization
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
  
  return React.useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;
};

// Throttle hook for performance optimization
export const useThrottledCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastCallRef = React.useRef<number>(0);
  
  return React.useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        callback(...args);
      }
    },
    [callback, delay]
  ) as T;
};

// Virtual scrolling helper for large lists
export const useVirtualScrolling = (
  items: any[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = React.useMemo(() => {
    return items.slice(visibleStart, visibleEnd).map((item, index) => ({
      item,
      index: visibleStart + index,
    }));
  }, [items, visibleStart, visibleEnd]);
  
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;
  
  const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
  };
};

// Lazy loading helper
export const useLazyLoad = (threshold: number = 0.1) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const elementRef = React.useRef<HTMLElement>(null);
  
  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsIntersecting(true);
          setHasLoaded(true);
        }
      },
      { threshold }
    );
    
    observer.observe(element);
    
    return () => observer.disconnect();
  }, [threshold, hasLoaded]);
  
  return {
    elementRef,
    isIntersecting,
    hasLoaded,
  };
};

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Initialize performance monitoring in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  performanceMonitor.startMonitoring();
  
  // Log performance report every 60 seconds
  setInterval(() => {
    const report = performanceMonitor.getPerformanceReport();
    const suggestions = performanceMonitor.getOptimizationSuggestions();
    
    console.group('📊 Performance Report');
    console.table(report.components);
    console.log('Suggestions:', suggestions);
    console.groupEnd();
  }, 60000);
}

export default performanceMonitor;
