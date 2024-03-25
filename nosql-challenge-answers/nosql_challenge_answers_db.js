
// creating Collections and indexes 
db.createCollection("users");
db.users.createIndex({ email: 1 }, { unique: true });

db.createCollection("products");
db.createCollection("transactions");
// Inserting Sample Data 

db.users.insertMany([
{ name: "Alice Smith", email: "alice@gmail.com", password: "password1" },
{ name: "Bob Johnson", email: "bob@gmail.com", password: "password2" }
]);

//  Products 
db.products.insertMany([
{ name: "MacBook Pro", description: "16-inch MacBook Pro", price: 2399, userId: db.users.findOne({ email: "alice@gmail.com" })._id },
{ name: "iPhone 12", description: "iPhone 12 Pro Max", price: 1099, userId: db.users.findOne({ email: "bob@gmail.com" })._id }
]);

//  Transactions 
db.transactions.insertMany([
{ buyerId: db.users.findOne({ email: "alice@gmail.com" })._id, productId: db.products.findOne({ name: "iPhone 12" })._id, date: new Date(), quantity: 1 }
]);
//  products listed by a specific user
db.products.find({ userId: db.users.findOne({ email: "alice@gmail.com" })._id });
//   total amount spent by a user 
db.transactions.aggregate([
{ $match: { buyerId: db.users.findOne({ email: "alice@gmail.com" })._id } },
{ $lookup: { from: "products", localField: "productId", foreignField: "_id", as: "productDetails" } },
{ $unwind: "$productDetails" },
{ $group: { _id: null, totalAmountSpent: { $sum: "$productDetails.price" } } }
]);
//  top 5 most popular products 
db.transactions.aggregate([
{ $group: { _id: "$productId", count: { $sum: 1 } } },
{ $sort: { count: -1 } },
{ $limit: 5 },
{ $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "productInfo" } },
{ $unwind: "$productInfo" },
{ $project: { productName: "$productInfo.name", transactionsCount: "$count" } }
]);
