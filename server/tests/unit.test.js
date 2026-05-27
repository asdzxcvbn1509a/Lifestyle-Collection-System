import { describe, it, expect } from 'vitest';
import { signToken, verifyToken } from '../src/lib/jwt.js';
import { hashPassword, comparePassword } from '../src/lib/hash.js';
import { publicUser } from '../src/lib/serialize.js';
import { DEFAULT_SETTINGS } from '../src/lib/settings.js';
import { emptyToUndefined } from '../src/lib/zodHelpers.js';

describe('jwt', () => {
  it('signs and verifies a payload', () => {
    const token = signToken({ sub: 42, role: 'USER' });
    const payload = verifyToken(token);
    expect(payload.sub).toBe(42);
    expect(payload.role).toBe('USER');
  });
});

describe('hash', () => {
  it('hashes and verifies passwords', async () => {
    const hash = await hashPassword('secret123');
    expect(hash).not.toBe('secret123');
    expect(await comparePassword('secret123', hash)).toBe(true);
    expect(await comparePassword('wrong', hash)).toBe(false);
  });
});

describe('serialize.publicUser', () => {
  it('strips passwordHash', () => {
    const u = publicUser({ id: 1, email: 'a@b.c', passwordHash: 'x', role: 'USER' });
    expect(u.passwordHash).toBeUndefined();
    expect(u.email).toBe('a@b.c');
  });
  it('returns null for null input', () => {
    expect(publicUser(null)).toBeNull();
  });
});

describe('settings defaults', () => {
  it('exposes the expected keys', () => {
    expect(Object.keys(DEFAULT_SETTINGS).sort()).toEqual([
      'allowRegistration',
      'maintenanceMode',
      'siteName',
    ]);
  });
});

describe('zodHelpers.emptyToUndefined', () => {
  it('maps empty string / undefined to undefined, keeps other values', () => {
    expect(emptyToUndefined('')).toBeUndefined();
    expect(emptyToUndefined(undefined)).toBeUndefined();
    expect(emptyToUndefined('x')).toBe('x');
    expect(emptyToUndefined('0')).toBe('0');
  });
});
