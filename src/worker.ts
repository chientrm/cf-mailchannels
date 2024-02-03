import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

const app = new Hono<{ Bindings: { DKIM_PRIVATE_KEY: string } }>();

app.post(
	'/send',
	zValidator(
		'json',
		z.object({
			to: z.array(z.object({ name: z.string(), email: z.string().email() })),
			from: z.object({ name: z.string(), email: z.string().email() }),
			dkim_domain: z.string(),
			subject: z.string(),
			content: z.array(z.object({ type: z.string(), value: z.string() })),
		})
	),
	async (c) => {
		const { to, from, dkim_domain, subject, content } = c.req.valid('json');
		return fetch('https://api.mailchannels.net/tx/v1/send', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				personalizations: [
					{
						to,
						dkim_domain,
						dkim_selector: 'mailchannels',
						dkim_private_key: c.env.DKIM_PRIVATE_KEY,
					},
				],
				from,
				subject,
				content,
			}),
		});
	}
);

export default app;
