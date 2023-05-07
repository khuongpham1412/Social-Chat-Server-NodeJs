const mongoose = require('mongoose');

async function connect() {
    try {
        mongoose.connect(process.env.MONGODB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
        });
        console.log("Successfully");
    } catch (error) {
        console.log("Fails");
    }
}
module.exports = { connect };