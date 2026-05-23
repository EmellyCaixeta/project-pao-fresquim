import { useState, useEffect } from "react";
import Modal from "./Modal";
import { IMaskInput } from "react-imask";
import toast from "react-hot-toast";

export default function ModalFuncionario({
  isOpen,
  onClose,
  funcionarioEditando,
  onSave,
}) {
  const estadoInicial = {
    nome: "",
    cargo: "",
    // cpf: "",
    telefone: "",
    salario: "",
    status: "Ativo",
  };

  const [formData, setFormData] = useState(estadoInicial);

  useEffect(() => {
    if (funcionarioEditando) {
      setFormData({
        ...funcionarioEditando,
        // cpf: String(funcionarioEditando.cpf || ""),
        telefone: String(funcionarioEditando.telefone || ""),
        salario: String(funcionarioEditando.salario || ""),
      });
    } else {
      setFormData(estadoInicial);
    }
  }, [funcionarioEditando, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.cpf.length < 14) {
      toast.error("Por favor, digite o CPF completo!");
      return;
    }

    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={funcionarioEditando ? "Editar Funcionário" : "Novo Funcionário"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
            Nome Completo
          </label>
          <input
            required
            type="text"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-orange-500"
            value={formData.nome}
            onChange={(e) => {
              const apenasLetras = e.target.value.replace(
                /[^a-zA-ZÀ-ÿ\s]/g,
                "",
              );
              setFormData({ ...formData, nome: apenasLetras });
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
              Cargo
            </label>
            <input
              required
              type="text"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-orange-500"
              value={formData.cargo}
              onChange={(e) => {
                const apenasLetras = e.target.value.replace(
                  /[^a-zA-ZÀ-ÿ\s]/g,
                  "",
                );
                setFormData({ ...formData, cargo: apenasLetras });
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
              Salário
            </label>
            <IMaskInput
              mask={Number}
              scale={2}
              thousandsSeparator="."
              radix=","
              padFractionalZeros={true}
              normalizeZeros={true}
              mapToRadix={["."]}
              prefix="R$ "
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-orange-500 text-emerald-600 font-bold"
              value={formData.salario}
              onAccept={(value) => setFormData({ ...formData, salario: value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
              CPF
            </label>
            <IMaskInput
              mask="000.000.000-00"
              placeholder="___.___.___-__"
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-orange-500"
              value={formData.cpf}
              onAccept={(value) => setFormData({ ...formData, cpf: value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
              Telefone
            </label>
            <IMaskInput
              mask="(00) 00000-0000"
              placeholder="(__) _____-____"
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-orange-500"
              value={formData.telefone}
              onAccept={(value) =>
                setFormData({ ...formData, telefone: value })
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
            Status
          </label>
          <select
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-orange-500 font-medium text-gray-700"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
            <option value="Férias">Férias</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-2xl mt-4 transition-all shadow-lg"
        >
          {funcionarioEditando ? "Salvar Alterações" : "Confirmar Cadastro"}
        </button>
      </form>
    </Modal>
  );
}
