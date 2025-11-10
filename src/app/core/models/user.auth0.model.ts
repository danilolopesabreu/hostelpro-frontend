export class Auth0User {
  email?: string;
  emailVerified?: boolean;
  familyName?: string;
  givenName?: string;
  name?: string;
  nickname?: string;
  picture?: string;
  sub?: string;
  updatedAt?: Date;

  constructor(init?: Partial<Auth0User>) {
    Object.assign(this, init);
  }

  /**
   * Constrói um Auth0User a partir da resposta do Auth0,
   * lidando com campos que vêm com underscore (ex: email_verified, given_name, updated_at).
   */
  static fromAuth0(obj: any): Auth0User {
    if (!obj) {
      return new Auth0User();
    }

    return new Auth0User({
      email: obj.email,
      emailVerified: obj.email_verified ?? obj.emailVerified,
      familyName: obj.family_name ?? obj.familyName,
      givenName: obj.given_name ?? obj.givenName,
      name: obj.name,
      nickname: obj.nickname,
      picture: obj.picture,
      sub: obj.sub,
      updatedAt: obj.updated_at ? new Date(obj.updated_at) : (obj.updatedAt ? new Date(obj.updatedAt) : undefined)
    });
  }

  /**
   * Converte a instância de volta para um objeto plano (útil para enviar ao backend).
   * Note que updatedAt volta como ISO string.
   */
  toPlainObject(): any {
    return {
      email: this.email,
      emailVerified: this.emailVerified,
      familyName: this.familyName,
      givenName: this.givenName,
      name: this.name,
      nickname: this.nickname,
      picture: this.picture,
      sub: this.sub,
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : undefined
    };
  }
}