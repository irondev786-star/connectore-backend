const mongo=require("mongoose")
const userSchema=mongo.Schema({
    fullName:{
        type:String,
        require:true,
        unique:true
    },
    email:{
        type:String,
        require:true,
        unique:true,
        lowercase: true,
        trim: true,
    },
    password:{
        type:String,
        require:true
    },
    dateCreated:{
        type:Date,
        default:Date.now()
    },
    posts:[{
        type:mongo.Schema.Types.ObjectId,
        ref:"Posts"
    }]
})
let user=mongo.model("User",userSchema)

module.exports=user