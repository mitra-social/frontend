export class AuthenticationUtil {
  private static readonly USER = "user";
  private static readonly USER_TOKEN = "user-token";

  public static setUser(user: string) {
    sessionStorage.setItem(AuthenticationUtil.USER, user);
  }

  public static getUser(): string | undefined {
    const user = sessionStorage.getItem(AuthenticationUtil.USER);
    return user ? user : undefined;
  }

  public static setToken(token: string) {
    sessionStorage.setItem(AuthenticationUtil.USER_TOKEN, token);
  }

  public static getToken(): string | undefined {
    const token = sessionStorage.getItem(AuthenticationUtil.USER_TOKEN);
    return token ? token : undefined;
  }

  public static clear() {
    sessionStorage.removeItem(AuthenticationUtil.USER);
    sessionStorage.removeItem(AuthenticationUtil.USER_TOKEN);
  }
}
