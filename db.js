const mongoose = require('mongoose');

module.exports=()=>{
    const connectionParams= {
        userNewUrlParser:true,
        useUnifiedTopology:true,
    }
    try {
        mongoose.connect(process.env.DB_URL);
        console.log(`Mongoose Database Connected in System`);
    } catch (error) {
        console.log(`Unable to connect to Mongoose Database in System`)
        console.log(error)
    }
}