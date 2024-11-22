import mongoose from "mongoose";

const studentSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    profileImageUrl: { type: String },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
