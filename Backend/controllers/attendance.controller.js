import Attendance from "../models/attendance.model.js";
import moment from "moment";

// MARK ATTENDANCE
export const markAttendance = async (req, res) => {
  try {
    const { studentId, date, status, subjectId, classId } = req.body;
    const schoolId = req.user.schoolId;

    const newAttendance = new Attendance({
      student: studentId,
      date,
      status,
      subject: subjectId,
      class: classId,
      school: schoolId,
    });

    await newAttendance.save();
    res.status(201).json(newAttendance);
  } catch (error) {
    console.error("Mark Attendance Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error in marking attendance" });
  }
};

// GET ATTENDANCE BY STUDENT
export const getAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const attendance = await Attendance.find({ student: studentId }).populate(
      "student"
    );
    res.status(200).json(attendance);
  } catch (error) {
    console.error("Get Attendance Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error in getting attendance" });
  }
};

// CHECK ATTENDANCE FOR CLASS TODAY
export const checkAttendance = async (req, res) => {
  const { classId } = req.params;

  try {
    const todayStart = moment().startOf("day").toDate();
    const todayEnd = moment().endOf("day").toDate();

    const attendanceForToday = await Attendance.findOne({
      class: classId,
      date: {
        $gte: todayStart,
        $lt: todayEnd,
      },
    });

    if (attendanceForToday) {
      return res.status(200).json({
        attendanceTaken: true,
        message: "Attendance already taken",
      });
    } else {
      return res.status(200).json({
        attendanceTaken: false,
        message: "No attendance taken for today",
      });
    }
  } catch (error) {
    console.error("Check Attendance Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error in checking attendance" });
  }
};