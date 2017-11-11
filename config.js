module.exports = function () {
	switch (process.env.NODE_ENV) {
		case 'production':
			return {
				db_address: 'localhost',
				port: 3000
			};
		case 'development':
			return {
				db_address: 'localhost',
				port: 3001
			};
		case 'test':
			return {
				db_address: 'mongo',
				port: 3002
			};
		default:
			return {};
	}
};