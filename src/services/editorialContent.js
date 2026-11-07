// Editorial articles bundled with the frontend. These are not backend records.
export const editorialArticles = [
  {
    id: 'guia-tingimento-artesanal', categoryName: 'Artesanato',
    title: 'Benefícios do tingimento artesanal em tecidos',
    summary: 'Conheça o tingimento artesanal, seus cuidados e como aproveitar tecidos que você já possui.',
    body: 'O tingimento artesanal é uma forma criativa de renovar tecidos e experimentar cores em pequenas peças. Ele pode ajudar a prolongar o uso de roupas e retalhos que seriam descartados.\nAntes de começar, confira a composição do tecido e faça um teste em um retalho: algodão e outras fibras naturais costumam reagir de modo diferente de tecidos sintéticos.\nSepare os utensílios usados no tingimento daqueles destinados ao preparo de alimentos. Use luvas quando necessário e proteja a superfície de trabalho.\nPrefira pequenas quantidades de água e siga as orientações de fixação e lavagem compatíveis com o material escolhido. Nem todo corante natural tem a mesma resistência à luz e às lavagens.\nDepois do tingimento, seque o tecido conforme as instruções de conservação. Evite descartar soluções concentradas ou resíduos de corantes sem conhecer as orientações locais.\nO objetivo é valorizar o que já existe: tingir uma peça não torna automaticamente todo o processo sustentável, mas pode fazer parte de um consumo mais consciente.',
  },
  {
    id: 'guia-casca-cebola', categoryName: 'Artesanato',
    title: 'Técnicas de tingimento natural com casca de cebola',
    summary: 'Um guia introdutório para experimentar tons terrosos em retalhos de algodão.',
    body: 'Cascas secas de cebola podem liberar pigmentos em água aquecida e produzir tonalidades amareladas ou terrosas, dependendo do tecido e do processo. O resultado varia e não é garantido.\nEscolha um pequeno retalho de algodão limpo para fazer o primeiro teste. Separe uma panela dedicada ao artesanato, água e cascas de cebola limpas.\nAqueça as cascas em água até formar um banho colorido, deixe esfriar o suficiente para manusear com segurança e coe o líquido. Não use os utensílios depois para preparar alimentos.\nColoque o retalho umedecido no banho de cor e observe a tonalidade ao longo do tempo. Use luvas e evite respingos; crianças devem realizar a atividade com supervisão.\nRetire o tecido, enxágue com cuidado e deixe secar à sombra. Faça uma lavagem de teste separada, pois a cor pode desbotar ou transferir para outras peças.\nAproveitar resíduos vegetais em experiências artesanais pode ser interessante, mas não substitui cuidados com consumo de água, energia e descarte adequado.',
  },
  {
    id: 'guia-doacao', categoryName: 'Doação',
    title: 'Como preparar roupas para doação',
    summary: 'Um passo a passo para separar peças e encaminhá-las a quem pode reutilizá-las.',
    body: 'Comece separando roupas por tipo e estado de conservação.\nLave e seque as peças antes da entrega. Verifique bolsos, zíperes e botões.\nSepare peças rasgadas, mofadas ou muito danificadas: elas não devem ser apresentadas como roupas prontas para uso.\nAntes de sair, confirme o endereço, os horários e os materiais aceitos pelo ponto de coleta. Algumas instituições recebem apenas itens específicos.\nOrganize as roupas em sacolas limpas e identificadas. Assim, a triagem fica mais fácil e a doação pode chegar mais rapidamente a quem precisa.',
  },
  {
    id: 'guia-destinacao', categoryName: 'Reciclagem',
    title: 'O que fazer com tecidos que não podem ser doados?',
    summary: 'Entenda a diferença entre reutilização e reciclagem têxtil e evite o descarte incorreto.',
    body: 'Nem todo tecido danificado precisa ir diretamente para o lixo comum. Primeiro, avalie se a peça pode ser consertada, transformada ou reutilizada.\nRetalhos limpos podem servir para pequenos reparos, artesanato e projetos de reaproveitamento.\nPara tecidos sem possibilidade de reutilização, procure iniciativas que aceitem resíduos têxteis para triagem e reciclagem. A aceitação depende da composição e das condições do material.\nNão deixe sacolas em frente a pontos fechados nem misture tecidos sujos com doações.\nConsulte as regras do ponto de coleta antes de entregar qualquer material.',
  },
  {
    id: 'guia-consumo', categoryName: 'Sustentabilidade',
    title: 'Cinco hábitos para fazer suas roupas durarem mais',
    summary: 'Cuidados simples ajudam a reduzir desperdícios e o consumo de novos tecidos.',
    body: 'Leia as etiquetas de conservação e respeite as orientações de lavagem e secagem.\nEvite lavar peças sem necessidade: arejar uma roupa usada por pouco tempo pode ser suficiente, dependendo da situação.\nConserte pequenos rasgos e substitua botões antes que o dano aumente.\nGuarde as peças secas e em locais adequados, protegidas de umidade.\nAntes de comprar, considere se você realmente precisa da peça e se ela combina com o que já possui.\nQuando uma roupa deixar de servir, avalie troca, revenda ou doação responsável.',
  },
  {
    id: 'guia-tecidos', categoryName: 'Educação ambiental',
    title: 'Por que separar os tipos de tecido?',
    summary: 'Algodão, poliéster e misturas podem exigir processos diferentes de reaproveitamento.',
    body: 'As roupas são produzidas com fibras naturais, sintéticas ou misturas de diferentes materiais.\nO tipo de fibra influencia o modo como o tecido pode ser recuperado e reciclado. Misturas de fibras podem dificultar determinados processos.\nSempre que possível, consulte a etiqueta da peça para identificar sua composição.\nNa hora do descarte, não presuma que todo ponto recebe qualquer tecido. Confira as regras de aceitação antes de levar os materiais.\nSeparar e identificar os itens ajuda a triagem e evita encaminhamentos inadequados.',
  },
]

const placeholderPattern = /lorem\s*ipsum|asdf|sadasd|aslas|teste\s*(de\s*)?(post|conte[uú]do)|^test\b|^aaaa+$/i
export const isMeaningfulPost = (post) => {
  if (!post || !post.id || typeof post.title !== 'string') return false
  const title = post.title.trim()
  const summary = String(post.summary || '').trim()
  if (title.length < 12 || summary.length < 30) return false
  const allText = [
    title, summary, post.body, post.content, post.description,
    post.text, post.fullContent, post.contentText,
  ].filter(Boolean).join(' ')
  if (placeholderPattern.test(allText)) return false
  // These two legacy API records have placeholder bodies. The frontend
  // publishes independently reviewed educational guides instead.
  const replacedTitles = new Set([
    'benefícios do tingimento artesanal em tecidos',
    'técnicas de tingimento natural com casca de cebola',
  ])
  if (replacedTitles.has(title.toLocaleLowerCase('pt-BR'))) return false
  return true
}
