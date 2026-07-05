const mongo=require("mongoose")
const postSchema=mongo.Schema({
    title:{
        type:String,
        require:true,
        unique:true
    },
    content:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default:Date.now()
    },
    createdBy:{
        type:mongo.Schema.Types.ObjectId,
        ref:"User"
    },
    comments:[
        {
            content:{
                type:String,
                require:true
            },
            writtenBy:{
                 type:mongo.Schema.Types.ObjectId,
                 ref:"User"
            },
            writtenAt:{
                type:Date,
                default:Date.now()
            }
        }
    ]

})
let post=mongo.model("Post",postSchema)
module.exports=post