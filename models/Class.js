import mongoose from "mongoose";

const classSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    studentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Class", classSchema);
