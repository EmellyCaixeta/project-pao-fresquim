package api_test.br.com.spring_boot_essentials.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "vendas")
public class VendaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    @NotNull(message = "Data da venda é obrigatória")
    @PastOrPresent(message = "Data da venda não pode ser futura")
    private LocalDate dataVenda;

    @Column(nullable = false)
    @DecimalMin(value = "0.01", message = "Valor total tem que ser maior do que zero")
    private Double valorTotal;

    @ManyToMany
    @JoinTable(name = "venda_produto", joinColumns = @JoinColumn(name = "venda_id"), inverseJoinColumns = @JoinColumn(name = "produto_id"))
    private List<ProdutoModel> produtos = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "pagamento_id", referencedColumnName = "id")
    private PagamentoModel pagamento;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "cliente_id")
    private ClienteModel cliente;

    public VendaModel(Integer id, LocalDate dataVenda, Double valorTotal) {
        this.id = id;
        this.dataVenda = dataVenda;
        this.valorTotal = valorTotal;
    }

    public VendaModel() {}
}
