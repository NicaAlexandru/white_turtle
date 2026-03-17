import { formatTimeSlot, expandDays } from '../../utils/format';

describe('formatTimeSlot', () => {
  it('formats days, start and end into a readable string', () => {
    expect(formatTimeSlot('MWF', '08:00', '09:00')).toBe('MWF 08:00-09:00');
  });

  it('handles two-day schedules', () => {
    expect(formatTimeSlot('TTH', '10:00', '11:30')).toBe('TTH 10:00-11:30');
  });
});

describe('expandDays', () => {
  it('expands MWF to individual day keys', () => {
    expect(expandDays('MWF')).toEqual(['M', 'W', 'F']);
  });

  it('expands TTH converting TH to H for Thursday', () => {
    expect(expandDays('TTH')).toEqual(['T', 'H']);
  });

  it('handles single day', () => {
    expect(expandDays('M')).toEqual(['M']);
  });

  it('handles lowercase input', () => {
    expect(expandDays('mwf')).toEqual(['M', 'W', 'F']);
  });

  it('handles MTWF (four days)', () => {
    expect(expandDays('MTWF')).toEqual(['M', 'T', 'W', 'F']);
  });

  it('handles MWTHF with Thursday notation', () => {
    expect(expandDays('MWTHF')).toEqual(['M', 'W', 'H', 'F']);
  });
});
