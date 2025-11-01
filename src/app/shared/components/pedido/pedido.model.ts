import { ItemPedido } from "./itemPedido.model";

export class Pedido {
  id?: number;

  estabelecimentoId!: number;

  quartoId!: number;

  usuarioId!: number;

  dataCriacao?: Date;

  status?: string;

  itens?: ItemPedido[];

  nomeCliente?: string;

  clienteId?: number;

  constructor(init?: Partial<Pedido>) {
    Object.assign(this, init);
  }

}