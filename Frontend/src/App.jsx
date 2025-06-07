import { BrowserRouter, Route, Routes } from "react-router-dom";
import School from "./school/School";
import Attendance from "./school/components/attendance/Attendance";
import Class from "./school/components/class/Class";
import Dashboard from "./school/components/dashboard/Dashboard";
import Subjects from "./school/components/subjects/Subjects";
import Students from "./school/components/students/Students";
import Teachers from "./school/components/teachers/Teachers";
import Client from "./client/Client";
import Home from "./client/components/home/Home";
import Login from "./client/components/login/Login";
import Register from "./client/components/register/Register";
import Teacher from "./teacher/Teacher";
import AttendanceTeacher from "./teacher/components/attendance/AttendanceTeacher";
import TeacherDashboard from "./teacher/components/teacherDashboard/TeacherDashboard";
import TeacherProfile from "./teacher/components/teacherProfile/TeacherProfile";
import Student from "./student/Student";
import StudentDashboard from "./student/components/studentDashboard/StudentDashboard";
import AttendanceStudent from "./student/components/attendance/AttendanceStudent";
import StudentProfile from "./student/components/studentProfile/StudentProfile";
import ProtectedRoute from "./guard/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* SCHOOL ROUTE */}
          <Route path="school" element={<ProtectedRoute allowRoles={['SCHOOL']}><School /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="class" element={<Class />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="students" element={<Students />} />
            <Route path="teachers" element={<Teachers />} />
          </Route>
          {/* STUDENT */}
          <Route path="/student" element={<ProtectedRoute allowRoles={['STUDENT']}><Student /></ProtectedRoute>}>
            <Route index element={<StudentDashboard />} />
            <Route path="attendance" element={<AttendanceStudent />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>
          {/* TEACHER */}
          <Route path="/teacher" element={<ProtectedRoute allowRoles={['TEACHER']}><Teacher /></ProtectedRoute>}>
            <Route index element={<TeacherDashboard />} />
            <Route path="attendance" element={<AttendanceTeacher />} />
            <Route path="profile" element={<TeacherProfile />} />
          </Route>
          {/* CLIENT */}
          <Route path="/" element={<Client />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;