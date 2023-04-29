const scheduleRouter = require('express').Router();
const Appointment = require('../models/Appointment');
const Schedule = require('../models/Schedule');

scheduleRouter.get('/', async (request, response) => {
  const schedule = await Schedule.find({}).populate(
    'appointments',
    'start end client employee service'
  );
  response.json(schedule);
});

scheduleRouter.post('/', async (request, response) => {
  const { date, open, close } = request.body;
  const newSchedule = new Schedule({
    date,
    open,
    close,
  });
  await newSchedule.save();
  response
    .status(201)
    .json({ message: 'New schedule added', data: newSchedule });
});

scheduleRouter.put('/:id', async (request, response) => {
  const { appointment } = request.body;
  const bookedAppt = await Appointment.findOne({ _id: appointment });
  const schedule = await Schedule.findOne({ _id: request.params.id });
  schedule.appointments.push(bookedAppt);
  await schedule.save();

  response
    .status(200)
    .json({ success: true, message: 'Schedule updated', data: schedule });
});

module.exports = scheduleRouter;
