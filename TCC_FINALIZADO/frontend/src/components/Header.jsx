import { useNavigate } from "react-router-dom";
import logo from "../assets/Ltstore.png";
import "./Header.css";

function Header() {

    const navigate = useNavigate();

    const usuarioSalvo = localStorage.getItem("usuario");

    let usuario = null;

    if (usuarioSalvo) {
        try {
            usuario = JSON.parse(usuarioSalvo);
        } catch (error) {
            console.error("Erro ao carregar usuário:", error);
        }
    }


    function sair() {

        localStorage.removeItem("usuario");

        navigate("/");

    }


    return (

        <header className="header">

            <div className="header-container">


                {/* LOGO */}

                <img
                    src={logo}
                    alt="LtStore"
                    className="logo"
                />  


                {/* USUÁRIO */}

                <div className="header-usuario">


                    <div className="header-usuario-info">

                        <div className="header-avatar">

                            {usuario?.nome
                                ? usuario.nome
                                    .charAt(0)
                                    .toUpperCase()
                                : "U"
                            }

                        </div>


                        <div className="header-usuario-texto">

                            <span>
                                Olá,
                            </span>

                            <strong>
                                {usuario?.nome || "Usuário"}
                            </strong>

                        </div>

                    </div>


                    {/* BOTÃO SAIR */}

                    <button
                        className="header-botao-sair"
                        onClick={sair}
                    >

                        <span>
                            ↪
                        </span>

                        Sair

                    </button>

                </div>

            </div>

        </header>

    );

}

export default Header;