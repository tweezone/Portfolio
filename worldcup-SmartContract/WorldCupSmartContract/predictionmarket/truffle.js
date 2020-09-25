// Allows us to use ES6 in our migrations and tests.
require('babel-register');

module.exports = {
	networks: {
		devnet: {
			host: 'eth-dev2.eastus.cloudapp.azure.com',
			port: 10285,
			network_id: '52812', // Match any network id
			from: '0xcdd8857c0aee2285d024657c82c29115f4d905ee',
			gasPrice: 1,
		},
		ganache: {
			host: '127.0.0.1',
			port: 7545,
			network_id: '*', // Match any network id
			from: '0x9Dc8E0BaF6Ce5719AC72d536A3E29e19dE19C153',
		},
	},
};
