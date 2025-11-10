import { Permissao } from './permissao.model';

export class Papel {
  id?: number;
  nome!: string;
  permissoes: Permissao[] = [];

  constructor(init?: Partial<Papel>) {
    Object.assign(this, init);
  }
}