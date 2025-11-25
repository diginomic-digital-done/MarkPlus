import { useEffect, useState } from 'react';
import { isStaffAuthenticated } from '../utils/auth';
import axios from "@/utils/axios"
import { useRouter } from "next/router";
import { Floorplan, Elevation, Livingzone, Masterzone, Familyzone, Finalstep, Bed, Bath, Car, Homeicon } from './component/Icons'
const steps = [
  { name: 'Floorplan', icon: <Floorplan /> },
  { name: 'Elevation', icon: <Elevation /> },
  { name: 'Living Zone', icon: <Livingzone /> },
  { name: 'Master Zone', icon: <Masterzone /> },
  { name: 'Family Zone', icon: <Familyzone /> },
  { name: 'Final Step', icon: <Finalstep /> },
];

export default function Home() {

  useEffect(() => {
    console.log("AXIOS BASE:", axios.defaults.baseURL);
  }, []);

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
    console.log(e.target.value)
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
    <div className="min-h-screen flex bg-gray-50 relative flex-col md:flex-row screen-wrapper">

      <header className="md:hidden flex justify-between items-center p-4 bg-white border-b">
        <img src="/header-logo.png" alt="Mark+ Logo" className="h-8" />
        <button><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        </button>
      </header>

      {/* Sidebar always visible */}
      <aside className="hidden md:block w-1/5 bg-white border-r">
        <div className="flex justify-center logo-wrapper" style={{ backgroundColor: "#000" }}>
          <img src="/header-logo.png" alt="Mark+ Logo" className="" />
        </div>
        <nav aria-label="Step Navigation" className='rightSidebar'>
          <ul className="space-y-4">
            {steps.map((step, idx) => (
              <li key={step.name} className={`${currentStep === idx ? ' active' : 'bg-gray-100 text-gray-800'}`}>
                <button
                  className={`w-full flex items-center gap-2 text-left px-4 py-2 rounded focus:outline-none focus:ring`}
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
        <div className="fixed inset-0  flex items-center justify-center z-50 popup-cover">
          <div className="mx-auto popup-form-parent rounded bg-white p-6">
            <div className='contact-popup-form p-6'>
              {/* Close button */}
              <button
                className="absolute contact-form-close"
                aria-label="Close"
                onClick={() => setShowReviewPopup(false)}
              >
                &times;
              </button>

              <h2 className="contact-form-head text-center mb-2 mt-2">✨  You're choices are locked in — nice work!</h2>
              <p className="contact-form-subhead text-center  mb-6">Pop in your details below to review and download your customised floorplan (we’ll also send a copy straight to your inbox).</p>
              <form className="flex flex-col" style={{ alignItems: "center" }} onSubmit={e => {
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
                  <div className="text-sm font-medium mb-1 contact-form-label">Already have land for this home design?</div>
                  <div className="flex gap-6 items-center justify-center contact-form-radio-group">
                    <label className="flex items-center gap-1 contact-form-input-label">
                      <input type="radio" name="hasLand" value="yes" checked={formHasLand === 'yes'} onChange={() => setFormHasLand('yes')} /> YES
                    </label>
                    <label className="flex items-center gap-1 contact-form-input-label">
                      <input type="radio" name="hasLand" value="no" checked={formHasLand === 'no'} onChange={() => setFormHasLand('no')} /> NO
                    </label>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-sm font-medium mb-1 contact-form-label">I'd like to start building in the next...</div>
                  <div className="flex gap-6 justify-center items-center contact-form-radio-group">
                    <label className="flex items-center gap-1 contact-form-input-label">
                      <input type="radio" name="buildTime" value="3m" checked={formBuildTime === '3m'} onChange={() => setFormBuildTime('3m')} /> 3M
                    </label>
                    <label className="flex items-center gap-1 contact-form-input-label">
                      <input type="radio" name="buildTime" value="6m" checked={formBuildTime === '6m'} onChange={() => setFormBuildTime('6m')} /> 6M
                    </label>
                    <label className="flex items-center gap-1 contact-form-input-label">
                      <input type="radio" name="buildTime" value="1yr" checked={formBuildTime === '1yr'} onChange={() => setFormBuildTime('1yr')} /> 1YR
                    </label>
                    <label className="flex items-center gap-1 contact-form-input-label">
                      <input type="radio" name="buildTime" value="just" checked={formBuildTime === 'just'} onChange={() => setFormBuildTime('just')} /> JUST LOOKING
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="py-3 mt-2 mb-2 min-w-20   btn btn-orange"
                >
                  Review your floorplan
                </button>
                <div className="contact-form-footer-txt text-center">We pinky promise not to spam. Just good vibes and helpful stuff. View our privacy policy.</div>
              </form>

            </div>

          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="w-full md:w-4/5 p-8">
        {/* Top bar: heading + logo */}
        <div className="flex justify-between items-center mb-8 header-flex-wrapper">
          <h1 className="heading font-bold">{stepHeadings[currentStep]}</h1>
          <a
            href="https://www.lavidahomes.com.au/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Go to LaVida Homes main site"
            className='header-lavida-logo'
          >
            <img src="/lavida-logo.png" alt="LV Logo" className="" />
          </a>
        </div>
        {/* Top bar: heading + logo */}
        {/* Region selection popup for visitor */}
        {showRegionPopup && mode === 'visitor' && (
          <div className="fixed inset-0 flex items-center justify-center z-50 popup-cover">
            <div className="bg-white p-8 rounded shadow-lg w-96 popup-form-parent">
              <div className='p-6 text-center popup-form form-name-input'>
                <h2 className="form-pre-head font-bold mb-4">Nice pick. <br />Let's get personal</h2>
               
                <div className='region-radio-group'>
                  {regions.map(regionObj => (
                    <label key={regionObj.id} className={`region-radio-option ${regionSelected && region === regionObj.id ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="regionOption"
                        value={regionObj.id}
                        aria-label="Region Selection"
                        checked={regionSelected && region === regionObj.id}
                        onChange={handleRegionSelect}
                      />
                      <span>{regionObj.name}</span>
                    </label>
                  ))}
                </div>


                {/* <h2 className="text-lg font-bold mb-4">Select Your Region</h2> */}

                {regionSelected && (
                  <>
                    <p className="form-head mb-6">What is your first name?</p>
                    <div className="mb-4">

                      <input
                        id="visitorName"
                        type="text"
                        className=""
                        value={visitorName}
                        onChange={handleNameChange}
                        aria-label="Visitor Name"
                        autoFocus
                      />
                    </div>
                  </>
                )}
                <button
                  className="  btn-orange btn"
                  onClick={handleVisitorContinue}
                  disabled={!(region && visitorName)}
                >
                  Let's keep rolling
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Step content placeholder */}
        
          {/* Step 0: Floorplan selection or auto-selected */}
          {currentStep === 0 && (
            <>
            <section className="grid grid-wrapper">
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
                        src={selectedFloorPlan.heroImage || '/placeholder-plan.png'}
                        alt={selectedFloorPlan.name || selectedFloorPlan.title}
                        className="w-full h-96 object-contain bg-gray-100 rounded mb-2"
                        style={{ maxWidth: '300px' }}
                      />
                      <div className="text-xs text-gray-500 mb-1">FROM</div>
                      <div className="text-xl font-bold mb-1">${selectedFloorPlan.basePrice ? selectedFloorPlan.basePrice.toLocaleString() : 'N/A'}*</div>
                      <div className="text-lg font-semibold mb-2">{selectedFloorPlan.name || selectedFloorPlan.title}</div>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span><Bed /> {selectedFloorPlan.bedrooms ?? '-'}</span>
                        <span><Bath /> {selectedFloorPlan.bathrooms ?? '-'}</span>
                        <span><Car /> {selectedFloorPlan.carSpaces ?? '-'}</span>
                        <span><Homeicon /> {selectedFloorPlan.frontage ?? '-'}</span>
                      </div>
                    </div>
                    {/* Right: Selection preview */}
                    <div className="flex flex-col items-center" style={{ minWidth: '180px', maxWidth: '180px' }}>
                      <div className="text-xs font-bold text-gray-700 mb-2 text-center">YOUR SELECTION</div>
                      <div className="border-2 border-blue-600 rounded p-2 bg-white flex items-center justify-center" style={{ width: '120px', height: '180px' }}>
                        <img
                          src={selectedFloorPlan.heroImage || '/placeholder-plan.png'}
                          alt={selectedFloorPlan.name || selectedFloorPlan.title}
                          className="object-contain h-full w-full"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                {/*------------------------------------------- choose your Floorplan----------------------------------- */}
                  {
                    filteredFloorplans.length === 0 ? (
                      <div className="col-span-3 text-center text-gray-500 py-10">No floorplans available for this region.</div>
                    ) : (
                      filteredFloorplans.map((fp) => (
                        <div
                          key={fp.id}
                          className={`bg-white rounded shadow p-4 cursor-pointer border-2 common-card ${selectedFloorPlan?.id === fp.id ? 'border-blue-600 selected' : 'border-transparent'}`}
                          onClick={() => handleFloorPlanSelect(fp)}
                        >
                          <div className="common-card-img-wrap">
                            <img src={fp.heroImage == "/placeholder.png" ? '/placeholder-plan.png' : fp.heroImage} alt={fp.name || fp.title} className="common-card-img w-full object-contain  rounded" />
                          </div>
                          <div className='common-card-bottom-txt'>
                            <div className="flex flex-col justify-between common-card-price-wrap">
                              <div className=" ">FROM</div>
                              <div className=" ">${fp.basePrice ? fp.basePrice.toLocaleString() : 'N/A'}*</div>
                            </div>
                            <div className="common-card-bottom-wrapper">
                              <div className="text-lg font-semibold mb-2 common-card-bottom-title">{fp.name || fp.title}</div>
                              <div className="flex text-sm text-gray-600 common-card-bottom-icons">
                                <span><Bed /> {fp.bedrooms ?? '-'}</span>
                                <span><Bath /> {fp.bathrooms ?? '-'}</span>
                                <span><Car /> {fp.carSpaces ?? '-'}</span>
                                <span><Homeicon /> {fp.frontage ?? '-'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )
                  }
                  {/*------------------------------------------- choose your Floorplan----------------------------------- */}
                </>
              )}
              </section>
            </>
          )}

        
          {/*-------------------- Step 2: Elevation selection-------------------------- */}
          {currentStep === 1 && selectedFloorPlan && (
            <>
              <div className=" center-wrapper">
                {/* Center: Large elevation image and description */}
                <div className=" center-wrapper-img">
                  {selectedElevation ? (
                    <>
                      <img src={selectedElevation.image} alt={selectedElevation.name} className="w-full object-cover rounded mb-2" />
                      
                      <div className="center-wrapper-img-txt">{selectedElevation.description}</div>
                    </>
                  ) : (
                    <div className="text-gray-500">No elevation selected or available.</div>
                  )}
                </div>
                {/* Right: Vertical list of elevation thumbnails */}
                <div className="  right-sidebar-wrapper">
                  <div className="text-xs font-bold text-gray-700 mb-4 text-center right-sidebar-heading">PICK YOUR FAVOURITE</div>
                  <div className="flex flex-col w-full right-sidebar">
                    {elevations.map(elev => (
                      <div
                        key={elev.id}
                        className={`w-full rounded cursor-pointer flex flex-col items-center`}
                        onClick={() => {
                          setSelectedElevation(elev);
                          localStorage.setItem('selectedElevationId', elev.id);
                        }}
                      >
                        <div className={`w-full border-2 rounded cursor-pointer flex flex-col items-center ${selectedElevation && selectedElevation.id === elev.id ? 'border-blue-600' : 'border-transparent'}`}>
                        <img src={elev.image} alt={elev.name} className="w-full h-auto object-cover rounded mb-1" />
                        </div>
                        <div className={`right-sidebar-subheading ${selectedElevation && selectedElevation.id === elev.id ? 'text-blue-600' : 'text-gray-600'}`}>{elev.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
          {/*-------------------- Step 2: Elevation selection-------------------------- */}
          
          {/*--------------------- Step 3: Living Zone selection------------------------ */}
          {currentStep === 2 && selectedFloorPlan && (
            <section className=" center-wrapper">
            <div className=" center-wrapper-img">

             <div className="center-wrapper-img-grid-content">
                {/* Center: Large zone image */}
                <div className="flex-1 flex flex-col items-center justify-center center-wrapper-img-grid-content-image">
                  {selectedLivingZone ? (
                    <img src={selectedLivingZone.image} alt={selectedLivingZone.name} className="w-full max-w-xl object-cover" />
                  ) : (
                    <div className="text-gray-500">No living zone selected or available.</div>
                  )}
                </div>
                {/* Right: Description */}
                <div className="flex flex-col justify-start w-96 center-wrapper-img-grid-content-text">
                  {selectedLivingZone ? (
                    <>
                      <div className="text-base text-gray-700 mb-6">{selectedLivingZone.description}</div>
                      <div className="text-xs text-blue-700 cursor-pointer mb-2">&#128269; LOCATE THIS ZONE</div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
             {/* Left: Vertical list of zone thumbnails */}
              <div className="  right-sidebar-wrapper">
                <div className="text-xs font-bold text-gray-700 mb-4 text-center right-sidebar-heading">PICK YOUR FAVOURITE</div>
                <div className="flex flex-col gap-4 w-full right-sidebar">
                  {livingZones.map((zone, idx) => (
                    <div
                      key={zone.id}
                      className={`w-full border-2 rounded cursor-pointer flex flex-col items-center p-2 ${selectedLivingZone && selectedLivingZone.id === zone.id ? 'border-blue-600' : 'border-transparent'}`}
                      onClick={() => {
                        setSelectedLivingZone(zone);
                        localStorage.setItem('selectedLivingZoneId', zone.id);
                      }}
                    >
                      <img src={zone.image} alt={zone.name} className="w-full h-auto object-cover rounded mb-1" />
                      <div className={`text-xs font-semibold text-center py-1 ${selectedLivingZone && selectedLivingZone.id === zone.id ? 'text-blue-600' : 'text-gray-700'}`}>{idx + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
           {/*--------------------- Step 3: Living Zone selection------------------------ */}
          {/*--------------------- Step 4: Master Zone selection------------------------ */}
          {currentStep === 3 && selectedFloorPlan && (
            <section className="center-wrapper">
            <div className="center-wrapper-img">

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
             
            </div>
             {/* right: Vertical list of zone thumbnails */}
              <div className="right-sidebar-wrapper">
                <div className="text-xs font-bold text-gray-700 mb-4 text-center right-sidebar-heading">PICK YOUR FAVOURITE</div>
                <div className="flex flex-col gap-4 w-full right-sidebar">
                  {masterZones.map((zone, idx) => (
                    <div
                      key={zone.id}
                      className={`w-full border-2 rounded cursor-pointer flex flex-col items-center p-2 ${selectedMasterZone && selectedMasterZone.id === zone.id ? 'border-blue-600' : 'border-transparent'}`}
                      onClick={() => {
                        setSelectedMasterZone(zone);
                        localStorage.setItem('selectedMasterZoneId', zone.id);
                      }}
                    >
                      <img src={zone.image} alt={zone.name} className="w-full h-auto object-cover rounded mb-1" />
                      <div className={`text-xs font-semibold text-center py-1 ${selectedMasterZone && selectedMasterZone.id === zone.id ? 'text-blue-600' : 'text-gray-700'}`}>{idx + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
           {/*--------------------- Step 4: Master Zone selection------------------------ */}
          {/*--------------------- Step 5: Family Zone selection------------------------ */}
          {currentStep === 4 && selectedFloorPlan && !showReviewPopup && (
            <section className="center-wrapper">
            <div className="center-wrapper-img">

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
            </div>
             {/* Left: Vertical list of zone thumbnails */}
              <div className="right-sidebar-wrapper">
                <div className="text-xs font-bold text-gray-700 mb-4 text-center right-sidebar-heading">PICK YOUR FAVOURITE</div>
                <div className="flex flex-col gap-4 w-full right-sidebar">
                  {familyZones.map((zone, idx) => (
                    <div
                      key={zone.id}
                      className={`w-full border-2 rounded cursor-pointer flex flex-col items-center p-2 ${selectedFamilyZone && selectedFamilyZone.id === zone.id ? 'border-blue-600' : 'border-transparent'}`}
                      onClick={() => {
                        setSelectedFamilyZone(zone);
                        localStorage.setItem('selectedFamilyZoneId', zone.id);
                      }}
                    >
                      <img src={zone.image} alt={zone.name} className="w-full h-auto object-cover rounded mb-1" />
                      <div className={`text-xs font-semibold text-center py-1 ${selectedFamilyZone && selectedFamilyZone.id === zone.id ? 'text-blue-600' : 'text-gray-700'}`}>{idx + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
          {/*--------------------- Step 5: Family Zone selection------------------------ */}
          {/*--------------------- Step 6: Final Step------------------------ */}
          {currentStep === 5 && selectedFloorPlan && (
            <section className="grid grid-wrapper">
            <div className="flex-1 flex flex-col min-h-screen">
              <div className="flex flex-row items-start justify-start px-10 pt-10 pb-32 gap-8 bg-white relative min-h-screen">
                {/* Floorplan image */}
                <div className="flex flex-col items-center" style={{ minWidth: '420px', maxWidth: '420px' }}>
                  {selectedFloorPlan && (
                    <img
                      src={selectedFloorPlan.heroImage || '/placeholder-plan.png'}
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
                <div className="absolute" style={{ top: '0.5rem', right: '2rem', fontSize: '3rem', color: '#FF6A39' }}>
                  ✶
                </div>
              </div>
            </div>
            </section>
          )}
          {/*--------------------- Step 6: Final Step------------------------ */}
        
        {/*--------------------- Bottom bar always rendered and aligned, now outside section ------------------------ */}
        <div className="footer fixed bottom-0 left-0 md:left-auto right-0 w-full md:w-4/5 bg-white p-4 border-t flex justify-between items-center">
          {currentStep !== 5 && (
            <div className="flex items-center footer-info">
              <span className="text-gray-500 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M8.38 12L10.79 14.42L15.62 9.57996" stroke="#0566DE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M10.75 2.44995C11.44 1.85995 12.57 1.85995 13.27 2.44995L14.85 3.80995C15.15 4.06995 15.71 4.27995 16.11 4.27995H17.81C18.87 4.27995 19.74 5.14995 19.74 6.20995V7.90995C19.74 8.29995 19.95 8.86995 20.21 9.16995L21.57 10.7499C22.16 11.4399 22.16 12.5699 21.57 13.2699L20.21 14.8499C19.95 15.1499 19.74 15.7099 19.74 16.1099V17.8099C19.74 18.8699 18.87 19.7399 17.81 19.7399H16.11C15.72 19.7399 15.15 19.9499 14.85 20.2099L13.27 21.5699C12.58 22.1599 11.45 22.1599 10.75 21.5699L9.17 20.2099C8.87 19.9499 8.31 19.7399 7.91 19.7399H6.18C5.12 19.7399 4.25 18.8699 4.25 17.8099V16.0999C4.25 15.7099 4.04 15.1499 3.79 14.8499L2.44 13.2599C1.86 12.5699 1.86 11.4499 2.44 10.7599L3.79 9.16995C4.04 8.86995 4.25 8.30995 4.25 7.91995V6.19995C4.25 5.13995 5.12 4.26995 6.18 4.26995H7.91C8.3 4.26995 8.87 4.05995 9.17 3.79995L10.75 2.44995Z" stroke="#0566DE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                SELECTED
              </span>
              <span className="footer-plan-name ">
                {(() => {
                  if (currentStep === 0) {
                    return selectedFloorPlan ? (selectedFloorPlan.name || selectedFloorPlan.title) : 'None';
                  } else if (currentStep === 1) {
                    return selectedElevation ? selectedElevation.label : 'None';
                  } else if (currentStep === 2) {
                    return selectedLivingZone ? selectedLivingZone.label : 'None';
                  } else if (currentStep === 3) {
                    return selectedMasterZone ? selectedMasterZone.label : 'None';
                  } else if (currentStep === 4) {
                    return selectedFamilyZone ? selectedFamilyZone.label : 'None';
                  } else {
                    return '';
                  }
                })()}
              </span>
            </div>
          )}
          <div className="flex gap-2 footer-btn-wrap">
            <button
              className=" flex items-center gap-2 btn-restart"
              onClick={handleRestart}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M7.12988 18.3101H15.1299C17.8899 18.3101 20.1299 16.0701 20.1299 13.3101C20.1299 10.5501 17.8899 8.31006 15.1299 8.31006H4.12988" stroke="#A8ADB0" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path d="M6.43012 10.8099L3.87012 8.24994L6.43012 5.68994" stroke="#A8ADB0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              RESTART
            </button>
            {currentStep > 0 && (
              <button
                className=" flex items-center gap-2   btn-back"
                onClick={handleBack}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9.31708 12L14.7593 18.3492C15.1187 18.7686 15.0701 19.3999 14.6508 19.7593C14.2315 20.1187 13.6002 20.0701 13.2407 19.6508L7.24074 12.6508C6.91975 12.2763 6.91975 11.7237 7.24074 11.3492L13.2407 4.34923C13.6002 3.9299 14.2315 3.88134 14.6508 4.24076C15.0701 4.60018 15.1187 5.23148 14.7593 5.65081L9.31708 12Z" fill="#A8ADB0"></path></svg>
                BACK
              </button>
            )}
            {currentStep != 5 && (
              <button
                className="btn btn-blue btn-arrow"
                disabled={currentStep === 0 ? !selectedFloorPlan : !selectedElevation}
                onClick={handleContinue}

              >
                Continue

              </button>
            )}
          </div>
        </div>
      </main>
    </div >
  );
}
