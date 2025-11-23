import { ProdutoEstabelecimento } from "../produto/produto-estabelecimento.model";
import { Produto } from "../produto/produto.model";

export class ItemPedido {
  id!: number;

  produtoId!: number;

  quantidade!: number;

  precoUnitario!: number;

  precoTotal!: number;

  produtoEstabelecimento!: ProdutoEstabelecimento;

  selecionado?: boolean;

  status!:string;

  constructor(init?: Partial<ItemPedido>) {
    Object.assign(this, init);
  }

}