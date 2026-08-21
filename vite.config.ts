import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * O projeto nasceu no Google AI Studio e o config injetava GEMINI_API_KEY
 * dentro do bundle do cliente via `define`. Nada aqui usa Gemini, e uma chave
 * injetada assim vai parar em texto puro no JS público. Removido.
 */
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
