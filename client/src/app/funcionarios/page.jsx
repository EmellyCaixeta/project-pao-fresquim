"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import api from "../../../services/api";
import ModalFuncionario from "@/components/ModalFuncionario";
import toast from "react-hot-toast";

export default function FuncionariosPage() {
  const [busca, setBusca] = useState("");
  const [funcionarios, setFuncionarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    funcionarioEditando: null,
  });

  async function getFuncionarios(params) {
    setIsLoading(true);
    try {
      const response = await api.get("/funcionarios/listar", { params });
      setFuncionarios(response.data);
    } catch (error) {
      toast.error("Erro ao buscar funcionários.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getFuncionarios();
  }, []);

  async function deleteFuncionarios(id) {
    try {
      await api.delete(`/funcionarios/${id}`);
      await getFuncionarios();
      toast.success("Funcionário desligado/excluído!");
    } catch (error) {
      toast.error("Erro ao excluir o funcionário.");
    }
  }

  const handleSaveFuncionario = async (dadosDoFormulario) => {
    try {
      if (dadosDoFormulario.id) {
        await api.put(
          `/funcionarios/${dadosDoFormulario.id}`,
          dadosDoFormulario,
        );
        toast.success("Dados atualizados com sucesso!");
      } else {
        await api.post("/funcionarios/cadastrar", dadosDoFormulario);
        toast.success("Novo funcionário cadastrado!");
      }

      setModalConfig({ isOpen: false, funcionarioEditando: null });
      await getFuncionarios();
    } catch (error) {
      console.error(error);
      toast.error("Ocorreu um erro ao conectar com o servidor.");
    }
  };

  const termoBusca = busca?.toLowerCase() || "";
  const funcionariosFiltrados = funcionarios.filter(
    (func) =>
      func.nome?.toLowerCase().includes(termoBusca) ||
      func.cpf?.toLowerCase().includes(termoBusca) ||
      func.cargo?.toLowerCase().includes(termoBusca),
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Funcionários</h1>
          <p className="text-gray-500">Gerencie o cadastro da equipe</p>
        </div>
        <button
          onClick={() =>
            setModalConfig({ isOpen: true, funcionarioEditando: null })
          }
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
        >
          <Plus size={20} />
          Novo Funcionário
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
              placeholder="Buscar por nome, CPF ou cargo..."
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
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">CPF</th>
                <th className="px-6 py-4 text-center">Cargo</th>
                <th className="px-6 py-4">Telefone</th>
                <th className="px-6 py-4">Salário</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-orange-500">
                      <Loader2 size={32} className="animate-spin mb-2" />
                      <p className="text-gray-500 font-medium text-sm">
                        Carregando equipe...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : funcionariosFiltrados.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Nenhum funcionário encontrado.
                  </td>
                </tr>
              ) : (
                funcionariosFiltrados.map((func) => (
                  <tr
                    key={func.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-700">{func.nome}</p>
                    </td>
                    {/* <td className="px-6 py-4 text-gray-500">{func.cpf}</td> */}
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-blue-50 rounded-full text-[10px] font-bold uppercase">
                        {func.cargo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{func.telefone}</td>

                    <td className="px-6 py-4 font-bold">
                      {String(func.salario).includes("R$")
                        ? func.salario
                        : `R$ ${func.salario}`}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                          func.status === "Inativo"
                            ? "bg-red-50 text-red-600"
                            : func.status === "Férias"
                              ? "bg-yellow-50 text-yellow-600"
                              : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        {func.status || "Ativo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 ">
                        <button
                          onClick={() =>
                            setModalConfig({
                              isOpen: true,
                              funcionarioEditando: func,
                            })
                          }
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => deleteFuncionarios(func.id)}
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

      <ModalFuncionario
        isOpen={modalConfig.isOpen}
        funcionarioEditando={modalConfig.funcionarioEditando}
        onClose={() =>
          setModalConfig({ isOpen: false, funcionarioEditando: null })
        }
        onSave={handleSaveFuncionario}
      />
    </div>
  );
}
