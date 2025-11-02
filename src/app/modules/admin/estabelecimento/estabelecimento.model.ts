import { Usuario } from "../usuario/usuario.model";

export class Estabelecimento {
  id?: number;
  nome?: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  usuarios?: Usuario[];

  constructor(init?: Partial<Estabelecimento>) {
    Object.assign(this, init);
  }
}