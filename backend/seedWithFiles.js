import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import Teacher from "./models/teacher.model.js";
import Subject from "./models/subject.model.js";
import File from "./models/file.model.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const users = [
  { name: "Alice Sharma", email: "alice@gla.edu", password: "pass123" },
  { name: "Ravi Patel", email: "ravi@gla.edu", password: "pass123" },
  { name: "Karan Mehta", email: "karan@gla.edu", password: "pass123" },
  { name: "Divya Chauhan", email: "divya@gla.edu", password: "pass123" },
  { name: "Mehul Sinha", email: "mehul@gla.edu", password: "pass123" },
  { name: "Tanvi Gupta", email: "tanvi@gla.edu", password: "pass123" },
  { name: "Ankit Yadav", email: "ankit@gla.edu", password: "pass123" },
  { name: "Pooja Nair", email: "pooja@gla.edu", password: "pass123" },
  { name: "Vikas Tiwari", email: "vikas@gla.edu", password: "pass123" },
  { name: "Sneha Rathi", email: "sneha@gla.edu", password: "pass123" },
];

const teachers = [
  {
    name: "Dr. Neha Singh",
    email: "neha@gla.edu",
    password: "pass123",
    department: "Physics",
  },
  {
    name: "Mr. Aman Joshi",
    email: "aman@gla.edu",
    password: "pass123",
    department: "Maths",
  },
  {
    name: "Mrs. Renu Verma",
    email: "renu@gla.edu",
    password: "pass123",
    department: "Chemistry",
  },
  {
    name: "Dr. Suresh Rana",
    email: "suresh@gla.edu",
    password: "pass123",
    department: "Biology",
  },
  {
    name: "Ms. Priya Desai",
    email: "priya@gla.edu",
    password: "pass123",
    department: "English",
  },
];

// Subjects with topics and dummy files
const subjectsData = [
  {
    name: "Mathematics",
    subject_code: "MATH101",
    topics: [
      {
        name: "Calculus",
        description: "Introduction to differential and integral calculus",
        dummyFiles: [
          { name: "Calculus_Chapter1.pdf", mimetype: "application/pdf", size: 2048576 },
          { name: "Calculus_Exercises.pdf", mimetype: "application/pdf", size: 1536000 },
          { name: "Calculus_Notes.docx", mimetype: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", size: 512000 }
        ]
      },
      {
        name: "Linear Algebra",
        description: "Vectors, matrices, and linear transformations",
        dummyFiles: [
          { name: "Linear_Algebra_Notes.pdf", mimetype: "application/pdf", size: 3072000 },
          { name: "Matrix_Operations.pptx", mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation", size: 1024000 }
        ]
      },
      {
        name: "Statistics",
        description: "Probability and statistical analysis",
        dummyFiles: [
          { name: "Statistics_Handbook.pdf", mimetype: "application/pdf", size: 4096000 },
          { name: "Probability_Examples.xlsx", mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", size: 768000 }
        ]
      }
    ]
  },
  {
    name: "Physics",
    subject_code: "PHY101",
    topics: [
      {
        name: "Mechanics",
        description: "Classical mechanics and motion",
        dummyFiles: [
          { name: "Newton_Laws.pdf", mimetype: "application/pdf", size: 2560000 },
          { name: "Mechanics_Lab_Report.pdf", mimetype: "application/pdf", size: 1792000 },
          { name: "Motion_Simulation.mp4", mimetype: "video/mp4", size: 15728640 }
        ]
      },
      {
        name: "Electromagnetism",
        description: "Electric and magnetic fields",
        dummyFiles: [
          { name: "EM_Theory.pdf", mimetype: "application/pdf", size: 3584000 },
          { name: "Circuit_Diagrams.pptx", mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation", size: 2048000 }
        ]
      }
    ]
  },
  {
    name: "Chemistry",
    subject_code: "CHEM101",
    topics: [
      {
        name: "Organic Chemistry",
        description: "Carbon compounds and reactions",
        dummyFiles: [
          { name: "Organic_Reactions.pdf", mimetype: "application/pdf", size: 5120000 },
          { name: "Molecular_Structures.pptx", mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation", size: 3072000 },
          { name: "Lab_Safety_Guidelines.pdf", mimetype: "application/pdf", size: 1024000 }
        ]
      },
      {
        name: "Inorganic Chemistry",
        description: "Non-carbon compounds and reactions",
        dummyFiles: [
          { name: "Inorganic_Notes.pdf", mimetype: "application/pdf", size: 4096000 },
          { name: "Periodic_Table_Reference.pdf", mimetype: "application/pdf", size: 1536000 }
        ]
      }
    ]
  },
  {
    name: "Computer Science",
    subject_code: "CS101",
    topics: [
      {
        name: "Programming Fundamentals",
        description: "Introduction to programming concepts",
        dummyFiles: [
          { name: "Python_Basics.pdf", mimetype: "application/pdf", size: 3584000 },
          { name: "Code_Examples.zip", mimetype: "application/zip", size: 2048000 },
          { name: "Programming_Assignment.pdf", mimetype: "application/pdf", size: 1280000 }
        ]
      },
      {
        name: "Data Structures",
        description: "Arrays, linked lists, and trees",
        dummyFiles: [
          { name: "Data_Structures_Guide.pdf", mimetype: "application/pdf", size: 6144000 },
          { name: "Algorithm_Complexity.pdf", mimetype: "application/pdf", size: 2560000 }
        ]
      },
      {
        name: "Web Development",
        description: "HTML, CSS, and JavaScript",
        dummyFiles: [
          { name: "HTML_CSS_Tutorial.pdf", mimetype: "application/pdf", size: 4096000 },
          { name: "JavaScript_Examples.js", mimetype: "application/javascript", size: 512000 },
          { name: "Web_Project_Template.zip", mimetype: "application/zip", size: 3072000 }
        ]
      }
    ]
  },
  {
    name: "English Literature",
    subject_code: "ENG101",
    topics: [
      {
        name: "Shakespeare",
        description: "Works of William Shakespeare",
        dummyFiles: [
          { name: "Hamlet_Analysis.pdf", mimetype: "application/pdf", size: 2560000 },
          { name: "Macbeth_Summary.pdf", mimetype: "application/pdf", size: 1792000 },
          { name: "Shakespeare_Quotes.docx", mimetype: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", size: 768000 }
        ]
      },
      {
        name: "Modern Literature",
        description: "Contemporary literary works",
        dummyFiles: [
          { name: "Modern_Novels_List.pdf", mimetype: "application/pdf", size: 1536000 },
          { name: "Literary_Criticism.pdf", mimetype: "application/pdf", size: 3072000 }
        ]
      }
    ]
  }
];

try {
  console.log("🗑️ Clearing existing data...");
  await User.deleteMany({});
  await Teacher.deleteMany({});
  await Subject.deleteMany({});
  await File.deleteMany({});

  console.log("👥 Creating users...");
  const insertedUsers = [];
  for (const u of users) {
    const user = new User(u);
    await user.save();
    insertedUsers.push(user);
  }

  console.log("👨‍🏫 Creating teachers...");
  const insertedTeachers = [];
  for (const t of teachers) {
    const teacher = new Teacher(t);
    await teacher.save();
    insertedTeachers.push(teacher);
  }

  console.log("📚 Creating subjects with topics and files...");
  const createdSubjects = [];
  
  for (const subjectData of subjectsData) {
    // Create subject
    const subject = new Subject({
      name: subjectData.name,
      subject_code: subjectData.subject_code,
      created_by: insertedTeachers[0]._id, // Assign to first teacher
      created_by_role: "Teacher"
    });

    // Add topics to subject
    for (const topicData of subjectData.topics) {
      const topic = {
        name: topicData.name,
        description: topicData.description,
        files: []
      };
      
      // Create dummy files for this topic
      for (const fileData of topicData.dummyFiles) {
        try {
          // Create file record in database (without actual Google Drive upload)
          const file = new File({
            name: fileData.name,
            mimetype: fileData.mimetype,
            size: fileData.size,
            drive_file_id: `dummy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            drive_file_url: `https://drive.google.com/file/d/dummy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}/view`,
            uploaded_by: insertedTeachers[0]._id,
            uploaded_by_role: "Teacher",
            linked_subject: subject._id
          });
          
          await file.save();
          
          // Add file ID to topic
          topic.files.push(file._id);
          
          console.log(`✅ Created file: ${fileData.name} for topic: ${topicData.name}`);
        } catch (error) {
          console.error(`❌ Error creating file ${fileData.name}:`, error.message);
        }
      }
      
      // Add topic to subject
      subject.topics.push(topic);
    }
    
    await subject.save();
    createdSubjects.push(subject);
    console.log(`✅ Created subject: ${subjectData.name} with ${subjectData.topics.length} topics`);
  }

  console.log("\n🎉 Seeding completed successfully!");
  console.log(`✔️ Users: ${insertedUsers.length}`);
  console.log(`✔️ Teachers: ${insertedTeachers.length}`);
  console.log(`✔️ Subjects: ${createdSubjects.length}`);
  
  // Count total files
  const totalFiles = await File.countDocuments();
  console.log(`✔️ Total Files: ${totalFiles}`);

} catch (err) {
  console.error("❌ Seeding failed:", err);
} finally {
  await mongoose.disconnect();
  console.log("🔌 Disconnected from database");
} 