import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// 去掉 <React.StrictMode>
createRoot(document.getElementById('root')!).render(
    <App />
)
