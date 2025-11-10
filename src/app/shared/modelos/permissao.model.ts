export class Permissao {
  id?: number;
  nome!: string;

  constructor(init?: Partial<Permissao>) {
    Object.assign(this, init);
  }
}