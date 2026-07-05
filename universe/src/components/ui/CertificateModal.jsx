import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUniverseStore } from '../../store/useUniverseStore';
import { certificates } from '../../data/portfolioData';

export default function CertificateModal() {
    const activeCertificateModalUrl = useUniverseStore((s) => s.activeCertificateModalUrl);
    const closeCertificateModal = useUniverseStore((s) => s.closeCertificateModal);

    // Find certificate matching the URL to display its title
    const cert = certificates.find((c) => c.credentialUrl === activeCertificateModalUrl);

    // Close on ESC keypress
    useEffect(() => {
        if (!activeCertificateModalUrl) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeCertificateModal();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeCertificateModalUrl, closeCertificateModal]);

    return (
        <AnimatePresence>
            {activeCertificateModalUrl && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-void/90 backdrop-blur-md cursor-zoom-out"
                    onClick={closeCertificateModal}
                >
                    {/* Close Indicator HUD */}
                    <div className="absolute top-6 right-6 flex items-center gap-2 pointer-events-none select-none z-[110]">
                        <span className="font-mono text-[10px] tracking-widest text-[#00FFFF]/70 uppercase">
                            ESC OR CLICK TO EXIT
                        </span>
                        <button className="h-8 w-8 rounded-full border border-[#00FFFF]/30 bg-[#00FFFF]/5 flex items-center justify-center text-holo text-sm font-mono cursor-pointer pointer-events-auto">
                            ✕
                        </button>
                    </div>

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative max-h-[88vh] max-w-[92vw] overflow-hidden rounded-xl border border-ion/40 shadow-glow-ion/20 flex flex-col items-center justify-center bg-void/95 cursor-default group"
                    >
                        {/* Header info */}
                        {cert && (
                            <div className="absolute top-0 left-0 right-0 p-3 bg-void/80 backdrop-blur border-b border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex justify-between items-center">
                                <span className="font-mono text-[9px] text-[#00FFFF] uppercase tracking-widest">
                                    DECRYPTED KNOWLEDGE ENVELOPE
                                </span>
                                <span className="font-mono text-xs text-white font-bold max-w-[70%] truncate">
                                    {cert.title}
                                </span>
                            </div>
                        )}

                        {/* Main Visual */}
                        <div className="p-2 w-full h-full flex items-center justify-center overflow-auto max-h-[85vh]">
                            {activeCertificateModalUrl.endsWith('.pdf') ? (
                                <iframe
                                    src={`${activeCertificateModalUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                                    className="w-[85vw] h-[80vh] border-0 rounded-lg bg-white"
                                    title={cert ? cert.title : "Certificate"}
                                />
                            ) : (
                                <img
                                    src={activeCertificateModalUrl}
                                    className="max-h-[80vh] max-w-[85vw] object-contain rounded-lg shadow-2xl border border-white/10"
                                    alt={cert ? cert.title : "Certificate"}
                                />
                            )}
                        </div>

                        {/* Bottom info */}
                        {cert && (
                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-void/80 backdrop-blur border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 text-center font-mono text-[10px] text-white/60">
                                ORGANIZATION: <span className="text-holo">{cert.organization}</span> | ISSUED: <span className="text-solar">{cert.issueDate}</span>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
