import { ItensAgrupados } from "@shared/modelos/itens-agrupados.model";
import { ItemPedido } from "./itemPedido.model";

export class Pedido {
  id?: number;

  estabelecimentoId!: number;

  quartoId!: number;

  usuarioId!: number;

  dataCriacao?: Date;

  status?: string;

  itens: ItemPedido[] = [];

  nomeCliente?: string;

  clienteId?: number;

  numeroDoPedido?:string;

  itensAgrupados?: ItensAgrupados;

  constructor(init?: Partial<Pedido>) {
    Object.assign(this, init);
  }

  fromDTO(dto: any): Pedido {
    Object.assign(this, dto);
    return this;
  }

  calcularTotalPedido(): number | undefined{
    return this.itens?.reduce((soma, item) => 
      soma + (item.precoTotal), 0);
  }

}