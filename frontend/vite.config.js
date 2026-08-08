import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5001"
      }
    }
  }
})

// export default defineConfig({

//     plugins:[
//         react()
//     ],


//     server: {

//         host:"0.0.0.0",


//         port:5173,


//         proxy: {

//             "/api": {

//                 target:
//                     "http://192.168.1.101:5001",

//                 changeOrigin:true

//             }

//         }

//     }

// });