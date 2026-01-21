import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface NavigationPillProps {
    activeTab: 'engineering' | 'photography';
    onToggle: (tab: 'engineering' | 'photography') => void;
}

const NavigationPill: React.FC<NavigationPillProps> = ({ activeTab, onToggle }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 1000); // 1s delay
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const getScrollContainer = () => {
            if (activeTab === 'engineering') {
                return document.querySelector('.portfolio-page');
            } else {
                return document.querySelector('.creative-page-new');
            }
        };

        const attachListener = () => {
            const container = getScrollContainer();
            if (!container) {
                // Retry if container not found immediately (due to transition)
                setTimeout(attachListener, 100);
                return;
            }

            const handleScroll = () => {
                const currentScrollY = container.scrollTop;

                if (currentScrollY > lastScrollY && currentScrollY > 50) {
                    // Scrolling down & past top
                    setIsVisible(false);
                } else {
                    // Scrolling up
                    setIsVisible(true);
                }

                setLastScrollY(currentScrollY);
            };

            container.addEventListener('scroll', handleScroll, { passive: true });

            // Cleanup function for this attachment
            return () => container.removeEventListener('scroll', handleScroll);
        };

        // Initial attachment
        const cleanup = attachListener();

        // Return global cleanup
        return () => {
            if (typeof cleanup === 'function') cleanup();
            const container = getScrollContainer();
            if (container) {
                // Ensure we clean up if the loop didn't return the cleanup function logic correctly
                // (though the closure above handles it, explicit safety is good)
            }
        };
    }, [activeTab, lastScrollY]);

    const shouldShow = isLoaded && isVisible;

    return (
        <motion.div
            className="nav-pill-container"
            initial={{ y: -50, opacity: 0 }}
            animate={{
                y: shouldShow ? 0 : -50,
                opacity: shouldShow ? 1 : 0,
                pointerEvents: shouldShow ? 'auto' : 'none'
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
                position: 'fixed',
                top: '1.0rem', // Moved up approx 1%
                left: '50%',
                transform: 'translateX(-50%)',
                x: '-50%', // motion style for centering
                zIndex: 10000,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                padding: '4px',
                borderRadius: '9999px',
                display: 'flex',
                gap: '4px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}
        >
            <button
                onClick={() => onToggle('engineering')}
                style={{
                    position: 'relative',
                    padding: '8px 20px',
                    borderRadius: '9999px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica', sans-serif",
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: activeTab === 'engineering' ? '#000' : 'rgba(255, 255, 255, 0.6)',
                    transition: 'color 0.3s ease',
                    zIndex: 1,
                    outline: 'none',
                }}
            >
                {activeTab === 'engineering' && (
                    <motion.div
                        layoutId="pill-bg"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: '#ffffff',
                            borderRadius: '9999px',
                            zIndex: -1,
                        }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                )}
                <span style={{ color: activeTab === 'engineering' ? '#000' : 'rgba(150, 150, 150, 1)' }}>
                    Engineering
                </span>
            </button>

            <button
                onClick={() => onToggle('photography')}
                style={{
                    position: 'relative',
                    padding: '8px 20px',
                    borderRadius: '9999px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontFamily: "'Syne Mono', monospace",
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    transition: 'color 0.3s ease',
                    zIndex: 1,
                    outline: 'none',
                }}
            >
                {activeTab === 'photography' && (
                    <motion.div
                        layoutId="pill-bg"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: '#000000',
                            borderRadius: '9999px',
                            zIndex: -1,
                        }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                )}
                <span style={{ color: activeTab === 'photography' ? '#fff' : 'rgba(150, 150, 150, 1)' }}>
                    Photography
                </span>
            </button>
        </motion.div>
    );
};

export default NavigationPill;
