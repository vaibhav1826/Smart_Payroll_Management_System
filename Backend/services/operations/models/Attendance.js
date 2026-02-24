const mongoose = require('mongoose');
const attendanceSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent', 'halfDay', 'leave', 'holiday'], default: 'present' },
    checkIn: { type: Date },
    checkOut: { type: Date },
    shift: { type: mongoose.Schema.Types.ObjectId, ref: 'Shift' },
    overtime: { type: Number, default: 0 }, // hours
    notes: { type: String, default: '' },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });
module.exports = mongoose.model('Attendance', attendanceSchema);
