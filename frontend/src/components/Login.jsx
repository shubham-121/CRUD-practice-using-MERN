import { useState } from "react";
import { useNavigate } from "react-router";

export default function Login() {
  const navigate = useNavigate();
  return (
    <div>
      <button
        className="w-[100px] h-[40px] border-2 border-black rounded-full bg-stone-400 fixed right-[5%] "
        onClick={() => navigate("/register")}
      >
        Register
      </button>
      <p className="text-center font-semibold text-xl mt-5">LogIn Page</p>
      <LogInForm></LogInForm>
    </div>
  );
}

function LogInForm() {
  const navigate = useNavigate();
  //   const [loggedUser, setLoggeduser] = useState();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  function handleFormChange(e) {
    const { name, value } = e.target;
    console.log(name, value);

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      credentials: "include",
    });

    const loggedUser = await res.json(); //get the logged user from the DB

    if (!loggedUser) alert("Error in logging in the user");

    console.log(loggedUser);

    alert("login data sent successfully");
    navigate("/");

    //reset fields
    setFormData({
      name: "",
      email: "",
      password: "",
    });
  }

  return (
    <div className="p-4 border rounded w-80 mx-auto mt-5">
      <form method="POST">
        <label className="block mb-2">User Email:</label>
        <input
          value={formData.email}
          name="email"
          onChange={handleFormChange}
          type="text"
          required
          className="w-full mb-4 p-2 border rounded"
        />

        <label className="block mb-2">User Password:</label>
        <input
          value={formData.password}
          name="password"
          onChange={handleFormChange}
          type="text"
          required
          className="w-full mb-4 p-2 border rounded"
        />

        <button
          onClick={handleSubmit}
          className="w-full p-2 bg-blue-500 text-white rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
