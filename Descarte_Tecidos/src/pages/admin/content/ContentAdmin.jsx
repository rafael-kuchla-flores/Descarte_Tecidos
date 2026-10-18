import { useCallback, useEffect, useState } from 'react'
import {
  createCategory,
  createPost,
  deleteCategory,
  deletePost,
  getAdminPost,
  listAdminCategories,
  listAllAdminPosts,
  listClothTypes,
  updateCategory,
  updatePost,
} from '../../../services/contentService'

const emptyForm = {
  title: '',
  summary: '',
  body: '',
  categoryId: '',
  coverImageUrl: '',
  coverImageAlt: '',
  tags: '',
  clothTypeIds: [],
  isPublished: false,
}

const formatDate = (value) => value
  ? new Date(value).toLocaleDateString('pt-BR')
  : '—'

const ContentAdmin = () => {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [clothTypes, setClothTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [editingCategoryName, setEditingCategoryName] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [formData, setFormData] = useState(emptyForm)

  const loadData = useCallback(async () => {
    try {
      const [postList, categoryList, clothTypeList] = await Promise.all([
        listAllAdminPosts({ size: 100, sort: 'createdAt,desc' }),
        listAdminCategories(),
        listClothTypes(),
      ])
      setPosts(postList)
      setCategories(categoryList)
      setClothTypes(clothTypeList)
      setError('')
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível carregar os conteúdos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    Promise.all([
      listAllAdminPosts({ size: 100, sort: 'createdAt,desc' }),
      listAdminCategories(),
      listClothTypes(),
    ])
      .then(([postList, categoryList, clothTypeList]) => {
        if (cancelled) return
        setPosts(postList)
        setCategories(categoryList)
        setClothTypes(clothTypeList)
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.message || 'Não foi possível carregar os conteúdos.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const filteredPosts = posts.filter((post) =>
    `${post.title} ${post.summary}`.toLocaleLowerCase('pt-BR').includes(searchTerm.toLocaleLowerCase('pt-BR'))
  )

  const openCreateModal = () => {
    setEditingId(null)
    setFormData({ ...emptyForm, categoryId: categories[0] ? String(categories[0].id) : '' })
    setIsModalOpen(true)
  }

  const openEditModal = async (post) => {
    setError('')
    try {
      const detail = await getAdminPost(post.id)
      setEditingId(detail.id)
      setFormData({
        title: detail.title || '',
        summary: detail.summary || '',
        body: detail.body || '',
        categoryId: String(detail.category?.id || ''),
        coverImageUrl: detail.coverImageUrl || '',
        coverImageAlt: detail.coverImageAlt || '',
        tags: (detail.tags || []).join(', '),
        clothTypeIds: (detail.clothTypes || []).map((clothType) => Number(clothType.id)),
        isPublished: Boolean(detail.isPublished),
      })
      setIsModalOpen(true)
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível carregar o post.')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      title: formData.title.trim(),
      summary: formData.summary.trim(),
      body: formData.body.trim(),
      categoryId: Number(formData.categoryId),
      coverImageUrl: formData.coverImageUrl.trim(),
      coverImageAlt: formData.coverImageAlt.trim(),
      tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      clothTypeIds: formData.clothTypeIds,
      isPublished: formData.isPublished,
    }

    try {
      if (editingId) await updatePost(editingId, payload)
      else await createPost(payload)
      setIsModalOpen(false)
      await loadData()
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível salvar o post.')
    } finally {
      setSaving(false)
    }
  }

  const handleAddCategory = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const category = await createCategory(categoryName)
      setCategories((current) => [...current, category].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')))
      setCategoryName('')
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível criar a categoria.')
    }
  }

  const handleDeleteCategory = async (category) => {
    if (!window.confirm(`Excluir a categoria "${category.name}"?`)) return
    setError('')
    try {
      await deleteCategory(category.id)
      setCategories((current) => current.filter((item) => item.id !== category.id))
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível excluir a categoria.')
    }
  }

  const handleUpdateCategory = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const updated = await updateCategory(editingCategoryId, editingCategoryName)
      setCategories((current) => current.map((item) => item.id === updated.id ? updated : item))
      setEditingCategoryId(null)
      setEditingCategoryName('')
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível atualizar a categoria.')
    }
  }

  const handleDeletePost = async () => {
    if (!pendingDelete?.justification.trim()) {
      setError('Informe a justificativa para excluir o post.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await deletePost(pendingDelete.post.id, pendingDelete.justification)
      setPendingDelete(null)
      await loadData()
    } catch (requestError) {
      setError(requestError.message || 'Não foi possível excluir o post.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="min-h-[calc(100vh-70px)] w-full bg-white p-5 sm:p-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
          <p className="mt-1 text-sm text-gray-500">Crie, edite e publique conteúdos do site.</p>
        </div>
        <button type="button" onClick={openCreateModal} className="rounded-lg bg-[#123C2C] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1a5640]">
          + Novo post
        </button>
      </div>

      {error && <p role="alert" className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <section className="mb-8 rounded-xl border border-gray-200 p-5">
        <h2 className="mb-3 text-base font-bold text-gray-800">Categorias</h2>
        <form onSubmit={handleAddCategory} className="mb-4 flex flex-col gap-2 sm:flex-row">
          <input
            required
            aria-label="Nome da nova categoria"
            value={categoryName}
            onChange={(event) => setCategoryName(event.target.value)}
            placeholder="Nome da categoria"
            className="min-w-0 flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
          />
          <button className="rounded-lg border border-[#123C2C] px-4 py-2.5 text-sm font-semibold text-[#123C2C] hover:bg-emerald-50">
            Adicionar categoria
          </button>
        </form>
        <ul className="flex flex-wrap gap-2">
          {categories.map((category) => editingCategoryId === category.id ? (
            <li key={category.id}>
              <form onSubmit={handleUpdateCategory} className="flex gap-1">
                <input autoFocus required aria-label="Editar nome da categoria" value={editingCategoryName} onChange={(event) => setEditingCategoryName(event.target.value)} className="w-40 rounded-full border px-3 py-1 text-sm" />
                <button className="text-sm font-semibold text-emerald-700">Salvar</button>
                <button type="button" onClick={() => setEditingCategoryId(null)} className="text-sm text-gray-500">Cancelar</button>
              </form>
            </li>
          ) : (
            <li key={category.id} className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700">
              {category.name}
              <button type="button" onClick={() => { setEditingCategoryId(category.id); setEditingCategoryName(category.name) }} aria-label={`Renomear categoria ${category.name}`} className="text-xs font-semibold text-[#2B6054] hover:text-[#123C2C]">
                Editar
              </button>
              <button type="button" onClick={() => handleDeleteCategory(category)} aria-label={`Excluir categoria ${category.name}`} className="font-bold text-gray-400 hover:text-red-600">
                ×
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div className="mb-5 max-w-sm">
        <input
          type="search"
          aria-label="Buscar posts"
          placeholder="Buscar posts..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="w-full min-w-[700px] text-left text-sm text-gray-600">
          <thead className="border-b border-gray-100 text-gray-500">
            <tr>
              <th className="px-5 py-4">Título</th>
              <th className="px-5 py-4">Categoria</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Data</th>
              <th className="px-5 py-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="px-5 py-8 text-center">Carregando posts...</td></tr>
            ) : filteredPosts.length === 0 ? (
              <tr><td colSpan="5" className="px-5 py-8 text-center">Nenhum post encontrado.</td></tr>
            ) : filteredPosts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 font-medium text-gray-800">{post.title}</td>
                <td className="px-5 py-4">{post.categoryName}</td>
                <td className="px-5 py-4">
                  {post.isDeleted ? 'Excluído' : post.isPublished ? 'Publicado' : 'Rascunho'}
                </td>
                <td className="px-5 py-4">{formatDate(post.createdAt)}</td>
                <td className="px-5 py-4">
                  <div className="flex gap-3">
                    {!post.isDeleted && (
                      <>
                        <button type="button" onClick={() => openEditModal(post)} className="font-semibold text-orange-600 hover:text-orange-800">
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDelete({ post, justification: '' })}
                          className="font-semibold text-red-600 hover:text-red-800"
                        >
                          Excluir
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <section role="dialog" aria-modal="true" aria-labelledby="post-form-title" className="flex max-h-[92vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl">
            <header className="flex items-center justify-between border-b px-6 py-4">
              <h2 id="post-form-title" className="text-lg font-bold">{editingId ? 'Editar post' : 'Novo post'}</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} aria-label="Fechar" className="text-2xl text-gray-500">×</button>
            </header>
            <form id="post-form" onSubmit={handleSubmit} className="space-y-4 overflow-y-auto p-6">
              <label className="block text-sm font-semibold text-gray-700">
                Título
                <input required maxLength="180" value={formData.title} onChange={(event) => setFormData({ ...formData, title: event.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2.5 font-normal" />
              </label>
              <label className="block text-sm font-semibold text-gray-700">
                Resumo
                <textarea required maxLength="500" rows="2" value={formData.summary} onChange={(event) => setFormData({ ...formData, summary: event.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2.5 font-normal" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Categoria
                  <select required value={formData.categoryId} onChange={(event) => setFormData({ ...formData, categoryId: event.target.value })} className="mt-1 w-full rounded-lg border bg-white px-3 py-2.5 font-normal">
                    <option value="">Selecione</option>
                    {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                  </select>
                </label>
                <label className="block text-sm font-semibold text-gray-700">
                  Tags
                  <input value={formData.tags} onChange={(event) => setFormData({ ...formData, tags: event.target.value })} placeholder="upcycling, jeans, diy" className="mt-1 w-full rounded-lg border px-3 py-2.5 font-normal" />
                </label>
              </div>
              <label className="block text-sm font-semibold text-gray-700">
                Conteúdo
                <textarea required rows="8" value={formData.body} onChange={(event) => setFormData({ ...formData, body: event.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2.5 font-normal" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-semibold text-gray-700">
                  URL da imagem de capa
                  <input type="url" value={formData.coverImageUrl} onChange={(event) => setFormData({ ...formData, coverImageUrl: event.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2.5 font-normal" />
                </label>
                <label className="block text-sm font-semibold text-gray-700">
                  Texto alternativo da imagem
                  <input required={Boolean(formData.coverImageUrl)} value={formData.coverImageAlt} onChange={(event) => setFormData({ ...formData, coverImageAlt: event.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2.5 font-normal" />
                </label>
              </div>
              <label className="block text-sm font-semibold text-gray-700">
                Tipos de tecido relacionados
                <select
                  multiple
                  value={formData.clothTypeIds.map(String)}
                  onChange={(event) => setFormData({ ...formData, clothTypeIds: [...event.target.selectedOptions].map((option) => Number(option.value)) })}
                  className="mt-1 min-h-24 w-full rounded-lg border bg-white px-3 py-2.5 font-normal"
                >
                  {clothTypes.map((clothType) => <option key={clothType.id} value={clothType.id}>{clothType.name}</option>)}
                </select>
                <span className="mt-1 block text-xs font-normal text-gray-500">Use Ctrl (Windows) ou Command (Mac) para selecionar mais de um.</span>
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <input type="checkbox" checked={formData.isPublished} onChange={(event) => setFormData({ ...formData, isPublished: event.target.checked })} />
                Publicado
              </label>
            </form>
            <footer className="flex justify-end gap-3 border-t px-6 py-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-600">Cancelar</button>
              <button form="post-form" disabled={saving} className="rounded-lg bg-[#123C2C] px-5 py-2 text-sm font-semibold text-white disabled:opacity-60">
                {saving ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Criar post'}
              </button>
            </footer>
          </section>
        </div>
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <section role="dialog" aria-modal="true" aria-labelledby="delete-post-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 id="delete-post-title" className="text-lg font-bold">Excluir post?</h2>
            <p className="mt-2 text-sm text-gray-600">“{pendingDelete.post.title}” será removido da área pública, mas ficará no histórico administrativo.</p>
            <label className="mt-4 block text-sm font-semibold text-gray-700">
              Justificativa
              <textarea required rows="3" value={pendingDelete.justification} onChange={(event) => setPendingDelete({ ...pendingDelete, justification: event.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2 font-normal" />
            </label>
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" onClick={() => setPendingDelete(null)} className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-600">Cancelar</button>
              <button type="button" disabled={saving} onClick={handleDeletePost} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">Excluir</button>
            </div>
          </section>
        </div>
      )}
    </section>
  )
}

export default ContentAdmin
