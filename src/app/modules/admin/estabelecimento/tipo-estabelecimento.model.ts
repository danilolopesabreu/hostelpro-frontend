import { Agrupador } from "@shared/modelos/agrupador.model";

export class TipoEstabelecimento {
  id?: number;
  nome?: string;
  agrupador?: Agrupador;

  constructor(init?: Partial<TipoEstabelecimento>) {
    Object.assign(this, init);
  }
}