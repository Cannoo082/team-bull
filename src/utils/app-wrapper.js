import express from 'express';

const app = express();
app.use(express.json());

import { POST as loginRoute } from '../app/api/login/route';
import { GET as profileRoute } from '../app/api/profile/route';
import { PATCH as usersRoute } from '../app/api/users/route';
import { GET as gradesRoute } from '../app/api/grades/route';
import { GET as coursesRoute } from '../app/api/courses/route';
import { GET as examsRoute } from '../app/api/exams/route';
import { GET as attendanceRoute } from '../app/api/attendance/route';
import { GET as notificationsRoute } from '../app/api/notifications/route';
import { GET as academicExamsByTerms } from '../app/api/academic_exams_by_terms/route';
import { GET as academicCoursesByTerms } from '../app/api/academic_courses_by_terms/route';
import { POST as addExamRoute } from "../app/api/add_exam/route";
import { DELETE as deleteExamRoute } from '../app/api/delete_exam/route';
import { GET as enrollmentGetRoute, POST as enrollmentPostRoute } from '../app/api/enrollment-student/route';
import { GET as semesterRoute } from "../app/api/semester/route";



// Utility to register routes
const registerRoute = (method, path, routeHandler) => {
  app[method](path, async (req, res) => {
    const requestUrl = `http://localhost:3000${req.originalUrl}`; 
    const request = {
      json: async () => req.body,
      url: requestUrl,
    };

    try {
      const response = await routeHandler(request);
      res.status(response.status || 200).json(await response.json());
    } catch (error) {
      console.error('Error:', error);

      const status = error.status || 500;
      const message = error.message || 'Internal Server Error';
      res.status(status).json({ message });
    }
  });
};

registerRoute('post', '/api/login', loginRoute);
registerRoute('patch', '/api/users', usersRoute);
registerRoute('get', '/api/grades', gradesRoute);
registerRoute('get', '/api/courses', coursesRoute);
registerRoute('get', '/api/notifications', notificationsRoute);
registerRoute('get', '/api/profile', profileRoute);
registerRoute('get', '/api/exams', examsRoute);
registerRoute('get', '/api/attendance', attendanceRoute);
registerRoute('get', '/api/academic_courses_by_terms', academicCoursesByTerms);
registerRoute('get', '/api/academic_exams_by_terms', academicExamsByTerms);
registerRoute("post", "/api/add_exam", addExamRoute);
registerRoute('delete', '/api/delete_exam', deleteExamRoute);
registerRoute('get', '/api/enrollment-student', enrollmentGetRoute);
registerRoute('post', '/api/enrollment-student', enrollmentPostRoute);
registerRoute("get", "/api/semester", semesterRoute);

export default app;
