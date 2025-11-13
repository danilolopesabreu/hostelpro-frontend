import { ItensAgrupados } from "@shared/modelos/itens-agrupados.model";
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

  numeroDoPedido?:string;

  itensAgrupados?: ItensAgrupados | string;

  constructor(init?: Partial<Pedido>) {
    Object.assign(this, init);
  }

}