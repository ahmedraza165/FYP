import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";
import { createContext } from "react";
import AgencyRoute from "../components/routes/AgencyRoute";
import AOS from "aos";
import "aos/dist/aos.css";

const Form = () => {
  const [values, setValues] = useState({
    place: "",
    days: "",
    price: "",
    description: "",
    deadline: "",
    totalCount: "",
    loading: false,
  });
  
  useEffect(() => {
    AOS.init();
  }, []);

  const [image, setImage] = useState(null);
  const { state, dispatch } = useContext(Context);

  const [preview, setPreview] = useState("");
  const [uploadButtonText, setUploadButtonText] = useState("Upload Image");

  const { pack } = state;
  const router = useRouter();
  useEffect(() => {
    if (pack !== null) {
      router.push("/createnewpackage");
    }
  }, [pack]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
      const formData = new FormData();
      formData.append("place", values.place);
      formData.append("days", values.days);
      formData.append("price", values.price);
      formData.append("description", values.description);
      formData.append("deadline", values.deadline); // Append deadline
      formData.append("totalCount", values.totalCount); // Append totalCount
  
    // Append the image only if it's not null
    if (image) {
      formData.append("image", image);
    }

    try {
      setValues({ ...values, loading: true });
      await axios.post("/api/createnewpackage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Package Created");
      setValues({
        place: "",
        days: "",
        price: "",
        description: "",
        deadline:"",
        totalCount:"",
        loading: false,
      });
      setImage(null);
      setPreview(""); // Clear the image preview
      router.push("/instructor");
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.error
        : "Error saving data";
      toast.error(errorMessage);
      setValues({ ...values, loading: false });
    }
  };

  const handlePlaceChange = (e) => {
    const inputValue = e.target.value;
    const pattern = /^[a-zA-Z\s]*$/; // Regular expression pattern for alphabets and spaces only

    if (pattern.test(inputValue)) {
      setValues({ ...values, place: inputValue });
    } else {
      toast.error("Invalid input. Only alphabets and spaces are allowed.");
    }
  };

  const handleDaysChange = (e) => {
    const inputValue = e.target.value;
    const pattern = /^[0-9\b]+$/; // Regular expression pattern for numbers only

    if (pattern.test(inputValue)) {
      setValues({ ...values, days: inputValue });
    } else {
      toast.error("Invalid input. Only numbers are allowed.");
    }
  };

  const handlePriceChange = (e) => {
    const inputValue = e.target.value;
    const pattern = /^[0-9\b]+$/; // Regular expression pattern for numbers only

    if (pattern.test(inputValue)) {
      setValues({ ...values, price: inputValue });
    } else {
      toast.error("Invalid input. Only numbers are allowed.");
    }
  };

  const handleDescriptionChange = (e) => {
    setValues({ ...values, description: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0])); // Set image preview
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview("");
  };

  const handleCancel = () => {
    setValues({
      place: "",
      days: "",
      price: "",
      description: "",
      loading: false,
    });
    setImage(null);
    setPreview("");
  };
  const handleDeadlineChange = (e) => {
    setValues({ ...values, deadline: e.target.value });
  };
  
  const handleTotalCountChange = (e) => {
    setValues({ ...values, totalCount: e.target.value });
  };
  
  return (
    <AgencyRoute>
      <FormDataContext.Provider value={values}>
        <div className="p-5">
        <h1
            className="jumbotron1 text-center text-white"
            data-aos="fade-left"
            data-aos-duration="1500"
          >
           Create Package
          </h1>
          <form  onSubmit={handleSubmit} encType="multipart/form-data" className="text-center">
            <div>
              <label htmlFor="place"></label>
              <input
              type="text"
              className="input1"
              id="place"
              name="place"
              value={values.place}
              onChange={handlePlaceChange}
              placeholder="Enter Place"
              required
              />
            </div>
            <div>
              <label htmlFor="days"></label>
              <input
                type="text"
                id="days"
                className="input1"
                name="days"
                placeholder="Enter Days"
                value={values.days}
                onChange={handleDaysChange}
              />
            </div>
            <div>
              <label htmlFor="price"></label>
              <input
                type="text"
                id="price"
                name="price"
                className="input1"
                placeholder="Enter Price"
                value={values.price}
                onChange={handlePriceChange}
              />
            </div>
            <div>
              <label htmlFor="description"></label>
              <textarea
                id="description"
                name="description"
                value={values.description}
                className="input1"
                placeholder="Give Description here ....."
                onChange={handleDescriptionChange}
              ></textarea>
            </div>
            <div>
              <label htmlFor="deadline"></label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                className="input1"
                placeholder="Enter Deadline"
                value={values.deadline}
                onChange={handleDeadlineChange}
                required
              />
            </div>
            <div>
              <label htmlFor="totalCount"></label>
              <input
                type="number"
                id="totalCount"
                name="totalCount"
                className="input1"
                placeholder="Enter Total Count of People"
                value={values.totalCount}
                onChange={handleTotalCountChange}
                required
              />
            </div>
            <div>
              <label htmlFor="image"></label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  className="input1"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
            </div>
            <div className="mt-4 flex space-x-2">
            <button
              type="submit"
              style={{marginRight:'10px'}}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md transition duration-300 btn btn-success "
            >
              {values.loading ? "Uploading..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-red-500 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-md transition duration-300 btn btn-primary"
            >
              Cancel
            </button>
          </div>

          </form>
        </div>
      </FormDataContext.Provider>
    </AgencyRoute>
  );
};

export const FormDataContext = createContext(null);
export default Form;
