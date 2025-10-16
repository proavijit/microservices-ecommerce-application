import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { configureRoutes } from './utils';
import getPort from 'get-port';

dotenv.config();

const app = express();

// security middleware
app.use(helmet());

// Rate limiting middleware
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
	handler: (_req, res) => {
		res
			.status(429)
			.json({ message: 'Too many requests, please try again later.' });
	},
});
app.use('/api', limiter);

// request logger
app.use(morgan('dev'));
app.use(express.json());

// TODO: Auth middleware

// routes
configureRoutes(app);

// health check
app.get('/health', (_req, res) => {
	res.json({ message: 'API Gateway is running' });
});

// 404 handler
app.use((_req, res) => {
	res.status(404).json({ message: 'Not Found' });
});

// error handler
app.use((err, _req, res, _next) => {
	console.error(err.stack);
	res.status(500).json({ message: 'Internal Server Error' });
});

const envPort = process.env.PORT ? Number(process.env.PORT) : undefined;

// Start server with dynamic port selection and graceful shutdown
(async () => {
	const port = envPort ?? (await getPort({ port: 8090 }));
	const server = app.listen(port, () => {
		console.log(`API Gateway is running on port ${port}`);
	});

	const shutdown = () => {
		server.close(() => process.exit(0));
	};

	process.on('SIGINT', shutdown);
	process.on('SIGTERM', shutdown);
})().catch((err) => {
	console.error(err);
	process.exit(1);
});
