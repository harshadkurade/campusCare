// import React from "react";
// import "../styles/RegiserStyles.css";
// import { Form, Input, message } from "antd";
// import { useDispatch } from "react-redux";
// import { showLoading, hideLoading } from "../redux/features/alertSlice";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./Login.css";

// const Login = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   //form handler
//   const onfinishHandler = async (values) => {
//     try {
//       dispatch(showLoading());
//       const res = await axios.post("/api/v1/user/login", values);
//       window.location.reload();
//       dispatch(hideLoading());
//       if (res.data.success) {
//         localStorage.setItem("token", res.data.token);
//         message.success("Login Successfully");
//         navigate("/");
//       } else {
//         message.error(res.data.message);
//       }
//     } catch (error) {
//       dispatch(hideLoading());
//       console.log(error);
//       message.error("something went wrong");
//     }
//   };
//   return (
//     <div className="form-container">
//       <nav className="navbar">
//         <h2>NIT Jalandhar</h2>
//       </nav>


//       <div className="form-container ">
//       <Form
//         layout="vertical"
//         onFinish={onfinishHandler}
//         className="register-form"
//       >
//         <h3 className="text-center">Login From</h3>

//         <Form.Item label="Email" name="email">
//           <Input type="email" required />
//         </Form.Item>
//         <Form.Item label="Password" name="password">
//           <Input type="password" required />
//         </Form.Item>
//         <Link to="/register" className="m-2">
//           Not a user Register here
//         </Link>
//         <button className="btn btn-primary" type="submit">
//           Login
//         </button>
//       </Form>
//     </div>
//     </div>
//   );
// };

// export default Login;



import React from "react";
import { Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";  // Importing the CSS for the Login page
import dispensaryImage from '../images/dispensary.png';
import logo from '../images/logo.png';


const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Form handler
  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/login", values);
      window.location.reload();
      dispatch(hideLoading());
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success("Login Successfully");
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };

  return (
    <div className="form-container">
      {/* Navbar */}
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
        <Form layout="vertical" onFinish={onfinishHandler} className="login-form">
          <h3 className="text-center text-2xl font-semibold mb-6">Login Form</h3>

          <Form.Item label="Email" name="email">
            <Input type="email" required className="border border-gray-300 p-3 rounded-md w-full" />
          </Form.Item>

          <Form.Item label="Password" name="password">
            <Input type="password" required className="border border-gray-300 p-3 rounded-md w-full" />
          </Form.Item>

          <Link to="/register" className="text-blue-500 hover:underline block text-center mb-4">
            Not a user? Register here
          </Link>

          <button className="login-btn">
  Login
</button>

        </Form>
      </div>
    </div>
  );
};

export default Login;
