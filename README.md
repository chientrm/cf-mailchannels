# cf-mailchannels

This worker let you send email via MailChannels from Cloudflare Workers.

## Setup

1. Fork this repo
2. Clone to your workspace
3. Setup [Cloudflare DMARC Management](https://developers.cloudflare.com/dmarc-management/) for your domain name.
4. Set `DKIM_PRIVATE_KEY` secret:

```bash
npx wrangler secret put DKIM_PRIVATE_KEY
```

5. Deploy:

```bash
npm run deploy
```

## How to use

1. Bind this worker to another Workers or Pages with name `MAIL` or anything.
2. To send email

```ts
const sendMail = (
	fetcher: Fetcher,
	body: {
		from: { name: string; email: string };
		to: { name: string; email: string }[];
		dkim_domain: string;
		subject: string;
		content: { type: 'text/plain' | 'text/html'; value: string }[];
	}
) =>
	fetcher.fetch('http://whatever.fake/send', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});

// Example usage
waitUntil(
	sendMail(platform.env.MAIL, {
		dkim_domain: '<your-domain-name>',
		from: { name: '<sender-name>', email: 'noreply@<your-domain-name>' },
		to: [{ name: email.split('@')[0], email }],
		subject: 'Hello World!',
		content: [{ type: 'text/html', value: 'Hello World!' }],
	})
);
```
