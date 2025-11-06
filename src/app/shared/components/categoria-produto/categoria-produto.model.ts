import { Estabelecimento } from "app/modules/admin/estabelecimento/estabelecimento.model";

export class CategoriaProduto {
  id?: number;
  estabelecimento?: Estabelecimento;
  nome!: string;
  categoriaPai?: CategoriaProduto;
  subcategorias: CategoriaProduto[] = [];
  criadoEm: Date = new Date();
  atualizadoEm: Date = new Date();
  imagem?: string;

  constructor(init?: Partial<CategoriaProduto>) {
    Object.assign(this, init);
  }
}
