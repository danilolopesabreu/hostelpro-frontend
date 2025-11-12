import { CategoriaProduto } from "@shared/components/categoria-produto/categoria-produto.model";
import { Usuario } from "../usuario/usuario.model";
import { TipoEstabelecimento } from "./tipo-estabelecimento.model";
import { ItensAgrupados } from "@shared/modelos/itens-agrupados.model";

export class Estabelecimento {
  id?: number;
  nome?: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  usuarios?: Usuario[];
  categoriaProduto?: CategoriaProduto[];
  tipoEstabelecimento?: TipoEstabelecimento;
  itensAgrupados?: ItensAgrupados[];

  constructor(init?: Partial<Estabelecimento>) {
    Object.assign(this, init);
  }
}