"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Mail,
  Phone,
  Loader2,
} from "lucide-react";
import api from "../../../services/api";
import ModalCliente from "@/components/ModalCliente";
import toast from "react-hot-toast";

export default function ClientesPage() {
  const [busca, setBusca] = useState("");
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    clienteEditando: null,
  });

  async function getClientes(params) {
    setIsLoading(true);
    try {
      const response = await api.get("/clientes/listar", { params });
      setClientes(response.data);
    } catch (error) {
      toast.error("Erro ao buscar clientes.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getClientes();
  }, []);

  async function deleteClientes(id) {
    try {
      await api.delete(`/clientes/deletar/${id}`);
      await getClientes();
      toast.success("Cliente excluído!");
    } catch (error) {
      toast.error("Erro ao excluir o cliente.");
    }
  }

  const handleSaveCliente = async (dadosDoFormulario) => {
    try {
      if (dadosDoFormulario.id) {
        await api.put(`/clientes/${dadosDoFormulario.id}`, dadosDoFormulario);
        toast.success("Cliente atualizado com sucesso!");
      } else {
        await api.post("/clientes/salvar", dadosDoFormulario);
        toast.success("Novo cliente cadastrado!");
      }

      setModalConfig({ isOpen: false, clienteEditando: null });
      await getClientes();
    } catch (error) {
      toast.error("Ocorreu um erro ao conectar com o servidor.");
    }
  };

  const termoBusca = busca?.toLowerCase() || "";
  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nome?.toLowerCase().includes(termoBusca) || c.cpf?.includes(termoBusca),
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Clientes</h1>
          <p className="text-gray-500">Gestão da base de consumidores</p>
        </div>
        <button
          onClick={() =>
            setModalConfig({ isOpen: true, clienteEditando: null })
          }
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-100"
        >
          <Plus size={20} />
          Novo Cliente
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
              placeholder="Buscar por nome ou CPF..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[11px] uppercase text-gray-400 font-bold">
              <tr>
                <th className="px-6 py-4">Nome do Cliente</th>
                <th className="px-6 py-4">CPF</th>
                <th className="px-6 py-4">Contato</th>
                <th className="px-6 py-4 text-center">Situação</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-orange-500">
                      <Loader2 size={32} className="animate-spin mb-2" />
                      <p className="text-gray-500 font-medium text-sm">
                        Carregando clientes...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : clientesFiltrados.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              ) : (
                clientesFiltrados.map((cliente) => (
                  <tr
                    key={cliente.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-700">{cliente.nome}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Mail size={12} /> {cliente.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium">
                      {cliente.cpf}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600 font-medium">
                        <Phone size={14} className="text-gray-400" />{" "}
                        {cliente.telefone}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          cliente.bloqueado
                            ? "bg-red-50 text-red-600"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        {cliente.bloqueado ? "Negativado" : "Positivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            setModalConfig({
                              isOpen: true,
                              clienteEditando: cliente,
                            })
                          }
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => deleteClientes(cliente.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalCliente
        isOpen={modalConfig.isOpen}
        clienteEditando={modalConfig.clienteEditando}
        onClose={() => setModalConfig({ isOpen: false, clienteEditando: null })}
        onSave={handleSaveCliente}
      />
    </div>
  );
}