import { isNroDoc } from './is-nro-doc.validator';
describe('isNroDoc validator', () => {
  it('Deberia retornar false para entradas undefined o null', () => {
    expect(isNroDoc(undefined)).toBe(false);
    expect(isNroDoc(null)).toBe(false);
  });

  it('Deberia retornar false para entradas con longitud < 4 y > 10', () => {
    expect(isNroDoc('123')).toBe(false);
    expect(isNroDoc('123456789012')).toBe(false);
  });

  it('Deberia retornar true para entradas con formato extranjero', () => {
    expect(isNroDoc('E-12345')).toBe(true);
    expect(isNroDoc('e-12345')).toBe(true);
  });

  it('Deberia retornar false para entradas con formato extranjero cuando se deshabilita la validación', () => {
    expect(isNroDoc('E-12345', { extranjero: false })).toBe(false);
    expect(isNroDoc('e-12345', { extranjero: false })).toBe(false);
  });

  it('Deberia retornar true para entradas con formato con complemento', () => {
    expect(isNroDoc('12345-11')).toBe(true);
    expect(isNroDoc('12345-1A')).toBe(true);
    expect(isNroDoc('12345-AA')).toBe(true);
    expect(isNroDoc('12345-A1')).toBe(true);
  });

  it('Deberia retornar false para entradas con formato con complemento cuando se deshabilita la validacion', () => {
    expect(isNroDoc('12345-11', { complemento: false })).toBe(false);
    expect(isNroDoc('12345-1A', { complemento: false })).toBe(false);
    expect(isNroDoc('12345-AA', { complemento: false })).toBe(false);
    expect(isNroDoc('12345-A1', { complemento: false })).toBe(false);
  });
});
