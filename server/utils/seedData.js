const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Course = require('../models/Course');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Result = require('../models/Result');

dotenv.config({ path: __dirname + '/../.env' });

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus_connect';
    await mongoose.connect(mongoUri);
    console.log('[Seed]: Connected to MongoDB...');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Attendance.deleteMany({});
    await Assignment.deleteMany({});
    await Submission.deleteMany({});
    await Result.deleteMany({});
    console.log('[Seed]: Cleared existing collections.');

    // 1. Create Users
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@campusconnect.com',
      password: 'password123',
      role: 'admin',
      department: 'Administration',
      phone: '+1 555-0199',
    });

    const teacher1 = await User.create({
      name: 'Dr. Sarah Smith',
      email: 'sarah.smith@campusconnect.com',
      password: 'password123',
      role: 'teacher',
      department: 'Computer Science',
      phone: '+1 555-0123',
    });

    const teacher2 = await User.create({
      name: 'Prof. Alan Turing',
      email: 'alan.turing@campusconnect.com',
      password: 'password123',
      role: 'teacher',
      department: 'Mathematics',
      phone: '+1 555-0144',
    });

    const student1 = await User.create({
      name: 'Alex Johnson',
      email: 'alex.johnson@campusconnect.com',
      password: 'password123',
      role: 'student',
      department: 'Computer Science',
      rollNumber: 'CS2026-001',
      phone: '+1 555-0188',
    });

    const student2 = await User.create({
      name: 'Priya Patel',
      email: 'priya.patel@campusconnect.com',
      password: 'password123',
      role: 'student',
      department: 'Computer Science',
      rollNumber: 'CS2026-002',
      phone: '+1 555-0189',
    });

    const student3 = await User.create({
      name: 'Marcus Chen',
      email: 'marcus.chen@campusconnect.com',
      password: 'password123',
      role: 'student',
      department: 'Computer Science',
      rollNumber: 'CS2026-003',
      phone: '+1 555-0190',
    });

    console.log('[Seed]: Created Admin, Teachers, and Students.');

    // 2. Create Courses
    const course1 = await Course.create({
      code: 'CS101',
      title: 'Introduction to Computer Science',
      department: 'Computer Science',
      semester: 1,
      credits: 4,
      description: 'Foundations of algorithms, problem solving, and Python programming.',
      teacher: teacher1._id,
    });

    const course2 = await Course.create({
      code: 'CS201',
      title: 'Data Structures and Algorithms',
      department: 'Computer Science',
      semester: 3,
      credits: 4,
      description: 'Trees, Graphs, Sorting algorithms, and asymptotic complexity.',
      teacher: teacher1._id,
    });

    const course3 = await Course.create({
      code: 'MATH105',
      title: 'Discrete Mathematics',
      department: 'Mathematics',
      semester: 2,
      credits: 3,
      description: 'Logic, Set theory, Combinatorics, and Graph theory fundamentals.',
      teacher: teacher2._id,
    });

    console.log('[Seed]: Created Courses.');

    // 3. Create Sample Attendance records
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    await Attendance.create([
      {
        course: course1._id,
        student: student1._id,
        teacher: teacher1._id,
        date: today,
        status: 'Present',
        remarks: 'On time',
      },
      {
        course: course1._id,
        student: student2._id,
        teacher: teacher1._id,
        date: today,
        status: 'Present',
        remarks: 'Active participant',
      },
      {
        course: course1._id,
        student: student3._id,
        teacher: teacher1._id,
        date: today,
        status: 'Late',
        remarks: '10 mins late',
      },
      {
        course: course1._id,
        student: student1._id,
        teacher: teacher1._id,
        date: yesterday,
        status: 'Present',
      },
      {
        course: course1._id,
        student: student2._id,
        teacher: teacher1._id,
        date: yesterday,
        status: 'Absent',
        remarks: 'Medical leave',
      },
    ]);

    console.log('[Seed]: Created Attendance records.');

    // 4. Create Sample Assignments
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const assignment1 = await Assignment.create({
      title: 'Assignment 1: Binary Search Tree Implementation',
      description: 'Implement an AVL and BST in C++ with search, insertion, and deletion operations.',
      course: course2._id,
      teacher: teacher1._id,
      dueDate: nextWeek,
      maxMarks: 100,
    });

    const assignment2 = await Assignment.create({
      title: 'Assignment 2: Propositional Logic Proofs',
      description: 'Complete problem sets 1 through 5 on Truth Tables and First-order predicate logic.',
      course: course3._id,
      teacher: teacher2._id,
      dueDate: nextWeek,
      maxMarks: 50,
    });

    console.log('[Seed]: Created Assignments.');

    // 5. Create Sample Submissions
    await Submission.create({
      assignment: assignment1._id,
      student: student1._id,
      content: 'https://github.com/alex-johnson/bst-avl-implementation',
      submittedAt: new Date(),
      status: 'Graded',
      marksObtained: 95,
      feedback: 'Excellent clean implementation and modular tests!',
    });

    await Submission.create({
      assignment: assignment1._id,
      student: student2._id,
      content: 'https://github.com/priya-patel/tree-dsa-assignment',
      submittedAt: new Date(),
      status: 'Submitted',
    });

    console.log('[Seed]: Created Submissions.');

    // 6. Create Sample Results
    await Result.create([
      {
        student: student1._id,
        course: course1._id,
        teacher: teacher1._id,
        examType: 'Midterm',
        marks: 92,
        totalMarks: 100,
        grade: 'A+',
        remarks: 'Outstanding performance',
      },
      {
        student: student1._id,
        course: course3._id,
        teacher: teacher2._id,
        examType: 'Midterm',
        marks: 85,
        totalMarks: 100,
        grade: 'A',
        remarks: 'Solid problem solving logic',
      },
      {
        student: student2._id,
        course: course1._id,
        teacher: teacher1._id,
        examType: 'Midterm',
        marks: 78,
        totalMarks: 100,
        grade: 'B',
        remarks: 'Good grasp of concepts',
      },
    ]);

    console.log('[Seed]: Created Examination Results.');
    console.log('=============================================');
    console.log(' SEEDING COMPLETED SUCCESSFULLY!');
    console.log(' Demo Credentials (all passwords: password123):');
    console.log(' Admin:   admin@campusconnect.com');
    console.log(' Teacher: sarah.smith@campusconnect.com');
    console.log(' Student: alex.johnson@campusconnect.com');
    console.log('=============================================');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error]: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
