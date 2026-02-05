import React, { useState, useEffect } from 'react';
import { UserCheck, ShieldClose, Clock, User, Mail, GraduationCap } from 'lucide-react';
import './ApplicantList.css';

const ApplicantList = ({ onVerify }) => {
    const [applicants, setApplicants] = useState([]);

    useEffect(() => {
        fetchApplicants();
    }, []);

    const fetchApplicants = async () => {
        try {
            const res = await fetch('http://localhost:5002/api/instructor-applications');
            const data = await res.json();
            // Map DB snake_case to component camelCase
            const mapped = data.map(app => ({
                id: app.id,
                fullName: app.full_name,
                email: app.email,
                specialization: app.specialization,
                bio: app.bio,
                resume: app.resume,
                certificate: app.certificate,
                idCard: app.id_card,
                status: app.status,
                aiStatus: app.ai_status,
                aiScore: app.ai_score,
                aiRemarks: app.ai_remarks,
                appliedAt: app.applied_at
            }));
            setApplicants(mapped);
        } catch (err) {
            console.error('Error fetching applicants:', err);
        }
    };

    const pendingApps = applicants; // Server already filters for PENDING

    return (
        <div className="applicant-list-view fade-in">
            <div className="view-header">
                <div>
                    <h1>Pending Verifications</h1>
                    <p>Review credentials for {pendingApps.length} incoming faculty applicants.</p>
                </div>
            </div>

            <div className="applicant-grid">
                {pendingApps.length > 0 ? pendingApps.map(app => (
                    <div key={app.id} className="applicant-card glass-panel">
                        <div className="applicant-main">
                            <div className="applicant-token">
                                <User size={32} className="text-cyan-400" />
                            </div>
                            <div className="applicant-meta">
                                <h3>{app.fullName}</h3>
                                <div className="meta-row">
                                    <GraduationCap size={14} />
                                    <span>{app.specialization}</span>
                                </div>
                                <div className="meta-row">
                                    <Mail size={14} />
                                    <span>{app.email}</span>
                                </div>
                            </div>
                        </div>

                        <div className="applicant-footer">
                            <div className="applied-at">
                                <Clock size={12} />
                                <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                            </div>
                            <button className="verify-button" onClick={() => onVerify(app)}>
                                <span>Analyze Credentials</span>
                                <UserCheck size={16} />
                            </button>
                        </div>

                        <div className="applicant-ai-badge">
                            <div className={`ai-pill ${app.aiStatus.toLowerCase()}`}>
                                AI: {app.aiStatus} ({app.aiScore}%)
                            </div>
                            {app.aiRemarks && <p className="ai-remarks" title={app.aiRemarks}>{app.aiRemarks}</p>}
                        </div>
                    </div>
                )) : (
                    <div className="empty-state">
                        <UserCheck size={48} className="text-slate-700" />
                        <p>No new applications detected in the transmission buffer.</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default ApplicantList;
