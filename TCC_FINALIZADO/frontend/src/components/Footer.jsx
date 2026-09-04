import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">

            <div className="footer-container">

                {/* Sobre a loja */}
                <div className="footer-column">

                    <h2>LtStore</h2>

                    <p>
                        Sua loja virtual de tecnologia,
                        informática e eletrônicos.
                    </p>

                    <p>
                        Qualidade, segurança e praticidade
                        para suas compras.
                    </p>

                </div>

                {/* Links */}
                <div className="footer-column">

                    <h3>Institucional</h3>

                    <a href="/">Sobre nós</a>

                    <a href="/">Política de privacidade</a>

                    <a href="/">Termos de uso</a>

                    <a href="/">Contato</a>

                </div>

                {/* Atendimento */}
                <div className="footer-column">

                    <h3>Atendimento</h3>

                    <p>Segunda a sexta</p>

                    <p>08:00 às 18:00</p>

                    <p>(11) 99999-9999</p>

                    <p>✉ contato@LtStore.com</p>

                </div>

                {/* Redes sociais */}
                <div className="footer-column">

                    <h3>Redes sociais</h3>

                    <div className="footer-social">

                        <a href="/">Instagram</a>

                        <a href="/">Facebook</a>

                        <a href="/">YouTube</a>

                    </div>

                </div>

            </div>

            {/* Rodapé inferior */}
            <div className="footer-bottom">

                <p>
                    © 2026 LtStore. Todos os direitos reservados.
                </p>

            </div>

        </footer>
    );
}

export default Footer;