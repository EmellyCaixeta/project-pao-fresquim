package api_test.br.com.spring_boot_essentials.controller;

import api_test.br.com.spring_boot_essentials.model.FuncionarioModel;
import api_test.br.com.spring_boot_essentials.service.FuncionarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("funcionarios")
@RequiredArgsConstructor
public class FuncionarioController {

    public final FuncionarioService funcionarioService;

    @GetMapping("/listar")
    @ResponseStatus(HttpStatus.OK)
    public List<FuncionarioModel> listarFuncionarios() {
        return funcionarioService.listarTodos();
    }

    @PostMapping("/cadastrar")
    @ResponseStatus(HttpStatus.CREATED)
    public FuncionarioModel cadastrarFuncionario(@Valid @RequestBody FuncionarioModel funcionario) {
        return funcionarioService.cadastrarFuncionario(funcionario);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public FuncionarioModel atualizarFuncionario(@PathVariable Integer id, @Valid @RequestBody FuncionarioModel funcionario) {
        funcionario.setId(id);
        return funcionarioService.atualizarFuncionario(funcionario);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluirFuncionario(@PathVariable Integer id) {
        funcionarioService.deletarFuncionario(id);
    }
}
