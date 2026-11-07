
import { useCallback, useEffect, useMemo, useState } from 'react';
import collectionPointService from '../../../services/collectionPointService';

const MATERIAL_OPTIONS = [
  { value: 'algodao', label: 'Algodão' },
  { value: 'jeans', label: 'Jeans' },
  { value: 'poliester', label: 'Poliéster' },
  { value: 'linho', label: 'Linho' },
  { value: 'viscose', label: 'Viscose' },
];

const INITIAL_FORM = {
  collectionPointId: '',
  material: '',
  weight: '',
  quantity: '',
  notes: '',
};

const normalizeText = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const getMaterialName = (material) => {
  if (typeof material === 'string') return material;

  return (
    material?.name ??
    material?.clothType?.name ??
    material?.material?.name ??
    ''
  );
};

const getAcceptedMaterials = (point) => {
  const materials = point?.acceptedClothTypes ?? point?.materials;

  return Array.isArray(materials) ? materials : [];
};

const validateForm = (form, points) => {
  const errors = {};

  const selectedPoint = points.find(
    (point) => String(point.id) === form.collectionPointId
  );

  if (!selectedPoint) {
    errors.collectionPointId = 'Selecione um ponto de coleta válido.';
  }

  if (!MATERIAL_OPTIONS.some((option) => option.value === form.material)) {
    errors.material = 'Selecione um tipo de tecido válido.';
  }

  const weight = Number(form.weight);

  if (
    form.weight.trim() === '' ||
    !Number.isFinite(weight) ||
    weight <= 0
  ) {
    errors.weight = 'Informe um peso maior que zero.';
  }

  const quantity = Number(form.quantity);

  if (
    form.quantity.trim() === '' ||
    !Number.isSafeInteger(quantity) ||
    quantity <= 0
  ) {
    errors.quantity = 'Informe uma quantidade inteira maior que zero.';
  }

  if (form.notes.length > 300) {
    errors.notes = 'As observações devem ter no máximo 300 caracteres.';
  }

  if (selectedPoint && form.material) {
    const acceptedMaterials = getAcceptedMaterials(selectedPoint);

    const knownNames = acceptedMaterials
      .map(getMaterialName)
      .filter(Boolean);

    if (knownNames.length > 0) {
      const selectedMaterial = MATERIAL_OPTIONS.find(
        (option) => option.value === form.material
      );

      const isAccepted = knownNames.some(
        (name) =>
          normalizeText(name) === normalizeText(selectedMaterial?.label) ||
          normalizeText(name) === normalizeText(form.material)
      );

      if (!isAccepted) {
        errors.material =
          'O ponto selecionado não informa aceitar este tipo de tecido.';
      }
    }
  }

  return errors;
};

const DisposalRegistration = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [showReview, setShowReview] = useState(false);
  const [collectionPoints, setCollectionPoints] = useState([]);
  const [pointsLoading, setPointsLoading] = useState(true);
  const [pointsError, setPointsError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const loadCollectionPoints = useCallback(async (isActive) => {
    try {
      setPointsLoading(true);
      setPointsError('');

      const response = await collectionPointService.getCollectionPoints();

      const points = Array.isArray(response)
        ? response
        : response?.content ?? [];

      if (isActive()) {
        setCollectionPoints(points);
      }
    } catch (error) {
      if (isActive()) {
        setCollectionPoints([]);
        setPointsError(
          error?.status === 401
            ? 'É necessário autenticar-se para consultar os pontos de coleta.'
            : 'Não foi possível carregar os pontos de coleta.'
        );
      }
    } finally {
      if (isActive()) {
        setPointsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;

    Promise.resolve().then(() => { if (active) loadCollectionPoints(() => active); });

    return () => {
      active = false;
    };
  }, [loadCollectionPoints, reloadKey]);

  const selectedPoint = useMemo(
    () =>
      collectionPoints.find(
        (point) => String(point.id) === form.collectionPointId
      ),
    [collectionPoints, form.collectionPointId]
  );

  const selectedMaterial = MATERIAL_OPTIONS.find(
    (option) => option.value === form.material
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: '',
      ...(name === 'collectionPointId' ? { material: '' } : {}),
    }));

    setShowReview(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateForm(form, collectionPoints);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setShowReview(false);
      return;
    }

    setShowReview(true);
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setShowReview(false);
  };

  const handleRetry = () => {
    setShowReview(false);
    setReloadKey((previous) => previous + 1);
  };

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">
        Registrar descarte
      </h1>

      <p className="mb-6 text-gray-600">
        Informe os dados dos materiais que deseja descartar.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="collectionPointId"
            className="block font-medium text-gray-800"
          >
            Ponto de coleta *
          </label>

          <select
            id="collectionPointId"
            name="collectionPointId"
            value={form.collectionPointId}
            onChange={handleChange}
            required
            disabled={pointsLoading || collectionPoints.length === 0}
            aria-invalid={Boolean(errors.collectionPointId)}
            aria-describedby={
              errors.collectionPointId ? 'collectionPointError' : undefined
            }
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-3 disabled:bg-gray-100"
          >
            <option value="">
              {pointsLoading
                ? 'Carregando pontos...'
                : 'Selecione um ponto de coleta'}
            </option>

            {collectionPoints.map((point) => (
              <option key={point.id} value={String(point.id)}>
                {point.name} — {point.city || point.address || 'Endereço não informado'}
              </option>
            ))}
          </select>

          {errors.collectionPointId && (
            <p
              id="collectionPointError"
              role="alert"
              className="mt-1 text-sm text-red-700"
            >
              {errors.collectionPointId}
            </p>
          )}

          {pointsError && (
            <div className="mt-2 space-y-2">
              <p role="alert" className="text-sm text-red-700">
                {pointsError}
              </p>
              <button
                type="button"
                onClick={handleRetry}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {!pointsLoading && !pointsError && collectionPoints.length === 0 && (
            <p role="status" className="mt-2 text-sm text-amber-700">
              Nenhum ponto de coleta disponível no momento.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="material" className="block font-medium text-gray-800">
            Tipo de tecido *
          </label>

          <select
            id="material"
            name="material"
            value={form.material}
            onChange={handleChange}
            required
            aria-invalid={Boolean(errors.material)}
            aria-describedby={errors.material ? 'materialError' : undefined}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-3"
          >
            <option value="">Selecione o material</option>
            {MATERIAL_OPTIONS.map((material) => (
              <option key={material.value} value={material.value}>
                {material.label}
              </option>
            ))}
          </select>

          {errors.material && (
            <p id="materialError" role="alert" className="mt-1 text-sm text-red-700">
              {errors.material}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="weight" className="block font-medium text-gray-800">
            Peso (kg) *
          </label>

          <input
            id="weight"
            type="number"
            name="weight"
            min="0.1"
            step="any"
            value={form.weight}
            onChange={handleChange}
            required
            placeholder="Ex.: 2.5"
            aria-invalid={Boolean(errors.weight)}
            aria-describedby={errors.weight ? 'weightError' : undefined}
            className="mt-1 w-full rounded-lg border border-gray-300 p-3"
          />

          {errors.weight && (
            <p id="weightError" role="alert" className="mt-1 text-sm text-red-700">
              {errors.weight}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="quantity" className="block font-medium text-gray-800">
            Quantidade de peças *
          </label>

          <input
            id="quantity"
            type="number"
            name="quantity"
            min="1"
            step="1"
            value={form.quantity}
            onChange={handleChange}
            required
            placeholder="Ex.: 5"
            aria-invalid={Boolean(errors.quantity)}
            aria-describedby={errors.quantity ? 'quantityError' : undefined}
            className="mt-1 w-full rounded-lg border border-gray-300 p-3"
          />

          {errors.quantity && (
            <p id="quantityError" role="alert" className="mt-1 text-sm text-red-700">
              {errors.quantity}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="notes" className="block font-medium text-gray-800">
            Observações (opcional)
          </label>

          <textarea
            id="notes"
            name="notes"
            rows={4}
            maxLength={300}
            value={form.notes}
            onChange={handleChange}
            placeholder="Informações adicionais..."
            className="mt-1 w-full rounded-lg border border-gray-300 p-3"
          />

          <p className="mt-1 text-right text-xs text-gray-500">
            {form.notes.length}/300 caracteres
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={pointsLoading || collectionPoints.length === 0}
            className="rounded-lg bg-green-900 px-5 py-3 font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Revisar descarte
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50"
          >
            Limpar formulário
          </button>
        </div>
      </form>

      {showReview && (
        <section
          aria-labelledby="reviewTitle"
          className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-5"
        >
          <h2 id="reviewTitle" className="mb-3 text-xl font-semibold">
            Revisão do descarte
          </h2>

          <dl className="space-y-3 text-sm sm:text-base">
            <div>
              <dt className="font-semibold">Ponto de coleta</dt>
              <dd>{selectedPoint?.name}</dd>
            </div>

            <div>
              <dt className="font-semibold">Material</dt>
              <dd>{selectedMaterial?.label}</dd>
            </div>

            <div>
              <dt className="font-semibold">Peso</dt>
              <dd>{form.weight} kg</dd>
            </div>

            <div>
              <dt className="font-semibold">Quantidade</dt>
              <dd>{form.quantity} peças</dd>
            </div>

            <div>
              <dt className="font-semibold">Observações</dt>
              <dd>{form.notes.trim() || 'Nenhuma'}</dd>
            </div>
          </dl>

          <p role="status" className="mt-5 text-sm text-amber-800">
            Esta é uma prévia dos dados. O registro ainda não foi enviado.
            A confirmação estará disponível após a integração com a API.
          </p>

          <button
            type="button"
            onClick={() => setShowReview(false)}
            className="mt-4 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-100"
          >
            Voltar e editar
          </button>
        </section>
      )}
    </main>
  );
};

export default DisposalRegistration;
