import { describe, expect, it } from 'vitest';
import { isUpcoming, normalizeWorkStock, workAvailability } from '../utils/format';
import { validateForm, validatePassword } from '../utils/validators';

describe('stock y disponibilidad', () => {
  it('stock 0 en una obra en venta figura como agotada y no se puede comprar', () => {
    const av = workAvailability({ for_sale: true, stock: 0, status: 'disponible' });
    expect(av.key).toBe('agotada');
    expect(av.canBuy).toBe(false);
  });
  it('con stock disponible se puede consultar la compra', () => {
    expect(workAvailability({ for_sale: true, stock: 2, status: 'disponible' }).canBuy).toBe(true);
  });
  it('vendida y no disponible nunca admiten compra', () => {
    expect(workAvailability({ for_sale: true, stock: 5, status: 'vendida' }).canBuy).toBe(false);
    expect(workAvailability({ for_sale: true, stock: 5, status: 'no_disponible' }).canBuy).toBe(false);
  });
  it('el stock nunca es negativo ni decimal', () => {
    expect(normalizeWorkStock({ stock: -3 }).stock).toBe(0);
    expect(normalizeWorkStock({ stock: 2.9 }).stock).toBe(2);
  });
});

describe('agenda', () => {
  const now = new Date(2026, 9, 25);
  it('distingue próximos de finalizados', () => {
    expect(isUpcoming({ event_date: '2026-12-15' }, now)).toBe(true);
    expect(isUpcoming({ event_date: '2026-10-25' }, now)).toBe(true);
    expect(isUpcoming({ event_date: '2026-04-10' }, now)).toBe(false);
  });
  it('funciona dentro de Array.filter (el 2.º argumento es el índice)', () => {
    const list = [{ event_date: '2999-01-01' }, { event_date: '2000-01-01' }];
    expect(list.filter(isUpcoming)).toHaveLength(1);
  });
});

describe('validaciones', () => {
  it('exige contraseña de 8+ caracteres con letras y números', () => {
    expect(validatePassword('abc')).not.toBe('');
    expect(validatePassword('sololetras')).not.toBe('');
    expect(validatePassword('Arte2026x')).toBe('');
  });
  it('campos obligatorios y número entero', () => {
    const fields = [
      { name: 'title', label: 'Título', required: true },
      { name: 'stock', label: 'Stock', type: 'number', integer: true, min: 0 },
    ];
    expect(Object.keys(validateForm(fields, { title: '', stock: '1.5' }))).toEqual(['title', 'stock']);
    expect(validateForm(fields, { title: 'Obra', stock: '3' })).toEqual({});
  });
});
