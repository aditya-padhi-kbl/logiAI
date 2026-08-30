export class Base {
  getUUID() {
    return Bun.randomUUIDv7();
  }
}
