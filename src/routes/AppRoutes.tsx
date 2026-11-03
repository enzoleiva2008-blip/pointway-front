import { Route, Routes } from 'react-router-dom'
import Layout from '../components/Layout'
import Home from '../pages/Home'
import Usuarios from '../pages/Usuarios'
import UsuarioDetalhe from '../pages/UsuarioDetalhe'
import Converter from '../pages/Converter'
import Catraca from '../pages/Catraca'
import Operadoras from '../pages/Operadoras'
import Sobre from '../pages/Sobre'
import Integrantes from '../pages/Integrantes'
import IntegranteDetalhe from '../pages/IntegranteDetalhe'
import Faq from '../pages/Faq'
import Contato from '../pages/Contato'
import NaoEncontrada from '../pages/NaoEncontrada'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Rotas estáticas */}
        <Route path="/" element={<Home />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/converter" element={<Converter />} />
        <Route path="/catraca" element={<Catraca />} />
        <Route path="/operadoras" element={<Operadoras />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/integrantes" element={<Integrantes />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contato" element={<Contato />} />

        {/* Rotas dinâmicas (com parâmetro na URL) */}
        <Route path="/usuarios/:id" element={<UsuarioDetalhe />} />
        <Route path="/catraca/:codigo" element={<Catraca />} />
        <Route path="/integrantes/:rm" element={<IntegranteDetalhe />} />

        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  )
}
