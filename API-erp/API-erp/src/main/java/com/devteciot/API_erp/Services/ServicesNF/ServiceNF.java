package com.devteciot.API_erp.Services.ServicesNF;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.devteciot.API_erp.DTO.DTONf.DTONfGet;
import com.devteciot.API_erp.DTO.DTONf.DTONfPost;
import com.devteciot.API_erp.Mapper.MapperNf.MapperNf;
import com.devteciot.API_erp.Models.ModelNf.ModelNF;
import com.devteciot.API_erp.Repository.RepositoryNF;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServiceNF {

    private final RepositoryNF repositoryNF;
    private final MapperNf mapperNf;

    /*
     * =====================================================
     * SALVAR
     * =====================================================
     */

    @Transactional
    public DTONfGet salvar(DTONfPost dto) {

        if (dto == null) {
            throw new IllegalArgumentException(
                    "A nota fiscal não pode ser nula."
            );
        }

        if (dto.nNF() == null) {
            throw new IllegalArgumentException(
                    "O número da NF é obrigatório."
            );
        }

        /*
         * Verifica se já existe uma NF com o mesmo número.
         */
        if (repositoryNF.existsByNNF(dto.nNF())) {
            throw new IllegalArgumentException(
                    "Já existe uma NF cadastrada com o número: "
                            + dto.nNF()
            );
        }

        /*
         * Converte DTO para entidade.
         */
        ModelNF nf = mapperNf.toEntity(dto);

        /*
         * Datas controladas pelo sistema.
         */
        LocalDateTime agora = LocalDateTime.now();

        nf.setDataCriacao(agora);
        nf.setDataAtualizacao(agora);

        /*
         * Salva a NF.
         */
        ModelNF salva = repositoryNF.save(nf);

        /*
         * Converte entidade para DTO de resposta.
         */
        return mapperNf.toResponseDTO(salva);
    }

    /*
     * =====================================================
     * BUSCAR POR ID
     * =====================================================
     */

    @Transactional(readOnly = true)
    public DTONfGet buscarPorId(Long id) {

        if (id == null) {
            throw new IllegalArgumentException(
                    "O ID da NF é obrigatório."
            );
        }

        ModelNF nf = repositoryNF.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "NF não encontrada: " + id
                        )
                );

        return mapperNf.toResponseDTO(nf);
    }

    /*
     * =====================================================
     * BUSCAR POR NÚMERO DA NF
     * =====================================================
     */

    @Transactional(readOnly = true)
    public DTONfGet buscarPorNumero(Integer nNF) {

        if (nNF == null) {
            throw new IllegalArgumentException(
                    "O número da NF é obrigatório."
            );
        }

        ModelNF nf = repositoryNF.findByNNF(nNF)
                .orElseThrow(() ->
                        new RuntimeException(
                                "NF não encontrada: " + nNF
                        )
                );

        return mapperNf.toResponseDTO(nf);
    }

    /*
     * =====================================================
     * LISTAR TODAS
     * =====================================================
     */

    @Transactional(readOnly = true)
    public List<DTONfGet> listar() {

        return repositoryNF.findAll()
                .stream()
                .map(mapperNf::toResponseDTO)
                .toList();
    }

    /*
     * =====================================================
     * ATUALIZAR
     * =====================================================
     */

    @Transactional
    public DTONfGet atualizar(
            Long id,
            DTONfPost dto) {

        if (id == null) {
            throw new IllegalArgumentException(
                    "O ID da NF é obrigatório."
            );
        }

        if (dto == null) {
            throw new IllegalArgumentException(
                    "Os dados da NF são obrigatórios."
            );
        }

        if (dto.nNF() == null) {
            throw new IllegalArgumentException(
                    "O número da NF é obrigatório."
            );
        }

        /*
         * Busca a NF existente.
         */
        ModelNF nf = repositoryNF.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "NF não encontrada: " + id
                        )
                );

        /*
         * Verifica se o novo número já pertence
         * a outra NF.
         */
        if (!nf.getNNF().equals(dto.nNF())
                && repositoryNF.existsByNNF(dto.nNF())) {

            throw new IllegalArgumentException(
                    "Já existe uma NF cadastrada com o número: "
                            + dto.nNF()
            );
        }

        /*
         * Atualiza somente os campos permitidos.
         *
         * O ID continua sendo o mesmo.
         */
        nf.setNNF(dto.nNF());

        /*
         * Atualiza a data.
         */
        nf.setDataAtualizacao(
                LocalDateTime.now()
        );

        /*
         * Salva.
         */
        ModelNF atualizado =
                repositoryNF.save(nf);

        return mapperNf.toResponseDTO(atualizado);
    }

    /*
     * =====================================================
     * DELETAR
     * =====================================================
     */

    @Transactional
    public void deletar(Long id) {

        if (id == null) {
            throw new IllegalArgumentException(
                    "O ID da NF é obrigatório."
            );
        }

        ModelNF nf = repositoryNF.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "NF não encontrada: " + id
                        )
                );

        repositoryNF.delete(nf);
    }
}