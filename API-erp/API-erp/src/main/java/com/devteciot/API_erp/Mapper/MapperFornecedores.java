package com.devteciot.API_erp.Mapper;

import java.util.List;

import com.devteciot.API_erp.DTO.DTOFornecedores.DTOFornecedoresGet;
import com.devteciot.API_erp.Models.ModelTbFornecedores;

public class MapperFornecedores {

    public static DTOFornecedoresGet toDTOFornecedores(ModelTbFornecedores dto) {

        List<Integer> nfs = dto.getNfs()
                .stream()
                .map(nf -> nf.getNNF())
                .toList();

        return new DTOFornecedoresGet(
                dto.getId(),
                dto.getRazaoSocial(),
                dto.getNomeFantasia(),
                dto.getInscricaoEstadual(),
                dto.getCnpj(),
                dto.getTelefone(),
                dto.getEmail(),
                nfs,
                dto.getDataCriacao()
        );
    }
}