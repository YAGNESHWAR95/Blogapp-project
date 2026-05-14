// import react and form
import React from "react";
import { useForm } from "react-hook-form";

// add article component
function AddArticle() {

  // form hook
  const { register, handleSubmit, formState:{errors} } = useForm();

  // submit function
  const submitArticle = (data)=>{
    console.log(data);
  };

  // return form
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">

      <form
        onSubmit={handleSubmit(submitArticle)}
        className="bg-gray-100 p-8 w-full max-w-md rounded shadow text-center"
      >

        <h2 className="text-xl font-semibold mb-6">
          Add Article
        </h2>

        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 bg-gray-300 mb-3"
          {...register("title",{required:true})}
        />

        {errors.title && (
          <p className="text-red-500 text-sm mb-2">
            Title is required
          </p>
        )}

        {/* Category */}
        <select
          className="w-full p-2 bg-gray-300 mb-3"
          {...register("category",{required:true})}
        >
          <option value="">Select Category</option>
          <option value="technology">Technology</option>
          <option value="education">Education</option>
          <option value="health">Health</option>
          <option value="sports">Sports</option>
        </select>

        {errors.category && (
          <p className="text-red-500 text-sm mb-2">
            Category is required
          </p>
        )}

        {/* Content */}
        <textarea
          rows="5"
          placeholder="Content"
          className="w-full p-2 bg-gray-300 mb-6"
          {...register("content",{required:true})}
        ></textarea>

        {errors.content && (
          <p className="text-red-500 text-sm mb-2">
            Content is required
          </p>
        )}

        {/* Publish Button */}
        <button
          type="submit"
          className="bg-sky-500 text-white px-6 py-2 rounded hover:bg-sky-600 transition"
        >
          Publish Article
        </button>

      </form>

    </div>
  );
}

export default AddArticle;