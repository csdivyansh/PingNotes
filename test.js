import "./db.js";
import Teacher from "./models/teacher.model.js";

const test = () => {
  const teacher = new Teacher({
    name: "teacher1",
    email: "teacher1@example.com",
    password: "123456",
    department: "Mathematics",
  });

  teacher.save();
  console.log("Teacher created:", teacher);
};

test();
