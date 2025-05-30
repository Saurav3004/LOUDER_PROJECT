import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    title: String,
    date:String,
    link:String,
    location:String,
    image:String,
    price:String
},{timestamps:true})

export const Event =  mongoose.model("Event",EventSchema)