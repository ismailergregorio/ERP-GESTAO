package com.devteciot.dev_erp.Service;
import com.devteciot.dev_erp.DTO.DTOFuncionario.*; import com.devteciot.dev_erp.Exception.ResourceNotFoundException; import com.devteciot.dev_erp.Models.Funcionario; import com.devteciot.dev_erp.Repository.FuncionarioRepository; import lombok.RequiredArgsConstructor; import org.springframework.stereotype.Service; import java.util.*;
@Service @RequiredArgsConstructor public class FuncionarioService { private final FuncionarioRepository r;
 public List<FuncionarioGetDTO> listar(){return r.findByAtivoTrueOrderByNomeAsc().stream().map(this::dto).toList();}
 public FuncionarioGetDTO buscar(Long id){return dto(r.findById(id).orElseThrow(()->new ResourceNotFoundException("Funcionário não encontrado: "+id)));}
 public FuncionarioGetDTO criar(FuncionarioPostDTO d){ if(r.existsByNomeIgnoreCase(d.nome())) throw new IllegalArgumentException("Já existe um funcionário com esse nome."); Funcionario f=new Funcionario(); f.setNome(d.nome().trim()); f.setCpf(normalizar(d.cpf())); return dto(r.save(f));}
 public FuncionarioGetDTO atualizar(Long id,FuncionarioPostDTO d){Funcionario f=r.findById(id).orElseThrow(()->new ResourceNotFoundException("Funcionário não encontrado: "+id)); if(!f.getNome().equalsIgnoreCase(d.nome())&&r.existsByNomeIgnoreCase(d.nome())) throw new IllegalArgumentException("Já existe um funcionário com esse nome."); f.setNome(d.nome().trim()); f.setCpf(normalizar(d.cpf())); return dto(r.save(f));}
 public void excluir(Long id){Funcionario f=r.findById(id).orElseThrow(()->new ResourceNotFoundException("Funcionário não encontrado: "+id)); f.setAtivo(false); r.save(f);}
 private String normalizar(String v){return v==null||v.isBlank()?null:v.trim();} private FuncionarioGetDTO dto(Funcionario f){return new FuncionarioGetDTO(f.getId(),f.getNome(),f.getCpf(),f.getAtivo(),f.getDataCriacao(),f.getDataUpdate());}
}
