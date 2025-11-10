import { Role } from "@core/models/role";
import { Papel } from "@shared/modelos/papel.model";

export class Usuario {
  id?: number;
  estabelecimentoId?: number;
  nome?: string;
  email?: string;
  senhaHash?: string;
  papel?: Papel;
  ativo?: boolean;
  foto?: string;

  constructor(init?: Partial<Usuario>) {
    Object.assign(this, init);
  }
}