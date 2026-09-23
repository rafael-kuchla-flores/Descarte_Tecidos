import React, { useState } from 'react';

const ManagerCollectionPoint = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: 'Ponto de Coleta Centro',
    endereco: 'Rua alto da paz, 15 - Jaboatao/PE',
    horario: 'Segunda a Sexta • 08:00 - 18:00',
    telefone: '(81) 98967-2450',
    email: 'matheusalan334@gmail.com',
    descricao: 'Ponto de coleta oficial da Planta. Recebemos diversos tipos de tecidos para reutilização e reciclagem.',
    status: 'Ativo'
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    console.log('Dados salvos:', formData);
    setIsEditing(false);
  };

 
  const handleCancel = () => {
    setIsEditing(false);
  };

  const inputClassName = "w-full mt-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-[#0d2a1f] focus:ring-1 focus:ring-[#0d2a1f]";

  return (
    <div className="w-full max-w-5xl">
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Informações do Ponto de Coleta</h1>
        <p className="text-gray-500 mt-1 text-sm">Gerencie as informações do seu ponto de coleta.</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 transition-all">
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4 w-full">
            <img 
              src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" 
              alt="Foto do Ponto de Coleta" 
              className="w-[72px] h-[72px] rounded-lg object-cover border border-gray-100 flex-shrink-0"
            />
            
            <div className="w-full max-w-md">
              {isEditing ? (
                <>
                  <input 
                    type="text" 
                    name="nome" 
                    value={formData.nome} 
                    onChange={handleInputChange}
                    className={`${inputClassName} font-bold text-lg text-[#0d2a1f] mb-2`}
                  />
                  <input 
                    type="text" 
                    name="endereco" 
                    value={formData.endereco} 
                    onChange={handleInputChange}
                    className={inputClassName}
                  />
                </>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-[#0d2a1f]">{formData.nome}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{formData.endereco}</p>
                </>
              )}
            </div>
          </div>
          
          <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-100 ml-4">
            {formData.status}
          </span>
        </div>

        <hr className="my-6 border-gray-100" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-400 mb-1">Horário de funcionamento</p>
            {isEditing ? (
              <input 
                type="text" 
                name="horario" 
                value={formData.horario} 
                onChange={handleInputChange}
                className={inputClassName}
              />
            ) : (
              <p className="text-sm text-gray-800 font-medium">{formData.horario}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Telefone</p>
            {isEditing ? (
              <input 
                type="text" 
                name="telefone" 
                value={formData.telefone} 
                onChange={handleInputChange}
                className={inputClassName}
              />
            ) : (
              <p className="text-sm text-gray-800 font-medium">{formData.telefone}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">E-mail</p>
            {isEditing ? (
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange}
                className={inputClassName}
              />
            ) : (
              <p className="text-sm text-gray-800 font-medium">{formData.email}</p>
            )}
          </div>
        </div>

        <hr className="my-6 border-gray-100" />

        <div>
          <p className="text-sm text-gray-400 mb-1">Descrição</p>
          {isEditing ? (
            <textarea 
              name="descricao" 
              value={formData.descricao} 
              onChange={handleInputChange}
              rows="3"
              className={`${inputClassName} resize-none`}
            />
          ) : (
            <p className="text-sm text-gray-700 leading-relaxed max-w-3xl">
              {formData.descricao}
            </p>
          )}
        </div>

        <div className="mt-8 flex justify-end gap-3">
          {isEditing ? (
            <>
              <button 
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                className="bg-[#0d2a1f] hover:bg-[#153b2d] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                Salvar alterações
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-[#0d2a1f] hover:bg-[#153b2d] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              Editar informações
            </button>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default ManagerCollectionPoint;