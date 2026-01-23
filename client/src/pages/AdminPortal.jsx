import React, { useState } from 'react';
import { Users, UserPlus, Shield, ChevronLeft, LogOut } from 'lucide-react';
import InstructorVerification from './InstructorVerification';
import ViewInstructors from '../components/admin/ViewInstructors';
import CommanderReview from '../components/admin/CommanderReview';
import ApplicantList from '../components/admin/ApplicantList';
import Navbar from '../components/layout/Navbar';
import './AdminPortal.css';

const AdminPortal = () => {
    const [activeTab, setActiveTab] = useState('view'); // 'view', 'verify', 'review'
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedApplicant, setSelectedApplicant] = useState(null);

    const menuItems = [
        { id: 'view', label: 'View Instructors', icon: <Users size={20} /> },
        { id: 'verify', label: 'Verify Instructors', icon: <UserPlus size={20} /> },
        { id: 'review', label: 'Commander Review', icon: <Shield size={20} /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'view':
                return <ViewInstructors />;
            case 'verify':
                if (selectedApplicant) {
                    return (
                        <div className="verification-detail">
                            <button className="back-btn" onClick={() => setSelectedApplicant(null)}>
                                ← Back to Applicant List
                            </button>
                            <InstructorVerification
                                isEmbedded={true}
                                applicantData={selectedApplicant}
                                onAction={(status) => {
                                    if (status === 'approved' || status === 'rejected' || status === 'back') {
                                        setSelectedApplicant(null);
                                    }
                                }}
                            />
                        </div>
                    );
                }
                return <ApplicantList onVerify={(app) => setSelectedApplicant(app)} />;
            case 'review':
                return <CommanderReview />;
            default:
                return <ViewInstructors />;
        }
    };

    return (
        <div className="admin-portal-wrapper">
            <Navbar />

            <div className={`admin-portal-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                {/* Sidebar */}
                <aside className="admin-sidebar glass-panel">
                    <div className="sidebar-header">
                        <div className="admin-badge">
                            <Shield className="text-cyan-400" size={18} />
                            <span>ADM-NODE v1.0</span>
                        </div>
                        <button className="collapse-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            <ChevronLeft size={16} />
                        </button>
                    </div>

                    <nav className="sidebar-nav">
                        {menuItems.map(item => (
                            <button
                                key={item.id}
                                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-label">{item.label}</span>
                                {activeTab === item.id && <div className="active-glow"></div>}
                            </button>
                        ))}
                    </nav>

                    <div className="sidebar-footer">
                        <a href="/" className="logout-btn">
                            <LogOut size={18} />
                            <span>Exit Terminal</span>
                        </a>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="admin-main-content">
                    <div className="view-container">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminPortal;
