import { useState } from 'react';
import { RiPauseCircleLine, RiPlayCircleLine } from 'react-icons/ri';

const DEFAULT_POINT = {
  nome: 'Ponto de Coleta Centro',
  endereco: 'Rua alto da paz, 15 - Jaboatao/PE',
  latitude: '',
  longitude: '',
  horario: 'Segunda a Sexta • 08:00 - 18:00',
  materiais: 'Algodão, Jeans, Poliéster',
  telefone: '(81) 98967-2450',
  email: 'matheusalan334@gmail.com',
  descricao: 'Ponto de coleta oficial da Planta. Recebemos diversos tipos de tecidos para reutilização e reciclagem.',
  foto: '',
  status: 'Ativo'
};

const ManagerCollectionPoint = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(() => {
    const savedPoint = localStorage.getItem('managerCollectionPoint');
    return savedPoint ? { ...DEFAULT_POINT, ...JSON.parse(savedPoint) } : DEFAULT_POINT;
  });
  const [originalFormData, setOriginalFormData] = useState(formData);
  const [feedback, setFeedback] = useState('');
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    const addressChanged = formData.endereco !== originalFormData.endereco
      || formData.latitude !== originalFormData.latitude
      || formData.longitude !== originalFormData.longitude;
    const updatedPoint = {
      ...formData,
      status: addressChanged ? 'Pendente' : formData.status
    };

    setFormData(updatedPoint);
    setOriginalFormData(updatedPoint);
    localStorage.setItem('managerCollectionPoint', JSON.stringify(updatedPoint));
    setFeedback(addressChanged
      ? 'Endereço alterado. O ponto voltou para análise do administrador.'
      : 'Alterações salvas com sucesso.');
    setIsEditing(false);
  };

  const handleToggleReceiving = () => {
    if (formData.status === 'Pendente') {
      setFeedback('O recebimento poderá ser alterado após a aprovação do administrador.');
      return;
    }

    const isPaused = formData.status === 'Pausado';
    setFormData((prev) => ({ ...prev, status: isPaused ? 'Ativo' : 'Pausado' }));
    setFeedback(isPaused ? 'Recebimento reativado neste ponto.' : 'Recebimento pausado neste ponto.');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      foto: URL.createObjectURL(file)
    }));
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setFeedback('A geolocalização não está disponível neste navegador.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setFormData((prev) => ({
          ...prev,
          latitude: coords.latitude.toFixed(6),
          longitude: coords.longitude.toFixed(6)
        }));
        setFeedback('Localização preenchida.');
      },
      () => setFeedback('Não foi possível obter sua localização.')
    );
  };

 
  const handleCancel = () => {
    setFormData(originalFormData);
    setIsEditing(false);
  };

  const handleStartEditing = () => {
    setOriginalFormData(formData);
    setFeedback('');
    setIsEditing(true);
  };

  const addressChanged = isEditing && (
    formData.endereco !== originalFormData.endereco
    || formData.latitude !== originalFormData.latitude
    || formData.longitude !== originalFormData.longitude
  );

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
              src={formData.foto || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'} 
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
          
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ml-4 ${
            formData.status === 'Pausado'
              ? 'bg-amber-50 text-amber-700 border-amber-100'
              : formData.status === 'Pendente'
                ? 'bg-gray-100 text-gray-600 border-gray-200'
                : 'bg-emerald-50 text-emerald-600 border-emerald-100'
          }`}>
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

        {isEditing && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Tipos de tecido aceitos</p>
              <input
                type="text"
                name="materiais"
                value={formData.materiais}
                onChange={handleInputChange}
                placeholder="Ex.: Algodão, jeans, linho"
                className={inputClassName}
              />
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Foto do ponto</p>
              <label className="flex items-center justify-center w-full mt-1 px-3 py-2 bg-gray-50 border border-dashed border-gray-300 rounded-md text-sm text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors">
                Escolher uma foto
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="sr-only" />
              </label>
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center justify-between gap-3 mb-1">
                <p className="text-sm text-gray-400">Geolocalização</p>
                <button
                  type="button"
                  onClick={handleUseLocation}
                  className="text-xs font-semibold text-[#0d2a1f] hover:underline"
                >
                  Usar minha localização
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  placeholder="Latitude"
                  className={inputClassName}
                />
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  placeholder="Longitude"
                  className={inputClassName}
                />
              </div>
            </div>
          </div>
        )}

        {addressChanged && (
          <p className="mt-5 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
            Alterações no endereço ou na localização exigem uma nova aprovação do administrador.
          </p>
        )}

        {feedback && (
          <p className="mt-5 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
            {feedback}
          </p>
        )}

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
            <>
              <button
                onClick={handleToggleReceiving}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm ${
                  formData.status === 'Pausado'
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    : formData.status === 'Pendente'
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                {formData.status === 'Pausado' ? <RiPlayCircleLine /> : <RiPauseCircleLine />}
                {formData.status === 'Pausado' ? 'Reativar recebimento' : 'Pausar recebimento'}
              </button>
              <button
                onClick={handleStartEditing}
                className="bg-[#0d2a1f] hover:bg-[#153b2d] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                Editar informações
              </button>
            </>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default ManagerCollectionPoint;