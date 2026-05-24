package api_test.br.com.spring_boot_essentials.service;

import api_test.br.com.spring_boot_essentials.exception.RecursoNaoEncontradoException;
import api_test.br.com.spring_boot_essentials.model.ClienteModel;
import api_test.br.com.spring_boot_essentials.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    public List<ClienteModel> listarTodos() {
        return clienteRepository.findAll();
    }

    public ClienteModel cadastrarCliente(ClienteModel clienteModel) {
        return clienteRepository.save(clienteModel);
    }

    public void deletarCliente(Integer clienteId) {
        clienteRepository.deleteById(clienteId);
    }

    public boolean validarSerasa(Integer clienteId) {
        ClienteModel cliente = clienteRepository.findById(clienteId).orElseThrow(() ->
                new RecursoNaoEncontradoException("Cliente não encontrado com ID: " + clienteId));

        boolean checarCliente = checarClienteSerasa(cliente.getCpf());

        if (checarCliente) {
            bloquearCliente(cliente);
        }

        return checarCliente;
    }

    public void bloquearCliente(ClienteModel cliente) {
        cliente.setBloqueado(true);
        clienteRepository.save(cliente);
        System.out.println("O Cliente " + cliente.getNome() + " foi bloqueado preventivamente!");
    }

    public boolean checarClienteSerasa(String cpf) {
        return cpf != null && cpf.startsWith("0");
    }
}
