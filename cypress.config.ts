import { defineConfig } from 'cypress'
import setupPlugins from './cypress/plugins';
import { resolve } from 'path';

export default defineConfig({
  video: false,
  viewportWidth: 1200,
  viewportHeight: 770,
  scrollBehavior: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    // setupNodeEvents(on, config) {
    //   // return setupPlugins(on, config);
    // },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.spec.*',
  },
})
