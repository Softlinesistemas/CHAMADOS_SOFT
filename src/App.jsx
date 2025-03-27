


import {useState, useEffect} from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

import NotFound from "./components/NotFound";

// IMPORTANDO Bootstrap
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';



// IMPORTANDO componente Formulario
import Formulario from './components/Formulario';

//IMPORTANDO Componente Listagem
import Listagem from './components/Listagem';

// IMPORTANDO Component implantacao
import ListagemImplantacao from './components/implantacao/ListagemImplantacao';

// IMPORTANDO Component implantacao
import ListagemCustomizacao from './components/customizacao/ListagemCustomizacao';

// IMPORTANDO Component UserForm
import UserForm from './components/user/UserForm';

// IMPORTANDO Component UserSoftlineForm
import UserSoftlineListagem from './components/userSoftline/UserSoftlineListagem';

import UsuarioListagem from './components/user/UsuarioListagem';

import AdminSoftlineForm from './components/adminSoftLine/AdminSoftlineForm';
import AdminSoftLineListagem from './components/adminSoftLine/AdminSoftLineListagem';

import RelatorioStatusChamados from './components/adminSoftLine/RelatorioStatusChamados';

import ChamadosEmAberto from './components/adminSoftLine/ChamadosEmAberto';
import ChamadoUser from "./components/adminSoftLine/ChamadoUser";
import ListarUsuarios from "./components/adminSoftLine/ListarUsuarios";
import UserSoftLineForm from "./components/userSoftline/UserSoftLineForm";

import NovosClientes from './components/adminSoftLine/NovosClientes';
import ListaNovosClientes from "./components/adminSoftLine/ListaNovosClientes";
import AvaliacaoCliente from './components/adminSoftLine/AvaliacaoCliente';

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation  } from "react-router-dom"; // Certifique-se de usar o nome correto
import UserHeaders from "./components/headers/UserHeaders";

import ChamadosSetorAberto from "./components/adminSoftLine/ChamadosSetorAberto"
import Login from "./components/Login";

import NaoAutorizado from "./NaoAutorizado";


function App() {


 // UseEffect
 const [chamados, setChamados] = useState([]); // uso de colchetes aqui indica recebimento de array/vetor

  const [chamadosUser, setChamadosUser] = useState([]);
  const [chamadosImplantacao, setChamadosImplantacao] = useState([]);
  const [chamadosCustomizacao, setChamadosCustomizacao] = useState([]);
  const [paginas, setPaginas] = useState(0);
  const [itens, setItens] = useState(8);

  useEffect(() => {  //https://chamados-softline-k3bsb.ondigitalocean.app/
      fetch(`https://chamados-softline-k3bsb.ondigitalocean.app/chamados/user/userListChamados?paginas=${paginas}&itens=${itens}`)
        .then((res) => res.json())
        .then((dados) => setChamadosUser(dados))
        .catch((error) => console.error("Erro ao buscar dados:", error));
    }, [paginas, itens]);

    useEffect(() => {
      fetch(`https://chamados-softline-k3bsb.ondigitalocean.app/chamados/implantacao/usuarioImplantacao?paginas=${paginas}&itens=${itens}`)
        .then((res) => res.json())
        .then((dados) => setChamadosImplantacao(dados))
        .catch((error) => console.error("Erro ao buscar dados:", error));
    }, [paginas, itens]);

    useEffect(() => {
      fetch(`https://chamados-softline-k3bsb.ondigitalocean.app/chamados/customizacao/usuarioCustomizacao?paginas=${paginas}&itens=${itens}`)
        .then((res) => res.json())
        .then((dados) => setChamadosCustomizacao(dados))
        .catch((error) => console.error("Erro ao buscar dados:", error));
    }, [paginas, itens]);

 const location = useLocation(); // Obter a rota atual




  return (


  <div className="App">

   {/*
   <Login />
   <Header />
  <Formulario />
   <Listagem vetor={chamadosUser}/>
     <ListagemImplantacao vetor={chamadosUser}/>
    <ListagemCustomizacao vetor={chamadosUser}/>
    <NovosClientes/>
    <UserForm/>
     <UserSoftlineListagem/>
      <UsuarioListagem/>
      <AdminSoftlineForm/>
      <AdminSoftLineListagem/>
      <RelatorioStatusChamados/>
       <ChamadosEmAberto/>
       <ChamadoUser />
       <ListarUsuarios />
       <UserSoftLineForm />
   */}

   {/* Renderizar UserHeaders apenas em rotas que não são /AdminSoftlineForm e /AdminSoftLineListagem */}
  {location.pathname !== "/AdminSoftlineForm" && location.pathname !== "/components/adminSoftLine/AdminSoftLineListagem"
  && location.pathname !== "/ListarUsuarios" && location.pathname !== "/AdminSoftlineForm" &&
  location.pathname !== "/UserSoftlineListagem" && location.pathname !== "/UserSoftLineForm" &&
  location.pathname !== "/components/customizacao/ListagemCustomizacao" && location.pathname !== "/components/implantacao/ListagemImplantacao" &&
 location.pathname !== "/ChamadoUser" && location.pathname !== "/RelatorioStatusChamados"
 && location.pathname !== "/ChamadosSetorAberto" && location.pathname !== "/UserSoftlineListagem" &&
  location.pathname !== "/Login" && location.pathname !== "/NovosClientes" && location.pathname !== "/" &&
 location.pathname !== "/components/userSoftline/UserSoftlineListagem" &&
 location.pathname !== "/ListaNovosClientes" && location.pathname !== "/AvaliacaoCliente" && location.pathname !== "/nao-autorizado" &&
  <UserHeaders />}





             <Routes>




              <Route path="/" element={<Login />} />

              <Route path="/not-found" element={<NotFound />} />


              <Route path="/nao-autorizado" element={<NaoAutorizado />} />

              <Route path="/AvaliacaoCliente" element={<AvaliacaoCliente />} />


               {/* Rota para o componente UserHeaders */}

              <Route path="/components/user/UsuarioListagem" element={<UsuarioListagem />} />
              <Route path="/UserForm" element={<UserForm />} />

              <Route path="/components/adminSoftLine/AdminSoftLineListagem" element={<AdminSoftLineListagem />} />

              <Route path="/ListarUsuarios" element={<ListarUsuarios />} />

              <Route path="/UsuarioListagem" element={<UsuarioListagem />} />

              <Route path="/AdminSoftlineForm" element={<AdminSoftlineForm />} />


              <Route path="/UserSoftLineForm" element={<UserSoftLineForm />} />
              <Route path="/components/customizacao/ListagemCustomizacao" element={<ListagemCustomizacao vetor={chamadosUser} />}/>

              <Route path="/components/implantacao/ListagemImplantacao" element={<ListagemImplantacao vetor={chamadosUser} />}/>

              <Route path="/ChamadoUser" element={<ChamadoUser />} />

              <Route path="/RelatorioStatusChamados" element={<RelatorioStatusChamados />} />
              <Route path="/ChamadosSetorAberto" element={<ChamadosSetorAberto />} />
              <Route path="/components/userSoftline/UserSoftlineListagem" element={<UserSoftlineListagem />} />
              <Route path="/NovosClientes" element={<NovosClientes />} />
              <Route path="/ListaNovosClientes" element={<ListaNovosClientes />} />

            </Routes>

         </div>



       );
}

export default App
