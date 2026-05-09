import { Link } from 'react-router-dom';
import { BookOpen, FileText, TrendingUp, ArrowRight } from 'lucide-react';

const RESOURCE_ITEMS = [
    {
        icon: BookOpen,
        category: 'Articles',
        title: 'NIL 101: What Every Athlete Needs to Know',
        description: 'A beginner-friendly breakdown of how NIL works, what you can earn, and how to get started.',
        link: '#',
    },
    {
        icon: FileText,
        category: 'Guides',
        title: 'The Athlete\'s Guide to NIL Contracts',
        description: 'Learn what to look for in a deal, red flags to avoid, and how to protect yourself.',
        link: '#',
    },
    {
        icon: TrendingUp,
        category: 'NIL Insights',
        title: 'State-by-State NIL Policy Breakdown',
        description: 'Understand how rules differ across states and what it means for your eligibility.',
        link: '#',
    },
    {
        icon: BookOpen,
        category: 'Articles',
        title: 'Building Your Personal Brand as a Student-Athlete',
        description: 'Practical steps to grow your audience and attract brand partnerships before graduation.',
        link: '#',
    },
    {
        icon: FileText,
        category: 'Guides',
        title: 'University Compliance Quick-Start Guide',
        description: 'For athletic departments: a step-by-step overview of NIL reporting requirements.',
        link: '#',
    },
    {
        icon: TrendingUp,
        category: 'NIL Insights',
        title: 'Top NIL Deals of the Year: What We Can Learn',
        description: 'Analysis of high-profile NIL activations and what made them work.',
        link: '#',
    },
];

const CATEGORIES = ['All', 'Articles', 'Guides', 'NIL Insights'];

export default function ResourcesPage() {
    return (
        <div className="nil-page-wrapper">
            <div className="nil-section" style={{ paddingTop: '7rem' }}>
                {/* Header */}
                <div className="nil-section-header">
                    <h1 className="nil-section-title">Resources</h1>
                    <p className="nil-section-subtitle">
                        Articles, guides, and NIL insights to help you navigate the landscape with confidence.
                    </p>
                </div>

                {/* Category Filter (static, visual only for now) */}
                <div className="nil-resource-filters">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            className={`nil-filter-btn${cat === 'All' ? ' nil-filter-btn--active' : ''}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Resource Grid */}
                <div className="nil-resource-grid">
                    {RESOURCE_ITEMS.map((item) => (
                        <a key={item.title} href={item.link} className="nil-resource-card">
                            <div className="nil-resource-meta">
                                <item.icon size={16} />
                                <span>{item.category}</span>
                            </div>
                            <h3 className="nil-resource-title">{item.title}</h3>
                            <p className="nil-resource-desc">{item.description}</p>
                            <span className="nil-resource-cta">
                                Read More <ArrowRight size={14} />
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
