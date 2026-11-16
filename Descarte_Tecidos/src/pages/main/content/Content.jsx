    <>
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
        <header className="mb-8 text-center">
          <h1 className="mb-3 text-3xl font-extrabold text-[#11271F] sm:text-4xl">
            Conteúdos educativos
          </h1>
          <p className="mx-auto max-w-xl text-gray-600">
            Informação que transforma. Aprenda sobre consumo consciente,
            sustentabilidade, economia circular e descarte responsável de tecidos.
          </p>
        </header>

        {/* Pesquisa aplicada aos guias locais e às publicações da API. */}
        <div className="mx-auto mb-6 max-w-2xl space-y-3">
          <label htmlFor="content-search" className="block text-sm font-semibold text-[#11271F]">
            Pesquisar conteúdos
          </label>
          <input
            id="content-search"
            type="search"
            placeholder="Buscar por título ou assunto..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-full border border-gray-300 px-5 py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#245747]"
          />
        </div>

        {/* O filtro aparece antes de ambas as listas para funcionar com as duas. */}
        <div className="mb-10 flex flex-wrap justify-center gap-3" role="group" aria-label="Filtrar conteúdos favoritos">
          <button
            type="button"
            onClick={() => chooseFavoriteFilter(false)}
            aria-pressed={!showFavorites}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-[#245747] ${!showFavorites ? 'bg-[#11271F] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Todos os conteúdos
          </button>
          <button
            type="button"
            onClick={() => chooseFavoriteFilter(true)}
            aria-pressed={showFavorites}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-[#245747] ${showFavorites ? 'bg-[#11271F] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Meus favoritos ({loadingFavorites ? `${localFavorites.length} + ...` : favoritesCount})
          </button>
        </div>

        {/* GUIAS EDUCATIVOS LOCAIS */}
        <section className="mx-auto mb-14 max-w-6xl" aria-labelledby="educational-guides-title">
          <div className="mb-7 text-center">
            <span className="mb-3 inline-block rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              Aprenda com o EcoTecidos
            </span>
            <h2 id="educational-guides-title" className="text-2xl font-extrabold text-[#11271F] sm:text-3xl">
              Guias para um futuro mais sustentável
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              Descubra atitudes simples para reduzir o desperdício,
              reutilizar materiais e contribuir com a economia circular.
            </p>
          </div>

          {localFilteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {localFilteredPosts.map((post) => (
                <div key={post.id} className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition-shadow hover:shadow-md">
                  <details className="group">
                    <summary className="cursor-pointer list-none p-6 focus-visible:outline-2 focus-visible:outline-emerald-700">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 text-3xl" aria-hidden="true">
                        🌱
                      </div>
                      <span className="inline-block rounded-full bg-[#E5F1EE] px-3 py-1 text-xs font-semibold text-[#2B6054]">
                        {post.category}
                      </span>
                      <h3 className="mt-4 text-xl font-bold leading-tight text-[#11271F]">
                        {post.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        {post.summary}
                      </p>
                      <span className="mt-5 inline-block text-sm font-semibold text-emerald-800 group-open:hidden">
                        Ler conteúdo completo +
                      </span>
                      <span className="mt-5 hidden text-sm font-semibold text-emerald-800 group-open:inline-block">
                        Recolher conteúdo −
                      </span>
                    </summary>

                    <div className="space-y-4 border-t border-emerald-100 px-6 pb-6 pt-5">
                      {(post.paragraphs || []).map((paragraph, index) => (
                        <p key={index} className="text-sm leading-7 text-gray-700">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </details>

                  <div className="border-t border-emerald-50 px-6 py-4">
                    <button
                      type="button"
                      onClick={() => toggleLocalFavorite(post.id)}
                      aria-pressed={localFavorites.includes(post.id)}
                      className="rounded-lg border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                    >
                      {localFavorites.includes(post.id)
                        ? '♥ Remover dos favoritos'
                        : '♡ Salvar nos favoritos'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div role="status" className="py-8 text-center text-sm text-gray-600">
              <p>{showFavorites
                ? 'Nenhum guia educativo favorito corresponde à sua pesquisa.'
                : 'Nenhum guia educativo corresponde à sua pesquisa.'}</p>
              {showFavorites && (
                <button type="button" onClick={clearFilters} className="mt-3 font-semibold text-emerald-800 underline">
                  Ver todos os conteúdos
                </button>
              )}
            </div>
          )}
          <p className="mt-4 text-xs text-gray-500">
            Os favoritos dos guias educativos ficam salvos neste navegador.
          </p>
        </section>

        {/* PUBLICAÇÕES CADASTRADAS NO BACKEND */}
        <section aria-labelledby="backend-posts-title">
          <div className="mb-7">
            <h2 id="backend-posts-title" className="text-2xl font-bold text-[#11271F]">
              Mais conteúdos e publicações
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Explore artigos cadastrados na plataforma e salve seus favoritos.
            </p>
          </div>

          {categories.length > 0 && (
            <div className="mb-8 flex flex-wrap justify-center gap-2" role="group" aria-label="Filtrar publicações por categoria">
              <button
                type="button"
                onClick={() => setSelectedCategory('')}
                aria-pressed={!selectedCategory}
                className={`rounded-full px-4 py-2 text-sm font-medium ${!selectedCategory ? 'bg-[#245747] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Todas as categorias
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(String(category.id))}
                  aria-pressed={String(category.id) === selectedCategory}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${String(category.id) === selectedCategory ? 'bg-[#245747] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
