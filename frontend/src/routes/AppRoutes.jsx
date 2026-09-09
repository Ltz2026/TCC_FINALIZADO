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


            <Route
                path="/"
                element={<Login />}
            />

            <Route
                path="/cadastro-usuario"
                element={<CadastroUsuario />}
            />

            <Route
                path="/home"
                element={<Home />}
            />

            <Route
                path="/produtos"
                element={<Produtos />}
            />

            <Route
                path="/cadastro-produto"
                element={<CadastroProduto />}
            />

            <Route
                path="/editar/:id"
                element={<Editar />}
            />

            <Route
                path="/carrinho"
                element={<Carrinho />}
            />

            <Route
                path="/pedidos"
                element={<Pedido />}
            />

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