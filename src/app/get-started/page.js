"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function GetStartedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('service');
  
  const [step, setStep] = useState("intro"); // intro, info, shipping, survey, completion, submitting
  const [questions, setQuestions] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // User Info State
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    birthday: "",
    sex: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    termsAccepted: false,
  });

  // Answers State
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    fetchQuestions();
    if (serviceId) {
      fetchServiceName();
    }
  }, [serviceId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && step === "survey") {
        const currentQ = questions[currentQuestionIndex];
        const hasAnswer = answers[currentQ._id];
        if (hasAnswer || !currentQ.required) {
          handleNextQuestion();
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, currentQuestionIndex, answers, questions]);

  const fetchQuestions = async () => {
    try {
      const url = serviceId 
        ? `/api/survey/questions?serviceId=${serviceId}`
        : "/api/survey/questions";
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setQuestions(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch questions", error);
    }
  };

  const fetchServiceName = async () => {
    try {
      const res = await fetch(`/api/services/${serviceId}`);
      const data = await res.json();
      if (data.success) {
        setServiceName(data.data.name);
      }
    } catch (error) {
      console.error("Failed to fetch service", error);
    }
  };

  const handleStart = () => setStep("info");

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    if (!userInfo.termsAccepted) {
      alert("Please accept the Terms and Conditions to proceed.");
      return;
    }
    setStep("shipping");
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (questions.length > 0) {
      setStep("survey");
    } else {
      submitSurvey();
    }
  };

  const handleNextQuestion = () => {
    const currentQ = questions[currentQuestionIndex];
    if (currentQ.required) {
      const answer = answers[currentQ._id];
      const hasAnswer = Array.isArray(answer) ? answer.length > 0 : !!answer;
      if (!hasAnswer) {
        alert("Please answer this question to proceed.");
        return;
      }
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setStep("completion");
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleOptionSelect = (qId, value) => {
    setAnswers({ ...answers, [qId]: value });
    const currentQ = questions[currentQuestionIndex];
    if (currentQ.type === 'radio' || currentQ.type === 'select') {
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        }
      }, 400);
    }
  };

  const submitSurvey = async () => {
    setStep("submitting");
    
    const formattedAnswers = questions.map(q => ({
      questionId: q._id,
      questionText: q.questionText,
      answer: answers[q._id] || "",
    }));

    try {
      const res = await fetch("/api/survey/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInfo, answers: formattedAnswers }),
      });
      
      const data = await res.json();
      if (data.success) {
        router.push("/");
      } else {
        alert("Something went wrong. Please try again.");
        setStep("survey");
      }
    } catch (error) {
      alert("Failed to submit. Please check your connection.");
      setStep("survey");
    }
  };

  const currentQ = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-secondary">
      {/* Progress Bar */}
      {(step === 'survey' || step === 'submitting') && (
        <div className="fixed top-0 left-0 w-full z-50">
          <div className="h-1 bg-gray-100 w-full">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${step === 'survey' ? progress : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Intro Step */}
      {step === 'intro' && (
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 max-w-5xl mx-auto w-full px-6 py-20">
          <div className="flex-1 flex justify-center md:justify-end animate-fadeIn">
            <h1 className="font-serif text-6xl md:text-8xl font-bold text-secondary tracking-tight">
              Survey<span className="text-primary">.</span>
            </h1>
          </div>
          
          <div className="flex-1 max-w-md text-left">
            <h2 className="text-3xl md:text-4xl font-light text-secondary mb-4 leading-tight animate-fadeIn">
              New Account Registration
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed animate-fadeIn">
              Fill out our brief 2-minute account registration questionnaire.
            </p>

            <button
              onClick={handleStart}
              className="px-8 py-3 bg-secondary text-white rounded-full font-bold text-sm tracking-wide hover:bg-secondary/90 transition-all shadow-md animate-fadeIn"
            >
              Let's Get Started
            </button>
            
            <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 font-medium animate-fadeIn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
              </svg>
              Takes 1 minute 30 seconds
            </div>
          </div>
        </div>
      )}

      {/* Completion Step */}
      {step === 'completion' && (
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 max-w-6xl mx-auto w-full px-6 py-20 animate-fadeIn">
          <div className="flex-1 flex justify-center md:justify-end">
            <h1 className="font-serif text-6xl md:text-8xl font-bold text-secondary tracking-tight">
              Survey<span className="text-primary">.</span>
            </h1>
          </div>
          
          <div className="flex-1 max-w-md text-left">
            <h2 className="text-3xl md:text-4xl font-light text-secondary mb-6 leading-tight">
              Thank you for completing your registration!
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We'll review your submission and get back to you within 24 hours.
            </p>

            <button
              onClick={submitSurvey}
              className="px-8 py-3 bg-secondary text-white rounded-full font-bold text-lg tracking-wide hover:bg-secondary/90 transition-all shadow-md"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Info & Shipping Steps */}
      {step !== 'survey' && step !== 'intro' && step !== 'completion' && (
        <div className="flex-1 flex flex-col justify-center px-6 max-w-4xl mx-auto w-full">
          <div className="mb-8 text-center animate-fadeIn">
            <Link href="/" className="inline-block mb-8">
              <span className="font-serif text-4xl font-bold">
                Survey<span className="text-primary">.</span>
              </span>
            </Link>
          </div>

          {step === 'info' && (
            <div className="w-full max-w-2xl mx-auto py-20 animate-fadeIn">
              <h2 className="text-2xl font-light text-secondary mb-8 flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-primary text-white flex items-center justify-center text-xs font-bold">1</span>
                Let's get to know you!*
              </h2>
              
              <form onSubmit={handleInfoSubmit} className="space-y-8 pl-9">
                <div className="space-y-2 group">
                  <label className="text-sm text-secondary block">First name*</label>
                  <input 
                    type="text" 
                    className="w-full pb-2 border-b border-gray-200 focus:border-primary outline-none transition-colors bg-transparent text-2xl text-primary placeholder:text-gray-300 font-light"
                    placeholder="Jane" 
                    required 
                    value={userInfo.firstName} 
                    onChange={e => setUserInfo({...userInfo, firstName: e.target.value})} 
                  />
                </div>

                <div className="space-y-2 group">
                  <label className="text-sm text-secondary block">Last name*</label>
                  <input 
                    type="text" 
                    className="w-full pb-2 border-b border-gray-200 focus:border-primary outline-none transition-colors bg-transparent text-2xl text-primary placeholder:text-gray-300 font-light"
                    placeholder="Doe" 
                    required 
                    value={userInfo.lastName} 
                    onChange={e => setUserInfo({...userInfo, lastName: e.target.value})} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2 group">
                    <label className="text-sm text-secondary block">Date of Birth*</label>
                    <input 
                      type="date" 
                      className="w-full pb-2 border-b border-gray-200 focus:border-primary outline-none transition-colors bg-transparent text-2xl text-primary font-light"
                      required 
                      value={userInfo.birthday} 
                      onChange={e => setUserInfo({...userInfo, birthday: e.target.value})} 
                    />
                  </div>
                  
                  <div className="space-y-2 group">
                    <label className="text-sm text-secondary block">Sex*</label>
                    <select 
                      className="w-full pb-2 border-b border-gray-200 focus:border-primary outline-none transition-colors bg-transparent text-2xl text-primary font-light"
                      required 
                      value={userInfo.sex} 
                      onChange={e => setUserInfo({...userInfo, sex: e.target.value})} 
                    >
                      <option value="" disabled>Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-sm text-secondary block">Phone number*</label>
                  <input 
                    type="tel" 
                    className="w-full pb-2 border-b border-gray-200 focus:border-primary outline-none transition-colors bg-transparent text-2xl text-primary placeholder:text-gray-300 font-light"
                    placeholder="(555) 555-5555" 
                    required 
                    value={userInfo.phone} 
                    onChange={e => setUserInfo({...userInfo, phone: e.target.value})} 
                  />
                </div>

                <div className="space-y-2 group">
                  <label className="text-sm text-secondary block">Email*</label>
                  <input 
                    type="email" 
                    className="w-full pb-2 border-b border-gray-200 focus:border-primary outline-none transition-colors bg-transparent text-2xl text-primary placeholder:text-gray-300 font-light"
                    placeholder="name@example.com" 
                    required 
                    value={userInfo.email} 
                    onChange={e => setUserInfo({...userInfo, email: e.target.value})} 
                  />
                </div>

                <div className="space-y-2 group">
                  <label className="text-sm text-secondary block">Company*</label>
                  <input 
                    type="text" 
                    className="w-full pb-2 border-b border-gray-200 focus:border-primary outline-none transition-colors bg-transparent text-2xl text-primary placeholder:text-gray-300 font-light"
                    placeholder="Acme Corp" 
                    required
                    value={userInfo.company} 
                    onChange={e => setUserInfo({...userInfo, company: e.target.value})} 
                  />
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={userInfo.termsAccepted}
                    onChange={(e) => setUserInfo({ ...userInfo, termsAccepted: e.target.checked })}
                    className="mt-1 h-5 w-5 cursor-pointer rounded border border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600 leading-snug cursor-pointer">
                    I agree to the <a href="#" className="text-primary hover:underline">Terms and Conditions</a> & <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                  </label>
                </div>

                <div className="pt-6">
                  <button type="submit" className="px-8 py-2 bg-secondary text-white rounded font-bold hover:bg-secondary/90 transition-all text-lg shadow-sm">
                    OK 
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 'shipping' && (
            <div className="w-full max-w-2xl mx-auto py-20 animate-fadeIn">
              <h2 className="text-2xl font-light text-secondary mb-8 flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-primary text-white flex items-center justify-center text-xs font-bold">2</span>
                Please provide your shipping address*
              </h2>
              
              <form onSubmit={handleShippingSubmit} className="space-y-8 pl-9">
                <div className="space-y-2 group">
                  <label className="text-sm text-secondary block">Address*</label>
                  <input 
                    type="text" 
                    className="w-full pb-2 border-b border-gray-200 focus:border-primary outline-none transition-colors bg-transparent text-2xl text-primary placeholder:text-gray-300 font-light"
                    placeholder="65 Hansen Way" 
                    required
                    value={userInfo.address} 
                    onChange={e => setUserInfo({...userInfo, address: e.target.value})} 
                  />
                </div>

                <div className="space-y-2 group">
                  <label className="text-sm text-secondary block">Address line 2</label>
                  <input 
                    type="text" 
                    className="w-full pb-2 border-b border-gray-200 focus:border-primary outline-none transition-colors bg-transparent text-2xl text-primary placeholder:text-gray-300 font-light"
                    placeholder="Apartment 4" 
                    value={userInfo.addressLine2} 
                    onChange={e => setUserInfo({...userInfo, addressLine2: e.target.value})} 
                  />
                </div>

                <div className="space-y-2 group">
                  <label className="text-sm text-secondary block">City*</label>
                  <input 
                    type="text" 
                    className="w-full pb-2 border-b border-gray-200 focus:border-primary outline-none transition-colors bg-transparent text-2xl text-primary placeholder:text-gray-300 font-light"
                    placeholder="Palo Alto" 
                    required
                    value={userInfo.city} 
                    onChange={e => setUserInfo({...userInfo, city: e.target.value})} 
                  />
                </div>

                <div className="space-y-2 group">
                  <label className="text-sm text-secondary block">State*</label>
                  <input 
                    type="text" 
                    className="w-full pb-2 border-b border-gray-200 focus:border-primary outline-none transition-colors bg-transparent text-2xl text-primary placeholder:text-gray-300 font-light"
                    placeholder="California" 
                    required
                    value={userInfo.state} 
                    onChange={e => setUserInfo({...userInfo, state: e.target.value})} 
                  />
                </div>

                <div className="space-y-2 group">
                  <label className="text-sm text-secondary block">Zip Code*</label>
                  <input 
                    type="text" 
                    className="w-full pb-2 border-b border-gray-200 focus:border-primary outline-none transition-colors bg-transparent text-2xl text-primary placeholder:text-gray-300 font-light"
                    placeholder="94304" 
                    required
                    value={userInfo.zipCode} 
                    onChange={e => setUserInfo({...userInfo, zipCode: e.target.value})} 
                  />
                </div>

                <div className="pt-6">
                  <button type="submit" className="px-8 py-2 bg-secondary text-white rounded font-bold hover:bg-secondary/90 transition-all text-lg shadow-sm">
                    OK 
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 'submitting' && (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="text-xl font-bold text-secondary">Submitting...</h3>
              <p className="text-gray-500 mt-2">Just a moment please.</p>
            </div>
          )}
        </div>
      )}

      {/* Survey Step */}
      {step === 'survey' && currentQ && (
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-3xl mx-auto px-6 py-20 relative">
          <div className="w-full animate-fadeIn">
            <h2 className="text-2xl md:text-3xl font-light text-secondary mb-12 flex items-start gap-4 leading-snug">
              <span className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0 mt-1">
                {currentQuestionIndex + 3}
              </span>
              <div>
                {currentQ.questionText} {currentQ.required && <span className="text-red-500">*</span>}
              </div>
            </h2>

            <div className="ml-12 space-y-6 max-w-xl">
              {currentQ.type === 'text' && (
                <input 
                  type="text"
                  value={answers[currentQ._id] || ""}
                  onChange={e => setAnswers({...answers, [currentQ._id]: e.target.value})}
                  className="w-full pb-2 border-b border-gray-200 focus:border-primary outline-none transition-colors bg-transparent text-2xl text-primary placeholder:text-gray-300 font-light"
                  placeholder="Type your answer here..."
                  autoFocus
                />
              )}

              {currentQ.type === 'textarea' && (
                <textarea 
                  rows={3}
                  value={answers[currentQ._id] || ""}
                  onChange={e => setAnswers({...answers, [currentQ._id]: e.target.value})}
                  className="w-full pb-2 border-b border-gray-200 focus:border-primary outline-none transition-colors bg-transparent text-xl text-primary placeholder:text-gray-300 font-light resize-none"
                  placeholder="Type your answer here..."
                  autoFocus
                />
              )}
              
              {['radio', 'select'].includes(currentQ.type) && (
                <div className="space-y-3">
                  {currentQ.options?.map((opt, idx) => {
                    const isSelected = answers[currentQ._id] === opt;
                    const letter = LETTERS[idx] || (idx + 1);
                    return (
                      <div 
                        key={idx}
                        onClick={() => handleOptionSelect(currentQ._id, opt)}
                        className={`group flex items-center p-3 pr-4 rounded-lg border transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-primary/10 border-primary/30 shadow-sm' 
                            : 'bg-white border-gray-200 hover:border-primary/50 hover:bg-primary/5'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold mr-4 transition-colors ${
                          isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary'
                        }`}>
                          {letter}
                        </div> 
                        <span className={`text-xl font-light ${isSelected ? 'text-primary' : 'text-gray-600'}`}>{opt}</span>
                        
                        {isSelected && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 ml-auto text-primary">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {currentQ.type === 'checkbox' && (
                <div className="space-y-3">
                  {currentQ.options?.map((opt, idx) => {
                    const currentAnswers = answers[currentQ._id] || [];
                    const isSelected = currentAnswers.includes(opt);
                    const letter = LETTERS[idx] || (idx + 1);
                    
                    return (
                      <div 
                        key={idx}
                        onClick={() => {
                          const newAnswers = isSelected 
                            ? currentAnswers.filter(a => a !== opt)
                            : [...currentAnswers, opt];
                          setAnswers({...answers, [currentQ._id]: newAnswers});
                        }}
                        className={`group flex items-center p-3 pr-4 rounded-lg border transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-primary/10 border-primary/30 shadow-sm' 
                            : 'bg-white border-gray-200 hover:border-primary/50 hover:bg-primary/5'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold mr-4 transition-colors ${
                          isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary'
                        }`}>
                          {letter}
                        </div> 
                        <span className={`text-xl font-light ${isSelected ? 'text-primary' : 'text-gray-600'}`}>{opt}</span>
                        
                        {isSelected && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 ml-auto text-primary">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
              
              <div className="mt-12">
                <button 
                  onClick={handleNextQuestion}
                  className="px-8 py-2 bg-secondary text-white text-lg font-bold rounded hover:bg-secondary/90 transition-all flex items-center gap-2 shadow-sm"
                >
                  OK 
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </button>
                <p className="text-xs text-gray-400 mt-2 ml-1">press <span className="font-bold">Enter ↵</span></p>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="fixed bottom-8 right-8 flex flex-col gap-1">
            <button 
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className="p-2 bg-secondary text-white rounded-t hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
              </svg>
            </button>
            <button 
              onClick={handleNextQuestion}
              className="p-2 bg-secondary text-white rounded-b hover:bg-secondary/90 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
