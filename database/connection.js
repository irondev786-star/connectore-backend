const mongo=require("mongoose")
const config=require("config")
const url=config.get("mongoUrl")

module.exports=()=>{
    mongo.connect(url).then(()=>{console.log("Database connected successfully")}).catch((err)=>{console.log(err)})

}