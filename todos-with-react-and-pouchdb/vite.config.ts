import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// {
//   plugins: [react()],
// }
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    define: {
      global: "window",
    },
    plugins: [react()],
  };
})
