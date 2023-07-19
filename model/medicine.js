const mongoose = require('mongoose');
const MeidicineSchema = new mongoose.Schema(
    {
        name             : {type :String, required:true},
        unit             : {type: Number, required:true},
        typeMedicineIds  : {type: [String], required:true},
        price            : {type: Number, required:true},
    },
    {timestamps:true}
) 

module.exports = mongoose.model("medicine",MeidicineSchema);