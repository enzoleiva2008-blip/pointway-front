import { BrowserRouter } from 'react-router-dom'
import { AvisoProvider } from './context/AvisoContext'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <AvisoProvider>
        <AppRoutes />
      </AvisoProvider>
    </BrowserRouter>
  )
}
