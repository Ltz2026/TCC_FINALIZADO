import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import CadastroUsuario from "../pages/CadastroUsuario";

import Home from "../pages/Home";
import Produtos from "../pages/Produtos";
import CadastroProduto from "../pages/CadastroProduto";
import Carrinho from "../pages/Carrinho";
import Editar from "../pages/Editar";
import Pedido from "../pages/Pedido";

function AppRoutes() {

    return (

        <Routes>

            {/* LOGIN */}

            <Route
                path="/"
                element={<Login />}
            />


            {/* CADASTRO DE USUÁRIO */}

            <Route
                path="/cadastro-usuario"
                element={<CadastroUsuario />}
            />


            {/* HOME */}

            <Route
                path="/home"
                element={<Home />}
            />


            {/* PRODUTOS */}

            <Route
                path="/produtos"
                element={<Produtos />}
            />


            {/* CADASTRO DE PRODUTO */}

            <Route
                path="/cadastro-produto"
                element={<CadastroProduto />}
            />


            {/* EDITAR PRODUTO */}

            <Route
                path="/editar/:id"
                element={<Editar />}
            />


            {/* CARRINHO */}

            <Route
                path="/carrinho"
                element={<Carrinho />}
            />

            <Route
                path="/pedidos"
                element={<Pedido />}
            />


            {/* ROTA DESCONHECIDA */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/"
                        replace
                    />
                }
            />

        </Routes>

    );

}


export default AppRoutes;