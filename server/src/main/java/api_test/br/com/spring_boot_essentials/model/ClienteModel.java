package api_test.br.com.spring_boot_essentials.model;

import api_test.br.com.spring_boot_essentials.service.DividaService;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "clientes")
public class ClienteModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @NotBlank(message = "Nome é obrigatório")
    private String nome;
    
    @NotBlank(message = "Telefone é obrigatório")
    @Pattern(regexp = "^\\(?\\d{2}\\)?\\s?\\d{4,5}-?\\d{4}$", message = "Telefone deve estar no formato (XX) XXXXX-XXXX ou similar")
    private String telefone;
    
    @Email(message = "Email deve ser válido")
    private String email;
    
    @NotBlank(message = "CPF é obrigatório")
    @Size(min = 11, max = 11, message = "CPF deve ter exatamente 11 dígitos")
    private String cpf;
    
    private boolean bloqueado = false;

    @Enumerated
    private EnderecoModel endereco;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL)
    private List<VendaModel> vendas = new ArrayList<>();

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL)
    private List<DividaModel> dividas = new ArrayList<>();

    public ClienteModel(Integer id, String nome, String telefone, String email) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
    }

    public ClienteModel() {}
}
