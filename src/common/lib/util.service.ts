import { Injectable } from '@nestjs/common'

@Injectable()
export class UtilService {
  static armarQueryParams(datos: any) {
    return Object.keys(datos)
      .map((dato) => `"${dato}":"${datos[dato]}"`)
      .join(', ')
  }

  static buildStatusCheck(items = {}) {
    const values = Object.keys(items).map((k) => items[k])
    if (values.length === 0) throw new Error('estado no definido')
    const result = `_estado in ('${values.join(`','`)}')`
    return result
  }
}
