import { useState, useEffect } from "react";
import Modal from "./Modal";
import { IMaskInput } from "react-imask";
import toast from "react-hot-toast";

export default function ModalCliente({
  isOpen,
  onClose,
  clienteEditando,
  onSave,
}) {
  const estadoInicial = {
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    // negativado: "Positivo",
  };

  const [formData, setFormData] = useState(estadoInicial);

  useEffect(() => {
    if (clienteEditando) {
      setFormData(clienteEditando);
    } else {
      setFormData(estadoInicial);
    }
  }, [clienteEditando, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!regexEmail.test(formData.email)) {
      toast.error("Por favor, digite um e-mail válido!");
      return;
    }

    if (formData.cpf.length < 11) {
      toast.error("Por favor, digite o CPF completo!");
      return;
    }

    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={clienteEditando ? "Editar Cadastro" : "Novo Cliente"}
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
            onChange={(e) =>
              setFormData({
                ...formData,
                nome: e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ""),
              })
            }
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
            E-mail
          </label>
          <input
            required
            type="email"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-orange-500"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
              CPF
            </label>
            <IMaskInput
              mask="000000000000"
              // placeholder="___.___.___-__"
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
            Situação do Cliente
          </label>
          <select
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-orange-500 font-medium text-gray-700"
            value={formData.negativado}
            onChange={(e) =>
              setFormData({ ...formData, negativado: e.target.value })
            }
          >
            <option value="Positivo">Positivo</option>
            <option value="Negativado">Negativado</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-2xl mt-4 transition-all shadow-lg"
        >
          {clienteEditando ? "Atualizar Cliente" : "Salvar Cliente"}
        </button>
      </form>
    </Modal>
  );
}
