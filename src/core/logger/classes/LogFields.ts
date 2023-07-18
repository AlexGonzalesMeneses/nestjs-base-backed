// Son los campos que se indexarán en loki
export class LogFields {
  readonly __FIELD__ = true
  args: { [key: string]: string | number | boolean }

  constructor(obj: { [key: string]: string | number | boolean }) {
    this.args = Object.assign({}, obj)
  }
}
