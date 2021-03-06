"use strict";

const db = require("../server/db");
const {User} = require("../server/db/models");
const {Transaction} = require("../server/db/models");
async function seed() {
	await db.sync({force: true});
	console.log("db synced!");
	const users = await Promise.all([
		User.create({email: "cody@email.com",
			password: "Ab123456*",
			firstName: "Cody",
			lastName: "Pickles"}),
		User.create({email: "murphy@email.com", 
			password: "Bc123456*",
			firstName: "John",
			lastName: "Murphy"
		}),
		User.create({
			email: "tom@email.com",
			password: "Cd123456*",
			admin: true,
			username: "thomas",
			firstName: "tom",
			lastName: "smih",
			apt: "2",
			street: "Main st",
			houseNumber: "111",
			zipcode: "11111",
			state: "NY"
		})
		
	]);
	const transactions = await Promise.all([
		Transaction.create({
			ticker: "TSLA",
			priceAtTransaction: 800.03,
			quantity: 20,
			userId: 1,
		}),
		Transaction.create({
			ticker: "AMZN",
			priceAtTransaction: 2134.87,
			quantity: 500,
			userId: 1,
		}),
		Transaction.create({
			ticker: "IBM",
			priceAtTransaction: 150.7,
			quantity: 50,
			userId: 1,
			sold: true,
		}),
		Transaction.create({
			ticker: "ORCL",
			priceAtTransaction: 55.47,
			quantity: 150,
			userId: 3,
		})
	])
	console.log(`seeded ${transactions.length} transactions`)
	console.log(`seeded ${users.length} users`);
	console.log(`seeded successfully`);
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
	console.log("seeding...");
	try {
		await seed();
	} catch (err) {
		console.error(err);
		process.exitCode = 1;
	} finally {
		console.log("closing db connection");
		await db.close();
		console.log("db connection closed");
	}
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
	runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
