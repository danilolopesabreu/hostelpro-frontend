export class ProdutoEstabelecimento {
  id?: number;
  produtoBaseId?: number;
  estabelecimentoId?: number;
  categoriaId?: number;
  nome!: string;
  descricao: string = '';
  preco!: number;
  imagem?: string;
  estoque: number = 0;
  quantidadeVendida: number = 0;
  quantidadeCarrinho:number = 0;
  situacao: string = 'ativo';
  origemCadastro: string = 'fabrica';
  editando?: boolean;
  novoPreco?: number;

  // esta linha permite adicionar "_ref" e outras props dinâmicas
  [key: string]: any;

  constructor(init?: Partial<ProdutoEstabelecimento>) {
    Object.assign(this, init);
  }
}