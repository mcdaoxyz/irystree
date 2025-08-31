// Additional polyfills for specific modules that might not be covered by vite-plugin-node-polyfills
import { Buffer } from 'buffer'
import { EventEmitter } from 'events'

// Make these available globally for any modules that might need them
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer
  ;(window as any).EventEmitter = EventEmitter
  
  // Ensure these are available for crypto operations
  if (!(window as any).crypto) {
    ;(window as any).crypto = (window as any).crypto || {}
  }
}

// Also make them available in the global scope
if (typeof global !== 'undefined') {
  (global as any).Buffer = Buffer
  ;(global as any).EventEmitter = EventEmitter
}

// Ensure Buffer is available in the global scope
if (typeof globalThis !== 'undefined') {
  (globalThis as any).Buffer = Buffer
  ;(globalThis as any).EventEmitter = EventEmitter
}

// Additional polyfill for process.nextTick if not available
if (typeof process !== 'undefined' && !process.nextTick) {
  process.nextTick = (fn: Function) => setTimeout(fn, 0)
} 