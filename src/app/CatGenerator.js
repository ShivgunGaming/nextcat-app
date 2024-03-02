"use client"

import React, { useState, useEffect } from "react";
import axios from "axios";

const CatGenerator = () => {
  const [catImage, setCatImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState(() => {
    const savedLikes = parseInt(localStorage.getItem("catLikes"));
    return isNaN(savedLikes) ? 0 : savedLikes;
  });
  const [liked, setLiked] = useState(false);
  const [likedCatImages, setLikedCatImages] = useState(() => {
    const savedLikedCatImages = localStorage.getItem("likedCatImages");
    return savedLikedCatImages ? JSON.parse(savedLikedCatImages) : [];
  });

  useEffect(() => {
    fetchCat();
  }, []);

  useEffect(() => {
    localStorage.setItem("catLikes", likes.toString());
    localStorage.setItem("likedCatImages", JSON.stringify(likedCatImages));
  }, [likes, likedCatImages]);

  const fetchCat = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.thecatapi.com/v1/images/search"
      );
      const catImageUrl = response.data[0].url;
      setCatImage(catImageUrl);
      setLiked(false);
    } catch (error) {
      console.error("Error fetching cat:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    setLikes((prevLikes) => {
      const newLikes = liked ? prevLikes - 1 : prevLikes + 1;
      setLiked(!liked);
      return newLikes;
    });

    if (!liked) {
      setLikedCatImages((prevLikedCatImages) => [
        ...prevLikedCatImages,
        catImage,
      ]);
    } else {
      setLikedCatImages((prevLikedCatImages) =>
        prevLikedCatImages.filter((image) => image !== catImage)
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        🐱 Cat-tastic Gallery
      </h1>
      <div className="flex items-center justify-center mb-8">
        <button
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
          onClick={fetchCat}
          disabled={loading}
        >
          {loading ? "Loading..." : "Get Random Cat"}
        </button>
      </div>
      {loading && (
        <p className="text-white text-lg text-center">Fetching a cat...</p>
      )}
      {catImage && (
        <div className="flex flex-col items-center mb-8">
          <div className="rounded-lg overflow-hidden shadow-lg mb-4">
            <img
              src={catImage}
              alt="Random Cat"
              className="w-96 h-96 object-cover object-center transition-transform transform hover:scale-105"
            />
          </div>
          <button
            className={`flex items-center justify-center bg-transparent rounded-full ${
              liked ? "text-red-500" : "text-gray-500"
            }`}
            onClick={handleLike}
            style={{ transition: "all 0.3s ease" }}
          >
            <span className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className={`w-8 h-8 fill-current ${
                  liked ? "text-red-500 transform scale-125" : "text-gray-500"
                }`}
                style={{
                  transition: "transform 0.2s ease",
                }}
              >
                {/* Heart icon */}
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span
                className={`absolute top-0 left-0 -ml-1 -mt-1 transform ${
                  liked ? "scale-0" : "scale-100 hidden"
                }`}
                style={{ transition: "transform 0.2s ease" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className={`w-8 h-8 fill-current text-gray-500`}
                >
                  {/* Heart icon */}
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </span>
            </span>
          </button>
        </div>
      )}
      {likedCatImages.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            Liked Cats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {likedCatImages.map((catImageUrl, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src={catImageUrl}
                  alt={`Liked Cat ${index + 1}`}
                  className="w-full h-96 object-cover object-center transition-transform transform hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <p className="text-white text-sm mt-8 text-center">
        Made with ❤️ by YourName
      </p>
    </div>
  );
};

export default CatGenerator;
