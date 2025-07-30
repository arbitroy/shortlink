import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Link2, History, Check, ExternalLink, Clock, BarChart3, QrCode as QrCodeIcon, Download, X } from 'lucide-react';
import QRCode from './QRCode';
import { colors } from './utils';

// History Page Component
function HistoryPage({ history, loading }) {
    const [copiedId, setCopiedId] = useState(null);
    const [qrModalData, setQrModalData] = useState(null);

    const copyToClipboard = (url, id) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;

        return date.toLocaleDateString();
    };

    const downloadQRCode = (shortUrl) => {
        const svg = document.getElementById(`qr-${shortUrl}`);
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const pngFile = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = `qr-${shortUrl.split('/').pop()}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
            >
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">URL History</h1>
                    <p style={{ color: colors.textMuted }}>View and manage all your shortened URLs</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.primary }}></div>
                    </div>
                ) : history.length === 0 ? (
                    <div className="text-center py-12">
                        <History className="w-16 h-16 mx-auto mb-4" style={{ color: colors.textMuted }} />
                        <p className="text-xl" style={{ color: colors.textMuted }}>No URLs shortened yet</p>
                        <p className="mt-2" style={{ color: colors.textMuted }}>Start shortening URLs to see them here</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {history.map((item, index) => (
                            <motion.div
                                key={item.shortCode || index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors"
                                style={{ backgroundColor: colors.surface }}
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start space-x-3 mb-2">
                                            <Link2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: colors.accent }} />
                                            <div className="flex-1 min-w-0">
                                                <a
                                                    href={item.shortUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-lg font-medium hover:underline flex items-center space-x-2"
                                                    style={{ color: colors.secondary }}
                                                >
                                                    <span className="truncate">{item.shortUrl}</span>
                                                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                                                </a>
                                                <p className="text-sm mt-1 truncate" style={{ color: colors.textMuted }}>
                                                    {item.originalUrl}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4 text-sm" style={{ color: colors.textMuted }}>
                                            <div className="flex items-center space-x-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{formatDate(item.createdAt)}</span>
                                            </div>
                                            {item.clicks !== undefined && (
                                                <div className="flex items-center space-x-1">
                                                    <BarChart3 className="w-4 h-4" />
                                                    <span>{item.clicks} clicks</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => copyToClipboard(item.shortUrl, item.shortCode || index)}
                                            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:opacity-90 transition-all"
                                            style={{ backgroundColor: colors.primary }}
                                        >
                                            {copiedId === (item.shortCode || index) ? (
                                                <Check className="w-4 h-4" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                            <span className="hidden sm:inline">{copiedId === (item.shortCode || index) ? 'Copied!' : 'Copy'}</span>
                                        </button>

                                        <button
                                            onClick={() => setQrModalData(item)}
                                            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:opacity-90 transition-all"
                                            style={{ backgroundColor: colors.accent }}
                                        >
                                            <QrCodeIcon className="w-4 h-4" />
                                            <span className="hidden sm:inline">QR Code</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* QR Code Modal */}
            <AnimatePresence>
                {qrModalData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={() => setQrModalData(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-xl p-6 max-w-sm w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">QR Code</h3>
                                <button
                                    onClick={() => setQrModalData(null)}
                                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="bg-white p-4 rounded-lg mb-4" id={`qr-${qrModalData.shortUrl}`}>
                                    <QRCode value={qrModalData.shortUrl} size={200} />
                                </div>

                                <p className="text-sm text-gray-600 text-center mb-4 break-all">
                                    {qrModalData.shortUrl}
                                </p>

                                <button
                                    onClick={() => downloadQRCode(qrModalData.shortUrl)}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:opacity-90 transition-all"
                                    style={{ backgroundColor: colors.primary }}
                                >
                                    <Download className="w-4 h-4" />
                                    <span>Download QR Code</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default HistoryPage;