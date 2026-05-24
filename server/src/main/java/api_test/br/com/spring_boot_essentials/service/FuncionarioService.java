package api_test.br.com.spring_boot_essentials.service;

import api_test.br.com.spring_boot_essentials.exception.RecursoNaoEncontradoException;
import api_test.br.com.spring_boot_essentials.model.FuncionarioModel;
import api_test.br.com.spring_boot_essentials.repository.FuncionarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FuncionarioService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    public List<FuncionarioModel> listarTodos() {
        return funcionarioRepository.findAll();
    }

    public FuncionarioModel cadastrarFuncionario(FuncionarioModel funcionario) {
        return funcionarioRepository.save(funcionario);
    }

    public FuncionarioModel listarFuncionario(FuncionarioModel funcionario) {
        return funcionarioRepository.findById(funcionario.getId()).orElseThrow(() ->
                new RecursoNaoEncontradoException("Funcionário não encontrado com ID: " + funcionario.getId()));
    }

    public FuncionarioModel atualizarFuncionario(FuncionarioModel funcionario) {
        funcionarioRepository.findById(funcionario.getId()).orElseThrow(() ->
                new RecursoNaoEncontradoException("Funcionário não encontrado com ID: " + funcionario.getId()));

        return funcionarioRepository.save(funcionario);
    }

    public void deletarFuncionario(Integer id) {
        funcionarioRepository.findById(id).orElseThrow(() ->
                new RecursoNaoEncontradoException("Funcionário não encontrado com ID: " + id));

        funcionarioRepository.deleteById(id);
    }
}
