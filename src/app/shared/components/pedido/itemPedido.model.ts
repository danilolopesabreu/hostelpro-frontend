import { Produto } from "../produto/produto.model";

export class ItemPedido {
  id?: number;

  produtoId!: number;

  quantidade!: number;

  precoUnitario!: number;

  precoTotal!: number;

  produto?: Produto;

  constructor(init?: Partial<ItemPedido>) {
    Object.assign(this, init);
  }

}