import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function UserPizzas() {
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <p className="text-center font-bold text-2xl mb-4">Your Custom Pizzas</p>
      <CustomPizzas />
    </div>
  );
}

function CustomPizzas() {
  const token = localStorage.getItem("access_token");
  const [customPizza, setCustomPizza] = useState();

  useEffect(() => {
    async function getCustomPizza() {
      const res = await fetch("http://localhost:5000/pizzas/userPizza", {
        method: "GET",
        headers: {
          //prettier-ignore
          "Authorization": `Bearer ${token}`, // Add token to the Authorization header
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (data) {
        console.log(data);
        setCustomPizza(data.db_pizzas);
      }
    }
    getCustomPizza();
  }, []);

  return (
    <div className="p-4">
      <p className="text-center font-semibold text-xl mb-4">
        Your pizzas are below:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customPizza ? (
          customPizza.map((pizza, idx) => (
            <RenderCustomPizza pizza={pizza} key={idx} />
          ))
        ) : (
          <p className="text-center text-gray-600">
            No custom pizzas available currently.
          </p>
        )}
      </div>
    </div>
  );
}

function RenderCustomPizza({ pizza }) {
  const navigate = useNavigate();

  function handleEditPizza(id) {
    navigate(`/editPizza/${id}`);
  }

  async function handleDeletePizza(id) {
    try {
      const res = await fetch(
        `http://localhost:5000/pizzas/deletePizza/${id}`,
        {
          method: "DELETE",
        }
      );
      const result = await res.json();
      console.log(result);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while deleting the pizza.");
    } finally {
      setTimeout(() => {
        navigate("/"); //redirect to home route
      }, 1000);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center border border-gray-300 shadow-md rounded-lg p-4 bg-white">
      <p className="text-lg font-bold mb-2">{pizza.name}</p>
      <p className="text-gray-700 mb-2">Price: ${pizza.price}</p>
      <p className="text-gray-500 mb-4">{pizza.ingredient}</p>
      {pizza.image && (
        <img
          className="max-h-[20vh] max-w-[20vw] rounded-full object-cover"
          src={pizza.image}
          alt={`${pizza.name} image`}
        />
      )}
      <div className="flex items-center justify-center space-x-5">
        <button
          onClick={() => handleEditPizza(pizza._id)}
          className="border-2 mt-5 w-[5vw] hover:scale-105 font-semibold text-l border-black rounded-full bg-blue-500"
        >
          Edit
        </button>

        <button
          onClick={() => handleDeletePizza(pizza._id)}
          className="border-2 mt-5 w-[5vw] hover:scale-105 font-semibold text-l border-black rounded-full bg-red-500"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
