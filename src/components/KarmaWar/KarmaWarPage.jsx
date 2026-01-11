import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './KarmaWar.css';

// --- Components ---

const TvSet = () => {
  return (
    <div className="relative w-full max-w-lg aspect-[4/3] bg-gray-800 rounded-3xl p-4 shadow-tv border-4 border-gray-600 mx-auto transform hover:scale-[1.02] transition-transform duration-500 group">
      {/* Power LED */}
      <div className="absolute top-2 right-8 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>

      {/* Inner Bezel */}
      <div className="w-full h-full bg-black rounded-2xl p-4 border-b-2 border-gray-700 relative overflow-hidden">

        {/* Screen Container */}
        <div className="w-41/48 h-full bg-screen-blue relative overflow-hidden rounded-xl flex flex-col items-center justify-center shadow-inner group-hover:brightness-110 transition-all">

          {/* Effects */}
          <div className="absolute inset-0 tv-scanline z-20 opacity-30"></div>
          <div className="absolute inset-0 crt-overlay z-20"></div>
          <div className="absolute inset-0 opacity-20 bg-noise animate-pulse z-0"></div>

          {/* Screen Content */}
          <div className="relative z-10 text-center transform -rotate-2">
            <p className="text-white/80 font-mono text-xs mb-2 tracking-[0.2em] uppercase animate-pulse">Registrations Open!</p>
            <h2 className="text-5xl lg:text-6xl font-display italic text-white leading-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
              REGISTER<br />NOW
            </h2>
          </div>
        </div>

        {/* Side Controls Panel */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gray-900 border-l border-gray-700 flex flex-col items-center py-6 gap-4 z-30 rounded-r-xl">
          {/* Dials */}
          <div className="w-10 h-10 rounded-full border-4 border-gray-700 bg-gray-800 shadow-inner relative transform rotate-45">
            <div className="absolute w-1 h-4 bg-gray-600 top-1 left-1/2 -translate-x-1/2"></div>
          </div>
          <div className="w-10 h-10 rounded-full border-4 border-gray-700 bg-gray-800 shadow-inner relative transform -rotate-12">
            <div className="absolute w-1 h-4 bg-gray-600 top-1 left-1/2 -translate-x-1/2"></div>
          </div>

          {/* Speaker Grill */}
          <div className="mt-auto grid grid-cols-2 gap-1 px-2">
            <div className="w-full h-1 bg-gray-700"></div> <div className="w-full h-1 bg-gray-700"></div>
            <div className="w-full h-1 bg-gray-700"></div> <div className="w-full h-1 bg-gray-700"></div>
            <div className="w-full h-1 bg-gray-700"></div> <div className="w-full h-1 bg-gray-700"></div>
            <div className="w-full h-1 bg-gray-700"></div> <div className="w-full h-1 bg-gray-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BackgroundDecorations = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
      <div className="absolute top-20 left-10 transform -rotate-12">
        <span className="material-icons-outlined text-[15rem] leading-none text-gray-600">cyclone</span>
      </div>
      <div className="absolute bottom-20 right-10 transform rotate-45">
        <span className="material-icons-outlined text-[15rem] leading-none text-gray-600">savings</span>
      </div>
      <div className="absolute top-1/3 right-20 transform rotate-12">
        <span className="material-icons-outlined text-[10rem] leading-none text-gray-800">star</span>
      </div>
      <div className="absolute top-10 left-1/3 transform -rotate-6">
        <div className="w-28 h-14 border-8 border-black rounded-full"></div>
      </div>
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-transparent border-l-4 border-b-4 border-gray-400 opacity-20 transform rotate-3"></div>
      <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] bg-transparent border-r-4 border-t-4 border-gray-400 opacity-20 transform -rotate-2"></div>
    </div>
  );
};

const Navbar = () => {
  return (
    <nav className="absolute top-0 w-full z-50 p-6 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-primary font-display text-2xl tracking-tighter lowercase">µLearn</span>
        <span className="text-xs font-mono text-gray-500 border-l border-gray-400 pl-2">Sahrdaya</span>
      </Link>
      <div className="flex gap-4">
        {/* Login button removed as registration is on the page */}
      </div>
    </nav>
  );
};

const HeroSection = () => {
  return (
    <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative">
      <div className="text-center mb-8 relative">
        <div className="absolute top-0 right-0 w-63/60 h-full bg-primary/30 -z-10 transform translate-x-4 -translate-y-2"></div>
        <h1
          className="text-7xl lg:text-9xl font-display font-black tracking-tighter leading-none text-secondary glitch-text"
          data-text="KARMA WAR"
        >
          KARMA WAR
        </h1>
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="h-1 bg-black w-12"></div>
          <p className="text-xl lg:text-2xl font-retro tracking-widest uppercase">Battle is Coming</p>
          <div className="h-1 bg-black w-12"></div>
        </div>
        <div className="mt-2">
          <p className="text-5xl lg:text-6xl font-handwritten font-bold text-black drop-shadow-lg">2026</p>
        </div>
      </div>

      <TvSet />

      <div className="mt-8 text-[0.5rem] lg:text-[0.6rem] text-center text-gray-400 font-mono leading-tight uppercase opacity-50 max-w-md">
        SDDFDVDVDVSDVFDFJVBKVVKDVBKSJVKDVJDKBVJBKSBCJSDBCKDBKDVBKDJVBDKVBDKVBDJ VBDKVBKDVBKVBKDVBKDBVKDBKV
        RFIRFLIRHFLERHVERH GHRGHERGHHGRUI GHIHGRIGOERG HROGHORIUGHORIGHRIGOHRIGHRIG
      </div>
    </div>
  );
};

const LoginForm = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    teamLead: { name: '', email: '', phone: '', muid: '', muidValid: false, karma: 0, rank: 0, level: '', year: '', department: '' },
    member2: { name: '', email: '', phone: '', muid: '', muidValid: false, karma: 0, rank: 0, level: '', year: '', department: '' },
    member3: { name: '', email: '', phone: '', muid: '', muidValid: false, karma: 0, rank: 0, level: '', year: '', department: '' }
  });

  const [validating, setValidating] = useState({
    teamLead: false,
    member2: false,
    member3: false
  });

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@sahrdaya\.ac\.in$/;
    return regex.test(email);
  };

  const validateMuId = async (muid) => {
    try {
      const response = await fetch('https://tests.mulearnscet.in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ muid }),
        mode: 'cors'
      });

      if (!response.ok) return null;
      const data = await response.json();

      if (data.valid || data.exists) {
        return data.data; // Return the full student object (contains karma, rank, etc.)
      }
      return null;
    } catch (err) {
      console.error("Validation error:", err);
      return null;
    }
  };

  const handleMuIdBlur = async (memberKey) => {
    const muid = formData[memberKey].muid;
    if (!muid) return;

    setValidating(prev => ({ ...prev, [memberKey]: true }));
    const studentData = await validateMuId(muid);
    setValidating(prev => ({ ...prev, [memberKey]: false }));

    const isValid = !!studentData;

    setFormData(prev => ({
      ...prev,
      [memberKey]: {
        ...prev[memberKey],
        muidValid: isValid,
        // Store the fetched details
        karma: studentData ? studentData.karma : 0,
        rank: studentData ? studentData.rank : 0,
        level: studentData ? studentData.level : ''
      }
    }));

    if (!isValid) {
      setError(`Invalid MuID for ${memberKey === 'teamLead' ? 'Squad Commander' : memberKey}`);
    } else {
      setError('');
    }
  };

  const handleChange = (memberKey, field, value) => {
    let processedValue = value;

    if (field === 'muid') {
      processedValue = value.toLowerCase();
    } else if (field === 'phone') {
      // Remove all non-numeric characters
      processedValue = value.replace(/\D/g, '');
      // If starts with 91 and length is 12, remove 91
      if (processedValue.length > 10 && processedValue.startsWith('91')) {
        processedValue = processedValue.substring(2);
      }
      // Limit to 10 chars
      if (processedValue.length > 10) {
        processedValue = processedValue.slice(-10);
      }
    }

    setFormData(prev => ({
      ...prev,
      [memberKey]: { ...prev[memberKey], [field]: processedValue }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Final Validation for Member 3 (since prev steps are validated on nextStep)
    if (!formData.member3.name || !formData.member3.year || !formData.member3.department || !formData.member3.email || !formData.member3.phone || !formData.member3.muid) {
      setError('Please fill all Operative Bravo details');
      return;
    }

    if (!formData.teamLead.muidValid || !formData.member2.muidValid || !formData.member3.muidValid) {
      setError('Please ensure all MuIDs are valid before submitting.');
      return;
    }

    if (!validateEmail(formData.member3.email)) {
      setError('Operative Bravo email must be a @sahrdaya.ac.in address');
      return;
    }

    setLoading(true);

    try {
      // Replace with your actual Google Apps Script Web App URL
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxlBFSmxeeP39ndjxwswzDflDZhpt_KmMy0LLxfmPbBl3tggZH3CcwPui-4jIuuj_mH/exec';

      const totalKarma =
        (Number(formData.teamLead.karma) || 0) +
        (Number(formData.member2.karma) || 0) +
        (Number(formData.member3.karma) || 0);

      // Send the full formData which now includes karma, rank, year, and totalKarma
      const payload = {
        ...formData,
        totalKarma
      };

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError('Submission failed. Please try again.');
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.teamLead.name || !formData.teamLead.year || !formData.teamLead.department || !formData.teamLead.email || !formData.teamLead.phone || !formData.teamLead.muid) {
        setError('Please fill all Squad Commander details');
        return;
      }
      if (!validateEmail(formData.teamLead.email)) {
        setError('Squad Commander email must be a @sahrdaya.ac.in address');
        return;
      }
      if (!formData.teamLead.muidValid) {
        setError('Please enter a valid MuID for Squad Commander');
        return;
      }
    }
    if (step === 2) {
      if (!formData.member2.name || !formData.member2.year || !formData.member2.department || !formData.member2.email || !formData.member2.phone || !formData.member2.muid) {
        setError('Please fill all Operative Alpha details');
        return;
      }
      if (!validateEmail(formData.member2.email)) {
        setError('Operative Alpha email must be a @sahrdaya.ac.in address');
        return;
      }
      if (!formData.member2.muidValid) {
        setError('Please enter a valid MuID for Operative Alpha');
        return;
      }
    }
    setError('');
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const renderSelect = (memberKey, field, label, options, icon) => (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest mb-1 text-gray-600" htmlFor={`${memberKey}-${field}`}>
        {label}
      </label>
      <div className="relative">
        <select
          id={`${memberKey}-${field}`}
          value={formData[memberKey][field]}
          onChange={(e) => handleChange(memberKey, field, e.target.value)}
          className="w-full bg-transparent border-2 border-gray-300 focus:border-primary focus:ring-0 text-secondary p-3 font-mono rounded-none transition-colors appearance-none"
        >
          <option value="" disabled>SELECT {label.toUpperCase()}</option>
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <span className="material-icons-outlined absolute right-3 top-3.5 text-gray-400 pointer-events-none">{icon}</span>
      </div>
    </div>
  );

  const renderInput = (memberKey, field, label, type = "text", placeholder, icon) => (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest mb-1 text-gray-600" htmlFor={`${memberKey}-${field}`}>
        {label}
      </label>
      <div className="relative">
        <input
          id={`${memberKey}-${field}`}
          type={type}
          value={formData[memberKey][field]}
          onChange={(e) => handleChange(memberKey, field, e.target.value)}
          onBlur={field === 'muid' ? () => handleMuIdBlur(memberKey) : undefined}
          placeholder={placeholder}
          className={`w-full bg-transparent border-2 ${field === 'muid' && formData[memberKey].muid && formData[memberKey].muidValid
            ? 'border-green-500'
            : field === 'muid' && formData[memberKey].muid && !formData[memberKey].muidValid
              ? 'border-red-500'
              : 'border-gray-300'
            } focus:border-primary focus:ring-0 text-secondary p-3 font-mono rounded-none transition-colors placeholder-gray-400`}
        />
        {field === 'muid' ? (
          <>
            {validating[memberKey] && (
              <span className="material-icons-outlined absolute right-3 top-3.5 text-gray-400 animate-spin">refresh</span>
            )}
            {!validating[memberKey] && formData[memberKey].muidValid && (
              <span className="material-icons-outlined absolute right-3 top-3.5 text-green-500">check_circle</span>
            )}
            {!validating[memberKey] && formData[memberKey].muid && !formData[memberKey].muidValid && (
              <span className="material-icons-outlined absolute right-3 top-3.5 text-red-500">error</span>
            )}
            {!validating[memberKey] && !formData[memberKey].muid && (
              <span className="material-icons-outlined absolute right-3 top-3.5 text-gray-400">{icon || 'badge'}</span>
            )}
          </>
        ) : (
          <span className="material-icons-outlined absolute right-3 top-3.5 text-gray-400">{icon}</span>
        )}
      </div>
      {/* Display Karma Points if available */}
      {field === 'muid' && formData[memberKey].muidValid && (
        <div className="text-xs font-mono text-green-600 mt-1 flex gap-3">
          <span>Karma: {formData[memberKey].karma}</span>
          <span>Rank: {formData[memberKey].rank}</span>
        </div>
      )}
    </div>
  );

  if (success) {
    return (
      <div className="w-full lg:w-1/3 relative z-20">
        <div className="bg-white/80 backdrop-blur-sm border border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-lg text-center">
          <span className="material-icons-outlined text-6xl text-green-500 mb-4">verified</span>
          <h3 className="text-2xl font-tech font-bold uppercase text-secondary mb-2">Registration Complete</h3>
          <p className="text-sm font-mono text-gray-500 mb-4">Your squad has been enlisted for the Karma War.</p>

          <div className="p-3 bg-yellow-100 border border-yellow-500 text-yellow-800 text-xs font-mono mb-4 text-left">
            <strong>⚠️ IMPORTANT:</strong> Only the top 20 teams based on total Karma ratings will be selected for the final war.
          </div>

          <p className="text-xs font-mono text-gray-400 mb-6">A confirmation email has been sent to your registered addresses.</p>

          <div className="p-4 bg-green-100 border border-green-500 rounded mb-6">
            <p className="text-green-800 font-bold text-sm">Join the War Room</p>
            <a href="https://chat.whatsapp.com/G3zyzzIfctjC46iGppry4N" target="_blank" rel="noopener noreferrer" className="text-primary underline text-xs mt-1 block">Click to join WhatsApp Group</a>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="text-sm font-mono text-gray-500 hover:text-primary underline"
          >
            Register another team
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-1/3 relative z-20 lg:scale-90">
      <div className="bg-white/80 backdrop-blur-sm border border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-lg">
        <div className="mb-6 border-b border-gray-300 pb-4">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-2xl font-tech font-bold uppercase text-secondary">
                {step === 1 ? 'Squad Commander' : step === 2 ? 'Operative Alpha' : 'Operative Bravo'}
              </h3>
              <p className="text-sm font-mono text-gray-500 mt-1">Join the Karma War Ranks.</p>
            </div>
            <div className="flex gap-1">
              <div className={`h-2 w-8 ${step >= 1 ? 'bg-primary' : 'bg-gray-300'} transition-colors`}></div>
              <div className={`h-2 w-8 ${step >= 2 ? 'bg-primary' : 'bg-gray-300'} transition-colors`}></div>
              <div className={`h-2 w-8 ${step >= 3 ? 'bg-primary' : 'bg-gray-300'} transition-colors`}></div>
            </div>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 text-xs font-mono">
              {error}
            </div>
          )}

          {step === 1 && (
            <>
              {renderInput('teamLead', 'name', 'Name', 'text', 'ENTER NAME', 'badge')}
              {renderSelect('teamLead', 'year', 'Year of Study', ['1st Year', '2nd Year', '3rd Year', '4th Year'], 'school')}
              {renderSelect('teamLead', 'department', 'Department', ['CSE', 'ASH'], 'domain')}
              {renderInput('teamLead', 'email', 'Institution Email', 'email', 'namesr@sahrdaya.ac.in', 'alternate_email')}
              {renderInput('teamLead', 'phone', 'Comms Link (Phone)', 'tel', '9999999999', 'call')}
              {renderInput('teamLead', 'muid', 'Service ID (MuID)', 'text', 'MULEARN ID', 'fingerprint')}
            </>
          )}

          {step === 2 && (
            <>
              {renderInput('member2', 'name', 'Name', 'text', 'ENTER NAME', 'badge')}
              {renderSelect('member2', 'year', 'Year of Study', ['1st Year', '2nd Year', '3rd Year', '4th Year'], 'school')}
              {renderSelect('member2', 'department', 'Department', ['CSE', 'ASH'], 'domain')}
              {renderInput('member2', 'email', 'Institution Email', 'email', 'namesr@sahrdaya.ac.in', 'alternate_email')}
              {renderInput('member2', 'phone', 'Comms Link (Phone)', 'tel', '9999999999', 'call')}
              {renderInput('member2', 'muid', 'Service ID (MuID)', 'text', 'MULEARN ID', 'fingerprint')}
            </>
          )}

          {step === 3 && (
            <>
              {renderInput('member3', 'name', 'Name', 'text', 'ENTER NAME', 'badge')}
              {renderSelect('member3', 'year', 'Year of Study', ['1st Year', '2nd Year', '3rd Year', '4th Year'], 'school')}
              {renderSelect('member3', 'department', 'Department', ['CSE', 'ASH'], 'domain')}
              {renderInput('member3', 'email', 'Institution Email', 'email', 'namesr@sahrdaya.ac.in', 'alternate_email')}
              {renderInput('member3', 'phone', 'Comms Link (Phone)', 'tel', '9999999999', 'call')}
              {renderInput('member3', 'muid', 'Service ID (MuID)', 'text', 'MULEARN ID', 'fingerprint')}
            </>
          )}

          {step === 3 && (
            <div className="flex items-start gap-2 pt-2">
              <input className="mt-1 rounded border-gray-400 text-primary focus:ring-primary bg-transparent" id="terms" type="checkbox" required />
              <label className="text-xs text-gray-600 leading-tight" htmlFor="terms">
                I accept the <a className="underline hover:text-primary" href="https://karma-war.notion.site/Karma-War-2e53764a149b800ea8dbfe89be7b1c50?source=copy_link" target="_blank">Rules of Engagement</a> and confirm I am ready for battle.
              </label>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 border-2 border-gray-400 text-gray-600 font-tech font-bold py-3 uppercase tracking-widest hover:bg-gray-100 transition-all"
              >
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 bg-primary text-white font-tech font-bold py-4 uppercase tracking-widest hover:bg-opacity-90 transition-all transform hover:-translate-y-1 hover:shadow-lg relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Initialize Registration <span className="material-icons-outlined">send</span>
                </span>
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-white font-tech font-bold py-4 uppercase tracking-widest hover:bg-opacity-90 transition-all transform hover:-translate-y-1 hover:shadow-lg relative overflow-hidden group disabled:opacity-70"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? 'Enlisting...' : 'Initialize Registration'} <span className="material-icons-outlined">send</span>
                </span>
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
              </button>
            )}
          </div>

          <div className="text-center mt-4">
            <span className="text-xs text-gray-500 font-mono">Already enlisted? <a className="text-primary hover:underline" href="https://chat.whatsapp.com/G3zyzzIfctjC46iGppry4N" target="_blank" rel="noopener noreferrer">Report to Base</a></span>
          </div>
        </form>
      </div>

      {/* Free Entry Badge */}
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center transform rotate-12 shadow-lg z-30 border-2 border-black">
        <span className="text-[0.6rem] font-bold text-black text-center leading-tight font-sans">FREE<br />ENTRY</span>
      </div>
    </div>
  );
};

// --- Main Page Component ---

const KarmaWarPage = () => {
  return (
    <div className="bg-background-light min-h-screen font-karma-sans text-secondary bg-grunge-pattern relative overflow-x-hidden selection:bg-primary selection:text-white">
      <Navbar />

      <BackgroundDecorations />

      <main className="relative z-10 flex flex-col lg:flex-row min-h-screen items-center justify-center p-6 gap-12 lg:gap-20 pt-24 lg:p-0">
        <HeroSection />
        <LoginForm />
      </main>

      <div className="fixed bottom-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-purple-500 to-blue-500 opacity-50 pointer-events-none z-50"></div>
    </div>
  );
};

export default KarmaWarPage;
