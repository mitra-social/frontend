import Cookies from "js-cookie";

export class AuthenticationUtil {
  private static readonly EXPIRATION_IN_DAYS = 1;
  private static readonly USER = "user";
  private static readonly USER_TOKEN = "user-token";

  /**********************
   * Attributes for cookiess
   **********************/
  private static readonly ATTRS_FOR_PRODUCTION = {
    expires: AuthenticationUtil.EXPIRATION_IN_DAYS,
    samesite: "lax",
    secure: true,
  };

  private static readonly ATTRS_FOR_MOCK = {
    expires: AuthenticationUtil.EXPIRATION_IN_DAYS,
  };

  private static readonly ATTRS =
    process.env.NODE_ENV === "development"
      ? AuthenticationUtil.ATTRS_FOR_MOCK
      : AuthenticationUtil.ATTRS_FOR_PRODUCTION;

  public static setAuth(user: string, token: string) {
    AuthenticationUtil.setUser(user);
    AuthenticationUtil.setToken(token);
  }

  public static clear() {
    Cookies.remove(AuthenticationUtil.USER);
    Cookies.remove(AuthenticationUtil.USER_TOKEN);
  }

  public static getToken(): string | undefined {
    const token = Cookies.get(AuthenticationUtil.USER_TOKEN);
    return token ? token : undefined;
  }

  public static setToken(token: string) {
    Cookies.set(AuthenticationUtil.USER_TOKEN, token, AuthenticationUtil.ATTRS);
  }

  public static getUser(): string | undefined {
    const user = Cookies.get(AuthenticationUtil.USER);
    return user ? user : undefined;
  }

  public static setUser(user: string) {
    Cookies.set(AuthenticationUtil.USER, user, AuthenticationUtil.ATTRS);
  }
}
