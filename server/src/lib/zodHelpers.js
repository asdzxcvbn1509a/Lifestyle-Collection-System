import { z } from 'zod';

// Treat empty strings (common from multipart forms / query strings) as "not provided".
export const emptyToUndefined = (v) => (v === '' || v === undefined ? undefined : v);

// Reusable route param: numeric :id.
export const idParam = z.object({ id: z.coerce.number().int().positive() });
