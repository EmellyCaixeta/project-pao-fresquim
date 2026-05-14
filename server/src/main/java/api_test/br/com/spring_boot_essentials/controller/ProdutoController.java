package api_test.br.com.spring_boot_essentials.controller;

import api_test.br.com.spring_boot_essentials.model.ProdutoModel;
import api_test.br.com.spring_boot_essentials.service.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/produtos")
@RequiredArgsConstructor
public class ProdutoController {

    public final ProdutoService produtoService;

    @GetMapping("/listar")
    @ResponseStatus(HttpStatus.OK)
    public List<ProdutoModel> listarProdutos() {
        return produtoService.listar();
    }

    @PostMapping("/adicionar")
    @ResponseStatus(HttpStatus.CREATED)
    public ProdutoModel adicionarProduto(@Valid @RequestBody ProdutoModel produtoModel) {
        return produtoService.salvar(produtoModel);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarProduto(Integer id) {
        produtoService.deletarProduto(id);
    }
}
