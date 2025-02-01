import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./../components/Layout";
import moment from "moment";
import { Table } from "antd";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const res = await axios.get("/api/v1/user/user-appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
    },
    // {
    //   title: "Name",
    //   dataIndex: "name",
    //   render: (text, record) => (
    //     <span>
    //       {record.doctorInfo.firstName} {record.doctorInfo.lastName}
    //     </span>
    //   ),
    // },
    // {
    //   title: "Phone",
    //   dataIndex: "phone",
    //   render: (text, record) => <span>{record.doctorInfo.phone}</span>,
    // },
    // {
    //   title: "Date & Time",
    //   dataIndex: "date",
    //   render: (text, record) => (
    //     <span>
    //       {moment(record.date).format("DD-MM-YYYY")} &nbsp;
    //       {moment(record.time).format("HH:mm")}
    //     </span>
    //   ),
    // },
    {
      title: "Date & Time",
      render: (text, record) => {
        // Parse date and time fields
        const datePart = moment(record.date); // Parse the date
        const timePart = moment(record.time); // Parse the time
    
        // Combine date and time
        const combinedDateTime = datePart
          .set({
            hour: timePart.hour(),
            minute: timePart.minute(),
            second: timePart.second(),
          });
    
        // Format the combined result
        return (
          <span>
            {combinedDateTime.format("DD-MM-YYYY")} &nbsp; {combinedDateTime.format("HH:mm")}
          </span>
        );
      },
    },
    
    
    
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  return (
    <Layout>
      <h1>Appoinmtnets Lists</h1>
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  );
};

export default Appointments;