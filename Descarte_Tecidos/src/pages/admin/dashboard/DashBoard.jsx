import React, { useState } from 'react'

const DashBoard = () => {
  const [metrics, setMetrics] = useState([
    { id: 1, title: 'Usuários cadastrados', value: '128', subtext: '+ 12 este mês' },
    { id: 2, title: 'Pontos de coleta', value: '32', subtext: '+ 5 este mês' },
    { id: 3, title: 'Campanhas ativas', value: '8', subtext: '+ 2 este mês' },
  ])

  const [activities, setActivities] = useState([
    {
      id: 1,
      title: 'Novo ponto de coleta cadastrado',
      description: 'ONG Mãos Solidárias - Recife/PE',
      time: 'Há 2h',
      avatar: 'https://i.pravatar.cc/150?img=11' 
    },
    {
      id: 2,
      title: 'Nova campanha criada',
      description: 'Campanha de Agasalho 2026',
      time: 'Há 5h',
      avatar: 'https://i.pravatar.cc/150?img=12'
    },
    {
      id: 3,
      title: 'Usuário cadastrado',
      description: 'Maria Santos',
      time: 'Há 1 dia',
      avatar: 'https://i.pravatar.cc/150?img=5'
    }
  ])

  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {metrics.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <h3 className="text-[15px] font-medium text-gray-500">{item.title}</h3>
            <p className="mt-4 text-4xl font-bold text-gray-900">{item.value}</p>
            <p className="mt-4 text-sm font-semibold text-[#155A43] bg-green-50 w-max px-2 py-1 rounded-md">
              {item.subtext}
            </p>
          </div>
        ))}
      </section>

      <section className="bg-white p-5 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-lg font-bold text-gray-800">Atividades recentes</h3>
          <span className="text-xl sm:text-2xl font-bold text-gray-800 ml-auto sm:ml-4">356</span>
        </div>

        <div className="flex flex-col gap-4">
          {activities.map((act) => (
            <div key={act.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 rounded-xl p-4 sm:px-6 gap-3">
              <div className="flex items-center gap-4">
                <img src={act.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-[14px] font-bold text-gray-800">{act.title}</p>
                  <p className="text-[13px] text-gray-500 mt-0.5">{act.description}</p>
                </div>
              </div>
              <span className="text-[12px] sm:text-[13px] font-medium text-gray-500 self-end sm:self-auto">{act.time}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default DashBoard