const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
	host: process.env.DB_HOST,
	dialect: process.env.DB_DIALECT,
	port: process.env.DB_PORT,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	logging: console.log,
});

(async () => {
	try {
		await sequelize.authenticate();
		console.log('Database connected successfully');
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
})();

module.exports = sequelize;
