import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 文件夹别名 @ 为src目录
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  css: {
    //css预处理
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/var.scss";`
      }
    }
  },
  server: {
    host: '0.0.0.0',
    open: false,
    // proxy: {},
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
})
