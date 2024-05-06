import { defineConfig } from 'vite'

export default defineConfig({
    base:'./',
    build:{
        minify:'terser' // kaboom js 使用esbuild打包會有bug 
    }
})