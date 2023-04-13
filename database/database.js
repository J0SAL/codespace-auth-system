const mongoose = require("mongoose")

const MONGODB_URL = process.env.MONGO_URI
console.log(MONGODB_URL)

exports.connect = () => {
    mongoose.connect(MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then((res) => console.log("Database connected!"))
    .catch((error) => {
        console.log(`DB connection FAILED`);
        console.log(error);
        process.exit(1)
    })
}