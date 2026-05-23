import { useState, useEffect } from "react";
import Modal from "./Modal";

export default function ModalProduto({
  isOpen,
  onClose,
  produtoEditando,
  onSave,
}) {
  const estadoInicial = {
    nome: "",
    categoria: "",
    estoque: "",
    preco: "",
    codProduto: "",
  };

  const [formData, setFormData] = useState(estadoInicial);

  useEffect(() => {
    if (produtoEditando) {
      setFormData(produtoEditando);
    } else {
      setFormData(estadoInicial);
    }
  }, [produtoEditando, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={produtoEditando ? "Editar Produto" : "Cadastrar Novo Produto"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
            Nome do Produto
          </label>
          <input
            required
            type="text"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-orange-500"
            value={formData.nome}
            onChange={(e) => {
              const textoLimpo = e.target.value.replace(
                /[^a-zA-Z0-9À-ÿ\s]/g,
                "",
              );
              setFormData({ ...formData, nome: textoLimpo });
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
              Categoria
            </label>
            <input
              required
              type="text"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-orange-500"
              value={formData.categoria}
              onChange={(e) => {
                const apenasLetras = e.target.value.replace(
                  /[^a-zA-ZÀ-ÿ\s]/g,
                  "",
                );
                setFormData({ ...formData, categoria: apenasLetras });
              }}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
              Estoque
            </label>
            <input
              required
              type="text"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-orange-500"
              value={formData.estoque}
              onChange={(e) => {
                const apenasNumeros = e.target.value.replace(/\D/g, "");
                setFormData({ ...formData, estoque: apenasNumeros });
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
              Preço Venda (R$)
            </label>
            <input
              required
              type="text"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-orange-500 text-emerald-600 font-bold"
              value={formData.preco}
              onChange={(e) => {
                const formatoMoeda = e.target.value.replace(/[^0-9.,]/g, "");
                setFormData({ ...formData, preco: formatoMoeda });
              }}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
            Código do Produto
          </label>
          <input
            required
            type="text"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-orange-500"
            value={formData.codProduto}
            onChange={(e) => {
              const apenasNumeros = e.target.value.replace(/\D/g, "");
              setFormData({ ...formData, codProduto: apenasNumeros });
            }}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-2xl mt-4 transition-all shadow-lg shadow-orange-100"
        >
          {produtoEditando ? "Salvar Alterações" : "Confirmar Cadastro"}
        </button>
      </form>
    </Modal>
  );
}
