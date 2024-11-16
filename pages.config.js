// pages.config.js
export default {
  // Build configuration
  build: {
    // Base directory for the build
    baseDirectory: '.',

    // Build command
    command: `
      if [ ! -f "go.mod" ]; then
        hugo mod init github.com/MKSG-MugunthKumar/mugunth.com
      fi
      npm ci
      hugo mod get -u
      hugo mod verify
      hugo --gc --minify
    `,

    // Output directory
    outputDirectory: 'public',

    // Environment variables for the build
    environment: {
      HUGO_VERSION: '0.138.0',
      HUGO_ENVIRONMENT: 'production',
      HUGO_ENV: 'production',
      GOPATH: '/opt/build/cache/go'
    }
  },

  // Routes configuration
  routes: [
    // Ensure resume.pdf is always fresh
    {
      pattern: '/resume.pdf',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    },
    // Cache static assets
    {
      pattern: '/static/*',
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    }
  ],

  // Custom 404 page
  notFoundPage: '/404.html'
}
