import { CategoriaProduto } from "@shared/components/categoria-produto/categoria-produto.model";
import { Usuario } from "../usuario/usuario.model";

export class Estabelecimento {
  id?: number;
  nome?: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  usuarios?: Usuario[];
  categoriaProduto?: CategoriaProduto[];
  idTipoEstabelecimento?: number;

  constructor(init?: Partial<Estabelecimento>) {
    Object.assign(this, init);
  }
}