import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddNewPizza() {
  return (
    <div>
      <AddPizzaForm></AddPizzaForm>
    </div>
  );
}

function AddPizzaForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [image, setImage] = useState("");

  function handleSubmitPizza(e) {
    e.preventDefault();

    const pizzaData = {
      name,
      price,
      ingredient,
      image,
    };

    fetch("http://localhost:5000/addNewPizza", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pizzaData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Successfully addded the new pizza", data);
        setName("");
        setPrice("");
        setIngredient("");
        setImage("");

        navigate("/");
      })
      .catch((error) => {
        console.error("Error adding pizza:", error);
      });

    // console.log("Data uploaded");
    // console.log(newPizza);
  }

  return (
    <div className="p-4 border rounded w-80 mx-auto mt-5">
      <form method="POST">
        <h2 className="text-lg font-semibold mb-4">Add New Pizza</h2>
        <label className="block mb-2">Pizza Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          required
          className="w-full mb-4 p-2 border rounded"
        />
        <label className="block mb-2">Pizza Price</label>
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="text"
          required
          className="w-full mb-4 p-2 border rounded"
        />
        <label className="block mb-2">Pizza Ingredients</label>
        <input
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          type="text"
          required
          className="w-full mb-4 p-2 border rounded"
        />
        <label className="block mb-2">Pizza Image</label>
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          type="text"
          required
          className="w-full mb-4 p-2 border rounded"
        />
        <button
          className="w-full p-2 bg-blue-500 text-white rounded"
          onClick={handleSubmitPizza}
        >
          Add Pizza
        </button>
      </form>
    </div>
  );
}
