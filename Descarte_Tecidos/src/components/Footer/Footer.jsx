import React from "react";
import { NavLink } from "react-router-dom";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa6";
import {
  MessageCircle,
  Mail,
  Send,
  Lock,
  Recycle,
  MapPin,
  Heart,
  Users,
  ArrowUp,
} from "lucide-react";

const Footer = () => {
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-[#063b2b] text-white">

      {/* =====================================================
          PARTE PRINCIPAL
      ====================================================== */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1.5fr]">

          {/* =================================================
              LOGO / DESCRIÇÃO
          ================================================== */}
          <div>

            <div className="mb-7 flex items-center gap-3">

              <Recycle
                size={48}
                strokeWidth={2}
                className="text-lime-400"
              />

              <div className="text-xl font-bold leading-tight">
                <p>DESCARTE</p>
                <p>
                  DE{" "}
                  <span className="text-lime-400">
                    TECIDOS
                  </span>
                </p>
              </div>

            </div>

            <p className="max-w-sm text-base leading-8 text-gray-200">
              Promovemos o descarte consciente de tecidos,
              conectando pessoas a pontos de coleta e campanhas
              que transformam o futuro em um lugar melhor para todos.
            </p>

            {/* Redes sociais */}
            <div className="mt-8 flex gap-4">

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-lime-400 text-lime-400 transition hover:bg-lime-400 hover:text-[#063b2b]"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-lime-400 text-lime-400 transition hover:bg-lime-400 hover:text-[#063b2b]"
              >
                <FaFacebook />
              </a>

              <a
                href="#"
                aria-label="WhatsApp"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-lime-400 text-lime-400 transition hover:bg-lime-400 hover:text-[#063b2b]"
              >
                <FaWhatsapp size={21} />
              </a>

              <a
                href="#"
                aria-label="E-mail"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-lime-400 text-lime-400 transition hover:bg-lime-400 hover:text-[#063b2b]"
              >
                <Mail size={21} />
              </a>

            </div>

          </div>


          {/* =================================================
              NAVEGAÇÃO
          ================================================== */}
          <div>

            <h3 className="mb-7 text-lg font-bold text-lime-300">
              NAVEGAÇÃO
            </h3>

            <ul className="space-y-5 text-gray-200">

              <li>
                <NavLink
                  to="/"
                  className="transition hover:text-lime-300"
                >
                  Início
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/como-funciona"
                  className="transition hover:text-lime-300"
                >
                  Como Funciona
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/pontos-de-coleta"
                  className="transition hover:text-lime-300"
                >
                  Pontos de Coleta
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/campanhas"
                  className="transition hover:text-lime-300"
                >
                  Campanhas
                </NavLink>
              </li>

              

              <li>
                <NavLink
                  to="/conteudos"
                  className="transition hover:text-lime-300"
                >
                  Conteúdos
                </NavLink>
              </li>

            </ul>

          </div>


         
         
          {/* =================================================
              NEWSLETTER
          ================================================== */}
          <div>

            <h3 className="mb-7 text-lg font-bold text-lime-300">
              RECEBA NOVIDADES
            </h3>

            <p className="mb-7 max-w-sm text-base leading-8 text-gray-200">
              Inscreva-se para receber novidades sobre campanhas,
              dicas de sustentabilidade e muito mais.
            </p>

            <form
              className="flex overflow-hidden rounded-lg border border-gray-300"
              onSubmit={(e) => e.preventDefault()}
            >

              <input
                type="email"
                placeholder="Seu e-mail"
                className="min-w-0 flex-1 bg-transparent px-5 py-4 text-white outline-none placeholder:text-gray-300"
              />

              <button
                type="submit"
                aria-label="Inscrever e-mail"
                className="flex w-16 items-center justify-center bg-lime-400 text-[#063b2b] transition hover:bg-lime-300"
              >
                <Send size={22} />
              </button>

            </form>

            <div className="mt-5 flex items-center gap-3 text-sm text-gray-300">

              <Lock
                size={17}
                className="shrink-0 text-lime-400"
              />

              <span>
                Não enviamos spam. Seu e-mail está seguro.
              </span>

            </div>

          </div>

        </div>


        {/* =====================================================
            LINHA DIVISÓRIA
        ====================================================== */}
        <div className="my-14 h-px bg-white/20" />


        {/* =====================================================
            BENEFÍCIOS
        ====================================================== */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {/* Sustentabilidade */}
          <div className="flex items-center gap-5 lg:border-r lg:border-white/20 lg:pr-8">

            <Recycle
              size={52}
              strokeWidth={1.5}
              className="shrink-0 text-lime-400"
            />

            <div>
              <h4 className="mb-2 font-bold">
                Sustentabilidade
              </h4>

              <p className="text-sm leading-6 text-gray-300">
                Apoie a moda circular e ajude a cuidar do planeta.
              </p>
            </div>

          </div>


          {/* Pontos */}
          <div className="flex items-center gap-5 lg:border-r lg:border-white/20 lg:pr-8">

            <MapPin
              size={52}
              strokeWidth={1.5}
              className="shrink-0 text-lime-400"
            />

            <div>
              <h4 className="mb-2 font-bold">
                Encontre Pontos
              </h4>

              <p className="text-sm leading-6 text-gray-300">
                Localize pontos de coleta perto de você.
              </p>
            </div>

          </div>


          {/* Campanhas */}
          <div className="flex items-center gap-5 lg:border-r lg:border-white/20 lg:pr-8">

            <Heart
              size={52}
              strokeWidth={1.5}
              className="shrink-0 text-lime-400"
            />

            <div>
              <h4 className="mb-2 font-bold">
                Participe de Campanhas
              </h4>

              <p className="text-sm leading-6 text-gray-300">
                Engaje-se em campanhas e faça a diferença.
              </p>
            </div>

          </div>


          {/* Impacto */}
          <div className="flex items-center gap-5">

            <Users
              size={52}
              strokeWidth={1.5}
              className="shrink-0 text-lime-400"
            />

            <div>
              <h4 className="mb-2 font-bold">
                Impacto Social
              </h4>

              <p className="text-sm leading-6 text-gray-300">
                Suas doações podem transformar vidas e comunidades.
              </p>
            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          RODAPÉ INFERIOR
      ====================================================== */}
      <div className="bg-[#084b38]">

        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-7 lg:flex-row lg:items-center lg:justify-between lg:px-8">

          {/* Copyright */}
          <p className="text-sm text-gray-300">
            © 2026 Descarte de Tecidos. Todos os direitos reservados.
          </p>


          {/* Links */}
          <div className="flex flex-wrap items-center gap-5 text-sm text-gray-300">

            <a
              href="#"
              className="transition hover:text-lime-300"
            >
              Política de Privacidade
            </a>

            <span className="hidden sm:block text-lime-300">
              |
            </span>

            <a
              href="#"
              className="transition hover:text-lime-300"
            >
              Termos de Uso
            </a>

            <span className="hidden sm:block text-lime-300">
              |
            </span>

            <a
              href="#"
              className="transition hover:text-lime-300"
            >
              Cookies
            </a>


            {/* Voltar ao topo */}
            <button
              type="button"
              onClick={handleBackToTop}
              aria-label="Voltar ao topo"
              className="ml-2 flex h-12 w-12 items-center justify-center rounded-full border border-lime-400 text-lime-400 transition hover:bg-lime-400 hover:text-[#063b2b]"
            >
              <ArrowUp size={22} />
            </button>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;