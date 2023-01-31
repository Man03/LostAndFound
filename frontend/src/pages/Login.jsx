import { useState } from "react";
import axios from "axios";

function Login() {
  const [formdata, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formdata;

  const onChange = (e) =>
    setFormData({ ...formdata, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    // const config = {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // };

    // const body = JSON.stringify({ email, password });

    // try {
    //   const res = await axios.post("http://localhost:8000/users", body, config);

    //   console.log(res.data);
    // } catch (err) {
    //   console.error(err.response.data);
    // }
    window.location.href = "http://localhost:3000";
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <br></br>
        <div>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
          />
        </div>
        <br />
        <input type="submit" value="Login" />
      </form>
    </div>
  );
}

export default Login;
