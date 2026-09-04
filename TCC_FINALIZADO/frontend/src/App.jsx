import { BrowserRouter, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import AppRoutes from "./routes/AppRoutes";


function Layout() {

    const location = useLocation();

    // Páginas que não devem mostrar Header/Navbar/Footer
    const paginasSemLayout =
        location.pathname === "/" ||
        location.pathname === "/cadastro-usuario";


    return (
        <>

            {!paginasSemLayout && <Header />}

            {!paginasSemLayout && <Navbar />}


            <main>
                <AppRoutes />
            </main>


            {!paginasSemLayout && <Footer />}

        </>
    );

}


function App() {

    return (

        <BrowserRouter>

            <Layout />

        </BrowserRouter>

    );

}


export default App;