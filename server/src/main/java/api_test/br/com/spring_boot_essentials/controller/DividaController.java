package api_test.br.com.spring_boot_essentials.controller;

import api_test.br.com.spring_boot_essentials.model.DividaModel;
import api_test.br.com.spring_boot_essentials.service.DividaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dividas")
@RequiredArgsConstructor
public class DividaController {

    private final DividaService dividaService;

    @GetMapping
    public ResponseEntity<List<DividaModel>> listarTodas() {
        return ResponseEntity.ok(dividaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DividaModel> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(dividaService.buscarPorId(id));
    }

    @PostMapping("/{id}")
    public DividaModel criar(DividaModel divida) {
        return dividaService.registrarDivida(divida);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DividaModel> atualizar(
            @PathVariable Integer id,
            @RequestBody DividaModel divida
    ) {
        return ResponseEntity.ok(dividaService.atualizar(id, divida));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        dividaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}