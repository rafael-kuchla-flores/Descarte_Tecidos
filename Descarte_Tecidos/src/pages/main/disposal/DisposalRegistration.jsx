
import { useEffect, useState } from 'react';
import collectionPointService from '../../../services/collectionPointService';

const DisposalRegistration = () => {
    const [form, setForm] = useState({
        collectionPointId: '',
        material: '',
        weight: '',
        quantity: '',
        notes: '',
    });

    const [showReview, setShowReview] = useState(false);
    const [collectionPoints, setCollectionPoints] = useState([]);
    const [pointsLoading, setPointsLoading] = useState(true);
    const [pointsError, setPointsError] = useState('');

    useEffect(() => {
        let active = true;

        const loadCollectionPoints = async () => {
            try {
                setPointsLoading(true);
                setPointsError('');

                const response = await collectionPointService.getCollectionPoints();

                const points = Array.isArray(response)
                    ? response
                    : response?.content || [];

                if (active) {
                    setCollectionPoints(points);
                }
            } catch (error) {
                if (active) {
                    setPointsError(
                        error.status === 401
                            ? 'É necessário autenticar-se para consultar os pontos de coleta.'
                            : 'Não foi possível carregar os pontos de coleta.'
                    );
                }
            } finally {
                if (active) {
                    setPointsLoading(false);
                }
            }
        };

        loadCollectionPoints();

        return () => {
            active = false;
        };
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setShowReview(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const weight = Number(form.weight);
        const quantity = Number(form.quantity);

        if (
            !collectionPoints.some(
                (point) => String(point.id) === form.collectionPointId
            ) ||
            !form.material ||
            !form.weight ||
            !Number.isFinite(weight) ||
            weight <= 0 ||
            !form.quantity ||
            !Number.isInteger(quantity) ||
            quantity <= 0
        ) {
            return;
        }

        setShowReview(true);
    };

    return (
        <main className="mx-auto max-w-2xl p-6">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
                Registrar descarte
            </h1>

            <p className="mb-6 text-gray-600">
                Informe os dados dos materiais que deseja descartar.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block">
                    <span className="font-medium">Ponto de coleta *</span>

                    <select
                        name="collectionPointId"
                        value={form.collectionPointId}
                        onChange={handleChange}
                        required
                        disabled={pointsLoading || collectionPoints.length === 0}
                        className="mt-1 w-full rounded-lg border border-gray-300 p-3"
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

                    {pointsError && (
                        <p role="alert" className="mt-2 text-sm text-red-700">
                            {pointsError}
                        </p>
                    )}

                </label>

                <label className="block">
                    <span className="font-medium">Tipo de tecido *</span>
                    <select
                        name="material"
                        value={form.material}
                        onChange={handleChange}
                        required
                        className="mt-1 w-full rounded-lg border border-gray-300 p-3"
                    >
                        <option value="">Selecione o material</option>
                        <option value="algodao">Algodão</option>
                        <option value="jeans">Jeans</option>
                        <option value="poliester">Poliéster</option>
                        <option value="linho">Linho</option>
                        <option value="viscose">Viscose</option>
                    </select>
                </label>

                <label className="block">
                    <span className="font-medium">Peso (kg) *</span>
                    <input
                        type="number"
                        name="weight"
                        min="0.1"
                        step="any"
                        value={form.weight}
                        onChange={handleChange}
                        required
                        placeholder="Ex.: 2.5"
                        className="mt-1 w-full rounded-lg border border-gray-300 p-3"
                    />
                </label>

                <label className="block">
                    <span className="font-medium">Quantidade de peças *</span>
                    <input
                        type="number"
                        name="quantity"
                        min="1"
                        step="1"
                        value={form.quantity}
                        onChange={handleChange}
                        required
                        placeholder="Ex.: 5"
                        className="mt-1 w-full rounded-lg border border-gray-300 p-3"
                    />
                </label>

                <label className="block">
                    <span className="font-medium">Observações (opcional)</span>
                    <textarea
                        name="notes"
                        rows={4}
                        maxLength={300}
                        value={form.notes}
                        onChange={handleChange}
                        placeholder="Informações adicionais..."
                        className="mt-1 w-full rounded-lg border border-gray-300 p-3"
                    />
                </label>

                <button
                    type="submit"
                    className="rounded-lg bg-green-900 px-5 py-3 font-semibold text-white hover:bg-green-800"
                >
                    Revisar descarte
                </button>
            </form>

            {showReview && (
                <section className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-5">
                    <h2 className="mb-3 text-xl font-semibold">
                        Revisão do descarte
                    </h2>

                    <div className="space-y-2">
                        <p>
                            <strong>Ponto de coleta:</strong>{' '}
                            {collectionPoints.find(
                                (point) => String(point.id) === form.collectionPointId
                            )?.name || form.collectionPointId}
                        </p>
                        <p>
                            <strong>Material:</strong> {form.material}
                        </p>
                        <p>
                            <strong>Peso:</strong> {form.weight} kg
                        </p>
                        <p>
                            <strong>Quantidade:</strong> {form.quantity} peças
                        </p>
                        <p>
                            <strong>Observações:</strong> {form.notes || 'Nenhuma'}
                        </p>
                    </div>

                    <p
                        role="status"
                        className="mt-4 text-sm text-amber-700"
                    >
                        O envio ao servidor será habilitado após a
                        integração com a API de descarte.
                    </p>

                    <button
                        type="button"
                        onClick={() => setShowReview(false)}
                        className="mt-4 rounded-lg border border-gray-300 px-4 py-2"
                    >
                        Voltar e editar
                    </button>

                </section>
            )}
        </main>
    );
};

export default DisposalRegistration;
