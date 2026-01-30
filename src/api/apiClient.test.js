import { describe, test, expect, vi, beforeEach } from 'vitest';
import { apiFetch } from './apiClient';

describe('apiFetch (apiClient.js)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.fetch = vi.fn();
  });

  test('sends request with credentials/include and JSON body', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ ok: true }),
      text: async () => '',
    });

    const payload = await apiFetch('/ping', {
      method: 'POST',
      body: { a: 1 },
      headers: { 'X-Test': '1' },
    });

    expect(payload).toEqual({ ok: true });

    const [url, options] = fetch.mock.calls[0];
    expect(url).toBe('http://localhost:3001/ping');
    expect(options.credentials).toBe('include');
    expect(options.headers['Content-Type']).toBe('application/json');
    expect(options.headers['X-Test']).toBe('1');
    expect(options.body).toBe(JSON.stringify({ a: 1 }));
  });

  test('returns text when response is not JSON', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'text/plain' }),
      json: async () => {
        throw new Error('should not be called');
      },
      text: async () => 'hello',
    });

    const payload = await apiFetch('/health');
    expect(payload).toBe('hello');
  });

  test('throws Error with message from { error } JSON payload when !ok', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ error: 'Unauthorized' }),
      text: async () => '',
    });

    await expect(apiFetch('/auth/me')).rejects.toMatchObject({
      message: 'Unauthorized',
      status: 401,
      payload: { error: 'Unauthorized' },
    });
  });

  test('throws Error with default message when !ok and payload is text', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      headers: new Headers({ 'content-type': 'text/plain' }),
      json: async () => {
        throw new Error('should not be called');
      },
      text: async () => 'server exploded',
    });

    await expect(apiFetch('/x')).rejects.toMatchObject({
      message: 'HTTP 500',
      status: 500,
      payload: 'server exploded',
    });
  });
});
