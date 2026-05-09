export default function AboutPage() {
    return (
        <div className="nil-page-wrapper">
            <div className="nil-about-page">

                {/* ── HEADER ── */}
                <div className="nil-about-header">
                    <h1 className="nil-about-title">About Front Door</h1>
                    <p className="nil-about-tagline">
                        Where athletes grow, agents connect, and schools stay compliant.
                    </p>
                </div>

                {/* ── STORY ── */}
                <section className="nil-about-section">
                    <div className="nil-about-story">
                        <p>
                            We started Front Door as college roommates trying to better understand how NIL
                            actually works.
                        </p>
                        <p>
                            What we found was a system full of opportunity, but very little structure.
                            Athletes were expected to navigate deals, branding, and compliance without clear
                            guidance. Schools were trying to keep up. Agents were operating without a
                            shared standard.
                        </p>
                        <p>
                            Most platforms focus on executing deals after they happen. We're building
                            something different.
                        </p>
                        <p>
                            Front Door is designed to sit upstream — helping athletes learn NIL, connect
                            with trusted representation, and stay organized from the beginning.
                        </p>
                        <p className="nil-about-closing">
                            Our goal is simple: make NIL easier to understand, safer to navigate, and more
                            structured for everyone involved.
                        </p>
                    </div>
                </section>

                {/* ── FOUNDERS ── */}
                <section className="nil-about-section">
                    <h2 className="nil-about-section-title">The Founders</h2>
                    <div className="nil-founders-grid">
                        <div className="nil-founder-card">
                            <div className="nil-founder-avatar">TA</div>
                            <div className="nil-founder-info">
                                <h3>Tife Agunloye</h3>
                                <span className="nil-founder-role">Co-Founder</span>
                                <p>
                                    Bates College. Interested in the intersection of sports, business, and
                                    athlete empowerment.
                                </p>
                            </div>
                        </div>
                        <div className="nil-founder-card">
                            <div className="nil-founder-avatar">RA</div>
                            <div className="nil-founder-info">
                                <h3>Rex Ah Chu</h3>
                                <span className="nil-founder-role">Co-Founder</span>
                                <p>
                                    Bates College. Focused on NIL, athlete branding, and building systems
                                    that make the space more transparent and accessible.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
