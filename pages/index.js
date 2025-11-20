import { useEffect, useState } from 'react';
import { isStaffAuthenticated } from '../utils/auth';
import axios from 'axios';
import { useRouter } from "next/router";
const steps = [
  { name: 'Floorplan', icon: '🏠' },
  { name: 'Elevation', icon: '🏗️' },
  { name: 'Living Zone', icon: '🛋️' },
  { name: 'Master Zone', icon: '👑' },
  { name: 'Family Zone', icon: '👨‍👩‍👧‍👦' },
  { name: 'Final Step', icon: '🏁' },
];

export default function Home() {
  // Popup modal state for review form
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formHasLand, setFormHasLand] = useState('yes');
  const [formBuildTime, setFormBuildTime] = useState('1yr');
  // Master Zone data
  const [masterZones, setMasterZones] = useState([]);
  const [selectedMasterZone, setSelectedMasterZone] = useState(null);
  // Track if user arrived via query string (direct visit)
  // Only one declaration for isDirectVisit
  const [selectedFloorPlan, setSelectedFloorPlan] = useState(null);
  const [selectedFloorplanId, setSelectedFloorplanId] = useState(null);
  // Only one declaration for currentStep
  // Elevation data fetched dynamically based on selected floorplan
  // Only one declaration for elevations
  const [selectedElevation, setSelectedElevation] = useState(null);
  // Living Zone data
  // Only one declaration for livingZones
  const [selectedLivingZone, setSelectedLivingZone] = useState(null);
  // Master Zone data
  // Only one declaration for masterZones
  // Only one declaration for selectedMasterZone
  // Family Zone data
  // Only one declaration for familyZones
  const [selectedFamilyZone, setSelectedFamilyZone] = useState(null);

  // Fetch Living Zone, Master Zone, Family Zone options when selectedFloorPlan changes
  useEffect(() => {
    if (selectedFloorPlan) {
      // Living Zone
  axios.get(`/api/floorplans/${selectedFloorPlan.id}/options?type=Living Area`)
        .then((res) => {
          if (Array.isArray(res.data)) {
            setLivingZones(res.data);
            const storedId = localStorage.getItem('selectedLivingZoneId');
            const found = res.data.find(e => e.id === Number(storedId));
            setSelectedLivingZone(found || res.data[0] || null);
          } else {
            setLivingZones([]);
            setSelectedLivingZone(null);
          }
        })
        .catch(() => {
          setLivingZones([]);
          setSelectedLivingZone(null);
        });
      // Master Zone
      axios.get(`/api/floorplans/${selectedFloorPlan.id}/options?type=Master Suite`)
        .then((res) => {
          if (Array.isArray(res.data)) {
            setMasterZones(res.data);
            const storedId = localStorage.getItem('selectedMasterZoneId');
            const found = res.data.find(e => e.id === Number(storedId));
            setSelectedMasterZone(found || res.data[0] || null);
          } else {
            setMasterZones([]);
            setSelectedMasterZone(null);
          }
        })
        .catch(() => {
          setMasterZones([]);
          setSelectedMasterZone(null);
        });
      // Family Zone
      axios.get(`/api/floorplans/${selectedFloorPlan.id}/options?type=Family Wing`)
        .then((res) => {
          if (Array.isArray(res.data)) {
            setFamilyZones(res.data);
            const storedId = localStorage.getItem('selectedFamilyZoneId');
            const found = res.data.find(e => e.id === Number(storedId));
            setSelectedFamilyZone(found || res.data[0] || null);
          } else {
            setFamilyZones([]);
            setSelectedFamilyZone(null);
          }
        })
        .catch(() => {
          setFamilyZones([]);
          setSelectedFamilyZone(null);
        });
    }
  }, [selectedFloorPlan]);
  // Step headings
  const stepHeadings = [
    'Choose your floorplan',
    'Choose your elevation',
    'Choose your living zone',
    'Choose your master zone',
    'Choose your family zone',
    'Final Step'
  ];
  const router = useRouter();
  // Track if user arrived via query string (direct visit)
  const [isDirectVisit, setIsDirectVisit] = useState(false);

  // On mount, determine if direct visit
  useEffect(() => {
    if (router.query.fp_enc || router.query.floorplan_name) {
      setIsDirectVisit(true);
    } else {
      setIsDirectVisit(false);
    }
  }, [router.query.fp_enc, router.query.floorplan_name]);
  const [currentStep, setCurrentStep] = useState(0);
  // Elevation data fetched dynamically based on selected floorplan
  const [elevations, setElevations] = useState([]);
  // Living Zone data
  const [livingZones, setLivingZones] = useState([]);
  // Master Zone data
  // Only one declaration for masterZones
  // Only one declaration for selectedMasterZone
  // Family Zone data
  const [familyZones, setFamilyZones] = useState([]);

  // Fetch Living Zone, Master Zone, Family Zone options when selectedFloorPlan changes
  // ...existing code...

    // Restore step and elevation from localStorage after mount
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const storedStep = localStorage.getItem('currentStep');
        if (storedStep) {
          setCurrentStep(Number(storedStep));
        }
      }
    }, []);

    // Fetch elevations when selectedFloorPlan changes (for Elevation step)
    useEffect(() => {
      if (selectedFloorPlan && currentStep === 1) {
        console.log('Fetching elevations for floorplanId:', selectedFloorPlan.id);
        axios.get(`/api/floorplans/${selectedFloorPlan.id}/options?type=elevation`)
          .then((res) => {
            console.log('Elevations API response:', res.data);
            if (Array.isArray(res.data)) {
              setElevations(res.data);
              // Restore selected elevation from localStorage if available
              const storedElevationId = localStorage.getItem('selectedElevationId');
              if (storedElevationId) {
                const found = res.data.find(e => e.id === Number(storedElevationId));
                setSelectedElevation(found || res.data[0]);
              } else {
                setSelectedElevation(res.data[0]);
              }
            } else {
              setElevations([]);
              setSelectedElevation(null);
              console.warn('Elevations API did not return an array:', res.data);
            }
          })
          .catch((err) => {
            setElevations([]);
            setSelectedElevation(null);
            console.error('Error fetching elevations:', err);
          });
      }
    }, [selectedFloorPlan, currentStep]);

  // Handle step navigation
  const handleContinue = () => {
    // If on Family Zone, show popup instead of moving to final step
    if (currentStep === 4) {
      setShowReviewPopup(true);
    } else {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      localStorage.setItem('currentStep', nextStep);
    }
  };
  const handleBack = () => {
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    localStorage.setItem('currentStep', prevStep);
  };
  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedFloorPlan(null);
    setSelectedFloorplanId(null);
    localStorage.removeItem('selectedFloorplanId');
    localStorage.removeItem('currentStep');
    localStorage.removeItem('selectedElevationId');
  };
  const [mode, setMode] = useState('visitor'); // 'staff' or 'visitor'
  const [region, setRegion] = useState(null); // regionId (number)
  const [regions, setRegions] = useState([]);
  const [visitorName, setVisitorName] = useState('');
  const [showRegionPopup, setShowRegionPopup] = useState(false);
  const [regionSelected, setRegionSelected] = useState(false);
  const [floorPlans, setFloorPlans] = useState([]);

  // Auto-select floorplan by Base64-encoded name from query string (fp_enc)
  useEffect(() => {
    if (router.query.fp_enc && floorPlans.length > 0) {
      try {
        const decodedName = atob(router.query.fp_enc);
        const found = floorPlans.find(fp => (fp.name || fp.title)?.toLowerCase() === decodedName.toLowerCase());
        if (found) {
          setSelectedFloorPlan(found);
          setSelectedFloorplanId(found.id);
          localStorage.setItem('selectedFloorplanId', found.id);
        }
      } catch (e) {
        // Invalid base64, ignore
      }
    }
  }, [router.query.fp_enc, floorPlans]);

  // Auto-select floorplan by name from query string
  useEffect(() => {
    if (router.query.floorplan_name && floorPlans.length > 0) {
      const queryName = router.query.floorplan_name.toLowerCase();
      const found = floorPlans.find(fp => (fp.name || fp.title)?.toLowerCase() === queryName);
      if (found) {
        setSelectedFloorPlan(found);
        setSelectedFloorplanId(found.id);
        localStorage.setItem('selectedFloorplanId', found.id);
      }
    }
  }, [router.query.floorplan_name, floorPlans]);

  useEffect(() => {
    // Fetch regions on mount
    axios.get("/api/regions").then((res) => {
      setRegions(res.data);
      // If staff, set first region as default (or from profile)
      if (isStaffAuthenticated()) {
        setMode('staff');
        setRegion(res.data[0]?.id || null);
        setShowRegionPopup(false);
      } else {
        // Check localStorage for visitor info
        const storedRegion = localStorage.getItem('visitorRegion');
        const storedName = localStorage.getItem('visitorName');
        if (storedRegion && storedName) {
          setRegion(Number(storedRegion));
          setVisitorName(storedName);
          setShowRegionPopup(false);
          setRegionSelected(true);
        } else {
          setMode('visitor');
          setShowRegionPopup(true);
          setRegionSelected(false);
        }
      }
    });
  }, []);

  useEffect(() => {
    // Fetch all floorplans, filter in render
    axios.get('/api/floorplans')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setFloorPlans(res.data);
        } else {
          setFloorPlans([]);
          console.error('API did not return an array:', res.data);
        }
      })
      .catch((err) => {
        setFloorPlans([]);
        console.error('Error fetching floorplans:', err);
      });
  }, []);

  // Handle region selection for visitor
  const handleRegionSelect = (e) => {
    setRegion(Number(e.target.value));
    setRegionSelected(true);
    // Do not store yet, only after continue
  };

  // Handle visitor name input
  const handleNameChange = (e) => {
    setVisitorName(e.target.value);
  };

  // Handle continue for visitor
  const handleVisitorContinue = () => {
    if (region && visitorName) {
      // Store visitor info in localStorage
      localStorage.setItem('visitorRegion', region);
      localStorage.setItem('visitorName', visitorName);
      setShowRegionPopup(false);
    }
  };

  // Sidebar navigation
  const handleStepClick = (idx) => {
    setCurrentStep(idx);
  };
  // Filter floorplans by selected region
  const filteredFloorplans = region
    ? floorPlans.filter(fp => fp.regionId === region)
    : floorPlans;

  // Floorplan select
  const handleFloorPlanSelect = (fp) => {
    setSelectedFloorPlan(fp);
    setSelectedFloorplanId(fp.id);
    localStorage.setItem('selectedFloorplanId', fp.id);
  };

  // Restore selected floorplan from localStorage after floorplans are loaded
  useEffect(() => {
    const storedFloorplanId = localStorage.getItem('selectedFloorplanId');
    if (storedFloorplanId && floorPlans.length > 0) {
      const found = floorPlans.find(fp => fp.id === Number(storedFloorplanId));
      if (found) {
        setSelectedFloorPlan(found);
        setSelectedFloorplanId(found.id);
      }
    }
  }, [floorPlans]);

  return (
    <div className="min-h-screen flex bg-gray-50 relative">
      {/* Sidebar always visible */}
      <aside className="w-64 bg-white shadow flex flex-col py-8 px-4">
        <div className="flex items-center mb-8">
          <span className="text-2xl font-bold mr-2">mark+</span>
          <span className="text-xs text-gray-500">by LaVida Homes</span>
        </div>
        <nav aria-label="Step Navigation">
          <ul className="space-y-4">
            {steps.map((step, idx) => (
              <li key={step.name}>
                <button
                  className={`w-full flex items-center gap-2 text-left px-4 py-2 rounded focus:outline-none focus:ring ${currentStep === idx ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                  onClick={() => handleStepClick(idx)}
                  aria-current={currentStep === idx ? 'step' : undefined}
                  disabled={currentStep === 5}
                >
                  <span>{step.icon}</span>
                  <span>{step.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* Main Content: changes per step */}
      
      {/* Review Popup Modal */}
      {showReviewPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 relative flex flex-col items-center">
            {/* Close button */}
            <button
              className="absolute top-6 right-6 text-2xl text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close"
              onClick={() => setShowReviewPopup(false)}
            >
              &times;
            </button>
            {/* Decorative icon */}
            <div className="absolute left-6 top-6">
              <span style={{fontSize: '2.5rem', color: '#FF6A39'}}>✶</span>
            </div>
            <h2 className="text-xl font-bold text-center mb-2 mt-2">✨ You're choices are locked in — nice work!</h2>
            <p className="text-center text-gray-700 mb-6">Pop in your details below to review and download your customised floorplan (we’ll also send a copy straight to your inbox).</p>
            <form className="w-full flex flex-col gap-4" onSubmit={e => {
              e.preventDefault();
              // Store info in localStorage
              localStorage.setItem('reviewFirstName', formFirstName);
              localStorage.setItem('reviewLastName', formLastName);
              localStorage.setItem('reviewMobile', formMobile);
              localStorage.setItem('reviewEmail', formEmail);
              localStorage.setItem('reviewHasLand', formHasLand);
              localStorage.setItem('reviewBuildTime', formBuildTime);
              setShowReviewPopup(false);
              setCurrentStep(5); // Move to final step
              localStorage.setItem('currentStep', 5);
            }}>
              <input
                type="text"
                placeholder="First Name"
                className="border border-gray-300 rounded px-4 py-2 w-full"
                value={formFirstName}
                onChange={e => setFormFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                className="border border-gray-300 rounded px-4 py-2 w-full"
                value={formLastName}
                onChange={e => setFormLastName(e.target.value)}
              />
              <input
                type="tel"
                placeholder="Mobile"
                className="border border-gray-300 rounded px-4 py-2 w-full"
                value={formMobile}
                onChange={e => setFormMobile(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="border border-gray-300 rounded px-4 py-2 w-full"
                value={formEmail}
                onChange={e => setFormEmail(e.target.value)}
                required
              />
              <div className="mt-2 mb-2">
                <div className="text-sm font-medium mb-1">Already have land for this home design?</div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-1">
                    <input type="radio" name="hasLand" value="yes" checked={formHasLand === 'yes'} onChange={() => setFormHasLand('yes')} /> YES
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="hasLand" value="no" checked={formHasLand === 'no'} onChange={() => setFormHasLand('no')} /> NO
                  </label>
                </div>
              </div>
              <div className="mb-2">
                <div className="text-sm font-medium mb-1">I'd like to start building in the next...</div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-1">
                    <input type="radio" name="buildTime" value="3m" checked={formBuildTime === '3m'} onChange={() => setFormBuildTime('3m')} /> 3M
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="buildTime" value="6m" checked={formBuildTime === '6m'} onChange={() => setFormBuildTime('6m')} /> 6M
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="buildTime" value="1yr" checked={formBuildTime === '1yr'} onChange={() => setFormBuildTime('1yr')} /> 1YR
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="buildTime" value="just" checked={formBuildTime === 'just'} onChange={() => setFormBuildTime('just')} /> JUST LOOKING
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#FF6A39] text-white font-semibold rounded-lg text-lg mt-2 mb-2 hover:bg-[#ff8a5c] focus:outline-none focus:ring"
              >
                Review your floorplan
              </button>
              <div className="text-xs text-gray-500 text-center mt-2">We pinky promise not to spam. Just good vibes and helpful stuff. View our privacy policy.</div>
            </form>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="aaaaa flex-1 flex flex-col min-h-screen">
        {/* Top bar: heading + logo */}
        <div className="flex items-center justify-between px-10 pt-10 pb-6">
          <h2 className="text-3xl font-bold">{stepHeadings[currentStep]}</h2>
          <a
            href="https://www.lavidahomes.com.au/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Go to LaVida Homes main site"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow border border-gray-200">
              <span className="text-2xl font-bold text-gray-900">LV</span>
            </div>
          </a>
        </div>
        {/* Region selection popup for visitor */}
        {showRegionPopup && mode === 'visitor' && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Select Your Region</h2>
              <select
                className="w-full mb-4 px-3 py-2 border border-gray-300 rounded"
                onChange={handleRegionSelect}
                value={region || ""}
                aria-label="Region Selection"
              >
                <option value="" disabled>Select region...</option>
                {regions.map(regionObj => (
                  <option key={regionObj.id} value={regionObj.id}>{regionObj.name}</option>
                ))}
              </select>
              {regionSelected && (
                <div className="mb-4">
                  <label htmlFor="visitorName" className="block text-sm font-medium text-gray-700">Your Name</label>
                  <input
                    id="visitorName"
                    type="text"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded"
                    value={visitorName}
                    onChange={handleNameChange}
                    aria-label="Visitor Name"
                    autoFocus
                  />
                </div>
              )}
              <button
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring"
                onClick={handleVisitorContinue}
                disabled={!(region && visitorName)}
              >
                Continue
              </button>
            </div>
          </div>
        )}
        {/* Step content placeholder */}
        <section className="flex-1 flex flex-col">
          {/* Step 0: Floorplan selection or auto-selected */}
          {currentStep === 0 && (
            <>
              {isDirectVisit && selectedFloorPlan ? (
                <>
                  {/* Three columns below */}
                  <div className="flex flex-row px-10 pb-32 gap-8">
                    {/* Left: Welcome message */}
                    <div className="flex-1 flex flex-col justify-center">
                      <span className="font-bold text-lg mb-2">Welcome!</span>
                      <span className="mb-4">You’ve picked your floorplan – now it’s time to make it yours. Ready to start customising? Let’s go!</span>
                      <span className="text-base text-gray-700">Changed your mind? No worries, head back and choose another base plan.</span>
                    </div>
                    {/* Middle: Large floorplan image and details */}
                    <div className="flex flex-col items-center" style={{ minWidth: '340px', maxWidth: '340px' }}>
                      <img
                        src={selectedFloorPlan.heroImage || '/placeholder.png'}
                        alt={selectedFloorPlan.name || selectedFloorPlan.title}
                        className="w-full h-96 object-contain bg-gray-100 rounded mb-2"
                        style={{ maxWidth: '300px' }}
                      />
                      <div className="text-xs text-gray-500 mb-1">FROM</div>
                      <div className="text-xl font-bold mb-1">${selectedFloorPlan.basePrice ? selectedFloorPlan.basePrice.toLocaleString() : 'N/A'}*</div>
                      <div className="text-lg font-semibold mb-2">{selectedFloorPlan.name || selectedFloorPlan.title}</div>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>🛏️ {selectedFloorPlan.bedrooms ?? '-'}</span>
                        <span>🛁 {selectedFloorPlan.bathrooms ?? '-'}</span>
                        <span>🚗 {selectedFloorPlan.carSpaces ?? '-'}</span>
                        <span>🏠 {selectedFloorPlan.frontage ?? '-'}</span>
                      </div>
                    </div>
                    {/* Right: Selection preview */}
                    <div className="flex flex-col items-center" style={{ minWidth: '180px', maxWidth: '180px' }}>
                      <div className="text-xs font-bold text-gray-700 mb-2 text-center">YOUR SELECTION</div>
                      <div className="border-2 border-blue-600 rounded p-2 bg-white flex items-center justify-center" style={{ width: '120px', height: '180px' }}>
                        <img
                          src={selectedFloorPlan.heroImage || '/placeholder.png'}
                          alt={selectedFloorPlan.name || selectedFloorPlan.title}
                          className="object-contain h-full w-full"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-8 px-10 pb-32">
                  {filteredFloorplans.length === 0 ? (
                    <div className="col-span-3 text-center text-gray-500 py-10">No floorplans available for this region.</div>
                  ) : (
                    filteredFloorplans.map((fp) => (
                      <div
                        key={fp.id}
                        className={`bg-white rounded shadow p-4 cursor-pointer border-2 ${selectedFloorPlan?.id === fp.id ? 'border-blue-600' : 'border-transparent'}`}
                        onClick={() => handleFloorPlanSelect(fp)}
                      >
                        <div className="mb-2">
                          <img src={fp.heroImage || '/placeholder.png'} alt={fp.name || fp.title} className="w-full h-40 object-contain bg-gray-100 rounded" />
                        </div>
                        <div className="text-xs text-gray-500 mb-1">FROM</div>
                        <div className="text-xl font-bold mb-1">${fp.basePrice ? fp.basePrice.toLocaleString() : 'N/A'}*</div>
                        <div className="text-lg font-semibold mb-2">{fp.name || fp.title}</div>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>🛏️ {fp.bedrooms ?? '-'}</span>
                          <span>🛁 {fp.bathrooms ?? '-'}</span>
                          <span>🚗 {fp.carSpaces ?? '-'}</span>
                          <span>🏠 {fp.frontage ?? '-'}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
          {/* Step 1: Elevation selection */}
          {currentStep === 1 && selectedFloorPlan && (
            <>
              <div className="flex flex-row px-10 pb-32 gap-8">
                {/* Center: Large elevation image and description */}
                <div className="flex-1 flex flex-col items-center justify-start">
                  {selectedElevation ? (
                    <>
                      <img src={selectedElevation.image} alt={selectedElevation.name} className="w-full max-w-2xl h-[420px] object-cover rounded mb-2" />
                      <div className="text-xs text-gray-500 mb-2">Images for illustrative purposes only.</div>
                      <div className="text-base text-gray-700 mb-6 text-center max-w-2xl">{selectedElevation.description}</div>
                    </>
                  ) : (
                    <div className="text-gray-500">No elevation selected or available.</div>
                  )}
                </div>
                {/* Right: Vertical list of elevation thumbnails */}
                <div className="flex flex-col items-center justify-start w-64">
                  <div className="text-xs font-bold text-gray-700 mb-4 text-center">PICK YOUR FAVOURITE</div>
                  <div className="flex flex-col gap-4 w-full">
                    {elevations.map(elev => (
                      <div
                        key={elev.id}
                        className={`w-full border-2 rounded cursor-pointer flex flex-col items-center p-2 ${selectedElevation && selectedElevation.id === elev.id ? 'border-blue-600' : 'border-transparent'}`}
                        onClick={() => {
                          setSelectedElevation(elev);
                          localStorage.setItem('selectedElevationId', elev.id);
                        }}
                      >
                        <img src={elev.image} alt={elev.name} className="w-full h-20 object-cover rounded mb-1" />
                        <div className={`text-xs font-semibold text-center py-1 ${selectedElevation && selectedElevation.id === elev.id ? 'text-blue-600' : 'text-gray-700'}`}>{elev.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
          {/* Step 2: Living Zone selection */}
          {currentStep === 2 && selectedFloorPlan && (
            <div className="flex flex-row px-10 pb-32 gap-8">
              
              {/* Center: Large zone image */}
              <div className="flex-1 flex flex-col items-center justify-center">
                {selectedLivingZone ? (
                  <img src={selectedLivingZone.image} alt={selectedLivingZone.name} className="w-full max-w-xl h-[420px] object-cover rounded mb-2" />
                ) : (
                  <div className="text-gray-500">No living zone selected or available.</div>
                )}
              </div>
              {/* Right: Description */}
              <div className="flex flex-col justify-start w-96">
                {selectedLivingZone ? (
                  <>
                    <div className="text-base text-gray-700 mb-6">{selectedLivingZone.description}</div>
                    <div className="text-xs text-blue-700 cursor-pointer mb-2">&#128269; LOCATE THIS ZONE</div>
                  </>
                ) : null}
              </div>
              {/* Left: Vertical list of zone thumbnails */}
              <div className="flex flex-col items-center justify-start w-32 mr-4">
                <div className="text-xs font-bold text-gray-700 mb-4 text-center">PICK YOUR FAVOURITE</div>
                <div className="flex flex-col gap-4 w-full">
                  {livingZones.map((zone, idx) => (
                    <div
                      key={zone.id}
                      className={`w-full border-2 rounded cursor-pointer flex flex-col items-center p-2 ${selectedLivingZone && selectedLivingZone.id === zone.id ? 'border-blue-600' : 'border-transparent'}`}
                      onClick={() => {
                        setSelectedLivingZone(zone);
                        localStorage.setItem('selectedLivingZoneId', zone.id);
                      }}
                    >
                      <img src={zone.image} alt={zone.name} className="w-full h-20 object-cover rounded mb-1" />
                      <div className={`text-xs font-semibold text-center py-1 ${selectedLivingZone && selectedLivingZone.id === zone.id ? 'text-blue-600' : 'text-gray-700'}`}>{idx + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Step 3: Master Zone selection */}
          {currentStep === 3 && selectedFloorPlan && (
            <div className="flex flex-row px-10 pb-32 gap-8">
              
              {/* left: Large zone image */}
              <div className="flex-1 flex flex-col items-center justify-center">
                {selectedMasterZone ? (
                  <img src={selectedMasterZone.image} alt={selectedMasterZone.name} className="w-full max-w-xl h-[420px] object-cover rounded mb-2" />
                ) : (
                  <div className="text-gray-500">No master zone selected or available.</div>
                )}
              </div>
              {/* center: Description */}
              <div className="flex flex-col justify-start w-96">
                {selectedMasterZone ? (
                  <>
                    <div className="text-base text-gray-700 mb-6">{selectedMasterZone.description}</div>
                    <div className="text-xs text-blue-700 cursor-pointer mb-2">&#128269; LOCATE THIS ZONE</div>
                  </>
                ) : null}
              </div>
              {/* right: Vertical list of zone thumbnails */}
              <div className="flex flex-col items-center justify-start w-32 mr-4">
                <div className="text-xs font-bold text-gray-700 mb-4 text-center">PICK YOUR FAVOURITE</div>
                <div className="flex flex-col gap-4 w-full">
                  {masterZones.map((zone, idx) => (
                    <div
                      key={zone.id}
                      className={`w-full border-2 rounded cursor-pointer flex flex-col items-center p-2 ${selectedMasterZone && selectedMasterZone.id === zone.id ? 'border-blue-600' : 'border-transparent'}`}
                      onClick={() => {
                        setSelectedMasterZone(zone);
                        localStorage.setItem('selectedMasterZoneId', zone.id);
                      }}
                    >
                      <img src={zone.image} alt={zone.name} className="w-full h-20 object-cover rounded mb-1" />
                      <div className={`text-xs font-semibold text-center py-1 ${selectedMasterZone && selectedMasterZone.id === zone.id ? 'text-blue-600' : 'text-gray-700'}`}>{idx + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Step 4: Family Zone selection */}
          {currentStep === 4 && selectedFloorPlan && !showReviewPopup && (
            <div className="flex flex-row px-10 pb-32 gap-8">
              
              {/* Center: Large zone image */}
              <div className="flex-1 flex flex-col items-center justify-center">
                {selectedFamilyZone ? (
                  <img src={selectedFamilyZone.image} alt={selectedFamilyZone.name} className="w-full max-w-xl h-[420px] object-cover rounded mb-2" />
                ) : (
                  <div className="text-gray-500">No family zone selected or available.</div>
                )}
              </div>
              {/* Right: Description */}
              <div className="flex flex-col justify-start w-96">
                {selectedFamilyZone ? (
                  <>
                    <div className="text-base text-gray-700 mb-6">{selectedFamilyZone.description}</div>
                    <div className="text-xs text-blue-700 cursor-pointer mb-2">&#128269; LOCATE THIS ZONE</div>
                  </>
                ) : null}
              </div>
              {/* Left: Vertical list of zone thumbnails */}
              <div className="flex flex-col items-center justify-start w-32 mr-4">
                <div className="text-xs font-bold text-gray-700 mb-4 text-center">PICK YOUR FAVOURITE</div>
                <div className="flex flex-col gap-4 w-full">
                  {familyZones.map((zone, idx) => (
                    <div
                      key={zone.id}
                      className={`w-full border-2 rounded cursor-pointer flex flex-col items-center p-2 ${selectedFamilyZone && selectedFamilyZone.id === zone.id ? 'border-blue-600' : 'border-transparent'}`}
                      onClick={() => {
                        setSelectedFamilyZone(zone);
                        localStorage.setItem('selectedFamilyZoneId', zone.id);
                      }}
                    >
                      <img src={zone.image} alt={zone.name} className="w-full h-20 object-cover rounded mb-1" />
                      <div className={`text-xs font-semibold text-center py-1 ${selectedFamilyZone && selectedFamilyZone.id === zone.id ? 'text-blue-600' : 'text-gray-700'}`}>{idx + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Step 5: Final Step */}
          {currentStep === 5 && selectedFloorPlan && (
        <div className="flex-1 flex flex-col min-h-screen">
          <div className="flex flex-row items-start justify-start px-10 pt-10 pb-32 gap-8 bg-white relative min-h-screen">
            {/* Floorplan image */}
            <div className="flex flex-col items-center" style={{ minWidth: '420px', maxWidth: '420px' }}>
              {selectedFloorPlan && (
                <img
                  src={selectedFloorPlan.heroImage || '/placeholder.png'}
                  alt={selectedFloorPlan.name || selectedFloorPlan.title}
                  className="w-full h-[520px] object-contain bg-gray-100 rounded mb-2 border"
                  style={{ maxWidth: '400px' }}
                />
              )}
            </div>
            {/* Final step actions */}
            <div className="flex flex-col justify-start w-full max-w-xl">
              <h2 className="text-3xl font-bold mb-2">Your design is complete</h2>
                <div className="mb-6 text-lg font-semibold">Hi {localStorage.getItem('reviewFirstName') || '[N}ame]'},<br />  {"You're all set — time to take the next step"}</div>
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="text-blue-700 font-semibold text-lg">Download your plan</div>
                    <div className="text-sm text-gray-600">Keep a copy to review anytime.</div>
                  </div>
                  <button className="bg-[#FF6A39] text-white font-semibold rounded px-6 py-2 text-base flex items-center gap-2 hover:bg-[#ff8a5c]">
                    Download PDF <span className="text-xl">&#8681;</span>
                  </button>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="text-blue-700 font-semibold text-lg">Get a quote</div>
                    <div className="text-sm text-gray-600">Get your personalised price estimate — no nasty surprises!</div>
                  </div>
                  <button className="bg-[#FF6A39] text-white font-semibold rounded px-6 py-2 text-base flex items-center gap-2 hover:bg-[#ff8a5c]">
                    Request quote <span className="text-xl">&#128176;</span>
                  </button>
                </div>
                <div className="flex items-center justify-between pb-4">
                  <div>
                    <div className="text-blue-700 font-semibold text-lg">Share your design</div>
                    <div className="text-sm text-gray-600">Show it off to friends or fam.</div>
                  </div>
                  <button className="bg-[#FF6A39] text-white font-semibold rounded px-6 py-2 text-base flex items-center gap-2 hover:bg-[#ff8a5c]">
                    Share it <span className="text-xl">&#10150;</span>
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2 mb-2">Disclaimer<br />All pricing is indicative only and based on your selected options. Final pricing may vary depending on design choices, specifications, and site conditions.</div>
            </div>
            {/* Decorative icon (top right of main content) */}
            <div className="absolute" style={{top: '0.5rem', right: '2rem', fontSize: '3rem', color: '#FF6A39'}}>
              ✶
            </div>
          </div>
        </div>
      )}
        </section>
        {/* Bottom bar always rendered and aligned, now outside section */}
        <div className="bg-white border-t flex items-center justify-between px-10 py-4 shadow-lg fixed" style={{ left: '16rem', right: 0, bottom: 0 }}>
          {currentStep !== 5 && (
          <div className="flex items-center gap-2">
            <span className="text-blue-600 font-semibold">SELECTED</span>
            <span className="font-bold text-lg">
              {(() => {
                if (currentStep === 0) {
                  return selectedFloorPlan ? (selectedFloorPlan.name || selectedFloorPlan.title) : 'None';
                } else if (currentStep === 1) {
                  return selectedElevation ? selectedElevation.name : 'None';
                } else if (currentStep === 2) {
                  return selectedLivingZone ? selectedLivingZone.name : 'None';
                } else if (currentStep === 3) {
                  return selectedMasterZone ? selectedMasterZone.name : 'None';
                } else if (currentStep === 4) {
                  return selectedFamilyZone ? selectedFamilyZone.name : 'None';
                } else {
                  return '';
                }
              })()}
            </span>
          </div>
          )}
          <div className="flex gap-2">
            <button
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded font-semibold flex items-center gap-2 hover:bg-gray-200"
              onClick={handleRestart}
            >
              &#8634; RESTART
            </button>
            {currentStep > 0 && (
              <button
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded font-semibold flex items-center gap-2 hover:bg-gray-200"
                onClick={handleBack}
              >
                &#8592; BACK
              </button>
            )}
            {currentStep != 5 && (
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded font-semibold flex items-center gap-2 hover:bg-blue-700"
              disabled={currentStep === 0 ? !selectedFloorPlan : !selectedElevation}
              onClick={handleContinue}
              style={{ minWidth: '120px' }}
            >
              Continue
              <span className="ml-2">&rarr;</span>
            </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
