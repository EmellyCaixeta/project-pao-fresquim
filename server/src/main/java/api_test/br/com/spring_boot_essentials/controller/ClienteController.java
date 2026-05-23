package api_test.br.com.spring_boot_essentials.controller;

import api_test.br.com.spring_boot_essentials.model.ClienteModel;
import api_test.br.com.spring_boot_essentials.service.ClienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;

    @PostMapping("/salvar")
    @ResponseStatus(HttpStatus.CREATED)
    public ClienteModel salvar(@Valid @RequestBody ClienteModel clienteModel) {
        return clienteService.cadastrarCliente(clienteModel);
    }

    @DeleteMapping("/deletar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(Integer id) {
        clienteService.deletarCliente(id);
    }

    @GetMapping("/deletar/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Boolean status(@PathVariable Integer id){
        return clienteService.validarSerasa(id);
    }

}
