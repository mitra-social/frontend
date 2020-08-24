import Cookies from "js-cookie";

import { AuthenticationUtil } from "@/utils/authentication-util";

describe("@/utils/authentication-util", () => {
  const mockSet = jest.fn();
  const mockRemove = jest.fn();

  beforeEach(() => {
    Cookies.set = mockSet;
    Cookies.remove = mockRemove;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Check whether the setting of cookies is called twice when the auth is set", () => {
    AuthenticationUtil.setAuth(
      "john.doe",
      "5XWdjcQ5n7xqf3G91TjD23EbQzrc-PPu5Xa-D5lNnB9KHLi"
    );

    expect(mockSet).toHaveBeenCalledTimes(2);
  });

  it("Check whether the setting of cookies is called once when the user is set", () => {
    AuthenticationUtil.setUser("john.doe");

    expect(mockSet).toHaveBeenCalledTimes(1);
  });

  it("Check whether the setting of cookies is called once when the token is set", () => {
    AuthenticationUtil.setToken(
      "5XWdjcQ5n7xqf3G91TjD23EbQzrc-PPu5Xa-D5lNnB9KHLi"
    );

    expect(mockSet).toHaveBeenCalledTimes(1);
  });

  it("We got the correct user from the cookie", () => {
    const user = "john.doe";
    jest.spyOn(AuthenticationUtil, "getUser").mockReturnValue(user);

    expect(AuthenticationUtil.getUser()).toBe(user);
  });

  it("We got the correct token from the cookie", () => {
    const token = "5XWdjcQ5n7xqf3G91TjD23EbQzrc-PPu5Xa-D5lNnB9KHLi";
    jest.spyOn(AuthenticationUtil, "getToken").mockReturnValue(token);

    expect(AuthenticationUtil.getToken()).toBe(token);
  });

  it("We got the correct token from the cookie", () => {
    const token = "5XWdjcQ5n7xqf3G91TjD23EbQzrc-PPu5Xa-D5lNnB9KHLi";
    jest.spyOn(AuthenticationUtil, "getToken").mockReturnValue(token);

    expect(AuthenticationUtil.getToken()).toBe(token);
  });

  it("Check whether the remove of cookies is called twice when clear authentications", () => {
    AuthenticationUtil.clear();

    expect(mockRemove).toHaveBeenCalledTimes(2);
  });
});
