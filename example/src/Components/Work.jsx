import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { Rating } from "primereact/rating";
import { motion, AnimatePresence } from "framer-motion";

const Work = () => {
  const [selectedOption, setSelectedOption] = useState(localStorage.getItem("selectedOption") || null);

  const [inputs, setInputs] = useState(() => {
    const storedInputs = localStorage.getItem("inputs");
    const parsedInputs = storedInputs ? JSON.parse(storedInputs) : { A: "", B: "", C: "", D: "", E: "", imageUrl: "" };
    return parsedInputs && parsedInputs.A !== undefined && parsedInputs.B !== undefined
      ? parsedInputs
      : { A: "", B: "", C: "", D: "", E: "", imageUrl: "" };
  });

  const [age, setAge] = useState(null);

  const [entries, setEntries] = useState(() => {
    const storedEntries = localStorage.getItem("entries");
    return storedEntries ? JSON.parse(storedEntries) : [];
  });

  const items = [
    { label: "About Me", value: "item2" },
    { label: "Skills", value: "item3" },
    { label: "Education", value: "item0" },
    { label: "Experience", value: "item1" },
  ];

  useEffect(() => {
    if (selectedOption) {
      localStorage.setItem("selectedOption", selectedOption);
    }
  }, [selectedOption]);

  useEffect(() => {
    localStorage.setItem("inputs", JSON.stringify(inputs));
    if (inputs.C && inputs.D) {
      setAge(calculateAgeAtFutureDate());
    }
  }, [inputs]);

  useEffect(() => {
    localStorage.setItem("entries", JSON.stringify(entries));
  }, [entries]);

  const handleDropdownChange = (e) => {
    setSelectedOption(e.value);
    setInputs({ A: "", B: "", C: "", D: "", E: "", imageUrl: "" });
  };

  const handleInputChange = (e, inputName) => {
    e.preventDefault();
    const value =
      (inputName === "C" || inputName === "D") && selectedOption !== "item2"
        ? e.value
        : e.target.value;
    setInputs((prev) => ({
      ...prev,
      [inputName]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInputs((prev) => ({
          ...prev,
          imageUrl: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (date) => {
    if (!date || isNaN(new Date(date))) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleCalendarChange = (e, key) => {
    const formattedDate = formatDate(e.value);
    setInputs((prev) => ({
      ...prev,
      [key]: formattedDate,
    }));
  };

  const calculateAgeAtFutureDate = () => {
    if (!inputs.B || !inputs.C || typeof inputs.B !== "string" || typeof inputs.C !== "string") {
      return "";
    }

    const birthDateParts = inputs.C.split("/");
    const futureDateParts = inputs.D.split("/");

    if (birthDateParts.length !== 3 || futureDateParts.length !== 3) {
      return "Invalid date format";
    }

    const [birthDay, birthMonth, birthYear] = birthDateParts;
    const [futureDay, futureMonth, futureYear] = futureDateParts;

    const birthDate = new Date(`${birthYear}-${birthMonth}-${birthDay}`);
    const futureDate = new Date(`${futureYear}-${futureMonth}-${futureDay}`);

    if (isNaN(birthDate) || isNaN(futureDate)) {
      return "Invalid dates";
    }

    let age = futureDate.getFullYear() - birthDate.getFullYear();

    const notHadBirthdayYet =
      futureDate.getMonth() < birthDate.getMonth() ||
      (futureDate.getMonth() === birthDate.getMonth() && futureDate.getDate() < birthDate.getDate());

    if (notHadBirthdayYet) {
      age--;
    }

    return age;
  };

  const handleAdd = () => {
    if (selectedOption) {
      let isValid = false;

      if (selectedOption === "item2") {
        isValid = inputs.A && inputs.B && inputs.C && inputs.D && inputs.E;
      } else if (selectedOption === "item3") {
        isValid = inputs.A && inputs.B; // Only require A and Rating (stored in B)
      } else {
        isValid = inputs.A && inputs.B && inputs.C && inputs.D;
      }

      if (isValid) {
        const ageResult = selectedOption !== "item3" ? calculateAgeAtFutureDate() : null;
        setEntries((prev) => [...prev, { ...inputs, age: ageResult, category: selectedOption }]);
        setInputs({ A: "", B: "", C: "", D: "", E: "", imageUrl: "" });
      } else {
        alert("Please fill in all required fields");
      }
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.8 }
    },
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen bg-gray-100 p-8 space-y-6 lg:space-y-0 lg:space-x-8">
      {/* Left side - Resume Preview with luxury styling and animations */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-10 w-full lg:w-1/2 min-h-[300px] flex flex-col overflow-y-auto space-y-8 relative"
      >
        {/* Decorative elements */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.5 }}
          className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
          {/* About Me Section */}
          <motion.div variants={itemVariants}>
            {entries.filter((entry) => entry.category === "item2").length === 0 ? (
              " "
            ) : (
              entries
                .filter((entry) => entry.category === "item2")
                .map((entry, index) => (
                  <motion.div 
                    key={index} 
                    className="text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    {entry.imageUrl && (
                      <motion.div 
                        className="mb-6 flex justify-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      >
                        <img
                          src={entry.imageUrl}
                          alt="Profile"
                          className="w-40 h-40 object-cover rounded-full border-4 border-indigo-400 shadow-lg shadow-indigo-300/30"
                        />
                      </motion.div>
                    )}

                    <motion.div 
                      className="text-center mb-6"
                      variants={fadeInVariants}
                    >
                      <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-purple-400 text-transparent bg-clip-text">
                        {entry.A} {entry.B}
                      </h2>
                      <div className="mt-3 w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
                    </motion.div>

                    <motion.div 
                      className="mt-6 space-y-3 backdrop-blur-sm bg-white/5 p-5 rounded-xl"
                      variants={fadeInVariants}
                    >
                      <p className="flex items-center">
                        <span className="inline-block mr-2 text-indigo-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                        </span>
                        <span className="font-light">{entry.C}</span>
                      </p>
                      <p className="flex items-center">
                        <span className="inline-block mr-2 text-indigo-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="font-light">Born: {entry.D}</span>
                      </p>
                      <p className="flex items-center">
                        <span className="inline-block mr-2 text-indigo-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="font-light">{entry.E}</span>
                      </p>
                    </motion.div>
                  </motion.div>
                ))
            )}
          </motion.div>

          {/* Education Section */}
          <motion.div variants={itemVariants}>
            {entries.filter((entry) => entry.category === "item0").length === 0 ? (
              " "
            ) : (
              <motion.div 
                className="text-white space-y-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <motion.h3 
                  className="text-2xl font-bold mb-4 flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-indigo-300 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                  </span>
                  Education
                </motion.h3>

                <AnimatePresence>
                  {entries
                    .filter((entry) => entry.category === "item0")
                    .map((entry, index) => (
                      <motion.div 
                        key={index} 
                        className="mb-6 p-4 backdrop-blur-sm bg-white/5 rounded-xl border border-indigo-500/20 hover:border-indigo-400/40 transition-all duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.2 }}
                        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.07)" }}
                      >
                        <h3 className="text-xl font-bold text-indigo-200">{entry.A}</h3>
                        <div className="mt-1 w-16 h-1 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full"></div>
                        <div className="mt-3 text-gray-300 italic flex items-center gap-2">
                          <span className="text-xs text-indigo-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </span>
                          {entry.C} - {entry.D}
                        </div>
                        <div className="mt-2 text-gray-200">{entry.B}</div>
                        <div className="mt-3">
                          <span className="text-xs font-semibold bg-gradient-to-r from-indigo-600 to-blue-700 px-3 py-1 rounded-full">
                            {entry.age} years
                          </span>
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
          {/* Skills Section */}
          <motion.div variants={itemVariants}>
            {entries.filter((entry) => entry.category === "item3").length === 0 ? (
              " "
            ) : (
              <motion.div 
                className="text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <motion.h3 
                  className="text-2xl font-bold mb-4 flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-indigo-300 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </span>
                  Skills
                </motion.h3>

                <div className="space-y-4">
                  {entries
                    .filter((entry) => entry.category === "item3")
                    .map((entry, index) => (
                      <motion.div 
                        key={index} 
                        className="p-3 backdrop-blur-sm bg-white/5 rounded-lg border border-indigo-500/20"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.07)" }}
                      >
                        <p className="text-lg font-medium mb-2 text-indigo-200">{entry.A}</p>
                        <div className="mt-1">
                          <Rating className="flex" value={entry.B} readOnly cancel={false} />
                        </div>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Experience Section */}
          <motion.div variants={itemVariants}>
            {entries.filter((entry) => entry.category === "item1").length === 0 ? (
              " "
            ) : (
              <motion.div 
                className="text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <motion.h3 
                  className="text-2xl font-bold mb-4 flex items-center"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-indigo-300 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  Experience
                </motion.h3>

                <div className="space-y-6">
                  {entries
                    .filter((entry) => entry.category === "item1")
                    .map((entry, index) => (
                      <motion.div 
                        key={index} 
                        className="p-4 backdrop-blur-sm bg-white/5 rounded-xl border border-rose-500/20 hover:border-rose-400/40 transition-all duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.2 }}
                        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.07)" }}
                      >
                        <h3 className="text-xl font-bold text-rose-200">{entry.A}</h3>
                        <div className="mt-1 w-16 h-1 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full"></div>
                        <div className="mt-3 text-gray-300 italic flex items-center gap-2">
                          <span className="text-xs text-rose-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </span>
                          {entry.C} - {entry.D}
                        </div>
                        <div className="mt-2 text-gray-200">{entry.B}</div>
                        <div className="mt-3">
                          <span className="text-xs font-semibold bg-gradient-to-r from-rose-600 to-pink-700 px-3 py-1 rounded-full">
                            {entry.age} years
                          </span>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Form inputs */}
      <div className="bg-white rounded-lg shadow-lg p-8 w-full lg:w-1/2">
        <div className="mb-6 relative">
          <Dropdown
            value={selectedOption}
            onChange={handleDropdownChange}
            options={items}
            optionLabel="label"
            optionValue="value"
            placeholder="Select a Category"
            className="w-full border-2 border-gray-300 rounded-lg shadow-sm"
            panelClassName="rounded-lg shadow-xl border border-gray-200 bg-white"
          />
          <div className="absolute top-3 right-4 text-gray-500">
            <i className="pi pi-chevron-down"></i>
          </div>
        </div>

        {selectedOption === "item2" ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center mb-2">
              {inputs.imageUrl ? (
                <div className="relative mb-3">
                  <img
                    src={inputs.imageUrl}
                    alt="Profile Preview"
                    className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
                  />
                  <button
                    onClick={() => setInputs((prev) => ({ ...prev, imageUrl: "" }))}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                    title="Remove image"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}

              <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition">
                Upload Picture
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">First Name</label>
              <input
                type="text"
                value={inputs.A}
                onChange={(e) => handleInputChange(e, "A")}
                placeholder="Enter First Name"
                className="p-3 border-2 border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out hover:border-blue-400 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Last Name</label>
              <input
                type="text"
                value={inputs.B}
                onChange={(e) => handleInputChange(e, "B")}
                placeholder="Enter Last Name"
                className="p-3 border-2 border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out hover:border-blue-400 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Telephone number</label>
              <input
                type="number"
                value={inputs.C}
                onChange={(e) => handleInputChange(e, "C")}
                placeholder="Enter tel number"
                className="p-3 border-2 border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out hover:border-blue-400 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col flex-1">
              <label className="text-gray-700 font-medium mb-1">Birthday</label>
              <Calendar
                value={inputs.D ? new Date(inputs.D.split("/").reverse().join("-")) : null}
                onChange={(e) => handleCalendarChange(e, "D")}
                dateFormat="dd/mm/yy"
                placeholder="Date of birth"
                monthNavigator
                yearNavigator
                yearRange="1900:2025"
                showIcon
                className="p-inputtext p-component p-calendar w-full border-2 border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out hover:border-blue-400 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Gender</label>
              <select
                value={inputs.E || ""}
                onChange={(e) => handleInputChange(e, "E")}
                className="p-3 border-2 border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out hover:border-blue-400 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <button
              onClick={handleAdd}
              className="mt-4 w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Save Personal Info
            </button>
          </div>
        ) : selectedOption === "item3" ? (
          // Skills form - only A and ratings
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Skill Name</label>
              <input
                type="text"
                value={inputs.A}
                onChange={(e) => handleInputChange(e, "A")}
                placeholder="Enter skill name"
                className="p-3 border-2 border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out hover:border-blue-400                hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Skill Level</label>
              <Rating
                value={inputs.B}
                onChange={(e) => handleInputChange(e, "B")}
                cancel={false}
              />
            </div>

            <button
              onClick={handleAdd}
              className="mt-4 w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Save Skill
            </button>
          </div>
        ) : selectedOption === "item0" || selectedOption === "item1" ? (
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                {selectedOption === "item0" ? "School / University Name" : "Company Name"}
              </label>
              <input
                type="text"
                value={inputs.A}
                onChange={(e) => handleInputChange(e, "A")}
                placeholder={
                  selectedOption === "item0"
                    ? "Enter name of the school or university"
                    : "Enter name of the company"
                }
                className="p-3 border-2 border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out hover:border-blue-400 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">
                {selectedOption === "item0" ? "Degree / Major" : "Position Title"}
              </label>
              <input
                type="text"
                value={inputs.B}
                onChange={(e) => handleInputChange(e, "B")}
                placeholder={
                  selectedOption === "item0"
                    ? "Enter your degree or field of study"
                    : "Enter your job title"
                }
                className="p-3 border-2 border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out hover:border-blue-400 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">Start Date</label>
              <Calendar
                value={inputs.C ? new Date(inputs.C.split("/").reverse().join("-")) : null}
                onChange={(e) => handleCalendarChange(e, "C")}
                dateFormat="dd/mm/yy"
                placeholder="Start Date"
                monthNavigator
                yearNavigator
                yearRange="1900:2025"
                showIcon
                className="p-inputtext p-component p-calendar w-full border-2 border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out hover:border-blue-400 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">End Date</label>
              <Calendar
                value={inputs.D ? new Date(inputs.D.split("/").reverse().join("-")) : null}
                onChange={(e) => handleCalendarChange(e, "D")}
                dateFormat="dd/mm/yy"
                placeholder="End Date"
                monthNavigator
                yearNavigator
                yearRange="1900:2025"
                showIcon
                className="p-inputtext p-component p-calendar w-full border-2 border-gray-300 rounded-lg shadow-sm transition duration-300 ease-in-out hover:border-blue-400 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleAdd}
              className="mt-4 w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Save {selectedOption === "item0" ? "Education" : "Experience"}
            </button>
          </div>
        ) : (
          <div className="text-gray-500 text-center mt-10">
            Please select a category to begin entering your information.
          </div>
        )}
      </div>
    </div>
  );
};

export default Work;
