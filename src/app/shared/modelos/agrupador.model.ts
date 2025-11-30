import { TipoEstabelecimento } from "app/modules/admin/estabelecimento/tipo-estabelecimento.model";

export class Agrupador {
  id?: number;
  nome?: string;
  observacao?: string;
  tipoEstabelecimento: TipoEstabelecimento[] = [];
  rotulo?:string;

  constructor(init?: Partial<Agrupador>) {
    Object.assign(this, init);
  }
}