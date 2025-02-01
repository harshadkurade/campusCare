
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Layout from "./../components/Layout";
// import { Row } from "antd";
// import DoctorList from "../components/DoctorList";
// const HomePage = () => {
//   const [doctors, setDoctors] = useState([]);
//   // login user data
//   const getUserData = async () => {
//     try {
//       const res = await axios.get(
//         "/api/v1/user/getAllDoctors",

//         {
//           headers: {
//             Authorization: "Bearer " + localStorage.getItem("token"),
//           },
//         }
//       );
//       if (res.data.success) {
//         setDoctors(res.data.data);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getUserData();
//   }, []);
//   return (
//     <Layout>
//       <h1 className="text-center">Home Page</h1>
//       <Row>
//         {doctors && doctors.map((doctor) => <DoctorList doctor={doctor} />)}
//       </Row>
//     </Layout>
//   );
// };

// export default HomePage;








// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Layout from "./../components/Layout";
// import { Row, Table } from "antd";
// import DoctorList from "../components/DoctorList";
// import moment from "moment";

// const HomePage = () => {
//   const [isDoctor, setIsDoctor] = useState(false);
//   const [doctors, setDoctors] = useState([]);
//   const [appointments, setAppointments] = useState([]);
//   const [totalPatients, setTotalPatients] = useState(0);

//   // Fetch user data to check if they are a doctor
//   const getUserData = async () => {
//     try {
//       const res = await axios.get("/api/v1/user/getUserDetails", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       if (res.data.success) {
//         setIsDoctor(res.data.data.isDoctor);
//         if (res.data.data.isDoctor) {
//           // Fetch today's appointments for the doctor
//           getDoctorAppointments();
//         } else {
//           // Fetch list of doctors if the user is not a doctor
//           getAllDoctors();
//         }
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // Fetch all doctors for non-doctor users
//   const getAllDoctors = async () => {
//     try {
//       const res = await axios.get("/api/v1/user/getAllDoctors", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       if (res.data.success) {
//         setDoctors(res.data.data);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // Fetch today's appointments for the doctor
//   const getDoctorAppointments = async () => {
//     try {
//       const res = await axios.get("/api/v1/doctor/getAppointments", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       if (res.data.success) {
//         // Filter appointments for today
//         const today = moment().startOf("day");
//         const todayAppointments = res.data.data.filter((appointment) =>
//           moment(appointment.date).isSame(today, "day")
//         );

//         setAppointments(todayAppointments);
//         setTotalPatients(todayAppointments.length);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getUserData();
//   }, []);

//   const appointmentColumns = [
//     {
//       title: "Patient Name",
//       dataIndex: "patientName",
//     },
//     {
//       title: "Date & Time",
//       render: (text, record) => {
//         const datePart = moment(record.date);
//         const timePart = moment(record.time);

//         const combinedDateTime = datePart.set({
//           hour: timePart.hour(),
//           minute: timePart.minute(),
//           second: timePart.second(),
//         });

//         return (
//           <span>
//             {combinedDateTime.format("DD-MM-YYYY")} &nbsp;
//             {combinedDateTime.format("HH:mm")}
//           </span>
//         );
//       },
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//     },
//   ];

//   return (
//     <Layout>
//       <h1 className="text-center">Home Page</h1>
//       {isDoctor ? (
//         <div>
//           <h2 className="text-center">Today's Appointments</h2>
//           <p className="text-center">Total Patients: {totalPatients}</p>
//           <Table columns={appointmentColumns} dataSource={appointments} />
//         </div>
//       ) : (
//         <Row>
//           {doctors &&
//             doctors.map((doctor) => <DoctorList key={doctor._id} doctor={doctor} />)}
//         </Row>
//       )}
//     </Layout>
//   );
// };

// export default HomePage;

// import React, { useState, useEffect } from "react";
// import Layout from "./../components/Layout";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { Row } from "antd";
// import { message, Spin, Badge, List } from "antd";
// import moment from "moment";
// import DoctorList from "../components/DoctorList";  // Import the DoctorList component

// const HomePage = () => {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [appointments, setAppointments] = useState([]);
//   const [patientCount, setPatientCount] = useState(0);

//   const [userdata, setUserdata] = useState(null);  // For storing the logged-in user data
//   const { user } = useSelector((state) => state.user);

//   // Fetch user data from the API
//   // const getUserData = async () => {
//   //   try {
//   //     setLoading(true); // Start loading
//   //     const res = await axios.post(
//   //       "/api/v1/user/getUserData",
//   //       {},
//   //       {
//   //         headers: {
//   //           Authorization: `Bearer ${localStorage.getItem("token")}`,
//   //         },
//   //       }
//   //     );

//   //     if (res.data.success) {
//   //       setUserData(res.data.data); // Store user data
//   //       if (res.data.data.role === "doctor") {
//   //         // Fetch doctor's appointments if logged in as doctor
//   //         getTodaysAppointments();
//   //       } else if (res.data.data.role === "user") {
//   //         // Fetch list of doctors if logged in as a user (patient)
//   //         getDoctorsList();
//   //       }
//   //     } else {
//   //       message.error(res.data.message || "Failed to fetch user data");
//   //     }
//   //   } catch (error) {
//   //     console.error("Error fetching user data:", error);
//   //     message.error("Error fetching user data. Please try again.");
//   //   } finally {
//   //     setLoading(false); // End loading
//   //   }
//   // };

//   // Fetch the list of doctors (for users/patients)
//   const getDoctorsList = async () => {
//     try {
//       const res = await axios.get("/api/v1/user/getAllDoctors", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       if (res.data.success) {
//         setDoctors(res.data.data);
//       } else {
//         message.error("Failed to fetch doctors list");
//       }
//     } catch (error) {
//       console.error("Error fetching doctors list:", error);
//       message.error("Error fetching doctors list. Please try again.");
//     }
//   };

//   // Fetch today's appointments for the doctor
//   const getTodaysAppointments = async () => {
//     try {
//       const today = moment().startOf("day").toISOString();
//       const res = await axios.get("/api/v1/doctor/doctor-appointments", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         params: {
//           date: today, // Filter for today's appointments
//         },
//       });

//       if (res.data.success) {
//         setAppointments(res.data.data);
//         setPatientCount(res.data.data.length); // Set the number of patients for today
//       } else {
//         message.error("Failed to fetch today's appointments");
//       }
//     } catch (error) {
//       console.error("Error fetching today's appointments:", error);
//       message.error("Error fetching today's appointments. Please try again.");
//     }
//   };

  




//   const [doctors, setDoctors] = useState([]);
//   // login user data
//   const getUserData = async () => {
//     try {
//       const res = await axios.get(
//         "/api/v1/user/getAllDoctors",

//         {
//           headers: {
//             Authorization: "Bearer " + localStorage.getItem("token"),
//           },
//         }
//       );
//       if (res.data.success) {
//         setDoctors(res.data.data);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getUserData();
//   }, []);




//   return (
//     <Layout>
//       <h1>Welcome to the Home Page</h1>

//       {userdata.isDoctor ? (
//           // If the user is a doctor, show today's appointments
//           <p>Your Appointments</p>
//         ) : (
//           <Row>
//            {doctors && doctors.map((doctor) => <DoctorList doctor={doctor} />)}
//           </Row>
//         )}

//       {/* {userData ? (
//         userData.role === "user" ? (
//           // Patient: Show list of doctors using DoctorList component
//           <div>
//             <h2>Available Doctors</h2>
//             {doctors.length === 0 ? (
//               <p>No doctors available at the moment.</p>
//             ) : (
//               doctors.map((doctor) => (
//                 <DoctorList key={doctor._id} doctor={doctor} />
//               ))
//             )}
//           </div>
//         ) : userData.role === "doctor" ? (
//           // Doctor: Show today's appointments and number of patients
//           <div>
//             <h2>Today's Appointments</h2>
//             <p>
//               <Badge count={patientCount} style={{ backgroundColor: "#52c41a" }} />{" "}
//               Patients for today
//             </p>
//             {appointments.length === 0 ? (
//               <p>No appointments for today.</p>
//             ) : (
//               <List
//                 itemLayout="horizontal"
//                 dataSource={appointments}
//                 renderItem={(appointment) => (
//                   <List.Item>
//                     <List.Item.Meta
//                       title={`Patient: ${appointment.patient.name}`}
//                       description={`Time: ${moment(appointment.date).format("HH:mm")}`}
//                     />
//                   </List.Item>
//                 )}
//               />
//             )}
//           </div>
//         ) : null
//       ) : (
//         <p>No user data available. Please try refreshing the page.</p>
//       )} */}
//     </Layout>
//   );
// };

// export default HomePage;


import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout";
import { useSelector } from "react-redux";
import axios from "axios";
import { Row } from "antd";
import moment from "moment";
import { message, Table } from "antd";
import DoctorList from "../components/DoctorList";  // Import the DoctorList component

const HomePage = () => {
  const [userData, setUserData] = useState(null); // Initialize userData as null initially
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const { user } = useSelector((state) => state.user);
  const [appointments, setAppointments] = useState([]);
  const [isDoctor, setIsDoctor] = useState(false);

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) {
      return "Good Morning";
    } else if (hours < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };


  // const getUserData = async () => {
  //   try {
  //     const res = await axios.get("/api/v1/user/getUserDetails", {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //     if (res.data.success) {
  //       setIsDoctor(res.data.data.isDoctor);
  //       if (res.data.data.isDoctor) {
  //         // Fetch today's appointments if the user is a doctor
  //         getDoctorAppointments();
  //       } else {
  //         // Fetch the list of doctors for patients
  //         getDoctorsList();
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     message.error("Failed to fetch user data.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getUserData = async () => {
    
      
        if (user && user.isDoctor) {
          // Fetch today's appointments if the user is a doctor
          getDoctorAppointments();
        } else {
          // Fetch the list of doctors for patients
          getDoctorsList();
        }
      
    
  };



  const getDoctorAppointments = async () => {
    try {
      const res = await axios.get("/api/v1/doctor/doctor-appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        // Filter appointments for today and with status 'pending'
        const today = moment().startOf("day");
        const todayAppointments = res.data.data.filter((appointment) =>
          moment(appointment.date).isSame(today, "day") && appointment.status === "pending"
        );
  
        setAppointments(todayAppointments);
      }
    } catch (error) {
      console.log(error);
    }
  };


  // const getDoctorAppointments = async () => {
  //   try {
  //     const res = await axios.get("/api/v1/doctor/doctor-appointments", {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //     if (res.data.success) {
  //       const today = moment().startOf("day");
  //       const todayAppointments = res.data.data.filter((appointment) =>
  //         moment(appointment.date).isSame(today, "day")
  //       );
  //       setAppointments(todayAppointments);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     message.error("Failed to fetch appointments.");
  //   }
  // };

  const appointmentColumns = [
    {
      title: "Patient Name",
      dataIndex: "patientName",
    },
    {
      title: "Date & Time",
      render: (text, record) => {
        const datePart = moment(record.date);
        const timePart = moment(record.time);
  
        const combinedDateTime = datePart.set({
          hour: timePart.hour(),
          minute: timePart.minute(),
          second: timePart.second(),
        });
  
        return (
          <span>
            {combinedDateTime.format("DD-MM-YYYY")} &nbsp;
            {combinedDateTime.format("HH:mm")}
          </span>
        );
      },
    },
  ];






  // Fetch doctors list
  const getDoctorsList = async () => {
    try {
      const res = await axios.get("/api/v1/user/getAllDoctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setDoctors(res.data.data);
      } else {
        message.error("Failed to fetch doctors list");
      }
    } catch (error) {
      console.error("Error fetching doctors list:", error);
      message.error("Error fetching doctors list. Please try again.");
    }
  };




  useEffect(() => {
    // Call the function to get doctors list on page load
    getUserData();
  }, []);






  return (
    <Layout>
      <h1 style={{ fontSize: "3rem", color: "#003A6A", fontWeight: "bold", marginTop: "20px", marginLeft:"17px",paddingTop:"10px" }}>
  {getGreeting()}, {user ? user.name : "Guest"}
</h1>


      {/* Check if user is admin, doctor, or a regular user (patient) */}
      {user && user.isAdmin ? (

        <p>Welcome, Admin! You have full access.</p>

      ) : user && user.isDoctor ? (
        
        <div>
          <Table
            columns={appointmentColumns}
            dataSource={appointments}
            rowKey="_id"
            pagination={false}
          />
        </div>

      ) : (
        // If the user is a regular user (patient), show the list of doctors
        <Row>
          {doctors && doctors.map((doctor) => <DoctorList key={doctor._id} doctor={doctor} />)}
        </Row>
      )}
    </Layout>
  );
};

export default HomePage;


