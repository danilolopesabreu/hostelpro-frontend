export class ItensAgrupados {
  id?: number;
  estabelecimentoId?: number;
  tipoEstabelecimentoId?: number;
  nome!: string;

  constructor(init?: Partial<ItensAgrupados>) {
    Object.assign(this, init);
  }
}
