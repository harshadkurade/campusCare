import React from "react";
import { useNavigate } from "react-router-dom";

const DoctorList = ({ doctor }) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="card m-3 shadow-sm"
        style={{
          cursor: "pointer",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid #003A6A",
        }}
        onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}
      >
        <div
          className="card-header text-white"
          style={{
          backgroundColor: "#003A6A",
          fontSize: "1.2rem",
          fontWeight: "bold",
        }}
        >
            Dr. {doctor.firstName} {doctor.lastName}
        </div>

        <div className="card-body">
          <p className="mb-2">
            <b>Specialization:</b> {doctor.specialization}
          </p>
          <p className="mb-2">
            <b>Experience:</b> {doctor.experience} years
          </p>
          <p className="mb-2">
            <b>Timings:</b> {doctor.timings[0]} - {doctor.timings[1]}
          </p>
          <button
  className="btn mt-3"
  style={{
    color: "#003A6A",
    borderColor: "#003A6A",
    backgroundColor: "transparent",
  }}
  onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}
  onMouseEnter={(e) => {
    e.target.style.backgroundColor = "#003A6A";
    e.target.style.color = "white";
  }}
  onMouseLeave={(e) => {
    e.target.style.backgroundColor = "transparent";
    e.target.style.color = "#003A6A";
  }}
>
  Book Appointment
</button>


        </div>
      </div>
    </>
  );
};

export default DoctorList;


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const DoctorList = () => {
//   const [doctors, setDoctors] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchDoctorData = async () => {
//       try {
//         const response = await fetch("/api/doctors", {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//           },
//         });
//         const data = await response.json();
//         setDoctors(data);
//       } catch (error) {
//         console.error("Error fetching doctor data", error);
//       }
//     };
//     fetchDoctorData();
//   }, []);

//   return (
//     <div>
//       {doctors.map((doctor) => (
//         <div
//           className="card m-2"
//           key={doctor._id}
//           style={{ cursor: "pointer" }}
//           onClick={() => navigate(`/doctor/book-appointment/${doctor._id}`)}
//         >
//           <div className="card-header">
//             Dr. {doctor.firstName} {doctor.lastName}
//           </div>
//           <div className="card-body">
//             <p>
//               <b>Specialization:</b> {doctor.specialization}
//             </p>
//             <p>
//               <b>Experience:</b> {doctor.experience} years
//             </p>
//             <p>
//               <b>Fees Per Consultation:</b> {doctor.feesPerCunsaltation}
//             </p>
//             <p>
//               <b>Timings:</b>{" "}
//               {doctor.timings && doctor.timings.length >= 2
//                 ? `${doctor.timings[0]} - ${doctor.timings[1]}`
//                 : "Not available"}
//             </p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default DoctorList;
