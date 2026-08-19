import { createServer } from 'vite'
import react from '@vitejs/plugin-react'

async function start() {
  const server = await createServer({
    configFile: false,
    root: '.',
    plugins: [react()],
    optimizeDeps: { noDiscovery: true },
    server: {
      port: 5173,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'https://slv-design-studio-backend.onrender.com/api',
          changeOrigin: true,
        },
        '/uploads': {
          target: 'https://slv-design-studio-backend.onrender.com',
          changeOrigin: true,
        },
      },
    },
  })

  await server.listen()
  console.log('\n✨ SLV Women\'s Fashion Studio is running at: http://localhost:5173\n')
  server.printUrls()
}

start().catch((err) => {
  console.error('Error starting server:', err)
  process.exit(1)
})
