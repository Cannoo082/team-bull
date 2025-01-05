import { validateEmail, formatString } from '@/helpers/functions/util';

describe('Utility Functions', () => {

  it('should return true for valid email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  it('should return false for invalid email', () => {
    expect(validateEmail('invalid-email')).toBe(false);
  });

  it('should format PascalCase string correctly', () => {
    expect(formatString('PascalCase')).toBe('Pascal case'); 
  });  

  it('should format string with underscores correctly', () => {
    expect(formatString('hello_world', ['_'])).toBe('Hello World');
  });

  it('should handle empty string gracefully', () => {
    expect(formatString('')).toBe('');
  });
});
