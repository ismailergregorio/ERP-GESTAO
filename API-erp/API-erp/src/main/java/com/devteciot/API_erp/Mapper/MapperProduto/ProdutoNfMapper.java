package com.devteciot.API_erp.Mapper.MapperProduto;

import org.springframework.stereotype.Component;

import com.devteciot.API_erp.DTO.DTOProdutos.DTOProdutoNfGet;
import com.devteciot.API_erp.DTO.DTOProdutos.DTOProdutoNfPost;
import com.devteciot.API_erp.Models.ModelNf.ModelNF;
import com.devteciot.API_erp.Models.ModelProdutos.ModelTbProdutos;
import com.devteciot.API_erp.Models.ModelProdutos.ModelTbProdutosNf;

@Component
public class ProdutoNfMapper {

    public ModelTbProdutosNf toEntity(
            DTOProdutoNfPost dto,
            ModelNF nf,
            ModelTbProdutos produtoRelacionado) {

        ModelTbProdutosNf entity = new ModelTbProdutosNf();

        entity.setNf(nf);
        entity.setProdutoRelacionado(produtoRelacionado);

        entity.setCodigo(dto.codigo());
        entity.setDescricao(dto.descricao());
        entity.setCodigoEAN(dto.codigoEAN());
        entity.setNcm(dto.ncm());
        entity.setCest(dto.cest());
        entity.setCfop(dto.cfop());
        entity.setUnidadeComercial(dto.unidadeComercial());
        entity.setUnidadeTributaria(dto.unidadeTributaria());

        entity.setQuantidade(dto.quantidade());
        entity.setQuantidadeTributaria(dto.quantidadeTributaria());
        entity.setValorUnitario(dto.valorUnitario());
        entity.setValorUnitarioTributario(dto.valorUnitarioTributario());
        entity.setValorTotal(dto.valorTotal());

        return entity;
    }

    public DTOProdutoNfGet toResponseDTO(
            ModelTbProdutosNf entity) {

        return new DTOProdutoNfGet(

                entity.getId(),

                entity.getNf() != null
                        ? entity.getNf().getId()
                        : null,

                entity.getProdutoRelacionado() != null
                        ? entity.getProdutoRelacionado().getId()
                        : null,

                entity.getCodigo(),
                entity.getDescricao(),
                entity.getCodigoEAN(),
                entity.getNcm(),
                entity.getCest(),
                entity.getCfop(),
                entity.getUnidadeComercial(),
                entity.getUnidadeTributaria(),

                entity.getQuantidade(),
                entity.getQuantidadeTributaria(),
                entity.getValorUnitario(),
                entity.getValorUnitarioTributario(),
                entity.getValorTotal());
    }
}