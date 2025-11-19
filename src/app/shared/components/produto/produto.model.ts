export interface Produto {
  id: number;
  estabelecimentoId: number;
  nome: string;
  preco: number;
  estoque: number;
  categoriaId: number;
  origemCadastro: string;
  imagem: string;
  descricao: string;
  quantidadeVendida: number;
  quantidadeCarrinho:number;
  situacao: string;
  editando: boolean;
  novoPreco: number;
}