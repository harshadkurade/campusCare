const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const moment = require("moment");
// const moment = require("moment-timezone");


//register callback
// const registerController = async (req, res) => {
//   try {
//     const exisitingUser = await userModel.findOne({ email: req.body.email });
//     if (exisitingUser) {
//       return res
//         .status(200)
//         .send({ message: "User Already Exist", success: false });
//     }
//     const password = req.body.password;
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     req.body.password = hashedPassword;
//     const newUser = new userModel(req.body);
//     await newUser.save();
//     res.status(201).send({ message: "Register Sucessfully", success: true });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: `Register Controller ${error.message}`,
//     });
//   }
// };
const registerController = async (req, res) => {
  try {
    // Check if the user already exists
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exists", success: false });
    }

    // Hash the password
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Determine role
    const isAdmin = req.body.role === "admin";

    // Create new user with initial isDoctor set to false
    const newUser = new userModel({
      ...req.body,
      password: hashedPassword,
      isAdmin,
      isDoctor: false, // Default to false; can be updated by admin
    });

    await newUser.save();
    res.status(201).send({ message: "Registered Successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller Error: ${error.message}`,
    });
  }
};



// login callback
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invlid EMail or Password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};

// APpply DOctor CTRL
const applyDoctorController = async (req, res) => {
  try {
    // Create a new doctor application
    const newDoctor = new doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();

    // Find admin user
    const adminUser = await userModel.findOne({ isAdmin: true });
    if (!adminUser) {
      return res.status(404).send({
        success: false,
        message: "Admin user not found",
      });
    }

    // Add notification to admin user
    const notifcation = adminUser.notifcation || [];
    notifcation.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
      data: {
        doctorId: newDoctor._id,
        name: `${newDoctor.firstName} ${newDoctor.lastName}`,
        onClickPath: "/admin/doctors",
      },
    });

    // Update admin user notifications
    await userModel.findByIdAndUpdate(adminUser._id, { notifcation });

    // Send success response
    res.status(201).send({
      success: true,
      message: "Doctor Account Applied Successfully",
    });
  } catch (error) {
    console.error("Error Applying for Doctor Account:", error.message);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error While Applying for Doctor",
    });
  }
};

//notification ctrl
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notifcation = user.notifcation;
    seennotification.push(...notifcation);
    user.notifcation = [];
    user.seennotification = notifcation;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "all notification marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in notification",
      success: false,
      error,
    });
  }
};

// delete notifications
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notifcation = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications Deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "unable to delete all notifications",
      error,
    });
  }
};

//GET ALL DOC
const getAllDocotrsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Doctors Lists Fetched Successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Errro WHile Fetching DOcotr",
    });
  }
};

// BOOK APPOINTMENT
const bookeAppointmnetController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    user.notifcation.push({
      type: "New-appointment-request",
      message: `A nEw Appointment Request from ${req.body.userInfo.name}`,
      onCLickPath: "/user/appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Book succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Booking Appointment",
    });
  }
};

const bookingAvailabilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not Availibale at this time",
        success: true,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Appointments available",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Booking",
    });
  }
};







// const bookeAppointmnetController = async (req, res) => {
//   try {
//     const date = moment.tz(req.body.date, "DD-MM-YYYY", "Asia/Kolkata").toISOString();
//     const time = moment.tz(req.body.time, "HH:mm", "Asia/Kolkata").toISOString();

//     const newAppointment = new appointmentModel({
//       ...req.body,
//       date,
//       time,
//       status: "pending",
//     });

//     await newAppointment.save();

//     const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
//     if (!user) {
//       return res.status(404).send({
//         success: false,
//         message: "Doctor's user not found",
//       });
//     }

//     user.notification.push({
//       type: "New-appointment-request",
//       message: `A new appointment request from ${req.body.userInfo.name}`,
//       onClickPath: "/user/appointments",
//     });

//     await user.save();

//     res.status(200).send({
//       success: true,
//       message: "Appointment booked successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error while booking appointment",
//     });
//   }
// };
// const bookingAvailabilityController = async (req, res) => {
//   try {
//     const date = moment.tz(req.body.date, "DD-MM-YYYY", "Asia/Kolkata").toISOString();
//     const time = moment.tz(req.body.time, "HH:mm", "Asia/Kolkata").toISOString();

//     const newAppointment = new appointmentModel({
//       ...req.body,
//       date,
//       time,
//       status: "pending",
//     });

//     await newAppointment.save();

//     const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
//     if (!user) {
//       return res.status(404).send({
//         success: false,
//         message: "Doctor's user not found",
//       });
//     }

//     user.notification.push({
//       type: "New-appointment-request",
//       message: `A new appointment request from ${req.body.userInfo.name}`,
//       onClickPath: "/user/appointments",
//     });

//     await user.save();

//     res.status(200).send({
//       success: true,
//       message: "Appointment booked successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error while booking appointment",
//     });
//   }
// };












// const bookingAvailabilityController = async (req, res) => {
//   try {
//     // Parse date and time into moment objects
//     const date = moment(req.body.date, "DD-MM-YYYY").startOf('day'); // Start of the day for the date
//     const time = moment(req.body.time, "HH:mm"); // Time in HH:mm format
//     const fromTime = time.clone().subtract(1, "hours"); // One hour before the requested time
//     const toTime = time.clone().add(1, "hours"); // One hour after the requested time

//     const doctorId = req.body.doctorId;

//     // Retrieve doctor's data
//     const doctor = await doctorModel.findById(doctorId);
//     if (!doctor) {
//       return res.status(404).send({
//         message: "Doctor not found",
//         success: false,
//       });
//     }

//     // Ensure that timings is an array and contains start and end times
//     const [startTimeStr, endTimeStr] = doctor.timings;
//     const startTiming = moment(startTimeStr, "HH:mm");
//     const endTiming = moment(endTimeStr, "HH:mm");

//     // Check if the requested time is within the doctor's working hours
//     if (time.isBefore(startTiming) || time.isAfter(endTiming)) {
//       return res.status(200).send({
//         message: "Requested time is outside the doctor's working hours",
//         success: false,
//       });
//     }

//     // Check for overlapping appointments within the doctor’s available working hours
//     const appointments = await appointmentModel.find({
//       doctorId,
//       date: date.toDate(), // Store the date as a Date object for comparison
//       time: {
//         $gte: fromTime.toDate(),
//         $lte: toTime.toDate(),
//       },
//     });

//     if (appointments.length > 0) {
//       return res.status(200).send({
//         message: "Appointments not available at this time",
//         success: false,
//       });
//     } else {
//       return res.status(200).send({
//         success: true,
//         message: "Appointments available",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error in checking availability",
//     });
//   }
// };



const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });
    res.status(200).send({
      success: true,
      message: "Users Appointments Fetch SUccessfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In User Appointments",
    });
  }
};

module.exports = {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDocotrsController,
  bookeAppointmnetController,
  bookingAvailabilityController,
  userAppointmentsController,
};