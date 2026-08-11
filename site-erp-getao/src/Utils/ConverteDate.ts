export default function covertData(valor: string) {
  const dataIso: string = valor;

  // 1. Converte a string para um objeto Date
  const objetoData: Date = new Date(dataIso);

  // 2. Formata para o padrão do Brasil
  return objetoData.toLocaleString("pt-BR");
}
