import React, { useState, useEffect } from 'react';
import { Users, Upload, CheckCircle, XCircle, MessageSquare, Image as ImageIcon, Send, ShieldCheck, Clock, Eye } from 'lucide-react';
import './Community.css';

const Community = () => {
    const [view, setView] = useState('FEED'); // FEED, SUBMIT, ADMIN
    const [reports, setReports] = useState([]);
    const [form, setForm] = useState({ title: '', content: '', category: 'Observation', images: [] });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial Load
    useEffect(() => {
        const saved = localStorage.getItem('spacescope_reports');
        if (saved) {
            let parsed = JSON.parse(saved);
            // MIGRATION: Fix the accidental car image in user's cache
            const oldCarUrl = "https://images.unsplash.com/photo-1573074617613-fc8ef27eaa2f?auto=format&fit=crop&q=80&w=800";
            const newAuroraUrl = "https://images.unsplash.com/photo-1531366930472-358045768e82?auto=format&fit=crop&q=80&w=800";

            let updated = false;
            parsed = parsed.map(r => {
                if (r.images && r.images.includes(oldCarUrl)) {
                    updated = true;
                    return { ...r, images: r.images.map(img => img === oldCarUrl ? newAuroraUrl : img) };
                }
                return r;
            });

            if (updated) {
                setReports(parsed);
                localStorage.setItem('spacescope_reports', JSON.stringify(parsed));
            } else {
                setReports(parsed);
            }
        } else {
            // Initial Seed Data
            const seed = [
                {
                    id: 1,
                    title: "Strange Aurora over Norway",
                    content: "Captured these unusual violet pillars during the last solar flare. Never seen this color intensity before!",
                    user: "StarGazer_99",
                    status: "APPROVED",
                    category: "Observation",
                    timestamp: new Date(Date.now() - 86400000).toISOString(),
                    images: ["https://images.unsplash.com/photo-1531366930472-358045768e82?auto=format&fit=crop&q=80&w=800"]
                },
                {
                    id: 2,
                    title: "Urban Light Pollution Report",
                    content: "Requesting more dark sky initiatives in Mumbai. The Bortle scale here is reaching critical levels for amateur astronomy.",
                    user: "AstroAmateur",
                    status: "APPROVED",
                    category: "Opinion",
                    timestamp: new Date(Date.now() - 172800000).toISOString(),
                    images: []
                },
                {
                    id: 3,
                    title: "Meteor Impact? Small Crater Found",
                    content: "Found this small impact site while hiking. Looks fresh. Anyone else hear a sonic boom last night?",
                    user: "CitizenScience",
                    status: "PENDING",
                    category: "Report",
                    timestamp: new Date().toISOString(),
                    images: ["https://images-assets.nasa.gov/image/PIA23351/PIA23351~orig.jpg"]
                }
            ];
            setReports(seed);
            localStorage.setItem('spacescope_reports', JSON.stringify(seed));
        }
    }, []);

    const saveReports = (newReports) => {
        setReports(newReports);
        localStorage.setItem('spacescope_reports', JSON.stringify(newReports));
    };

    // Form Handlers
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        // Simple base64 conversion for LocalStorage storage (Note: large images might hit limit, kept small for demo)
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm(prev => ({ ...prev, images: [...prev.images, reader.result] }));
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newReport = {
            id: Date.now(),
            ...form,
            user: "Guest_User",
            status: "PENDING",
            timestamp: new Date().toISOString()
        };

        const updated = [newReport, ...reports];
        saveReports(updated);

        setTimeout(() => {
            setIsSubmitting(false);
            setForm({ title: '', content: '', category: 'Observation', images: [] });
            setView('FEED');
            alert("Report submitted! It is now waiting for Admin validation.");
        }, 1000);
    };

    // Admin Handlers
    const handleAdminAction = (id, status) => {
        const updated = reports.map(r => r.id === id ? { ...r, status } : r);
        saveReports(updated);
    };

    const approvedReports = reports.filter(r => r.status === 'APPROVED');
    const pendingReports = reports.filter(r => r.status === 'PENDING');

    return (
        <div className="community-container fade-in">
            {/* TAB NAVIGATION */}
            <div className="community-nav glass-panel">
                <button className={`nav-tab ${view === 'FEED' ? 'active' : ''}`} onClick={() => setView('FEED')}>
                    <Users size={20} /> Community Feed
                </button>
                <button className={`nav-tab ${view === 'SUBMIT' ? 'active' : ''}`} onClick={() => setView('SUBMIT')}>
                    <Upload size={20} /> Share Report
                </button>
                <button className={`nav-tab ${view === 'ADMIN' ? 'active' : ''}`} onClick={() => setView('ADMIN')}>
                    <ShieldCheck size={20} /> Admin Review {pendingReports.length > 0 && <span className="notif-dot">{pendingReports.length}</span>}
                </button>
            </div>

            {/* REVIEW SECTION AT TOP (Highlights) */}
            {view === 'FEED' && (
                <div className="review-highlight-section">
                    <div className="section-tag">LATEST VALIDATED REPORTS</div>
                    <div className="highlight-scroll">
                        {approvedReports.slice(0, 3).map(r => (
                            <div key={r.id} className="highlight-card glass-panel" onClick={() => setView('FEED')}>
                                <div className="h-cat">{r.category}</div>
                                <h4>{r.title}</h4>
                                <div className="h-meta"><Clock size={12} /> {new Date(r.timestamp).toLocaleDateString()}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* MAIN VIEWS */}
            <main className="community-main">
                {view === 'FEED' && (
                    <div className="feed-view">
                        <div className="feed-header">
                            <h2>The Collective Conscious</h2>
                            <p>Global space intelligence verified by our crew.</p>
                        </div>
                        <div className="report-grid">
                            {approvedReports.length > 0 ? approvedReports.map(report => (
                                <ReportCard key={report.id} report={report} />
                            )) : <div className="empty-msg">No reports found. Be the first to share!</div>}
                        </div>
                    </div>
                )}

                {view === 'SUBMIT' && (
                    <div className="submit-view glass-panel">
                        <h2>Dispatch New Intel</h2>
                        <form onSubmit={handleSubmit} className="submit-form">
                            <div className="form-group">
                                <label>Report Title</label>
                                <input
                                    required
                                    value={form.title}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                    placeholder="e.g. Unusual Glow in North Sky"
                                />
                            </div>

                            <div className="form-group">
                                <label>Type</label>
                                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                    <option>Observation</option>
                                    <option>Opinion</option>
                                    <option>Report</option>
                                    <option>Question</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Detailed Description</label>
                                <textarea
                                    required
                                    rows="5"
                                    value={form.content}
                                    onChange={e => setForm({ ...form, content: e.target.value })}
                                    placeholder="Describe your observation, impact, or opinion..."
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label>Attach Evidence (Images)</label>
                                <div className="image-upload-zone">
                                    <input type="file" multiple accept="image/*" onChange={handleFileChange} id="file-upload" />
                                    <label htmlFor="file-upload" className="upload-btn">
                                        <ImageIcon size={24} /> Upload Images
                                    </label>
                                    <div className="preview-strip">
                                        {form.images.map((img, i) => (
                                            <div key={i} className="preview-box" style={{ backgroundImage: `url(${img})` }}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="submit-action-btn" disabled={isSubmitting}>
                                {isSubmitting ? "Transmitting..." : <><Send size={18} /> Submit for Validation</>}
                            </button>
                        </form>
                    </div>
                )}

                {view === 'ADMIN' && (
                    <div className="admin-view">
                        <div className="admin-header">
                            <h2>Command Center: Validation Hub</h2>
                            <p>As an admin, review incoming data for accuracy and relevance.</p>
                        </div>
                        <div className="admin-list">
                            {pendingReports.length > 0 ? pendingReports.map(report => (
                                <div key={report.id} className="admin-item glass-panel">
                                    <div className="admin-item-info">
                                        <div className="item-head">
                                            <span className="item-user">@{report.user}</span>
                                            <span className="item-date">{new Date(report.timestamp).toLocaleString()}</span>
                                        </div>
                                        <h3>{report.title}</h3>
                                        <p>{report.content}</p>
                                        <div className="admin-images">
                                            {report.images.map((img, i) => <img key={i} src={img} alt="Evidence" />)}
                                        </div>
                                    </div>
                                    <div className="admin-actions">
                                        <button className="approve-btn" onClick={() => handleAdminAction(report.id, 'APPROVED')}>
                                            <CheckCircle size={20} /> Verify
                                        </button>
                                        <button className="reject-btn" onClick={() => handleAdminAction(report.id, 'REJECTED')}>
                                            <XCircle size={20} /> Reject
                                        </button>
                                    </div>
                                </div>
                            )) : <div className="empty-msg">No pending requests. Great job, Commander!</div>}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

const ReportCard = ({ report }) => (
    <div className="report-card glass-panel fade-in">
        <div className="report-header">
            <span className="report-cat">{report.category}</span>
            <span className="report-user">@{report.user}</span>
        </div>

        {report.images.length > 0 && (
            <div className="report-image" style={{ backgroundImage: `url(${report.images[0]})` }}>
                {report.images.length > 1 && <div className="img-count">+{report.images.length - 1}</div>}
            </div>
        )}

        <div className="report-body">
            <h3>{report.title}</h3>
            <p>{report.content}</p>
        </div>

        <div className="report-footer">
            <div className="footer-stats">
                <span><MessageSquare size={14} /> 0 Responses</span>
                <span><Eye size={14} /> {Math.floor(Math.random() * 50) + 5} Views</span>
            </div>
            <span className="report-time">{new Date(report.timestamp).toLocaleDateString()}</span>
        </div>
    </div>
);

export default Community;
