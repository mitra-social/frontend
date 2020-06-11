import Cookies from "js-cookie";

export class AuthenticationUtil {
  private static readonly USER = "user";
  private static readonly USER_TOKEN = "user-token";

  // Attributes for cookies
  private static readonly ATTRS = {
    expires: 1,
    secure: true,
    samesite: "lax",
  };

  public static setAuth(user: string, token: string) {
    AuthenticationUtil.setUser(user);
    AuthenticationUtil.setToken(token);
  }

  public static setUser(user: string) {
    Cookies.set(AuthenticationUtil.USER, user, AuthenticationUtil.ATTRS);
  }

  public static getUser(): string | undefined {
    const user = Cookies.get(AuthenticationUtil.USER);
    return user ? user : undefined;
  }

  public static setToken(token: string) {
    Cookies.set(AuthenticationUtil.USER_TOKEN, token, AuthenticationUtil.ATTRS);
  }

  public static getToken(): string | undefined {
    const token = Cookies.get(AuthenticationUtil.USER_TOKEN);
    return token ? token : undefined;
  }

  public static clear() {
    Cookies.remove(AuthenticationUtil.USER);
    Cookies.remove(AuthenticationUtil.USER_TOKEN);
  }
}
