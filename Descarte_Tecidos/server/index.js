import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { STATUS_CODES } from 'node:http';
import process from 'node:process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'database.json');
const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'ecotecido-dev-secret';

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use((req, res, next) => {
  const sendJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode < 400 || !body || typeof body !== 'object' || Array.isArray(body) || body.timestamp) {
      return sendJson(body);
    }
    return sendJson({
      timestamp: new Date().toISOString(),
      status: res.statusCode,
      error: STATUS_CODES[res.statusCode] || 'Error',
      message: body.message || 'Ocorreu um erro na requisição.',
      path: req.originalUrl.split('?')[0],
      ...(Array.isArray(body.fieldErrors) ? { fieldErrors: body.fieldErrors } : {}),
    });
  };
  next();
});

const defaultState = {
  users: [
    {
      id: 1,
      name: 'Administrador',
      email: 'admin@ecotecido.com',
      password: 'admin123',
      role: 'ADMIN',
      status: 'ACTIVE',
      document: '000.000.000-00',
      phone: '(11) 99999-0001',
      pointId: null,
    },
    {
      id: 2,
      name: 'Gerente do Ponto',
      email: 'gerente@ecotecido.com',
      password: 'gerente123',
      role: 'PONTO_COLETA_GERENTE',
      status: 'ACTIVE',
      document: '111.111.111-11',
      phone: '(11) 99999-0002',
      pointId: 1,
    },
    {
      id: 3,
      name: 'Operador do Ponto',
      email: 'operador@ecotecido.com',
      password: 'operador123',
      role: 'PONTO_COLETA_OPERADOR',
      status: 'ACTIVE',
      document: '222.222.222-22',
      phone: '(11) 99999-0003',
      pointId: 1,
    },
    {
      id: 4,
      name: 'Usu�rio Comum',
      email: 'usuario@ecotecido.com',
      password: 'usuario123',
      role: 'USER',
      status: 'ACTIVE',
      document: '333.333.333-33',
      phone: '(11) 99999-0004',
      pointId: null,
    },
  ],
  pendingUpdates: [],
  clothTypes: [
    { id: 1, name: 'Algod�o', description: '', active: true },
    { id: 2, name: 'Jeans', description: '', active: true },
    { id: 3, name: 'Poli�ster', description: '', active: true },
    { id: 4, name: 'L�', description: '', active: true },
    { id: 5, name: 'Malha', description: '', active: true },
  ],
  categories: [
    { id: 1, name: 'Sustentabilidade' },
    { id: 2, name: 'Dicas' },
    { id: 3, name: 'Economia Circular' },
    { id: 4, name: 'Moda Consciente' },
  ],
  posts: [
    {
      id: 1,
      slug: 'o-impacto-da-industria-textil-no-meio-ambiente',
      title: 'O impacto da indústria têxtil no meio ambiente',
      summary: 'Entenda por que o descarte correto de tecidos é tão importante.',
      body: 'A indústria têxtil gera grande volume de resíduos e consome muita água e energia. O descarte correto e o reaproveitamento de tecidos ajudam a reduzir esse impacto.',
      categoryId: 1,
      coverImageUrl: '',
      coverImageAlt: '',
      tags: ['sustentabilidade', 'meio ambiente'],
      clothTypeIds: [],
      createdAt: '2026-05-16T12:00:00.000Z',
      updatedAt: '2026-05-16T12:00:00.000Z',
      createdByName: 'Administrador',
      isPublished: true,
      isDeleted: false,
      deletedAt: null,
      deletedByName: null,
      deletionJustification: null,
    },
    {
      id: 2,
      slug: '5-dicas-para-reutilizar-suas-roupas',
      title: '5 dicas para reutilizar suas roupas',
      summary: 'Pequenas atitudes que fazem grande diferença.',
      body: 'Reutilizar roupas prolonga a vida útil dos tecidos e reduz o descarte. Doe peças em bom estado, transforme roupas antigas e encaminhe tecidos sem uso para um ponto de coleta.',
      categoryId: 2,
      coverImageUrl: '',
      coverImageAlt: '',
      tags: ['reutilização', 'dicas'],
      clothTypeIds: [],
      createdAt: '2026-05-10T12:00:00.000Z',
      updatedAt: '2026-05-10T12:00:00.000Z',
      createdByName: 'Administrador',
      isPublished: true,
      isDeleted: false,
      deletedAt: null,
      deletedByName: null,
      deletionJustification: null,
    },
  ],
  collectionPoints: [
    {
      id: 1,
      name: 'Ponto de Coleta Centro',
      city: 'S�o Paulo',
      status: 'ACTIVE',
      phone: '(11) 3333-0101',
      description: 'Coleta de roupas, retalhos e tecidos em bom estado.',
      pointPictureUrl: '',
      latitude: -23.5489,
      longitude: -46.6388,
      address: {
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'S�o Paulo',
        state: 'SP',
      },
      acceptedClothTypes: ['Algod�o', 'Jeans', 'Poli�ster'],
      operatingHours: [
        { dayOfWeek: 'Segunda', openingTime: '08:00', closingTime: '18:00' },
        { dayOfWeek: 'Ter�a', openingTime: '08:00', closingTime: '18:00' },
        { dayOfWeek: 'Quarta', openingTime: '08:00', closingTime: '18:00' },
      ],
      managerId: 2,
      operatorIds: [3],
    },
    {
      id: 2,
      name: 'Eco Moda Vila Mariana',
      city: 'S�o Paulo',
      status: 'ACTIVE',
      phone: '(11) 3333-0102',
      description: 'Recebemos roupas de inverno e tecidos usados em boa condi��o.',
      pointPictureUrl: '',
      latitude: -23.5948,
      longitude: -46.6529,
      address: {
        street: 'Avenida Paulista',
        number: '1500',
        neighborhood: 'Bela Vista',
        city: 'S�o Paulo',
        state: 'SP',
      },
      acceptedClothTypes: ['L�', 'Malha', 'Algod�o'],
      operatingHours: [
        { dayOfWeek: 'Segunda', openingTime: '09:00', closingTime: '17:00' },
        { dayOfWeek: 'Quinta', openingTime: '09:00', closingTime: '17:00' },
        { dayOfWeek: 'S�bado', openingTime: '09:00', closingTime: '14:00' },
      ],
      managerId: null,
      operatorIds: [],
    },
    {
      id: 3,
      name: 'Recicla Tecido Pinheiros',
      city: 'S�o Paulo',
      status: 'PENDING',
      phone: '(11) 3333-0103',
      description: 'Recebimento de todo tipo de tecido com foco em reciclagem.',
      pointPictureUrl: '',
      latitude: -23.5614,
      longitude: -46.6972,
      address: {
        street: 'Rua do Orvalho',
        number: '45',
        neighborhood: 'Pinheiros',
        city: 'S�o Paulo',
        state: 'SP',
      },
      acceptedClothTypes: ['Poli�ster', 'Jeans', 'L�'],
      operatingHours: [
        { dayOfWeek: 'Segunda', openingTime: '10:00', closingTime: '19:00' },
        { dayOfWeek: 'Quarta', openingTime: '10:00', closingTime: '19:00' },
      ],
      managerId: null,
      operatorIds: [],
    },
  ],
  campaigns: [
    {
      id: 1,
      title: 'Campanha do Agasalho 2026',
      startDate: '01/06/2026',
      endDate: '30/08/2026',
      status: 'Ativa',
      description: 'Doe roupas e aque�a o inverno de quem mais precisa. Pontos de coleta em toda a regi�o.',
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80',
      steps: [
        { number: 1, title: 'Separe as roupas', description: 'Selecione roupas de inverno em bom estado.' },
        { number: 2, title: 'Encontre um ponto', description: 'Veja os pontos de coleta participantes abaixo.' },
        { number: 3, title: 'Fa�a a doa��o', description: 'Leve suas roupas ao ponto de coleta escolhido.' },
      ],
      pointIds: [1, 2, 3],
    },
    {
      id: 2,
      title: 'Doe e Recicle',
      startDate: '15/03/2026',
      endDate: '15/06/2026',
      status: 'Ativa',
      description: 'Contribua com tecidos e res�duos t�xteis para reciclagem e fortalecimento da economia circular.',
      image: 'https://images.unsplash.com/photo-1605289982774-9a6fef564df8?auto=format&fit=crop&w=1200&q=80',
      steps: [
        { number: 1, title: 'Separe os tecidos', description: 'Junte retalhos, sobras e roupas desgastadas.' },
        { number: 2, title: 'Consulte os centros', description: 'Localize os postos com foco em reciclagem t�xtil.' },
        { number: 3, title: 'Destine corretamente', description: 'Entregue o material para ser reaproveitado.' },
      ],
      pointIds: [2, 3],
    },
  ],
  contents: [
    {
      id: 1,
      titulo: 'O impacto da ind�stria t�xtil no meio ambiente',
      categoria: 'Sustentabilidade',
      tags: ['sustentabilidade', 'meio ambiente'],
      conteudo: 'A ind�stria t�xtil gera grande volume de res�duos e consumo intensivo de �gua e energia.',
      imagem: '',
      status: 'Publicado',
      data: '16/05/2026',
    },
    {
      id: 2,
      titulo: '5 dicas para reutilizar suas roupas',
      categoria: 'Dicas',
      tags: ['reutiliza��o', 'dicas'],
      conteudo: 'Dicas pr�ticas para reaproveitar roupas e tecidos sem gerar desperd�cio.',
      imagem: '',
      status: 'Publicado',
      data: '10/05/2026',
    },
  ],
  receipts: [
    { id: 1, pointId: 1, operatorId: 3, material: 'Algod�o', quantity: '10 kg', responsavel: 'Operador do Ponto', createdAt: '2026-09-11T10:00:00.000Z', notes: 'Recebimento regular' },
    { id: 2, pointId: 1, operatorId: 3, material: 'Jeans', quantity: '8 kg', responsavel: 'Operador do Ponto', createdAt: '2026-09-10T09:30:00.000Z', notes: 'Material separado' },
    { id: 3, pointId: 1, operatorId: 3, material: 'Poli�ster', quantity: '15 kg', responsavel: 'Operador do Ponto', createdAt: '2026-09-09T11:15:00.000Z', notes: 'Enviado para reciclagem' },
  ],
};

const readState = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultState, null, 2));
      return structuredClone(defaultState);
    }

    const content = fs.readFileSync(DATA_FILE, 'utf8');
    if (!content.trim()) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultState, null, 2));
      return structuredClone(defaultState);
    }

    const parsed = JSON.parse(content);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      users: Array.isArray(parsed.users) ? parsed.users : structuredClone(defaultState.users),
      collectionPoints: Array.isArray(parsed.collectionPoints) ? parsed.collectionPoints : structuredClone(defaultState.collectionPoints),
      pendingUpdates: Array.isArray(parsed.pendingUpdates) ? parsed.pendingUpdates : structuredClone(defaultState.pendingUpdates || []),
      clothTypes: Array.isArray(parsed.clothTypes) ? parsed.clothTypes : structuredClone(defaultState.clothTypes),
      categories: Array.isArray(parsed.categories) ? parsed.categories : structuredClone(defaultState.categories),
      posts: Array.isArray(parsed.posts)
        ? parsed.posts
        : (Array.isArray(parsed.contents) && parsed.contents.length > 0
          ? parsed.contents.map((item, index) => {
            const category = (Array.isArray(parsed.categories) ? parsed.categories : defaultState.categories)
              .find((entry) => entry.name === item.categoria)
              || defaultState.categories.find((entry) => entry.name === item.categoria)
              || defaultState.categories[0];
            const title = item.titulo || 'Conteúdo sem título';
            const timestamp = new Date().toISOString();
            return {
              id: Number(item.id) || Date.now() + index,
              slug: String(title).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
              title,
              summary: String(item.conteudo || '').slice(0, 180),
              body: item.conteudo || '',
              categoryId: category.id,
              coverImageUrl: item.imagem || '',
              coverImageAlt: item.imagem ? title : '',
              tags: Array.isArray(item.tags) ? item.tags : [],
              clothTypeIds: [],
              createdAt: timestamp,
              updatedAt: timestamp,
              createdByName: 'Administrador',
              isPublished: item.status !== 'Rascunho',
              isDeleted: false,
              deletedAt: null,
              deletedByName: null,
              deletionJustification: null,
            };
          })
          : structuredClone(defaultState.posts)),
      campaigns: Array.isArray(parsed.campaigns) ? parsed.campaigns : structuredClone(defaultState.campaigns),
      contents: Array.isArray(parsed.contents) ? parsed.contents : structuredClone(defaultState.contents),
      receipts: Array.isArray(parsed.receipts) ? parsed.receipts : structuredClone(defaultState.receipts),
    };
  } catch (error) {
    console.error('Erro ao carregar dados do backend:', error);
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultState, null, 2));
    return structuredClone(defaultState);
  }
};

let state = readState();

const saveState = () => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2));
};

const buildPagination = (items, page = 0, size = 10) => {
  const numericPage = Number(page) || 0;
  const numericSize = Number(size) || 10;
  const start = numericPage * numericSize;
  const end = start + numericSize;
  const pageItems = items.slice(start, end);

  return {
    content: pageItems,
    page: {
      number: numericPage,
      size: numericSize,
      totalElements: items.length,
      totalPages: Math.ceil(items.length / numericSize),
    },
  };
};

const normalizeUser = (user) => {
  if (!user) return null;
  const safeUser = { ...user };
  delete safeUser.password;
  const active = user.status ? user.status === 'ACTIVE' : user.active !== false;
  const roles = user.roles || (user.role ? [user.role === 'USER' ? 'DOADOR' : user.role] : ['DOADOR']);
  const document = String(user.document || '').replace(/[^a-zA-Z0-9]/g, '');
  const rawPhone = String(user.phone || '');
  const phoneDigits = rawPhone.replace(/\D/g, '');
  const phone = rawPhone.startsWith('+') ? `+${phoneDigits}` : phoneDigits ? `+55${phoneDigits}` : '';
  return {
    ...safeUser,
    document,
    phone,
    active,
    roles,
    createdAt: user.createdAt || new Date().toISOString(),
    updatedAt: user.updatedAt || user.createdAt || new Date().toISOString(),
  };
};

const normalizePoint = (point) => {
  const safePoint = { ...point };
  delete safePoint.createdByUserId;
  const hours = (point.operatingHours || []).map((hour) => ({
    dayOfWeek: hour.dayOfWeek,
    openingTime: hour.openingTime || hour.openTime || '',
    closingTime: hour.closingTime || hour.closeTime || '',
  }));
  return {
  ...safePoint,
  id: Number(point.id),
  city: point.city || point.address?.city || 'Localização não informada',
  address: typeof point.address === 'string'
    ? {
      street: point.address,
      number: '',
      complement: '',
      neighborhood: '',
      city: point.city || '',
      state: '',
      country: 'Brasil',
      zipCode: '',
      latitude: point.latitude ?? null,
      longitude: point.longitude ?? null,
    }
    : {
      street: point.address?.street || '',
      number: point.address?.number || '',
      complement: point.address?.complement || '',
      neighborhood: point.address?.neighborhood || '',
      city: point.address?.city || point.city || '',
      state: point.address?.state || '',
      country: point.address?.country || 'Brasil',
      zipCode: point.address?.zipCode || '',
      latitude: point.address?.latitude ?? point.latitude ?? null,
      longitude: point.address?.longitude ?? point.longitude ?? null,
    },
  latitude: point.latitude ?? point.address?.latitude ?? null,
  longitude: point.longitude ?? point.address?.longitude ?? null,
  imageUrl: point.imageUrl || point.pointPictureUrl || point.photo || '',
  pointPictureUrl: point.imageUrl || point.pointPictureUrl || point.photo || '',
  description: point.description || '',
  photo: point.imageUrl || point.pointPictureUrl || point.photo || '',
  clothTypeIds: point.clothTypeIds || (point.acceptedClothTypes || point.materials || [])
    .map((acceptedType) => state.clothTypes.find((clothType) => clothType.name === acceptedType)?.id)
    .filter(Boolean),
  acceptedClothTypes: point.clothTypeIds
    ? point.clothTypeIds.map((id) => state.clothTypes.find((clothType) => Number(clothType.id) === Number(id))?.name).filter(Boolean)
    : point.acceptedClothTypes || point.materials || [],
  operatingHours: hours,
  hasPendingUpdate: Boolean(point.pendingUpdate || point.hasPendingUpdate),
  status: point.status || 'ACTIVE',
  distanceKm: point.distanceKm || null,
  };
};

const normalizeClothType = (clothType) => ({
  id: Number(clothType.id),
  name: clothType.name,
  description: clothType.description || '',
  isActive: clothType.isActive ?? clothType.active ?? true,
});

const getPendingUpdateResponse = (point) => {
  if (!point.pendingUpdate) return null;
  return {
    id: Number(point.pendingUpdate.id),
    currentPoint: normalizePoint(point),
    proposedChanges: point.pendingUpdate.proposedChanges,
    requestedByEmail: point.pendingUpdate.requestedByEmail,
    requestedAt: point.pendingUpdate.requestedAt,
  };
};

const getUserSummary = (user) => {
  const normalized = normalizeUser(user);
  return {
    name: normalized.name,
    document: normalized.document,
    email: normalized.email,
    phone: normalized.phone,
    createdAt: normalized.createdAt,
  };
};

const getCollectionPointUsersResponse = (point) => {
  const managers = state.users
    .filter((user) => Number(user.id) === Number(point.managerId))
    .map(getUserSummary);
  const operators = state.users
    .filter((user) => (point.operatorIds || []).some((id) => Number(id) === Number(user.id)))
    .map(getUserSummary);
  const summary = normalizePoint(point);

  return {
    collectionPoint: {
      id: summary.id,
      name: summary.name,
      status: summary.status,
      address: [
        summary.address.street,
        summary.address.number,
        summary.address.neighborhood,
        summary.address.city,
        summary.address.state,
      ].filter(Boolean).join(', '),
      latitude: summary.latitude,
      longitude: summary.longitude,
      aceptedClothTypes: summary.acceptedClothTypes,
    },
    managers,
    operators,
  };
};

const normalizePointUpdatePayload = (body) => {
  const proposed = {};
  for (const field of ['name', 'address', 'status', 'imageUrl', 'clothTypeIds']) {
    if (body[field] !== undefined) proposed[field] = body[field];
  }
  const hours = body.operatingHour ?? body.operatingHours;
  if (hours !== undefined) proposed.operatingHour = hours;
  return proposed;
};

const validateCollectionPointPayload = (body, { partial = false } = {}) => {
  const errors = [];
  const hours = body.operatingHours ?? body.operatingHour;
  if (!partial) {
    if (!String(body.name || '').trim()) errors.push({ field: 'name', message: 'O nome do ponto é obrigatório.' });
    if (!body.address || typeof body.address !== 'object' || Array.isArray(body.address)) {
      errors.push({ field: 'address', message: 'O endereço é obrigatório.' });
    }
    if (!Array.isArray(body.clothTypeIds) || body.clothTypeIds.length === 0) {
      errors.push({ field: 'clothTypeIds', message: 'Selecione ao menos um tipo de tecido.' });
    }
    if (!Array.isArray(hours) || hours.length === 0) {
      errors.push({ field: 'operatingHours', message: 'Informe ao menos um horário de funcionamento.' });
    }
  }

  if (body.name !== undefined && !String(body.name).trim()) {
    errors.push({ field: 'name', message: 'O nome do ponto é obrigatório.' });
  }
  if (body.address !== undefined && (!body.address || typeof body.address !== 'object' || Array.isArray(body.address))) {
    errors.push({ field: 'address', message: 'O endereço deve ser um objeto válido.' });
  }
  if (body.clothTypeIds !== undefined) {
    const ids = body.clothTypeIds;
    if (!Array.isArray(ids) || ids.length === 0 || new Set(ids.map(Number)).size !== ids.length
      || ids.some((id) => !state.clothTypes.some((clothType) => Number(clothType.id) === Number(id) && (clothType.isActive ?? clothType.active ?? true)))) {
      errors.push({ field: 'clothTypeIds', message: 'Os tipos de tecido devem conter IDs válidos e sem duplicatas.' });
    }
  }
  if (hours !== undefined) {
    const validDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (!Array.isArray(hours) || hours.length === 0
      || new Set(hours.map((hour) => hour.dayOfWeek)).size !== hours.length
      || hours.some((hour) => !validDays.includes(hour.dayOfWeek)
        || !timePattern.test(hour.openTime || hour.openingTime || '')
        || !timePattern.test(hour.closeTime || hour.closingTime || ''))) {
      errors.push({ field: 'operatingHours', message: 'Informe dias únicos e horários válidos no formato HH:mm.' });
    }
  }
  if (body.status !== undefined && !['ACTIVE', 'PENDING', 'PAUSED', 'SUSPENDED'].includes(body.status)) {
    errors.push({ field: 'status', message: 'Status inválido.' });
  }

  for (const field of ['latitude', 'longitude']) {
    if (body[field] !== undefined && body[field] !== null && !Number.isFinite(Number(body[field]))) {
      errors.push({ field, message: 'A coordenada deve ser numérica.' });
    }
  }
  if (body.address && typeof body.address === 'object') {
    for (const field of ['latitude', 'longitude']) {
      const value = body.address[field];
      if (value !== undefined && value !== null && !Number.isFinite(Number(value))) {
        errors.push({ field: `address.${field}`, message: 'A coordenada deve ser numérica.' });
      }
    }
  }
  return errors;
};

const applyCollectionPointPayload = (point, body) => {
  if (body.name !== undefined) point.name = String(body.name).trim();
  if (body.address !== undefined) {
    point.address = {
      ...(typeof point.address === 'object' ? point.address : {}),
      ...body.address,
    };
    point.city = body.address.city || point.city;
  }
  if (body.latitude !== undefined) point.latitude = body.latitude === null ? null : Number(body.latitude);
  if (body.longitude !== undefined) point.longitude = body.longitude === null ? null : Number(body.longitude);
  if (body.address?.latitude !== undefined) point.latitude = Number(body.address.latitude);
  if (body.address?.longitude !== undefined) point.longitude = Number(body.address.longitude);
  if (body.imageUrl !== undefined) {
    point.imageUrl = String(body.imageUrl || '').trim();
    point.pointPictureUrl = point.imageUrl;
  }
  if (body.clothTypeIds !== undefined) {
    point.clothTypeIds = [...new Set(body.clothTypeIds.map(Number))];
    point.acceptedClothTypes = point.clothTypeIds
      .map((id) => state.clothTypes.find((clothType) => Number(clothType.id) === id)?.name)
      .filter(Boolean);
  } else if (body.acceptedClothTypes !== undefined) {
    point.acceptedClothTypes = body.acceptedClothTypes;
    point.clothTypeIds = body.acceptedClothTypes
      .map((name) => state.clothTypes.find((clothType) => clothType.name === name)?.id)
      .filter(Boolean);
  }
  const hours = body.operatingHours ?? body.operatingHour;
  if (hours !== undefined) {
    point.operatingHours = hours.map((hour) => ({
      dayOfWeek: hour.dayOfWeek,
      openTime: hour.openTime || hour.openingTime,
      closeTime: hour.closeTime || hour.closingTime,
    }));
  }
  if (body.status !== undefined) point.status = body.status;
};

const slugify = (value) => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const normalizeSearchText = (value) => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLocaleLowerCase('pt-BR');

const normalizePost = (post, includeAdminFields = false) => {
  const category = state.categories.find((item) => Number(item.id) === Number(post.categoryId));
  const clothTypes = (post.clothTypeIds || [])
    .map((id) => state.clothTypes.find((item) => Number(item.id) === Number(id)))
    .filter(Boolean)
    .map(({ id, name }) => ({ id, name }));
  const response = {
    id: Number(post.id),
    slug: post.slug,
    title: post.title,
    summary: post.summary,
    body: post.body,
    category: category ? { id: category.id, name: category.name } : null,
    coverImageUrl: post.coverImageUrl || '',
    coverImageAlt: post.coverImageAlt || '',
    tags: post.tags || [],
    clothTypes,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    createdByName: post.createdByName || '',
    isPublished: Boolean(post.isPublished),
  };

  if (includeAdminFields) {
    response.isDeleted = Boolean(post.isDeleted);
    response.deletedAt = post.deletedAt || null;
    response.deletedByName = post.deletedByName || null;
    response.deletionJustification = post.deletionJustification || null;
  }

  return response;
};

const validatePostRequest = (body, { partial = false } = {}) => {
  const errors = [];
  const requiredFields = ['title', 'summary', 'body', 'categoryId'];
  if (!partial) {
    requiredFields.forEach((field) => {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        errors.push({ field, message: 'Campo obrigatório.' });
      }
    });
  }

  if (body.title !== undefined && !String(body.title).trim()) errors.push({ field: 'title', message: 'O título é obrigatório.' });
  if (body.summary !== undefined && !String(body.summary).trim()) errors.push({ field: 'summary', message: 'O resumo é obrigatório.' });
  if (body.body !== undefined && !String(body.body).trim()) errors.push({ field: 'body', message: 'O conteúdo é obrigatório.' });
  if (body.categoryId !== undefined && !state.categories.some((item) => Number(item.id) === Number(body.categoryId))) {
    errors.push({ field: 'categoryId', message: 'Categoria não encontrada.' });
  }
  if (body.tags !== undefined && (!Array.isArray(body.tags) || body.tags.some((tag) => typeof tag !== 'string' || !tag.trim()))) {
    errors.push({ field: 'tags', message: 'As tags devem ser uma lista de textos não vazios.' });
  }
  if (body.clothTypeIds !== undefined && (!Array.isArray(body.clothTypeIds)
    || body.clothTypeIds.some((id) => !state.clothTypes.some((item) => Number(item.id) === Number(id))))) {
    errors.push({ field: 'clothTypeIds', message: 'Um ou mais tipos de tecido não foram encontrados.' });
  }
  if (body.coverImageUrl && !String(body.coverImageAlt || '').trim()) {
    errors.push({ field: 'coverImageAlt', message: 'O texto alternativo é obrigatório quando há imagem de capa.' });
  }
  if (body.isPublished !== undefined && typeof body.isPublished !== 'boolean') {
    errors.push({ field: 'isPublished', message: 'O campo deve ser verdadeiro ou falso.' });
  }

  return errors;
};

const getPagedResults = (req, res, items, defaultSort, allowedSortFields) => {
  const page = req.query.page === undefined ? 0 : Number(req.query.page);
  const size = req.query.size === undefined ? 10 : Number(req.query.size);
  const sortParams = req.query.sort === undefined ? [defaultSort] : [].concat(req.query.sort);

  if (!Number.isInteger(page) || page < 0 || !Number.isInteger(size) || size < 1 || size > 100) {
    return res.status(400).json({ message: 'Parâmetros de consulta inválidos.' });
  }

  const criteria = [];
  for (const value of sortParams) {
    const [property, direction = 'asc'] = String(value).split(',');
    if (!allowedSortFields.includes(property) || !['asc', 'desc'].includes(direction.toLowerCase())) {
      return res.status(400).json({ message: 'Parâmetros de consulta inválidos.' });
    }
    criteria.push({ property, direction: direction.toLowerCase() });
  }

  const sorted = [...items].sort((left, right) => {
    for (const { property, direction } of criteria) {
      const leftValue = left[property] ?? '';
      const rightValue = right[property] ?? '';
      const comparison = typeof leftValue === 'string'
        ? leftValue.localeCompare(String(rightValue), 'pt-BR', { sensitivity: 'base' })
        : leftValue < rightValue ? -1 : leftValue > rightValue ? 1 : 0;
      if (comparison !== 0) return direction === 'asc' ? comparison : -comparison;
    }
    return 0;
  });

  return res.json(buildPagination(sorted, page, size));
};

const normalizeReceipt = (receipt) => {
  const rawQuantity = receipt.quantity ?? receipt.quantidade ?? 0;
  const amount = Number.parseFloat(String(rawQuantity).replace(',', '.')) || 0;
  const quantityLabel = String(rawQuantity).toLowerCase().includes('kg') ? String(rawQuantity) : `${amount} kg`;

  return {
    ...receipt,
    id: Number(receipt.id),
    pointId: Number(receipt.pointId),
    operatorId: receipt.operatorId ? Number(receipt.operatorId) : null,
    material: receipt.material || 'Material',
    quantidade: quantityLabel,
    quantity: amount,
    createdAt: receipt.createdAt || new Date().toISOString(),
    data: receipt.data || new Date().toLocaleDateString('pt-BR'),
    responsavel: receipt.responsavel || 'Operador',
  };
};

const formatPointAddress = (point) => typeof point.address === 'string'
  ? point.address
  : [point.address?.street, point.address?.number, point.address?.neighborhood, point.address?.city || point.city, point.address?.state].filter(Boolean).join(', ');

const signToken = (user) => jwt.sign({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  roles: user.roles || [user.role === 'USER' ? 'DOADOR' : user.role],
  sub: user.email,
}, JWT_SECRET, { expiresIn: '8h' });

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Token n�o informado.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Token inv�lido.' });
  }
};

const requireRole = (...allowedRoles) => (req, res, next) => {
  const userRole = req.user?.role || req.user?.roles?.[0];

  if (!userRole || !allowedRoles.includes(userRole)) {
    return res.status(403).json({ message: 'Acesso negado.' });
  }

  next();
};

const getPointByUser = (userId) => {
  return state.collectionPoints.find((point) => Number(point.managerId) === Number(userId) || point.operatorIds?.includes(Number(userId)));
};

const getCurrentPointForUser = (userId) => {
  const user = state.users.find((item) => Number(item.id) === Number(userId));
  if (user?.pointId) {
    return state.collectionPoints.find((point) => Number(point.id) === Number(user.pointId));
  }

  return getPointByUser(userId);
};

app.get('/health', (_req, res) => {
  res.json({ ok: true, message: 'Backend Ecotecido funcionando.' });
});

app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = state.users.find(
    (item) => item.email.toLowerCase() === String(email || '').toLowerCase() && item.password === String(password || '')
  );

  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  return res.json({ token: signToken(user) });
});

app.post('/api/v1/register', (req, res) => {
  const { name, email, password, document, phone } = req.body || {};

  const fieldErrors = [];
  if (typeof name !== 'string' || name.trim().length < 3 || name.trim().length > 120) fieldErrors.push({ field: 'name', message: 'O nome deve ter entre 3 e 120 caracteres.' });
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.push({ field: 'email', message: 'Informe um e-mail válido.' });
  if (typeof password !== 'string' || password.length < 6) fieldErrors.push({ field: 'password', message: 'A senha deve ter pelo menos 6 caracteres.' });
  if (typeof document !== 'string' || !document.trim()) fieldErrors.push({ field: 'document', message: 'O documento é obrigatório.' });
  if (typeof phone !== 'string' || !phone.trim()) fieldErrors.push({ field: 'phone', message: 'O telefone é obrigatório.' });
  if (fieldErrors.length) {
    return res.status(400).json({ message: 'Erro de validação nos campos enviados.', fieldErrors });
  }

  const existing = state.users.find((user) => user.email.toLowerCase() === String(email).toLowerCase());
  if (existing) {
    return res.status(409).json({ message: 'Este e-mail j� est� cadastrado.' });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password,
    document: document || '',
    phone: phone || '',
    role: 'USER',
    roles: ['DOADOR'],
    status: 'ACTIVE',
    pointId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  state.users.push(newUser);
  saveState();

  return res.status(201).json({
    message: 'Usu�rio cadastrado com sucesso.',
    user: normalizeUser(newUser),
  });
});

app.post('/api/v1/auth/forgot-password', (req, res) => {
  const { email } = req.body || {};
  const user = state.users.find((item) => item.email.toLowerCase() === String(email || '').toLowerCase());

  if (!user) {
    return res.status(404).json({ message: 'E-mail n�o encontrado.' });
  }

  return res.json({
    message: 'Se o e-mail estiver cadastrado, enviaremos as instru��es de recupera��o.',
    resetToken: signToken(user),
  });
});

app.get('/api/v1/auth/forgot-password/check-token', (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ message: 'Token ausente.' });

  try {
    jwt.verify(String(token), JWT_SECRET);
    return res.json({ valid: true, message: 'Token v�lido.' });
  } catch {
    return res.status(400).json({ valid: false, message: 'Token inv�lido.' });
  }
});

app.post('/api/v1/auth/forgot-password/reset', (req, res) => {
  const { token, newPassword } = req.body || {};

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token e nova senha s�o obrigat�rios.' });
  }

  try {
    const decoded = jwt.verify(String(token), JWT_SECRET);
    const user = state.users.find((item) => Number(item.id) === Number(decoded.id));

    if (!user) {
      return res.status(404).json({ message: 'Usu�rio n�o encontrado.' });
    }

    user.password = String(newPassword);
    saveState();
    return res.json({ message: 'Senha redefinida com sucesso.' });
  } catch {
    return res.status(400).json({ message: 'Token inv�lido.' });
  }
});

app.get('/api/v1/user', requireAuth, (req, res) => {
  const user = state.users.find((item) => Number(item.id) === Number(req.user.id));
  if (!user) return res.status(404).json({ message: 'Usu�rio n�o encontrado.' });
  return res.json(normalizeUser(user));
});

app.get('/api/v1/user/associations', requireAuth, (req, res) => {
  const user = state.users.find((item) => Number(item.id) === Number(req.user.id));
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });
  const points = state.collectionPoints
    .filter((point) => Number(point.managerId) === Number(user.id) || point.operatorIds?.some((id) => Number(id) === Number(user.id)))
    .map((point) => ({
      id: Number(point.id),
      name: point.name,
      role: Number(point.managerId) === Number(user.id) ? 'PONTO_COLETA_GERENTE' : 'PONTO_COLETA_OPERADOR',
      status: point.status,
    }));
  return res.json({ user: normalizeUser(user), associations: points });
});

app.patch('/api/v1/user', requireAuth, (req, res) => {
  const user = state.users.find((item) => Number(item.id) === Number(req.user.id));
  if (!user) return res.status(404).json({ message: 'Usu�rio n�o encontrado.' });

  const { name, email, phone } = req.body || {};
  if (name) user.name = name;
  if (email) user.email = email;
  if (phone) user.phone = phone;

  saveState();
  return res.json(normalizeUser(user));
});

app.patch('/api/v1/user/password', requireAuth, (req, res) => {
  const user = state.users.find((item) => Number(item.id) === Number(req.user.id));
  if (!user) return res.status(404).json({ message: 'Usu�rio n�o encontrado.' });

  const { currentPassword, newPassword } = req.body || {};
  if (user.password !== String(currentPassword)) {
    return res.status(400).json({ message: 'Senha atual incorreta.' });
  }

  user.password = String(newPassword);
  saveState();
  return res.json({ message: 'Senha alterada com sucesso.' });
});

app.get('/api/v1/admin/users', requireAuth, requireRole('ADMIN'), (req, res) => {
  const { page = 0, size = 10 } = req.query;
  return res.json(buildPagination(state.users.map(normalizeUser), Number(page), Number(size)));
});

app.get('/api/v1/admin/users/:id', requireAuth, requireRole('ADMIN'), (req, res) => {
  const user = state.users.find((item) => Number(item.id) === Number(req.params.id));
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });
  return res.json(normalizeUser(user));
});

app.post('/api/v1/admin/users', requireAuth, requireRole('ADMIN'), (req, res) => {
  const { name, email, password, role = 'USER', roles, phone, document } = req.body || {};

  const requestedRoles = roles || [role];
  const validRoles = ['ADMIN', 'PONTO_COLETA_GERENTE', 'PONTO_COLETA_OPERADOR', 'DOADOR'];
  const fieldErrors = [];
  if (typeof name !== 'string' || name.trim().length < 3 || name.trim().length > 120) fieldErrors.push({ field: 'name', message: 'O nome deve ter entre 3 e 120 caracteres.' });
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.push({ field: 'email', message: 'Informe um e-mail válido.' });
  if (typeof document !== 'string' || !document.trim()) fieldErrors.push({ field: 'document', message: 'O documento é obrigatório.' });
  if (typeof phone !== 'string' || !phone.trim()) fieldErrors.push({ field: 'phone', message: 'O telefone é obrigatório.' });
  if (!Array.isArray(requestedRoles) || requestedRoles.length === 0
    || requestedRoles.some((item) => !validRoles.includes(item))
    || new Set(requestedRoles).size !== requestedRoles.length) {
    fieldErrors.push({ field: 'roles', message: 'Selecione perfis válidos e sem duplicatas.' });
  }
  if (password !== undefined && (typeof password !== 'string' || password.length < 6)) fieldErrors.push({ field: 'password', message: 'A senha deve ter pelo menos 6 caracteres.' });
  if (fieldErrors.length) return res.status(400).json({ message: 'Erro de validação nos campos enviados.', fieldErrors });

  const exists = state.users.some((user) => user.email.toLowerCase() === String(email).toLowerCase());
  if (exists) return res.status(409).json({ message: 'Usu�rio j� cadastrado.' });

  const newUser = {
    id: Date.now(),
    name,
    email,
    password: password || '',
    role: requestedRoles[0] === 'DOADOR' ? 'USER' : requestedRoles[0],
    roles: requestedRoles,
    phone,
    document,
    status: 'ACTIVE',
    pointId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  state.users.push(newUser);
  saveState();
  return res.status(201).json(normalizeUser(newUser));
});

app.patch('/api/v1/admin/users/:id', requireAuth, requireRole('ADMIN'), (req, res) => {
  const { id } = req.params;
  const user = state.users.find((item) => Number(item.id) === Number(id));

  if (!user) return res.status(404).json({ message: 'Usu�rio n�o encontrado.' });

  const { name, email, role, roles, isActive, status, phone, document, pointId } = req.body || {};
  const nextRoles = roles || (role ? [role] : undefined);
  const validRoles = ['ADMIN', 'PONTO_COLETA_GERENTE', 'PONTO_COLETA_OPERADOR', 'DOADOR'];
  const fieldErrors = [];
  if (name !== undefined && (typeof name !== 'string' || name.trim().length < 3 || name.trim().length > 120)) fieldErrors.push({ field: 'name', message: 'O nome deve ter entre 3 e 120 caracteres.' });
  if (email !== undefined && (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) fieldErrors.push({ field: 'email', message: 'Informe um e-mail válido.' });
  if (nextRoles !== undefined && (!Array.isArray(nextRoles) || nextRoles.length === 0
    || nextRoles.some((item) => !validRoles.includes(item)) || new Set(nextRoles).size !== nextRoles.length)) {
    fieldErrors.push({ field: 'roles', message: 'Selecione perfis válidos e sem duplicatas.' });
  }
  if (isActive !== undefined && typeof isActive !== 'boolean') fieldErrors.push({ field: 'isActive', message: 'O campo deve ser verdadeiro ou falso.' });
  if (fieldErrors.length) return res.status(400).json({ message: 'Erro de validação nos campos enviados.', fieldErrors });
  if (email !== undefined && state.users.some((item) => Number(item.id) !== Number(user.id)
    && item.email.toLowerCase() === String(email).toLowerCase())) {
    return res.status(409).json({ message: 'E-mail já cadastrado.' });
  }
  if (name) user.name = name;
  if (email) user.email = email;
  if (nextRoles) {
    user.roles = nextRoles;
    user.role = nextRoles[0] === 'DOADOR' ? 'USER' : nextRoles[0];
  }
  if (phone !== undefined) user.phone = phone;
  if (document !== undefined) user.document = document;
  if (pointId !== undefined) user.pointId = pointId ? Number(pointId) : null;
  if (typeof isActive === 'boolean') user.status = isActive ? 'ACTIVE' : 'INACTIVE';
  if (status) user.status = status;
  if (user.roles?.includes('PONTO_COLETA_GERENTE') && pointId) {
    user.pointId = Number(pointId);
    const point = state.collectionPoints.find((item) => Number(item.id) === Number(pointId));
    if (point) point.managerId = Number(user.id);
  }
  user.updatedAt = new Date().toISOString();

  saveState();
  return res.json(normalizeUser(user));
});

app.get('/api/v1/collection-points', (req, res) => {
  const { page = 0, size = 10 } = req.query;
  const filtered = state.collectionPoints.filter((point) => point.status === 'ACTIVE');
  return res.json(buildPagination(filtered.map(normalizePoint), Number(page), Number(size)));
});

app.get('/api/v1/collection-points/nearby', (req, res) => {
  const { lat, lng, radiusKm = 15, size = 3 } = req.query;
  const points = state.collectionPoints.filter((point) => point.status === 'ACTIVE').map(normalizePoint);

  const latitude = Number(lat || points[0]?.latitude || -23.55);
  const longitude = Number(lng || points[0]?.longitude || -46.63);
  const distanceLimit = Number(radiusKm) || 15;

  const nearby = [...points]
    .sort((a, b) => {
      const da = Math.hypot(Number(a.latitude) - latitude, Number(a.longitude) - longitude);
      const db = Math.hypot(Number(b.latitude) - latitude, Number(b.longitude) - longitude);
      return da - db;
    })
    .filter((point) => {
      const distance = Math.hypot(Number(point.latitude) - latitude, Number(point.longitude) - longitude) * 111;
      return distance <= distanceLimit;
    })
    .slice(0, Number(size) || 3);

  return res.json(nearby);
});

app.get('/api/v1/collection-points/:id', (req, res) => {
  const point = state.collectionPoints.find((item) => Number(item.id) === Number(req.params.id));
  if (!point) return res.status(404).json({ message: 'Ponto de coleta não encontrado.' });
  const canManage = req.user?.role === 'ADMIN'
    || Number(point.createdByUserId) === Number(req.user?.id)
    || (req.user?.role === 'PONTO_COLETA_GERENTE'
      && Number(getCurrentPointForUser(req.user.id)?.id) === Number(point.id));
  if (point.status !== 'ACTIVE' && !canManage) {
    return res.status(403).json({ message: 'Acesso negado para operadores deste ponto.' });
  }
  return res.json(normalizePoint(point));
});

app.get('/api/v1/collection-points/:id/operators', requireAuth, (req, res) => {
  const point = state.collectionPoints.find((item) => Number(item.id) === Number(req.params.id));
  if (!point) return res.status(404).json({ message: 'Ponto n�o encontrado.' });

  const operators = state.users
    .filter((user) => Number(user.pointId) === Number(point.id) && user.role === 'PONTO_COLETA_OPERADOR')
    .map(normalizeUser);

  return res.json(operators);
});

app.post('/api/v1/collection-points/:id/operators', requireAuth, requireRole('PONTO_COLETA_GERENTE'), (req, res) => {
  const point = state.collectionPoints.find((item) => Number(item.id) === Number(req.params.id));
  if (Number(getCurrentPointForUser(req.user.id)?.id) !== Number(point?.id)) {
    return res.status(403).json({ message: 'Acesso negado para operadores deste ponto.' });
  }
  if (!point) return res.status(404).json({ message: 'Ponto n�o encontrado.' });

  const { name, email, phone, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nome, e-mail e senha s�o obrigat�rios.' });
  }

  const existing = state.users.find((user) => user.email.toLowerCase() === String(email).toLowerCase());
  if (existing) {
    return res.status(409).json({ message: 'Este operador j� existe no sistema.' });
  }

  const newOperator = {
    id: Date.now(),
    name,
    email,
    phone: phone || '',
    password,
    role: 'PONTO_COLETA_OPERADOR',
    status: 'ACTIVE',
    document: '',
    pointId: Number(point.id),
  };

  state.users.push(newOperator);
  if (!point.operatorIds.includes(newOperator.id)) {
    point.operatorIds.push(newOperator.id);
  }

  saveState();
  return res.status(201).json(normalizeUser(newOperator));
});

app.delete('/api/v1/collection-points/:id/operators/:operatorId', requireAuth, requireRole('PONTO_COLETA_GERENTE'), (req, res) => {
  const point = state.collectionPoints.find((item) => Number(item.id) === Number(req.params.id));
  if (Number(getCurrentPointForUser(req.user.id)?.id) !== Number(point?.id)) {
    return res.status(403).json({ message: 'Acesso negado para operadores deste ponto.' });
  }
  if (!point) return res.status(404).json({ message: 'Ponto n�o encontrado.' });

  const operator = state.users.find((user) => Number(user.id) === Number(req.params.operatorId));
  if (!operator) return res.status(404).json({ message: 'Operador n�o encontrado.' });

  point.operatorIds = point.operatorIds.filter((item) => Number(item) !== Number(operator.id));
  operator.pointId = null;
  operator.role = 'USER';

  saveState();
  return res.json({ message: 'Operador removido do ponto.', operator: normalizeUser(operator) });
});

app.get('/api/v1/admin/collection-points', requireAuth, requireRole('ADMIN'), (req, res) => {
  const { page = 0, size = 10 } = req.query;
  return res.json(buildPagination(state.collectionPoints.map(normalizePoint), Number(page), Number(size)));
});

app.get('/api/v1/admin/collection-points/pending', requireAuth, requireRole('ADMIN'), (req, res) => {
  const { page = 0, size = 10 } = req.query;
  const pending = state.collectionPoints.filter((point) => point.status === 'PENDING');
  return res.json(buildPagination(pending.map(normalizePoint), Number(page), Number(size)));
});

app.get('/api/v1/admin/collection-points/pending-updates', requireAuth, requireRole('ADMIN'), (req, res) => {
  const { page = 0, size = 10 } = req.query;
  const updates = state.collectionPoints
    .filter((point) => point.pendingUpdate)
    .map(getPendingUpdateResponse)
    .sort((left, right) => new Date(right.requestedAt) - new Date(left.requestedAt));
  return res.json(buildPagination(updates, Number(page), Number(size)));
});

app.get('/api/v1/admin/collection-points/:id', requireAuth, requireRole('ADMIN'), (req, res) => {
  const point = state.collectionPoints.find((item) => Number(item.id) === Number(req.params.id));
  if (!point) return res.status(404).json({ message: 'Ponto de coleta não encontrado.' });
  return res.json(normalizePoint(point));
});

app.get('/api/v1/admin/collection-points/:id/users', requireAuth, requireRole('ADMIN'), (req, res) => {
  const point = state.collectionPoints.find((item) => Number(item.id) === Number(req.params.id));
  if (!point) return res.status(404).json({ message: 'Ponto de coleta não encontrado.' });
  return res.json(getCollectionPointUsersResponse(point));
});

app.patch('/api/v1/admin/collection-points/:id/users/operators', requireAuth, requireRole('ADMIN'), (req, res) => {
  const point = state.collectionPoints.find((item) => Number(item.id) === Number(req.params.id));
  if (!point) return res.status(404).json({ message: 'Ponto de coleta não encontrado.' });

  const document = String(req.body?.document || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  if (!document) return res.status(400).json({ message: 'Informe o documento do operador.' });
  const operator = state.users.find((user) => String(user.document || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase() === document);
  if (!operator) return res.status(404).json({ message: 'Não foi encontrado usuário cadastrado com esse documento.' });
  if (Number(point.managerId) === Number(operator.id)) {
    return res.status(400).json({ message: 'O gerente do ponto não pode ser adicionado como operador.' });
  }
  if (operator.pointId && Number(operator.pointId) !== Number(point.id)) {
    return res.status(409).json({ message: 'O usuário já está vinculado a outro ponto de coleta.' });
  }

  operator.role = 'PONTO_COLETA_OPERADOR';
  operator.roles = ['PONTO_COLETA_OPERADOR'];
  operator.pointId = Number(point.id);
  operator.updatedAt = new Date().toISOString();
  point.operatorIds = [...new Set([...(point.operatorIds || []).map(Number), Number(operator.id)])];
  saveState();
  return res.json(getCollectionPointUsersResponse(point));
});

const createCollectionPoint = (req, res) => {
  const body = req.body || {};
  const fieldErrors = validateCollectionPointPayload(body);
  if (fieldErrors.length) {
    return res.status(400).json({ message: 'Erro de validação nos campos enviados.', fieldErrors });
  }

  const newPoint = {
    id: Date.now(),
    status: 'PENDING',
    managerId: null,
    operatorIds: [],
    createdByUserId: Number(req.user.id),
  };
  applyCollectionPointPayload(newPoint, body);
  state.collectionPoints.push(newPoint);
  saveState();
  return res.status(201).json(normalizePoint(newPoint));
};

app.post('/api/v1/collection-points', requireAuth, createCollectionPoint);

app.post('/api/v1/admin/collection-points', requireAuth, requireRole('ADMIN'), createCollectionPoint);

app.put('/api/v1/collection-points/:id', requireAuth, (req, res) => {
  const point = state.collectionPoints.find((item) => Number(item.id) === Number(req.params.id));
  if (!point) return res.status(404).json({ message: 'Ponto de coleta não encontrado.' });
  const canManage = req.user.role === 'ADMIN'
    || Number(point.createdByUserId) === Number(req.user.id)
    || (req.user.role === 'PONTO_COLETA_GERENTE'
      && Number(getCurrentPointForUser(req.user.id)?.id) === Number(point.id));
  if (!canManage) return res.status(403).json({ message: 'Acesso negado para editar este ponto de coleta.' });

  const fieldErrors = validateCollectionPointPayload(req.body || {}, { partial: true });
  if (fieldErrors.length) {
    return res.status(400).json({ message: 'Erro de validação nos campos enviados.', fieldErrors });
  }
  if (req.user.role === 'ADMIN') {
    applyCollectionPointPayload(point, req.body || {});
  } else {
    point.pendingUpdate = {
      id: Date.now(),
      proposedChanges: normalizePointUpdatePayload(req.body || {}),
      requestedByEmail: req.user.email,
      requestedAt: new Date().toISOString(),
    };
  }
  saveState();
  return res.json(normalizePoint(point));
});

app.patch('/api/v1/admin/collection-points/:id', requireAuth, requireRole('ADMIN'), (req, res) => {
  const { id } = req.params;
  const point = state.collectionPoints.find((item) => Number(item.id) === Number(id));
  if (!point) return res.status(404).json({ message: 'Ponto n�o encontrado.' });

  const fieldErrors = validateCollectionPointPayload(req.body || {}, { partial: true });
  if (fieldErrors.length) {
    return res.status(400).json({ message: 'Erro de validação nos campos enviados.', fieldErrors });
  }
  applyCollectionPointPayload(point, req.body || {});
  saveState();
  return res.json(normalizePoint(point));
});

app.patch('/api/v1/admin/collection-points/:id/approve', requireAuth, requireRole('ADMIN'), (req, res) => {
  const point = state.collectionPoints.find((item) => Number(item.id) === Number(req.params.id));
  if (!point) return res.status(404).json({ message: 'Ponto n�o encontrado.' });

  point.status = 'ACTIVE';
  saveState();
  return res.json({ message: 'Ponto aprovado com sucesso.', point: normalizePoint(point) });
});

app.patch('/api/v1/admin/collection-points/:id/reject', requireAuth, requireRole('ADMIN'), (req, res) => {
  const point = state.collectionPoints.find((item) => Number(item.id) === Number(req.params.id));
  if (!point) return res.status(404).json({ message: 'Ponto n�o encontrado.' });

  point.status = 'SUSPENDED';
  saveState();
  return res.json({ message: 'Ponto rejeitado.', point: normalizePoint(point) });
});

app.post('/api/v1/admin/collection-points/:id/approve-update', requireAuth, requireRole('ADMIN'), (req, res) => {
  const point = state.collectionPoints.find((item) => Number(item.id) === Number(req.params.id));
  if (!point) return res.status(404).json({ message: 'Ponto de coleta não encontrado.' });
  if (!point.pendingUpdate) return res.status(400).json({ message: 'O ponto não possui edições pendentes.' });

  const fieldErrors = validateCollectionPointPayload(point.pendingUpdate.proposedChanges, { partial: true });
  if (fieldErrors.length) {
    return res.status(400).json({ message: 'A edição pendente contém dados inválidos.', fieldErrors });
  }
  applyCollectionPointPayload(point, point.pendingUpdate.proposedChanges);
  point.pendingUpdate = null;
  saveState();
  return res.json(normalizePoint(point));
});

app.post('/api/v1/admin/collection-points/:id/reject-update', requireAuth, requireRole('ADMIN'), (req, res) => {
  const point = state.collectionPoints.find((item) => Number(item.id) === Number(req.params.id));
  if (!point) return res.status(404).json({ message: 'Ponto de coleta não encontrado.' });
  if (!point.pendingUpdate) return res.status(400).json({ message: 'O ponto não possui edições pendentes.' });

  point.pendingUpdate = null;
  saveState();
  return res.status(204).end();
});

app.get('/api/v1/admin/cloth-types', requireAuth, requireRole('ADMIN'), (req, res) => {
  const { page = 0, size = 10 } = req.query;
  return res.json(buildPagination(state.clothTypes.map(normalizeClothType), Number(page), Number(size)));
});

app.get('/api/v1/admin/cloth-types/:id', requireAuth, requireRole('ADMIN'), (req, res) => {
  const clothType = state.clothTypes.find((item) => Number(item.id) === Number(req.params.id));
  if (!clothType) return res.status(404).json({ message: 'Tipo de tecido não encontrado.' });
  return res.json(normalizeClothType(clothType));
});

app.post('/api/v1/admin/cloth-types', requireAuth, requireRole('ADMIN'), (req, res) => {
  const { name, description = '' } = req.body || {};
  const normalizedName = String(name || '').trim();
  const normalizedDescription = String(description || '').trim();
  if (normalizedName.length < 2 || normalizedName.length > 30 || normalizedDescription.length > 255) {
    return res.status(400).json({
      message: 'Erro de validação nos campos enviados.',
      fieldErrors: [
        ...(normalizedName.length < 2 || normalizedName.length > 30 ? [{ field: 'name', message: 'O nome deve ter entre 2 e 30 caracteres.' }] : []),
        ...(normalizedDescription.length > 255 ? [{ field: 'description', message: 'A descrição deve ter no máximo 255 caracteres.' }] : []),
      ],
    });
  }
  if (state.clothTypes.some((item) => item.name.toLocaleLowerCase('pt-BR') === normalizedName.toLocaleLowerCase('pt-BR'))) {
    return res.status(409).json({ message: 'Já existe um tipo de tecido com esse nome.' });
  }

  const newType = { id: Date.now(), name: normalizedName, description: normalizedDescription, active: true };
  state.clothTypes.push(newType);
  saveState();
  return res.status(201).json(normalizeClothType(newType));
});

app.patch('/api/v1/admin/cloth-types/:id', requireAuth, requireRole('ADMIN'), (req, res) => {
  const item = state.clothTypes.find((entry) => Number(entry.id) === Number(req.params.id));
  if (!item) return res.status(404).json({ message: 'Tipo de tecido n�o encontrado.' });

  const { name, description, isActive } = req.body || {};
  const normalizedName = name === undefined ? item.name : String(name).trim();
  const normalizedDescription = description === undefined ? item.description || '' : String(description || '').trim();
  const fieldErrors = [];
  if (name !== undefined && (normalizedName.length < 2 || normalizedName.length > 30)) {
    fieldErrors.push({ field: 'name', message: 'O nome deve ter entre 2 e 30 caracteres.' });
  }
  if (description !== undefined && normalizedDescription.length > 255) {
    fieldErrors.push({ field: 'description', message: 'A descrição deve ter no máximo 255 caracteres.' });
  }
  if (isActive !== undefined && typeof isActive !== 'boolean') {
    fieldErrors.push({ field: 'isActive', message: 'O campo deve ser verdadeiro ou falso.' });
  }
  if (fieldErrors.length) return res.status(400).json({ message: 'Erro de validação nos campos enviados.', fieldErrors });
  if (name !== undefined && state.clothTypes.some((entry) => Number(entry.id) !== Number(item.id)
    && entry.name.toLocaleLowerCase('pt-BR') === normalizedName.toLocaleLowerCase('pt-BR'))) {
    return res.status(409).json({ message: 'Já existe um tipo de tecido com esse nome.' });
  }

  item.name = normalizedName;
  item.description = normalizedDescription;
  if (isActive !== undefined) {
    item.active = isActive;
    item.isActive = isActive;
  }
  saveState();
  return res.json(normalizeClothType(item));
});

app.get('/api/v1/campaigns', (_req, res) => {
  return res.json({ content: state.campaigns, page: { number: 0, size: state.campaigns.length, totalElements: state.campaigns.length, totalPages: 1 } });
});

app.get('/api/v1/campaigns/:id', (req, res) => {
  const campaign = state.campaigns.find((item) => Number(item.id) === Number(req.params.id));
  if (!campaign) return res.status(404).json({ message: 'Campanha n�o encontrada.' });
  return res.json(campaign);
});

app.get('/api/v1/categories', requireAuth, (req, res) => {
  const categories = [...state.categories].sort((left, right) => left.name.localeCompare(right.name, 'pt-BR'));
  return getPagedResults(req, res, categories, 'name,asc', ['id', 'name']);
});

app.get('/api/v1/categories/:id', requireAuth, (req, res) => {
  const category = state.categories.find((item) => Number(item.id) === Number(req.params.id));
  if (!category) return res.status(404).json({ message: 'Categoria não encontrada.' });
  return res.json(category);
});

app.get('/api/v1/admin/categories', requireAuth, requireRole('ADMIN'), (req, res) => {
  return getPagedResults(req, res, state.categories, 'name,asc', ['id', 'name']);
});

app.get('/api/v1/admin/categories/:id', requireAuth, requireRole('ADMIN'), (req, res) => {
  const category = state.categories.find((item) => Number(item.id) === Number(req.params.id));
  if (!category) return res.status(404).json({ message: 'Categoria não encontrada.' });
  return res.json(category);
});

app.post('/api/v1/admin/categories', requireAuth, requireRole('ADMIN'), (req, res) => {
  const name = String(req.body?.name || '').trim();
  if (!name) return res.status(400).json({ message: 'O nome da categoria é obrigatório.' });
  if (state.categories.some((item) => item.name.toLocaleLowerCase('pt-BR') === name.toLocaleLowerCase('pt-BR'))) {
    return res.status(409).json({ message: 'Já existe uma categoria com esse nome.' });
  }

  const category = { id: Date.now(), name };
  state.categories.push(category);
  saveState();
  return res.status(201).json(category);
});

app.put('/api/v1/admin/categories/:id', requireAuth, requireRole('ADMIN'), (req, res) => {
  const category = state.categories.find((item) => Number(item.id) === Number(req.params.id));
  if (!category) return res.status(404).json({ message: 'Categoria não encontrada.' });
  const name = String(req.body?.name || '').trim();
  if (!name) return res.status(400).json({ message: 'O nome da categoria é obrigatório.' });
  if (state.categories.some((item) => Number(item.id) !== Number(category.id)
    && item.name.toLocaleLowerCase('pt-BR') === name.toLocaleLowerCase('pt-BR'))) {
    return res.status(409).json({ message: 'Já existe uma categoria com esse nome.' });
  }

  category.name = name;
  saveState();
  return res.json(category);
});

app.delete('/api/v1/admin/categories/:id', requireAuth, requireRole('ADMIN'), (req, res) => {
  const categoryIndex = state.categories.findIndex((item) => Number(item.id) === Number(req.params.id));
  if (categoryIndex === -1) return res.status(404).json({ message: 'Categoria não encontrada.' });
  if (state.posts.some((post) => Number(post.categoryId) === Number(req.params.id))) {
    return res.status(409).json({ message: 'Não é possível excluir uma categoria vinculada a posts.' });
  }

  state.categories.splice(categoryIndex, 1);
  saveState();
  return res.status(204).end();
});

app.get('/api/v1/posts', requireAuth, (req, res) => {
  const { categoryId, searchTerm } = req.query;
  const requestedTags = req.query.tags === undefined ? [] : [].concat(req.query.tags).map(normalizeSearchText);
  if (categoryId !== undefined && (!Number.isInteger(Number(categoryId)) || Number(categoryId) < 1)) {
    return res.status(400).json({ message: 'Parâmetros de consulta inválidos.' });
  }
  if (requestedTags.some((tag) => !tag.trim())) return res.status(400).json({ message: 'Parâmetros de consulta inválidos.' });

  const term = normalizeSearchText(searchTerm).trim();
  const posts = state.posts
    .filter((post) => post.isPublished && !post.isDeleted)
    .filter((post) => categoryId === undefined || Number(post.categoryId) === Number(categoryId))
    .filter((post) => !term || [post.title, post.summary, post.body].some((field) => normalizeSearchText(field).includes(term)))
    .filter((post) => requestedTags.every((tag) => (post.tags || []).some((item) => normalizeSearchText(item) === tag)))
    .map((post) => {
      const normalized = normalizePost(post);
      const summary = { ...normalized };
      delete summary.body;
      return summary;
    });
  return getPagedResults(req, res, posts, 'createdAt,asc', ['id', 'slug', 'title', 'summary', 'category', 'createdAt', 'updatedAt']);
});

app.get('/api/v1/posts/:id', requireAuth, (req, res) => {
  const post = state.posts.find((item) => Number(item.id) === Number(req.params.id) && item.isPublished && !item.isDeleted);
  if (!post) return res.status(400).json({ message: 'Post inexistente ou não disponível.' });
  return res.json(normalizePost(post));
});

app.get('/api/v1/admin/posts', requireAuth, requireRole('ADMIN'), (req, res) => {
  const { categoryId, searchTerm } = req.query;
  const requestedTags = req.query.tags === undefined ? [] : [].concat(req.query.tags).map(normalizeSearchText);
  if (categoryId !== undefined && (!Number.isInteger(Number(categoryId)) || Number(categoryId) < 1)) {
    return res.status(400).json({ message: 'Parâmetros de consulta inválidos.' });
  }
  if (requestedTags.some((tag) => !tag.trim())) return res.status(400).json({ message: 'Parâmetros de consulta inválidos.' });

  const term = normalizeSearchText(searchTerm).trim();
  const posts = state.posts
    .filter((post) => categoryId === undefined || Number(post.categoryId) === Number(categoryId))
    .filter((post) => !term || [post.title, post.summary, post.body].some((field) => normalizeSearchText(field).includes(term)))
    .filter((post) => requestedTags.every((tag) => (post.tags || []).some((item) => normalizeSearchText(item) === tag)))
    .map((post) => {
      const normalized = normalizePost(post, true);
      return {
        id: normalized.id,
        slug: normalized.slug,
        title: normalized.title,
        summary: normalized.summary,
        categoryName: normalized.category?.name || '',
        coverImageUrl: normalized.coverImageUrl,
        coverImageAlt: normalized.coverImageAlt,
        tags: normalized.tags,
        clothTypes: normalized.clothTypes,
        createdAt: normalized.createdAt,
        isPublished: normalized.isPublished,
        isDeleted: normalized.isDeleted,
        deletedAt: normalized.deletedAt,
      };
    });
  return getPagedResults(req, res, posts, 'createdAt,asc', ['id', 'slug', 'title', 'summary', 'categoryName', 'createdAt', 'deletedAt']);
});

app.post('/api/v1/admin/posts', requireAuth, requireRole('ADMIN'), (req, res) => {
  const body = req.body || {};
  const fieldErrors = validatePostRequest(body);
  if (fieldErrors.length) return res.status(400).json({ message: 'Erro de validação nos campos enviados.', fieldErrors });

  const now = new Date().toISOString();
  const title = String(body.title).trim();
  const baseSlug = slugify(title) || `post-${Date.now()}`;
  const slug = state.posts.some((post) => post.slug === baseSlug) ? `${baseSlug}-${Date.now()}` : baseSlug;
  const post = {
    id: Date.now(),
    slug,
    title,
    summary: String(body.summary).trim(),
    body: String(body.body).trim(),
    categoryId: Number(body.categoryId),
    coverImageUrl: String(body.coverImageUrl || '').trim(),
    coverImageAlt: String(body.coverImageAlt || '').trim(),
    tags: [...new Set((body.tags || []).map((tag) => tag.trim()))],
    clothTypeIds: [...new Set((body.clothTypeIds || []).map(Number))],
    createdAt: now,
    updatedAt: now,
    createdByName: req.user.name || req.user.email,
    isPublished: body.isPublished ?? false,
    isDeleted: false,
    deletedAt: null,
    deletedByName: null,
    deletionJustification: null,
  };

  state.posts.unshift(post);
  saveState();
  return res.status(201).json(normalizePost(post));
});

app.get('/api/v1/admin/posts/:id', requireAuth, requireRole('ADMIN'), (req, res) => {
  const post = state.posts.find((item) => Number(item.id) === Number(req.params.id) && !item.isDeleted);
  if (!post) return res.status(400).json({ message: 'Post inexistente ou não disponível.' });
  return res.json(normalizePost(post, true));
});

app.patch('/api/v1/admin/posts/:id', requireAuth, requireRole('ADMIN'), (req, res) => {
  const post = state.posts.find((item) => Number(item.id) === Number(req.params.id) && !item.isDeleted);
  if (!post) return res.status(400).json({ message: 'Post inexistente ou não disponível.' });
  const body = req.body || {};
  const fieldErrors = validatePostRequest(body, { partial: true });
  if (fieldErrors.length) return res.status(400).json({ message: 'Erro de validação nos campos enviados.', fieldErrors });

  if (body.title !== undefined) post.title = String(body.title).trim();
  if (body.summary !== undefined) post.summary = String(body.summary).trim();
  if (body.body !== undefined) post.body = String(body.body).trim();
  if (body.categoryId !== undefined) post.categoryId = Number(body.categoryId);
  if (body.coverImageUrl !== undefined) post.coverImageUrl = String(body.coverImageUrl).trim();
  if (body.coverImageAlt !== undefined) post.coverImageAlt = String(body.coverImageAlt).trim();
  if (body.tags !== undefined) post.tags = [...new Set(body.tags.map((tag) => tag.trim()))];
  if (body.clothTypeIds !== undefined) post.clothTypeIds = [...new Set(body.clothTypeIds.map(Number))];
  if (body.isPublished !== undefined) post.isPublished = body.isPublished;
  if (body.title !== undefined) {
    const baseSlug = slugify(post.title) || `post-${post.id}`;
    post.slug = state.posts.some((item) => item.id !== post.id && item.slug === baseSlug)
      ? `${baseSlug}-${post.id}`
      : baseSlug;
  }
  post.updatedAt = new Date().toISOString();
  saveState();
  return res.json(normalizePost(post));
});

app.delete('/api/v1/admin/posts/:id', requireAuth, requireRole('ADMIN'), (req, res) => {
  const post = state.posts.find((item) => Number(item.id) === Number(req.params.id) && !item.isDeleted);
  if (!post) return res.status(400).json({ message: 'Post inexistente.' });
  const justification = String(req.body?.justification || '').trim();
  if (!justification) return res.status(400).json({ message: 'A justificativa da exclusão é obrigatória.' });

  post.isDeleted = true;
  post.deletedAt = new Date().toISOString();
  post.deletedByName = req.user.name || req.user.email;
  post.deletionJustification = justification;
  post.updatedAt = post.deletedAt;
  saveState();
  return res.status(204).end();
});

app.get('/api/v1/manager/collection-point', requireAuth, requireRole('PONTO_COLETA_GERENTE'), (req, res) => {
  const point = getCurrentPointForUser(req.user.id);
  if (!point) return res.status(404).json({ message: 'Ponto n�o encontrado para este gerente.' });
  return res.json(normalizePoint(point));
});

app.patch('/api/v1/manager/collection-point', requireAuth, requireRole('PONTO_COLETA_GERENTE'), (req, res) => {
  const point = getCurrentPointForUser(req.user.id);
  if (!point) return res.status(404).json({ message: 'Ponto n�o encontrado para este gerente.' });

  const { name, city, address, phone, email, description, latitude, longitude, acceptedClothTypes, operatingHours, pointPictureUrl, imageUrl } = req.body || {};
  const addressChanged = (address !== undefined && formatPointAddress(point) !== String(address))
    || (city !== undefined && String(point.city) !== String(city))
    || (latitude !== undefined && String(point.latitude) !== String(latitude))
    || (longitude !== undefined && String(point.longitude) !== String(longitude));

  if (name) point.name = name;
  if (city) point.city = city;
  if (address !== undefined) point.address = address;
  if (phone) point.phone = phone;
  if (email !== undefined) point.email = email;
  if (description !== undefined) point.description = description;
  if (latitude !== undefined) point.latitude = latitude;
  if (longitude !== undefined) point.longitude = longitude;
  if (acceptedClothTypes) point.acceptedClothTypes = acceptedClothTypes;
  if (operatingHours) point.operatingHours = operatingHours;
  if (imageUrl !== undefined || pointPictureUrl !== undefined) {
    point.imageUrl = imageUrl ?? pointPictureUrl;
    point.pointPictureUrl = point.imageUrl;
  }
  if (addressChanged && point.status === 'ACTIVE') {
    point.status = 'PENDING';
  }

  saveState();
  return res.json(normalizePoint(point));
});

app.patch('/api/v1/manager/collection-point/status', requireAuth, requireRole('PONTO_COLETA_GERENTE'), (req, res) => {
  const point = getCurrentPointForUser(req.user.id);
  if (!point) return res.status(404).json({ message: 'Ponto n�o encontrado para este gerente.' });

  const { status } = req.body || {};
  if (!status) return res.status(400).json({ message: 'Status obrigat�rio.' });

  point.status = status;
  saveState();
  return res.json({ message: 'Status atualizado.', point: normalizePoint(point) });
});

app.get('/api/v1/manager/dashboard', requireAuth, requireRole('PONTO_COLETA_GERENTE'), (req, res) => {
  const point = getCurrentPointForUser(req.user.id);
  if (!point) return res.status(404).json({ message: 'Ponto n�o encontrado para este gerente.' });

  const pointReceipts = state.receipts.filter((receipt) => Number(receipt.pointId) === Number(point.id));
  const totalRecebimentos = pointReceipts.length;
  const operatorCount = state.users.filter((user) => Number(user.pointId) === Number(point.id) && user.role === 'PONTO_COLETA_OPERADOR' && user.status === 'ACTIVE').length;

  res.json({
    pontoInfo: {
      nome: point.name,
      endereco: formatPointAddress(point),
      status: point.status === 'ACTIVE' ? 'ATIVO' : point.status === 'PENDING' ? 'PENDENTE' : 'PAUSADO',
    },
    metricas: {
      totalRecebimentos: totalRecebimentos,
      crescimentoRecebimentos: 'Dados atualizados',
      operadores: operatorCount,
      crescimentoOperadores: `${operatorCount} ativos`,
      tiposTecido: (point.acceptedClothTypes || []).length,
      crescimentoTecido: 'Aceitos neste ponto',
    },
    recebimentos: pointReceipts.slice(0, 4).map((receipt) => ({
      id: receipt.id,
      data: new Date(receipt.createdAt).toLocaleDateString('pt-BR'),
      material: receipt.material,
      quantidade: normalizeReceipt(receipt).quantidade,
      responsavel: receipt.responsavel || 'Operador',
    })),
  });
});

app.get('/api/v1/manager/receipts', requireAuth, requireRole('PONTO_COLETA_GERENTE'), (req, res) => {
  const point = getCurrentPointForUser(req.user.id);
  if (!point) return res.status(404).json({ message: 'Ponto n�o encontrado para este gerente.' });

  const data = state.receipts.filter((receipt) => Number(receipt.pointId) === Number(point.id));
  return res.json({ content: data.map(normalizeReceipt), page: { number: 0, size: data.length, totalElements: data.length, totalPages: 1 } });
});

app.get('/api/v1/operator/dashboard', requireAuth, requireRole('PONTO_COLETA_OPERADOR'), (req, res) => {
  const point = getCurrentPointForUser(req.user.id);
  if (!point) return res.status(404).json({ message: 'Ponto n�o encontrado para este operador.' });

  const pointReceipts = state.receipts.filter((receipt) => Number(receipt.pointId) === Number(point.id));
  const now = new Date();
  const todayReceipts = pointReceipts.filter((receipt) => new Date(receipt.createdAt).toDateString() === now.toDateString());
  const monthReceipts = pointReceipts.filter((receipt) => {
    const receiptDate = new Date(receipt.createdAt);
    return receiptDate.getFullYear() === now.getFullYear() && receiptDate.getMonth() === now.getMonth();
  });
  const totalWeight = pointReceipts.reduce((total, receipt) => total + normalizeReceipt(receipt).quantity, 0);

  res.json({
    pontoInfo: {
      nome: point.name,
      endereco: formatPointAddress(point),
      status: point.status === 'ACTIVE' ? 'Ativo' : point.status === 'PAUSED' ? 'Pausado' : 'Pendente',
    },
    metricas: {
      recebimentosHoje: todayReceipts.length,
      totalMes: monthReceipts.length,
      pesoTotal: totalWeight,
    },
  });
});

app.get('/api/v1/operator/receipts', requireAuth, requireRole('PONTO_COLETA_OPERADOR'), (req, res) => {
  const point = getCurrentPointForUser(req.user.id);
  if (!point) return res.status(404).json({ message: 'Ponto n�o encontrado para este operador.' });

  const data = state.receipts.filter((receipt) => Number(receipt.pointId) === Number(point.id));
  return res.json({ content: data.map(normalizeReceipt), page: { number: 0, size: data.length, totalElements: data.length, totalPages: 1 } });
});

app.post('/api/v1/operator/receipts', requireAuth, requireRole('PONTO_COLETA_OPERADOR'), (req, res) => {
  const point = getCurrentPointForUser(req.user.id);
  if (!point) return res.status(404).json({ message: 'Ponto n�o encontrado para este operador.' });

  const { material, quantity, quantidade, notes, observacoes, responsavel } = req.body || {};
  const amount = Number(quantity ?? quantidade);
  if (!material || !Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Material e quantidade s�o obrigat�rios.' });
  }

  const receipt = {
    id: Date.now(),
    pointId: Number(point.id),
    operatorId: Number(req.user.id),
    material,
    quantity: amount,
    notes: notes || observacoes || '',
    responsavel: responsavel || state.users.find((user) => Number(user.id) === Number(req.user.id))?.name || 'Operador',
    createdAt: new Date().toISOString(),
  };

  state.receipts.unshift(receipt);
  saveState();
  return res.status(201).json(normalizeReceipt(receipt));
});

app.listen(PORT, () => {
  console.log(`Backend Ecotecido rodando em http://localhost:${PORT}`);
});
