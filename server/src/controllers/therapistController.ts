import { Request, Response } from 'express';
import Therapist from '../models/Therapist';
import Appointment from '../models/Appointment';
import { AuthRequest } from '../middleware/auth';

export const getAllTherapists = async (req: Request, res: Response) => {
  try {
    const therapists = await Therapist.find({ isVerified: true });
    res.json(therapists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching therapists', error });
  }
};

export const createAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { therapistId, startTime, endTime } = req.body;
    const clientId = req.user?.userId;

    const newAppointment = new Appointment({
      client: clientId,
      therapist: therapistId,
      startTime,
      endTime,
      status: 'pending'
    });

    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating appointment', error });
  }
};

export const getMyAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const clientId = req.user?.userId;
    const appointments = await Appointment.find({ client: clientId }).populate('therapist');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
};

export const cancelAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const clientId = req.user?.userId;

    const appointment = await Appointment.findOne({ _id: id, client: clientId });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.status === 'cancelled') {
        return res.status(400).json({ message: 'Appointment is already cancelled' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling appointment', error });
  }
};
