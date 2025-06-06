import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongoDB.js'
import schoolRouter from './routes/school.router.js'
import classRouter from './routes/classs.router.js'
import studentRouter from './routes/student.router.js'
import subjectRouter from './routes/subject.router.js'
import teacherRouter from './routes/student.router.js'

const PORT = process.env.PORT || 4000
const app = express()

app.use(express.json());
app.use(cors());

app.get('/', (req, res)=> res.send("API Working"))
app.use("/api/school", schoolRouter);
app.use("/api/class", classRouter);
app.use("/api/subject", subjectRouter);
app.use("/api/student", studentRouter);
app.use("/api/teacher", teacherRouter);


app.listen(PORT, ()=> console.log('Server running on Port ' + PORT));
await connectDB();