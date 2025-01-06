import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./index.css";

export default function App() {
  const navigate = useNavigate();
  return (
    <div>
      <button
        onClick={() => navigate("/register")}
        className="border-2 border-black w-[7vw] h-[5vh] mt-2 rounded-full bg-gray-500 relative left-[90%]"
      >
        Register
      </button>
      <h1 className="text-stone-800 text-center font-semibold text-xl ">
        Pizzas Website
      </h1>
      <FetchData></FetchData>
      <div className="flex items-center justify-center space-x-4 ">
        <button
          className="border-2 border-black rounded-full mt-5 max-w-[40vw] h-[8vh] bg-red-500"
          onClick={() => navigate("/addNewPizza")}
        >
          Add Pizzas
        </button>

        <button
          className="border-2 border-black rounded-full mt-5 max-w-[40vw] h-[8vh] bg-blue-400"
          onClick={() => navigate("/userPizza")}
        >
          User Pizzas
        </button>
      </div>
    </div>
  );
}

function FetchData() {
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    async function getData() {
      const res = await fetch(`http://localhost:5000/pizzas/getPizzas`);
      const data = await res.json();

      console.log(data);

      if (data) setApiData(data.pizzas);
      else {
        console.error("Error occured");
        alert("Error fetching the data from the backend");
      }
    }
    getData();
  }, []);

  return (
    <div>
      <h1 className="text-center font-semibold text-xl">
        Order from a variety of our pizzas!
      </h1>
      <div className="flex flex-row justify-center items-center border-2 border-black">
        {apiData ? (
          apiData.map((pizza, idx) => (
            <RenderPizzas pizza={pizza} key={idx}></RenderPizzas>
          ))
        ) : (
          <p>Fetching pizzas please wait!</p>
        )}
      </div>
    </div>
  );
}

function RenderPizzas({ pizza }) {
  return (
    <div className="border-2 border-black flex justify-center items-center">
      <ul>
        <li className="flex items-center justify-center">
          <img
            className="max-h-[40vh] max-w-[40vw] min-w-[10vw] rounded-full"
            src={pizza.imagesrc}
          ></img>
        </li>
        <li>
          <strong>Name:</strong> {pizza.name}
        </li>
        <li>
          <strong>Price:</strong> {pizza.price}
        </li>
        <li>
          <strong>Ingredients:</strong> {pizza.ingredients.join(",")}
        </li>
        <li>
          <strong>SoldOut:</strong>{" "}
          {pizza.soldOut ? "Not Available" : "Available"}
        </li>
      </ul>
    </div>
  );
}
