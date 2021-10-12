const mongoose = require('mongoose')

const examSchema = new mongoose.Schema({
    user_id : {
        type: mongoose.Types.ObjectId,
        required: true,

    },
    exam_name: {
        type: String,
        unique: true,
        required: true,
        
    },
    exam_status: {
        type: Boolean,
        required: true,
        
        
    },
    is_deleted : {
        type: Boolean,
        required: true,

    },
    created_date : {
        type: Date,
        required: true,

    },
    exam_date: {
        type: Date,
        required: true,
        
        
    }
}, {
    timestamps: true
})

const exam = mongoose.model('exams', examSchema)

module.exports = exam