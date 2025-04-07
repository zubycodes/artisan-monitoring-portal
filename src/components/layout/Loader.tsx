import React, { useEffect, useState } from "react";

const Loader = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(function animate() {
      setRotation((prev) => (prev + 1) % 360);
      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="flex items-center justify-center flex-col h-full w-full">
      <div className="relative w-64 h-64 mt-6">
        {/* Outer spinning circle */}
        <div
          className="absolute inset-0 border-8 border-transparent rounded-full"
          style={{
            borderTopColor: "#E57373", // Red
            borderRightColor: "#FFB74D", // Orange
            transform: `rotate(${rotation}deg)`,
            transition: "transform 0.05s linear",
          }}
        />

        {/* Middle spinning circle - opposite direction */}
        <div
          className="absolute inset-4 border-8 border-transparent rounded-full"
          style={{
            borderTopColor: "#4FC3F7", // Blue
            borderLeftColor: "#81C784", // Green
            transform: `rotate(${-rotation * 1.5}deg)`,
            transition: "transform 0.05s linear",
          }}
        />

        {/* Inner spinning circle */}
        <div
          className="absolute inset-8 border-8 border-transparent rounded-full"
          style={{
            borderBottomColor: "#BA68C8", // Purple
            borderRightColor: "#FFD54F", // Yellow
            transform: `rotate(${rotation * 2}deg)`,
            transition: "transform 0.05s linear",
          }}
        />

        {/* Central dots representing artisan craftsmanship */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-12 h-12">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  transform: `rotate(${angle}deg) translateY(-8px)`,
                  opacity: (Math.sin((rotation + angle) * 0.017) + 1) / 2,
                }}
              />
            ))}
            <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Text with gradient effect */}
      <div className="relative text-center">
        <p className="text-lg mt-6 font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Crafting Experience
        </p>
        <div className="flex justify-center mt-2 space-x-1">
          <div
            className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Loader;
