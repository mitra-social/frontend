export class ObjectHelper {
  public static hasProperty(obj: object, property: string): boolean {
    try {
      return property in obj;
    } catch (err) {
      return false;
    }
  }
}
