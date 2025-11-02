export class Usuario {
  id?: number;
  estabelecimentoId?: number;
  nome?: string;
  email?: string;
  senhaHash?: string;
  perfil?: string;
  ativo?: boolean;

  constructor(init?: Partial<Usuario>) {
    Object.assign(this, init);
  }
}