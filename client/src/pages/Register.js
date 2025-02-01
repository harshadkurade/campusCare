// import React from "react";
// import "../styles/RegiserStyles.css";
// import { Form, Input, message } from "antd";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { showLoading, hideLoading } from "../redux/features/alertSlice";
// const Register = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   //form handler
//   const onfinishHandler = async (values) => {
//     try {
//       dispatch(showLoading());
//       const res = await axios.post("/api/v1/user/register", values);
//       dispatch(hideLoading());
//       if (res.data.success) {
//         message.success("Register Successfully!");
//         navigate("/login");
//       } else {
//         message.error(res.data.message);
//       }
//     } catch (error) {
//       dispatch(hideLoading());
//       console.log(error);
//       message.error("Something Went Wrong");
//     }
//   };
//   return (
//     <>
//       <div className="form-container ">
//         <Form
//           layout="vertical"
//           onFinish={onfinishHandler}
//           className="register-form"
//         >
//           <h3 className="text-center">Register From</h3>
//           <Form.Item label="Name" name="name">
//             <Input type="text" required />
//           </Form.Item>
//           <Form.Item label="Email" name="email">
//             <Input type="email" required />
//           </Form.Item>
//           <Form.Item label="Password" name="password">
//             <Input type="password" required />
//           </Form.Item>
//           <Link to="/login" className="m-2">
//             Already user login here
//           </Link>
//           <button className="btn btn-primary" type="submit">
//             Register
//           </button>
//         </Form>
//       </div>
//     </>
//   );
// };

// export default Register;

import React from "react";
import "../styles/RegiserStyles.css";
import { Form, Input, message, Select } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import "./Login.css";
import logo from '../images/logo.png';

const { Option } = Select;

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //form handler
  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/register", values);
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Register Successfully!");
        navigate("/login");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something Went Wrong");
    }
  };

  return (
    <>
      <div className="form-container ">
      <nav className="navbar">
        <div className="navbar-content">
        <img src={logo} alt="Logo" className="navbar-logo" />
          <div> 
            <h2>Medical Dispensary</h2>
            <p>Dr. B. R. Ambedkar National Institute of Technology Jalandhar</p>
          </div>
        </div>
      </nav>
        <div className="login-form-container">
        <Form
          layout="vertical"
          onFinish={onfinishHandler}
          className="register-form"
        >
          <h3 className="text-center">Register Form</h3>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter your name!" }]}>
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter your email!" }]}>
            <Input type="email" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter your password!" }]}>
            <Input type="password" />
          </Form.Item>
          <Form.Item label="Role" name="role" rules={[{ required: true, message: "Please select a role!" }]}>
            <Select placeholder="Select your role">
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
          <Link to="/login" className="m-2">
            Already a user? Login here
          </Link>
          <button className="btn btn-primary" type="submit">
            Register
          </button>
        </Form>
        </div>
      </div>
    </>
  );
};

export default Register;
