import React, { useState, useEffect } from "react";
import { TEInput, TERipple } from "tw-elements-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png";

import image1 from "../assets/img/pexels-mccutcheon-1153895.jpg";
import image2 from "../assets/img/pexels-quang-nguyen-vinh-222549-2166456.jpg";
import image3 from "../assets/img/pexels-hadyanphotograph-1328495.jpg";
import image4 from "../assets/img/pexels-j-mt_photography-628996-3680094.jpg";
import image5 from "../assets/img/pexels-digitalbuggu-191295.jpg";
import image6 from "../assets/img/pexels-orlovamaria-4915832.jpg";
import image7 from "../assets/img/pexels-solodsha-8105116.jpg";
import image8 from "../assets/img/pexels-digitalbuggu-352899.jpg";
import image9 from "../assets/img/pexels-jadson-thomas-164235-542556.jpg";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  // Artisan craft images
  const artisanImages = [
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    image7,
    image8,
    image9,
  ];

  // Crafting-related quotes
  const craftQuotes = [
    "Craftsmanship is the delicate balance of heart and technique.",
    "Every creation begins with a single thoughtful touch.",
    "In the hands of an artisan, ordinary materials become extraordinary.",
    "True craftsmanship leaves a mark that time cannot erase.",
    "Precision in every detail, passion in every piece.",
  ];

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem("ussr");
    if (user) navigate("/dashboard");
  }, [navigate]);

  // Image slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % artisanImages.length
      );
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic validation
    if (!username || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }
    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("https://artisan-psic.com/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        // Store token if provided in response
        if (data) {
          localStorage.setItem("ussr", JSON.stringify(data));
        }
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed");
      }
    } catch (error) {
      setError("Username or Password is incorrect!");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 p-4">
      {/* Background pattern - subtle craft tool pattern */}
      {/*  <div 
        className="fixed inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div> */}

      {/* Main container */}
      <div className="max-w-6xl w-full bg-white rounded-xl overflow-hidden shadow-2xl relative z-10 flex flex-col md:flex-row">
        {/* Left side - Large image display */}
        <div className="md:w-7/12 relative">
          {/* Main background - image slideshow */}
          <div className="relative h-64 md:h-full overflow-hidden">
            {artisanImages.map((img, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
                  idx === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={img}
                  alt={`Artisan craft showcase ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}

            {/* Overlay with craft-themed elements */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6 md:p-10">
              {/* Decorative pattern element - mimicking traditional craft pattern */}
              <div className="absolute top-0 left-0 right-0 h-16 opacity-30">
                <svg width="100%" height="100%" viewBox="0 0 100 20">
                  <pattern
                    id="craftPattern"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M0,10 L20,10 M10,0 L10,20"
                      stroke="white"
                      strokeWidth="1"
                    />
                    <circle
                      cx="10"
                      cy="10"
                      r="3"
                      fill="none"
                      stroke="white"
                      strokeWidth="1"
                    />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#craftPattern)" />
                </svg>
              </div>

              {/* Quote display */}
              <div className="mb-8">
                <p className="text-white/90 text-xl md:text-2xl font-serif italic">
                  "{craftQuotes[currentImageIndex % craftQuotes.length]}"
                </p>
              </div>

              {/* Bottom navigation dots */}
              <div className="flex space-x-2">
                {artisanImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    aria-label={`View image ${idx + 1}`}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === currentImageIndex
                        ? "bg-white scale-125"
                        : "bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form with craftsman theme */}
        <div className="md:w-5/12 p-6 md:p-10 flex flex-col">
          {/* Top decoration - craftsman tools silhouette */}
          <div className="flex justify-center mb-8">
            <div className="relative w-full max-w-[200px]">
              <img
                src={logo}
                alt="Artisan Logo"
                className="w-full h-auto object-contain"
              />
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-stone-800 to-transparent"></div>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2">
            Welcome
          </h2>
          <p className="text-stone-600 mb-8">
            Sign in to access your artisan dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <TEInput
                type="text"
                label="Username"
                size="lg"
                value={username}
                onChange={(e) => setUsername(e.target.value.trim())}
                className="peer"
              />
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-stone-800 transition-all duration-300 group-hover:w-full peer-focus:w-full"></div>
            </div>

            <div className="relative group">
              <TEInput
                type="password"
                label="Password"
                size="lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer"
              />
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-stone-800 transition-all duration-300 group-hover:w-full peer-focus:w-full"></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-stone-800 focus:ring-stone-700 border-stone-300 rounded"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-stone-600"
                >
                  Remember me
                </label>
              </div>

              <a
                href="#"
                className="text-sm font-medium text-stone-700 hover:text-stone-900 underline-offset-4 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border-l-4 border-red-600 text-red-700 text-sm">
                <div className="flex">
                  <svg
                    className="h-5 w-5 text-red-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <TERipple rippleColor="light" className="w-full">
              <button
                type="submit"
                disabled={isLoading}
                className={`
                  w-full relative overflow-hidden py-3 px-4
                  text-white font-medium rounded-md
                  transition-all duration-300
                  bg-stone-800 hover:bg-stone-900
                  ${isLoading ? "opacity-80 cursor-not-allowed" : ""}
                `}
              >
                {/* Decorative element - craft tool pattern */}
                <span className="absolute inset-0 opacity-10">
                  <svg width="100%" height="100%">
                    <pattern
                      id="btnPattern"
                      x="0"
                      y="0"
                      width="10"
                      height="10"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M0,5 L10,5 M5,0 L5,10"
                        stroke="white"
                        strokeWidth="0.5"
                      />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#btnPattern)" />
                  </svg>
                </span>

                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Authenticating...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </TERipple>
          </form>

          {/* Footer with craft motif */}
          <div className="mt-2 flex items-center justify-center">
            <div className="flex items-center">
              {/* Decorative craft-themed elements */}
              <div className="mt-12 pt-8 border-t border-gray-200 text-center relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-4">
                  <svg
                    className="w-6 h-6 text-black/20"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">
                  Handcrafted with pride and passion
                </p>
                <p className="text-sm text-gray-400">
                  <a href="https://www.processjunction.com" className="">
                    ProcessJunction Pvt. Ltd
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ornamental border - inspired by traditional craft techniques */}
      {/*  <div className="fixed bottom-0 left-0 right-0 h-6 bg-stone-800 opacity-80">
        <svg width="100%" height="100%" preserveAspectRatio="none">
          <pattern id="borderPattern" width="20" height="6" patternUnits="userSpaceOnUse">
            <path d="M0,0 L10,6 L20,0" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#borderPattern)" />
        </svg>
      </div> */}
    </div>
  );
};

export default Login;
