import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      // Fast Refresh is enabled by default in Vite
      // Enable automatic JSX runtime
      jsxRuntime: 'automatic',
    }),
    // Reduced Node.js polyfills - only essential ones
    nodePolyfills({
      include: ['buffer', 'crypto'],
      globals: {
        Buffer: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
      stream: 'stream-browserify',
      util: 'util'
    },
  },
  define: {
    global: 'globalThis',
    __DEV__: JSON.stringify(false)
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@tanstack/react-query',
      '@irys/sdk',
      'lucide-react',
      '@rainbow-me/rainbowkit',
      'wagmi',
      'viem'
    ],
    // Force exclude heavy dependencies that should be lazy loaded
    exclude: ['@irys/sdk/build/esm/common/upload'],
    esbuildOptions: {
      target: 'es2020',
    },
  },
  
  // TypeScript configuration for build
  esbuild: {
    // Ignore unused variables for faster builds
    legalComments: 'none',
    drop: ['console', 'debugger'],
  },
  

  build: {
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: false, // Disable sourcemaps for production
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunk for core React libraries
          if (id.includes('react') || id.includes('react-dom')) {
            return 'vendor';
          }
          // UI libraries chunk
           if (id.includes('lucide-react') || id.includes('@rainbow-me/rainbowkit')) {
             return 'ui';
           }
          // Crypto and blockchain libraries
          if (id.includes('@irys/sdk') || id.includes('ethers') || id.includes('viem')) {
            return 'crypto';
          }
          // Query libraries
          if (id.includes('@tanstack/react-query')) {
            return 'query';
          }
          // Components chunk for lazy-loaded components
          if (id.includes('/components/') && !id.includes('node_modules')) {
            return 'components';
          }
          // Utils and lib chunk
          if (id.includes('/lib/') && !id.includes('node_modules')) {
            return 'utils';
          }
        },
      },
    },
    // Enable tree shaking
    output: {
      moduleSideEffects: false,
    },
    chunkSizeWarningLimit: 1000,
  },
  // Development server optimizations
  server: {
    hmr: {
      overlay: false // Disable error overlay for better performance
    },
    fs: {
      strict: false
    }
  },
})