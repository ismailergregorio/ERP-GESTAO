package com.devteciot.dev_erp.Service;

import com.devteciot.dev_erp.Exception.ResourceNotFoundException;
import com.devteciot.dev_erp.Models.Saida;
import com.devteciot.dev_erp.Models.SaidaProduto;
import com.devteciot.dev_erp.Repository.SaidaRepository;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SaidaPdfService {
    private final SaidaRepository repository;
    private static final DateTimeFormatter DATA = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    @Transactional(readOnly = true)
    public byte[] gerar(Long id) {
        Saida saida = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Saída não encontrada: " + id));
        if (!Boolean.TRUE.equals(saida.getAtivo())) throw new IllegalArgumentException("A saída está desativada.");
        try (PDDocument doc = new PDDocument(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            List<String> linhas = new ArrayList<>();
            linhas.add("COMPROVANTE DE SAÍDA" + (Boolean.TRUE.equals(saida.getSaidaEpi()) ? " - EPI / UNIFORME" : " DE PRODUTOS"));
            linhas.add("Saída nº: " + saida.getId());
            linhas.add("Data: " + (saida.getDataCriacao() == null ? "-" : saida.getDataCriacao().format(DATA)));
            linhas.add("Destinatário/funcionário: " + saida.getFuncionario().getNome());
            linhas.add("Setor: " + saida.getSetor().getNome());
            linhas.add("Tipo de saída: " + saida.getTipoSaida().getNome());
            linhas.add("Finalidade: " + saida.getFinalidade());
            if (saida.getObs() != null && !saida.getObs().isBlank()) linhas.add("Observações: " + saida.getObs());
            linhas.add("");
            linhas.add("ITENS ENTREGUES");
            linhas.add("Produto | Quantidade | Unidade | Valor unitário | Total");
            for (SaidaProduto item : saida.getProdutos()) {
                linhas.add(item.getProduto().getNome() + " | " + item.getQuantidade() + " | " + item.getProduto().getUnidadeMedida().getSigla()
                        + " | R$ " + item.getValorUnitario() + " | R$ " + item.getValorTotal());
            }
            int porPagina = 38;
            int paginas = Math.max(1, (int) Math.ceil(linhas.size() / (double) porPagina));
            for (int p = 0; p < paginas; p++) {
                PDPage page = new PDPage(PDRectangle.A4);
                doc.addPage(page);
                try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {
                    float y = 790;
                    if (p > 0) y = escreverLinha(cs, "CONTINUAÇÃO - SAÍDA Nº " + saida.getId(), 50, y, 12, true) - 8;
                    int inicio = p * porPagina;
                    int fim = Math.min(linhas.size(), inicio + porPagina);
                    for (int i = inicio; i < fim; i++) {
                        boolean titulo = (i == 0 || linhas.get(i).equals("ITENS ENTREGUES"));
                        y = escreverLinha(cs, linhas.get(i), 50, y, titulo ? 13 : 9, titulo) - (titulo ? 3 : 0);
                    }
                    if (p == paginas - 1) desenharAssinatura(cs, doc, saida);
                }
            }
            doc.save(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new IllegalStateException("Não foi possível gerar o PDF da saída.", e);
        }
    }

    private float escreverLinha(PDPageContentStream cs, String texto, float x, float y, int tamanho, boolean negrito) throws IOException {
        PDType1Font fonte = new PDType1Font(negrito ? Standard14Fonts.FontName.HELVETICA_BOLD : Standard14Fonts.FontName.HELVETICA);
        String seguro = texto == null ? "" : texto.replaceAll("[^\\x20-\\x7E\\u00A0-\\u00FF]", "?");
        if (seguro.length() > 110) seguro = seguro.substring(0, 107) + "...";
        cs.beginText(); cs.setFont(fonte, tamanho); cs.newLineAtOffset(x, y); cs.showText(seguro); cs.endText();
        return y - (tamanho + 7);
    }

    private void desenharAssinatura(PDPageContentStream cs, PDDocument doc, Saida saida) throws IOException {
        float y = 115;
        cs.moveTo(50, y); cs.lineTo(300, y); cs.stroke();
        escreverLinha(cs, "Assinatura do funcionário: " + saida.getFuncionario().getNome(), 50, y - 15, 9, false);
        if (saida.getAssinaturaFuncionario() != null && saida.getAssinaturaFuncionario().length > 0) {
            PDImageXObject imagem = PDImageXObject.createFromByteArray(doc, saida.getAssinaturaFuncionario(), "assinatura");
            float escala = Math.min(220f / imagem.getWidth(), 55f / imagem.getHeight());
            cs.drawImage(imagem, 55, y - 78, imagem.getWidth() * escala, imagem.getHeight() * escala);
            escreverLinha(cs, "Assinado em: " + (saida.getDataAssinatura() == null ? "-" : saida.getDataAssinatura().format(DATA)), 50, 20, 8, false);
        } else {
            escreverLinha(cs, "Assinatura não coletada.", 50, y - 30, 9, false);
        }
    }
}
