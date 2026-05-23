package api_test.br.com.spring_boot_essentials.repository;

import api_test.br.com.spring_boot_essentials.model.LicencaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LicencaRepository extends JpaRepository<LicencaModel, Integer> {
    List<LicencaModel> findByFuncionarioId(Integer funcionarioId);
}
