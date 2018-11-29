module.exports = {
  apps: [{
    name: "Raxxla Research Program WEB UI",
    script: "./server.js",
    watch: ['app', 'resources/views'],
    watch_options: {
      usePolling: true,
    }
  }]
}