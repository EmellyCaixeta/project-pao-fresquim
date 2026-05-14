package api_test.br.com.spring_boot_essentials.service;

import api_test.br.com.spring_boot_essentials.model.DividaModel;
import api_test.br.com.spring_boot_essentials.repository.DividaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DividaService {

    private final DividaRepository dividaRepository;

    public List<DividaModel> listarTodas() {
        return dividaRepository.findAll();
    }

    public DividaModel buscarPorId(Integer id) {
        return dividaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dívida não encontrada com o ID: " + id));
    }

    public DividaModel salvar(DividaModel divida) {
        return dividaRepository.save(divida);
    }

    public DividaModel atualizar(Integer id, DividaModel divida) {
        buscarPorId(id);
        return dividaRepository.save(divida);
    }

    public void deletar(Integer id) {
        DividaModel divida = buscarPorId(id);
        dividaRepository.delete(divida);
    }

    public DividaModel registrarDivida(DividaModel novaDivida) {
        return dividaRepository.save(novaDivida);
    }

    public void enviarCobranca(DividaModel divida) {
        String email = divida.getCliente().getEmail();
        System.out.println("Enviando cobrança de R$" + divida.getValor() + " para: " + email);
    }
}