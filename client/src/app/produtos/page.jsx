"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import api from "../../../services/api";
import ModalProduto from "@/components/ModalProduto";
import toast from "react-hot-toast";

export default function ProdutosPage() {
  const [busca, setBusca] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    produtoEditando: null,
  });

  async function getProdutos(params) {
    setIsLoading(true);
    try {
      const response = await api.get("/produtos", { params });
      setProdutos(response.data);
    } catch (error) {
      toast.error("Erro ao buscar produtos.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getProdutos();
  }, []);

  async function deleteProduto(id) {
    try {
      await api.delete(`/produtos/${id}`);
      await getProdutos();
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Erro ao excluir produto.");
    }
  }

  const handleSaveProduto = async (dadosDoFormulario) => {
    try {
      if (dadosDoFormulario.id) {
        await api.put(`/produtos/${dadosDoFormulario.id}`, dadosDoFormulario);
        toast.success("Produto atualizado com sucesso!");
      } else {
        await api.post("/produtos", dadosDoFormulario);
        toast.success("Produto criado com sucesso!");
      }

      setModalConfig({ isOpen: false, produtoEditando: null });
      await getProdutos();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      toast.error("Ocorreu um erro ao conectar com o servidor.");
    }
  };

  const termoBusca = busca?.toLowerCase() || "";
  const produtosFiltrados = produtos.filter(
    (p) =>
      p.nome?.toLowerCase().includes(termoBusca) ||
      p.categoria?.toLowerCase().includes(termoBusca),
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Produtos</h1>
          <p className="text-gray-500">Gerencie o catálogo da padaria</p>
        </div>
        <button
          onClick={() =>
            setModalConfig({ isOpen: true, produtoEditando: null })
          }
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-100"
        >
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar produto pelo nome ou categoria..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[11px] uppercase text-gray-400 font-bold">
            <tr>
              <th className="px-6 py-4">Cód. Barras</th>
              <th className="px-6 py-4">Produto</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Preço</th>
              <th className="px-6 py-4 text-center">Estoque</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-orange-500">
                    <Loader2 size={32} className="animate-spin mb-2" />
                    <p className="text-gray-500 font-medium text-sm">
                      Carregando produtos...
                    </p>
                  </div>
                </td>
              </tr>
            ) : produtosFiltrados.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center text-gray-500"
                >
                  Nenhum produto encontrado.
                </td>
              </tr>
            ) : (
              produtosFiltrados.map((prod) => (
                <tr
                  key={prod.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-6 py-4 font-bold text-gray-700">
                    {prod.codigoBarras}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-700">
                    {prod.nome}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {prod.categoria}
                  </td>
                  <td className="px-6 py-4 font-bold">R$ {prod.preco}</td>
                  <td className="px-6 py-4 text-center font-medium text-gray-600">
                    {prod.quantidade}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          setModalConfig({
                            isOpen: true,
                            produtoEditando: prod,
                          })
                        }
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => deleteProduto(prod.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ModalProduto
        isOpen={modalConfig.isOpen}
        produtoEditando={modalConfig.produtoEditando}
        onClose={() => setModalConfig({ isOpen: false, produtoEditando: null })}
        onSave={handleSaveProduto}
      />
    </div>
  );
}