import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Satellite, Brain, Cloud, Star, MapPin, Clock, CheckCircle, Circle, Play, Users, Award, TrendingUp, Globe, Code, Microscope, Wind } from 'lucide-react';
import './CareerPath.css';

const CareerPath = () => {
    const [selectedInterest, setSelectedInterest] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [selectedCareer, setSelectedCareer] = useState(null);
    const [simulationMode, setSimulationMode] = useState(false);
    const [simulationLocation, setSimulationLocation] = useState('');
    const [completedSkills, setCompletedSkills] = useState(new Set());
    const [showCareers, setShowCareers] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const interests = [
        { id: 'space-science', name: 'Space Science', icon: <Rocket size={20} /> },
        { id: 'satellites', name: 'Satellites', icon: <Satellite size={20} /> },
        { id: 'climate', name: 'Climate', icon: <Cloud size={20} /> },
        { id: 'ai', name: 'AI & Data', icon: <Brain size={20} /> },
        { id: 'astronomy', name: 'Astronomy', icon: <Star size={20} /> }
    ];

    const levels = [
        { id: 'school', name: 'School Student' },
        { id: 'college', name: 'College Student' },
        { id: 'beginner', name: 'Beginner' }
    ];

    const careers = [
        {
            id: 'satellite-analyst',
            title: 'Satellite Data Analyst',
            icon: <Satellite size={24} />,
            category: 'satellites',
            description: 'Analyze satellite imagery and data to monitor Earth changes',
            skills: ['Data Analysis', 'Remote Sensing', 'Python', 'GIS', 'Machine Learning'],
            realWorld: 'Track deforestation, monitor crops, predict natural disasters',
            salary: '$65,000 - $120,000',
            growth: '+23% by 2030',
            learningPath: [
                { step: 'Learn Python Basics', time: '2-4 weeks', content: 'python-basics' },
                { step: 'Understand Satellite Data', time: '3-6 weeks', content: 'satellite-data' },
                { step: 'Master Data Analysis Tools', time: '4-8 weeks', content: 'data-analysis' },
                { step: 'Build Real Projects', time: '8-12 weeks', content: 'projects' },
                { step: 'Get Certified', time: '2-4 weeks', content: 'certification' }
            ]
        },
        {
            id: 'astrophysicist',
            title: 'Astrophysicist',
            icon: <Star size={24} />,
            category: 'astronomy',
            description: 'Study celestial objects and phenomena to understand the universe',
            skills: ['Physics', 'Mathematics', 'Programming', 'Research', 'Data Analysis'],
            realWorld: 'Discover exoplanets, study black holes, understand cosmic evolution',
            salary: '$80,000 - $150,000',
            growth: '+7% by 2030',
            learningPath: [
                { step: 'Master Physics & Math', time: '6-12 months', content: 'physics-math' },
                { step: 'Learn Astronomy Basics', time: '3-6 months', content: 'astronomy' },
                { step: 'Programming for Research', time: '2-4 months', content: 'research-coding' },
                { step: 'Research Experience', time: '6-12 months', content: 'research' },
                { step: 'Advanced Studies', time: '2-4 years', content: 'graduate-studies' }
            ]
        },
        {
            id: 'space-software-engineer',
            title: 'Space Software Engineer',
            icon: <Code size={24} />,
            category: 'ai',
            description: 'Build software systems for satellites, rockets, and space missions',
            skills: ['Programming', 'Systems Design', 'Aerospace Knowledge', 'Testing', 'Robotics'],
            realWorld: 'Code satellite navigation systems, develop mission control software',
            salary: '$90,000 - $160,000',
            growth: '+22% by 2030',
            learningPath: [
                { step: 'Learn Programming Fundamentals', time: '3-6 months', content: 'programming' },
                { step: 'Study Aerospace Systems', time: '4-8 months', content: 'aerospace' },
                { step: 'Master Software Engineering', time: '6-12 months', content: 'software-engineering' },
                { step: 'Build Space Projects', time: '4-8 months', content: 'space-projects' },
                { step: 'Internship Experience', time: '3-6 months', content: 'internship' }
            ]
        },
        {
            id: 'climate-scientist',
            title: 'Climate Scientist',
            icon: <Wind size={24} />,
            category: 'climate',
            description: 'Use space data to study climate change and environmental patterns',
            skills: ['Climate Science', 'Data Analysis', 'Remote Sensing', 'Modeling', 'Statistics'],
            realWorld: 'Track global warming, predict extreme weather, advise policy makers',
            salary: '$70,000 - $130,000',
            growth: '+8% by 2030',
            learningPath: [
                { step: 'Climate Science Fundamentals', time: '2-4 months', content: 'climate-basics' },
                { step: 'Learn Data Analysis', time: '3-6 months', content: 'climate-data' },
                { step: 'Master Remote Sensing', time: '4-8 weeks', content: 'remote-sensing' },
                { step: 'Climate Modeling', time: '3-6 months', content: 'modeling' },
                { step: 'Field Research', time: '2-4 months', content: 'field-research' }
            ]
        },
        {
            id: 'mission-controller',
            title: 'Mission Controller',
            icon: <Rocket size={24} />,
            category: 'space-science',
            description: 'Manage and monitor space missions from launch to completion',
            skills: ['Systems Monitoring', 'Problem Solving', 'Communication', 'Engineering', 'Crisis Management'],
            realWorld: 'Guide spacecraft, handle emergencies, ensure mission success',
            salary: '$85,000 - $140,000',
            growth: '+15% by 2030',
            learningPath: [
                { step: 'Engineering Fundamentals', time: '4-6 months', content: 'engineering-basics' },
                { step: 'Mission Operations', time: '3-5 months', content: 'mission-ops' },
                { step: 'Communication Systems', time: '2-4 months', content: 'communications' },
                { step: 'Simulation Training', time: '2-3 months', content: 'simulation' },
                { step: 'Certification Process', time: '1-2 months', content: 'certification' }
            ]
        },
        {
            id: 'space-medicine',
            title: 'Space Medicine Specialist',
            icon: <Microscope size={24} />,
            category: 'space-science',
            description: 'Study and manage human health in space environments',
            skills: ['Medicine', 'Biology', 'Physiology', 'Research', 'Aerospace Medicine'],
            realWorld: 'Keep astronauts healthy, research space effects on body',
            salary: '$95,000 - $180,000',
            growth: '+18% by 2030',
            learningPath: [
                { step: 'Medical Degree', time: '4-8 years', content: 'medical-school' },
                { step: 'Aerospace Medicine', time: '2-4 years', content: 'aerospace-med' },
                { step: 'Space Physiology', time: '1-2 years', content: 'space-physiology' },
                { step: 'Research Experience', time: '2-3 years', content: 'research' },
                { step: 'Space Agency Training', time: '6-12 months', content: 'agency-training' }
            ]
        },
        {
            id: 'ai-space-researcher',
            title: 'AI Space Researcher',
            icon: <Brain size={24} />,
            category: 'ai',
            description: 'Apply artificial intelligence to solve space exploration challenges',
            skills: ['Machine Learning', 'Deep Learning', 'Space Science', 'Programming', 'Data Science'],
            realWorld: 'Develop AI for autonomous spacecraft, analyze cosmic data patterns',
            salary: '$100,000 - $170,000',
            growth: '+35% by 2030',
            learningPath: [
                { step: 'Machine Learning Mastery', time: '6-12 months', content: 'ml-basics' },
                { step: 'Space Science Knowledge', time: '3-6 months', content: 'space-science' },
                { step: 'Advanced AI Techniques', time: '4-8 months', content: 'advanced-ai' },
                { step: 'Space Data Projects', time: '6-12 months', content: 'space-ai-projects' },
                { step: 'Research Publication', time: '3-6 months', content: 'research-papers' }
            ]
        },
        {
            id: 'planetary-geologist',
            title: 'Planetary Geologist',
            icon: <Globe size={24} />,
            category: 'space-science',
            description: 'Study geological formations and processes on planets and moons',
            skills: ['Geology', 'Planetary Science', 'Remote Sensing', 'Chemistry', 'Field Research'],
            realWorld: 'Analyze Mars rover data, study moon samples, search for resources',
            salary: '$75,000 - $135,000',
            growth: '+12% by 2030',
            learningPath: [
                { step: 'Geology Fundamentals', time: '4-8 months', content: 'geology-basics' },
                { step: 'Planetary Science', time: '3-6 months', content: 'planetary-science' },
                { step: 'Remote Sensing Skills', time: '2-4 months', content: 'remote-sensing' },
                { step: 'Field Experience', time: '4-8 months', content: 'field-work' },
                { step: 'Mission Involvement', time: '6-12 months', content: 'mission-work' }
            ]
        },
        {
            id: 'space-entrepreneur',
            title: 'Space Entrepreneur',
            icon: <TrendingUp size={24} />,
            category: 'ai',
            description: 'Build innovative companies and solutions for the space industry',
            skills: ['Business Strategy', 'Space Industry Knowledge', 'Innovation', 'Leadership', 'Fundraising'],
            realWorld: 'Launch space startups, develop new space technologies',
            salary: '$80,000 - $200,000+',
            growth: '+45% by 2030',
            learningPath: [
                { step: 'Business Fundamentals', time: '3-6 months', content: 'business-basics' },
                { step: 'Space Industry Knowledge', time: '2-4 months', content: 'space-industry' },
                { step: 'Innovation Methods', time: '2-3 months', content: 'innovation' },
                { step: 'Startup Experience', time: '6-12 months', content: 'startup-work' },
                { step: 'Funding & Growth', time: '3-6 months', content: 'funding' }
            ]
        }
    ];

    const instructors = [
        {
            id: 1,
            name: 'Dr. Sarah Chen',
            role: 'Satellite Data Expert',
            expertise: ['Remote Sensing', 'Machine Learning', 'Climate Analysis'],
            experience: '12+ years at NASA',
            sessions: 45,
            rating: 4.9,
            careers: ['satellite-analyst', 'climate-scientist']
        },
        {
            id: 2,
            name: 'Prof. Michael Roberts',
            role: 'Astrophysics Researcher',
            expertise: ['Exoplanets', 'Cosmology', 'Data Analysis'],
            experience: '15+ years at MIT',
            sessions: 38,
            rating: 4.8,
            careers: ['astrophysicist']
        },
        {
            id: 3,
            name: 'Lisa Kumar',
            role: 'Space Software Engineer',
            expertise: ['Mission Control', 'Robotics', 'Systems Design'],
            experience: '10+ years at SpaceX',
            sessions: 52,
            rating: 4.9,
            careers: ['space-software-engineer']
        },
        {
            id: 4,
            name: 'Dr. James Mitchell',
            role: 'Mission Control Specialist',
            expertise: ['Mission Operations', 'Spacecraft Systems', 'Crisis Management'],
            experience: '20+ years at NASA Mission Control',
            sessions: 67,
            rating: 4.9,
            careers: ['mission-controller']
        },
        {
            id: 5,
            name: 'Dr. Elena Rodriguez',
            role: 'Space Medicine Physician',
            expertise: ['Aerospace Medicine', 'Human Physiology', 'Space Health'],
            experience: '8+ years at ESA',
            sessions: 29,
            rating: 4.8,
            careers: ['space-medicine']
        },
        {
            id: 6,
            name: 'Dr. Alex Thompson',
            role: 'AI & Space Research Lead',
            expertise: ['Machine Learning', 'Space Data Science', 'Autonomous Systems'],
            experience: '12+ years at JPL',
            sessions: 41,
            rating: 4.7,
            careers: ['ai-space-researcher']
        },
        {
            id: 7,
            name: 'Dr. Maria Santos',
            role: 'Planetary Geology Expert',
            expertise: ['Planetary Science', 'Geological Analysis', 'Mars Research'],
            experience: '15+ years at USGS Astrogeology',
            sessions: 33,
            rating: 4.8,
            careers: ['planetary-geologist']
        },
        {
            id: 8,
            name: 'Robert Chang',
            role: 'Space Entrepreneur & Investor',
            expertise: ['Space Startups', 'Business Strategy', 'Innovation'],
            experience: 'Founded 3 space companies',
            sessions: 56,
            rating: 4.6,
            careers: ['space-entrepreneur']
        }
    ];

    const filteredCareers = careers.filter(career =>
        (!selectedInterest || career.category === selectedInterest) &&
        (!selectedLevel || true) // All careers available for all levels
    );

    const toggleSkill = (skill) => {
        const newSkills = new Set(completedSkills);
        if (newSkills.has(skill)) {
            newSkills.delete(skill);
        } else {
            newSkills.add(skill);
        }
        setCompletedSkills(newSkills);
    };

    const calculateProgress = (career) => {
        const careerSkills = career.skills;
        const completed = careerSkills.filter(skill => completedSkills.has(skill)).length;
        return Math.round((completed / careerSkills.length) * 100);
    };

    const startSimulation = (career) => {
        setSelectedCareer(career);
        setSimulationMode(true);
    };

    const getSimulationData = (career, location) => {
        // Simulate different data based on career
        switch (career.id) {
            case 'climate-scientist':
                return {
                    title: 'Climate Impact Analysis',
                    metrics: [
                        { label: 'Temperature Rise', value: '+2.3°C', trend: 'up' },
                        { label: 'Sea Level Change', value: '+3.2mm/year', trend: 'up' },
                        { label: 'Carbon Levels', value: '415 ppm', trend: 'up' }
                    ],
                    impact: 'Your analysis helps cities prepare for climate change'
                };
            case 'satellite-analyst':
                return {
                    title: 'Satellite Monitoring Dashboard',
                    metrics: [
                        { label: 'Deforestation Rate', value: '-12%', trend: 'down' },
                        { label: 'Crop Health', value: '87%', trend: 'stable' },
                        { label: 'Urban Growth', value: '+5.2%', trend: 'up' }
                    ],
                    impact: 'Your monitoring protects forests and feeds communities'
                };
            case 'mission-controller':
                return {
                    title: 'Mission Control Systems',
                    metrics: [
                        { label: 'Spacecraft Status', value: 'Nominal', trend: 'stable' },
                        { label: 'Communication Link', value: '98.5%', trend: 'up' },
                        { label: 'Mission Progress', value: '67%', trend: 'up' }
                    ],
                    impact: 'Your expertise ensures successful space missions'
                };
            case 'space-medicine':
                return {
                    title: 'Astronaut Health Monitoring',
                    metrics: [
                        { label: 'Vital Signs', value: 'Normal', trend: 'stable' },
                        { label: 'Radiation Exposure', value: 'Safe Levels', trend: 'down' },
                        { label: 'Bone Density', value: '98%', trend: 'stable' }
                    ],
                    impact: 'Your medical knowledge keeps astronauts healthy in space'
                };
            case 'ai-space-researcher':
                return {
                    title: 'AI Space Data Analysis',
                    metrics: [
                        { label: 'Data Processed', value: '5.2 TB', trend: 'up' },
                        { label: 'AI Accuracy', value: '96.8%', trend: 'up' },
                        { label: 'Discoveries', value: '12', trend: 'up' }
                    ],
                    impact: 'Your AI algorithms unlock secrets of the universe'
                };
            case 'planetary-geologist':
                return {
                    title: 'Planetary Sample Analysis',
                    metrics: [
                        { label: 'Samples Analyzed', value: '234', trend: 'up' },
                        { label: 'Mineral Discoveries', value: '8', trend: 'up' },
                        { label: 'Research Papers', value: '5', trend: 'up' }
                    ],
                    impact: 'Your geological research helps plan future space settlements'
                };
            case 'space-entrepreneur':
                return {
                    title: 'Space Startup Metrics',
                    metrics: [
                        { label: 'Funding Raised', value: '$2.5M', trend: 'up' },
                        { label: 'Team Size', value: '24', trend: 'up' },
                        { label: 'Market Impact', value: 'High', trend: 'up' }
                    ],
                    impact: 'Your innovation is shaping the future of space industry'
                };
            default:
                return {
                    title: 'Space Data Analysis',
                    metrics: [
                        { label: 'Data Processed', value: '2.3 TB', trend: 'up' },
                        { label: 'Accuracy', value: '94.5%', trend: 'stable' },
                        { label: 'Discoveries', value: '7', trend: 'up' }
                    ],
                    impact: 'Your work advances human knowledge of space'
                };
        }
    };

    return (
        <div className="career-path-container">
            <header className="career-page-header">
                <h1 className="page-title">
                    
                    <span className="title-text"> 🚀 SPACE CAREER</span>
                    <span className="title-subtext">LEARNING PATH</span>
                </h1>
                <p className="page-subtitle">From curiosity to career - your journey into the space industry starts here</p>
            </header>

            {/* Career Discovery Panel */}
            <section className="discovery-panel glass-panel">
                <h2>🧭 Discover Your Space Career</h2>
                <div className="discovery-form">
                    <div className="form-group">
                        <label>What interests you most?</label>
                        <div className="interest-grid">
                            {interests.map(interest => (
                                <button
                                    key={interest.id}
                                    className={`interest-btn ${selectedInterest === interest.id ? 'active' : ''}`}
                                    onClick={() => setSelectedInterest(interest.id)}
                                >
                                    {interest.icon}
                                    <span>{interest.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Your current level</label>
                        <div className="level-selector">
                            {levels.map(level => (
                                <button
                                    key={level.id}
                                    className={`level-btn ${selectedLevel === level.id ? 'active' : ''}`}
                                    onClick={() => setSelectedLevel(level.id)}
                                >
                                    {level.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        className="explore-btn primary-btn"
                        onClick={() => {
                            if (!selectedInterest || !selectedLevel) {
                                alert('Please select both your interest and level');
                                return;
                            }
                            setShowCareers(true);
                        }}
                    >
                        <Rocket size={20} />
                        Explore Careers
                    </button>
                </div>
            </section>

            {!showCareers && (
                <section className="welcome-section">
                    <div className="welcome-content glass-panel">
                        <h2>🌟 Welcome to Your Space Career Journey!</h2>
                        <p>Select your interests and current level above to discover personalized career opportunities in the space industry.</p>
                        <div className="feature-highlights">
                            <div className="highlight-item">
                                <Rocket size={24} />
                                <span>9+ Space Career Paths</span>
                            </div>
                            <div className="highlight-item">
                                <Users size={24} />
                                <span>Expert Mentorship</span>
                            </div>
                            <div className="highlight-item">
                                <Play size={24} />
                                <span>Career Simulations</span>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Career Cards Grid */}
            {showCareers && (
                <section className="careers-section">
                    <h2>🧑‍🚀 Your Career Opportunities</h2>
                    <div className="careers-grid">
                        {filteredCareers.map(career => (
                            <div key={career.id} className="career-card glass-panel">
                                <div className="career-header">
                                    <div className="career-icon">{career.icon}</div>
                                    <div className="career-info">
                                        <h3>{career.title}</h3>
                                        <div className="career-meta">
                                            <span className="salary">{career.salary}</span>
                                            <span className="growth">{career.growth}</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="career-description">{career.description}</p>

                                <div className="career-impact">
                                    <strong>Real-world impact:</strong> {career.realWorld}
                                </div>

                                <div className="career-progress">
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${calculateProgress(career)}%` }}
                                        ></div>
                                    </div>
                                    <span className="progress-text">{calculateProgress(career)}% ready</span>
                                </div>

                                <div className="career-actions">
                                    <button
                                        className="view-career-btn"
                                        onClick={() => setSelectedCareer(career)}
                                    >
                                        View Details
                                    </button>
                                    <button
                                        className="simulate-btn"
                                        onClick={() => startSimulation(career)}
                                    >
                                        <Play size={16} />
                                        Simulate
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Career Detail Modal */}
            {selectedCareer && !simulationMode && (
                <div className="career-modal-overlay" onClick={() => setSelectedCareer(null)}>
                    <div className="career-modal glass-panel" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-icon">{selectedCareer.icon}</div>
                            <h2>{selectedCareer.title}</h2>
                            <button className="close-btn" onClick={() => setSelectedCareer(null)}>×</button>
                        </div>

                        {/* Learning Path Timeline */}
                        <div className="learning-path">
                            <h3>🛤️ Your Learning Path</h3>
                            <div className="path-timeline">
                                {selectedCareer.learningPath.map((step, index) => (
                                    <div
                                        key={index}
                                        className={`timeline-step ${currentStep >= index ? 'completed' : ''} ${currentStep === index ? 'active' : ''}`}
                                        onClick={() => setCurrentStep(index)}
                                    >
                                        <div className="step-marker">
                                            {currentStep > index ? <CheckCircle size={20} /> : <Circle size={20} />}
                                        </div>
                                        <div className="step-content">
                                            <h4>{step.step}</h4>
                                            <div className="step-meta">
                                                <Clock size={14} />
                                                <span>{step.time}</span>
                                            </div>
                                            <Link to={`/learn/${step.content}`} className="step-link">
                                                Start Learning →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Skill Tracker */}
                        <div className="skill-tracker">
                            <h3>🧠 Skill Tracker</h3>
                            <div className="skills-grid">
                                {selectedCareer.skills.map(skill => (
                                    <div
                                        key={skill}
                                        className={`skill-item ${completedSkills.has(skill) ? 'completed' : ''}`}
                                        onClick={() => toggleSkill(skill)}
                                    >
                                        <div className="skill-checkbox">
                                            {completedSkills.has(skill) ? <CheckCircle size={20} /> : <Circle size={20} />}
                                        </div>
                                        <span className="skill-name">{skill}</span>
                                        {completedSkills.has(skill) && <span className="skill-badge">Unlocked! 🎉</span>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Instructors */}
                        <div className="instructors-section">
                            <h3>👩‍🏫 Expert Instructors</h3>
                            <div className="instructors-grid">
                                {instructors
                                    .filter(inst => inst.careers.includes(selectedCareer.id))
                                    .map(instructor => (
                                        <div key={instructor.id} className="instructor-card">
                                            <div className="instructor-header">
                                                <div className="instructor-avatar">
                                                    <Users size={24} />
                                                </div>
                                                <div className="instructor-info">
                                                    <h4>{instructor.name}</h4>
                                                    <p>{instructor.role}</p>
                                                    <div className="instructor-meta">
                                                        <span className="experience">{instructor.experience}</span>
                                                        <span className="rating">⭐ {instructor.rating}</span>
                                                        <span className="sessions">{instructor.sessions} sessions</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="instructor-expertise">
                                                {instructor.expertise.map(tag => (
                                                    <span key={tag} className="expertise-tag">{tag}</span>
                                                ))}
                                            </div>
                                            <button className="connect-btn" onClick={() => window.location.href = '/instructor-connect'}>View All Instructors →</button>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Career Simulator Mode */}
            {simulationMode && selectedCareer && (
                <div className="simulator-overlay">
                    <div className="simulator-container glass-panel">
                        <div className="simulator-header">
                            <h2>🌍 Career Simulator: {selectedCareer.title}</h2>
                            <button className="close-simulator" onClick={() => setSimulationMode(false)}>×</button>
                        </div>

                        <div className="location-selector">
                            <MapPin size={20} />
                            <select
                                value={simulationLocation}
                                onChange={(e) => setSimulationLocation(e.target.value)}
                                className="location-select"
                            >
                                <option value="">Select a location to simulate</option>
                                <option value="mumbai">Mumbai, India</option>
                                <option value="newyork">New York, USA</option>
                                <option value="london">London, UK</option>
                                <option value="tokyo">Tokyo, Japan</option>
                                <option value="sao-paulo">São Paulo, Brazil</option>
                            </select>
                        </div>

                        {simulationLocation && (() => {
                            const simData = getSimulationData(selectedCareer, simulationLocation);
                            return (
                                <div className="simulation-content">
                                    <div className="simulation-dashboard">
                                        <h3>{simData.title}</h3>
                                        <p className="simulation-location">Analyzing data for: {simulationLocation}</p>

                                        <div className="metrics-grid">
                                            {simData.metrics.map((metric, index) => (
                                                <div key={index} className="metric-card">
                                                    <h4>{metric.label}</h4>
                                                    <div className={`metric-value ${metric.trend}`}>
                                                        {metric.value}
                                                        {metric.trend === 'up' && <TrendingUp size={16} />}
                                                        {metric.trend === 'down' && <TrendingUp size={16} style={{ transform: 'rotate(180deg)' }} />}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="simulation-impact">
                                        <Award size={24} />
                                        <div>
                                            <h3>This is how your work impacts Earth</h3>
                                            <p>{simData.impact}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CareerPath;
