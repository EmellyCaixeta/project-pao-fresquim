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
@CrossOrigin(origins = "*")
public class FuncionarioController {

    public final FuncionarioService funcionarioService;

    @PostMapping("/cadastrar")
    @ResponseStatus(HttpStatus.CREATED)
    public FuncionarioModel cadastrarFuncionario(@Valid FuncionarioModel funcionario){
        return funcionarioService.cadastrarFuncionario(funcionario);
    }

    @PutMapping("/atualizar/{id}")
    @ResponseStatus(HttpStatus.OK)
    public FuncionarioModel atualizarFuncionario(@Valid FuncionarioModel funcionario){
        return funcionarioService.atualizarFuncionario(funcionario);
    }

    @DeleteMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluirFuncionario(Integer id){
        funcionarioService.deletarFuncionario(id);
    }

    @GetMapping("/listar")
    @ResponseStatus(HttpStatus.OK)
    public List<FuncionarioModel> listarFuncionarios(){
        return funcionarioService.listarFuncionario();
    }
}
