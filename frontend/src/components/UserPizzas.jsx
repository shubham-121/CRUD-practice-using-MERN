import { useEffect, useState } from "react";

export default function UserPizzas() {
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <p className="text-center font-bold text-2xl mb-4">Your Custom Pizzas</p>
      <CustomPizzas />
    </div>
  );
}

function CustomPizzas() {
  const [customPizza, setCustomPizza] = useState();

  useEffect(() => {
    async function getCustomPizza() {
      const res = await fetch("http://localhost:5000/pizzas/userPizza");
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
            <RenderCustomPizza pizza={pizza} key={idx} pizza_id={pizza._id} />
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

function RenderCustomPizza({ pizza, pizza_id }) {
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
      <button className="border-2 mt-5 w-[5vw] hover:scale-105 font-semibold text-l border-black rounded-full bg-red-500">
        Remove
      </button>
    </div>
  );
}
