module.exports = function () {
	switch (process.env.NODE_ENV) {
		case 'production':
			return {
				db_address: 'localhost',
				db_name: 'dreamshare',
				port: 3000
			};
		case 'development':
			return {
				db_address: 'localhost',
				db_name: 'devdreamshare',
				port: 3001
			};
		case 'test':
			return {
				db_address: 'mongo',
				db_name: 'testdreamshare',
				port: 3002
			};
		default:
			return {};
	}
};