import React, { useState } from 'react';
import { RiTimeLine } from 'react-icons/ri';

const Schedules = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [schedules, setSchedules] = useState([
    { id: 'seg', day: 'Segunda-feira', isOpen: true, openTime: '08:00', closeTime: '18:00' },
    { id: 'ter', day: 'Terça-feira', isOpen: true, openTime: '08:00', closeTime: '18:00' },
    { id: 'qua', day: 'Quarta-feira', isOpen: true, openTime: '08:00', closeTime: '18:00' },
    { id: 'qui', day: 'Quinta-feira', isOpen: true, openTime: '08:00', closeTime: '18:00' },
    { id: 'sex', day: 'Sexta-feira', isOpen: true, openTime: '08:00', closeTime: '18:00' },
    { id: 'sab', day: 'Sábado', isOpen: false, openTime: '08:00', closeTime: '18:00' },
    { id: 'dom', day: 'Domingo', isOpen: false, openTime: '08:00', closeTime: '18:00' },
  ]);

  const handleToggle = (id) => {
    if (!isEditing) return;
    setSchedules((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };
  const handleTimeChange = (id, field, value) => {
    setSchedules((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };
  const handleSave = () => {
    console.log('Novos horários salvos:', schedules);
    setIsEditing(false);
  };

  return (
    <div className="w-full max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0d2a1f]">Horários de Funcionamento</h1>
        <p className="text-gray-500 text-sm mt-1">
          Defina os dias e horários de funcionamento do ponto de coleta.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {schedules.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center justify-between px-6 py-3.5 ${
              index !== schedules.length - 1 ? 'border-b border-gray-100' : ''
            }`}
          >
            <span className="text-sm font-medium text-gray-700 w-32">
              {item.day}
            </span>
            <div className="flex-1 flex justify-start pl-4">
              <button
                type="button"
                onClick={() => handleToggle(item.id)}
                disabled={!isEditing}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  item.isOpen ? 'bg-[#153b2d]' : 'bg-gray-200'
                } ${isEditing ? 'cursor-pointer' : 'cursor-default opacity-90'}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    item.isOpen ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-end w-52">
              {item.isOpen ? (
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 border border-gray-200 rounded-lg px-2.5 py-1 bg-white shadow-2xs ${isEditing ? 'focus-within:border-[#0d2a1f] focus-within:ring-1 focus-within:ring-[#0d2a1f]' : ''}`}>
                    <input
                      type="text"
                      value={item.openTime}
                      disabled={!isEditing}
                      onChange={(e) => handleTimeChange(item.id, 'openTime', e.target.value)}
                      className="w-10 text-xs font-medium text-center text-gray-700 focus:outline-none disabled:bg-transparent"
                    />
                    <RiTimeLine className="text-gray-400 text-xs" />
                  </div>

                  <span className="text-gray-400 text-xs">-</span>
                  <div className={`flex items-center gap-1.5 border border-gray-200 rounded-lg px-2.5 py-1 bg-white shadow-2xs ${isEditing ? 'focus-within:border-[#0d2a1f] focus-within:ring-1 focus-within:ring-[#0d2a1f]' : ''}`}>
                    <input
                      type="text"
                      value={item.closeTime}
                      disabled={!isEditing}
                      onChange={(e) => handleTimeChange(item.id, 'closeTime', e.target.value)}
                      className="w-10 text-xs font-medium text-center text-gray-700 focus:outline-none disabled:bg-transparent"
                    />
                    <RiTimeLine className="text-gray-400 text-xs" />
                  </div>
                </div>
              ) : (
                <span className="text-xs font-medium text-gray-400 pr-2">
                  Fechado
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-center gap-3">
        {isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="bg-[#0d2a1f] hover:bg-[#153b2d] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
            >
              Salvar alterações
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-[#0d2a1f] hover:bg-[#153b2d] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
          >
            Editar alterações
          </button>
        )}
      </div>

    </div>
  );
};

export default Schedules;