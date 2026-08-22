const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Simple wrapper so we don't have to write try/catch in every controller
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const wrapRouterHandlers = (router) => {
  router.stack.forEach((layer) => {
    if (layer.route) {
      layer.route.stack.forEach((routeLayer) => {
        routeLayer.handle = asyncHandler(routeLayer.handle);
      });
    }
  });
  return router;
};

app.get('/', (req, res) => {
  res.json({ message: 'Dayflow API is running' });
});

app.use('/api/auth', wrapRouterHandlers(require('./routes/authRoutes')));
app.use('/api/employees', wrapRouterHandlers(require('./routes/employeeRoutes')));
app.use('/api/tasks', wrapRouterHandlers(require('./routes/taskRoutes')));
app.use('/api/attendance', wrapRouterHandlers(require('./routes/attendanceRoutes')));
app.use('/api/leaves', wrapRouterHandlers(require('./routes/leaveRoutes')));
app.use('/api/performance', wrapRouterHandlers(require('./routes/performanceRoutes')));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Dayflow server running on port ${PORT}`));
