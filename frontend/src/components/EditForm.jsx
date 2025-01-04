import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function EditForm() {
  return (
    <div>
      <p className="text-center font-semibold text-xl">
        Edit your pizza details:
      </p>
      <Form></Form>
    </div>
  );
}

function Form() {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    ingredient: "",
    image: "",
  });

  //   const [pizzaId, setPizzaId] = useState();

  //get current pizza details with the id
  useEffect(() => {
    async function getPizzaDetails() {
      try {
        const res = await fetch(`http://localhost:5000/editPizza/${id}`);
        const data = await res.json();

        if (!data)
          console.error("Could not find the pizza with the id in the DB");

        console.log(data);

        // setFormData({
        //   name: data.pizza.name,
        //   price: data.pizza.price,
        //   image: data.pizza.image,
        //   ingredient: data.pizza.ingredient,
        // });
        setFormData(data.pizza);
      } catch (err) {
        console.error(
          "Could not find the pizza with the id in the DB",
          err.message
        );
      }
    }
    getPizzaDetails();
  }, [id]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    // console.log(name, value);
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Update only the changed field
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch(`http://localhost:5000/editPizza/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();

    if (!data) console.log("Error in fetching the updated data");

    alert("Pizza updated successfully!");
    navigate("/userPizza"); // navigate to home after updating
  }

  return (
    <div className="p-4 border rounded w-80 mx-auto mt-5">
      <form method="POST">
        <h2 className="text-lg font-semibold mb-4">Edit a Pizza</h2>
        <label className="block mb-2">Pizza Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          type="text"
          required
          className="w-full mb-4 p-2 border rounded"
        />
        <label className="block mb-2">Pizza Price</label>
        <input
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          type="text"
          required
          className="w-full mb-4 p-2 border rounded"
        />
        <label className="block mb-2">Pizza Ingredients</label>
        <input
          name="ingredient"
          value={formData.ingredient}
          onChange={handleInputChange}
          type="text"
          required
          className="w-full mb-4 p-2 border rounded"
        />
        <label className="block mb-2">Pizza Image</label>
        <input
          name="image"
          value={formData.image}
          onChange={handleInputChange}
          type="text"
          required
          className="w-full mb-4 p-2 border rounded"
        />
        <button
          className="w-full p-2 bg-blue-500 text-white rounded"
          onClick={handleSubmit}
        >
          Add Pizza
        </button>
      </form>
    </div>
  );
}
