import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Link2, Check, ExternalLink, Share2, Zap, Shield, BarChart3 } from 'lucide-react';
import BlurText from './BlurText';
import QRCode from './QRCode';
import { colors } from './utils';

// Home Page Component
function HomePage({ onShortenUrl, attempts, isAuthenticated }) {
    const [url, setUrl] = useState('');
    const [shortUrl, setShortUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showQR, setShowQR] = useState(false);

    const remainingAttempts = isAuthenticated ? Infinity : 3 - attempts.count;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        const result = await onShortenUrl(url);
        if (result) {
            setShortUrl(result);
            setUrl('');
        }
        setLoading(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shortUrl.shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
            {/* Hero Section */}
            <div className="text-center mb-12">
                <BlurText
                    text="Welcome to ShortLink!"
                    className="text-5xl md:text-7xl font-bold mb-6"
                    delay={100}
                />
                <BlurText
                    text="Make your URLs shorter and more shareable"
                    className="text-xl md:text-2xl mb-8"
                    delay={150}
                    direction="bottom"
                    style={{ color: colors.textMuted }}
                />
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-xl border border-gray-800"
                    style={{ backgroundColor: colors.surface }}
                >
                    <Zap className="w-10 h-10 mb-4" style={{ color: colors.warning }} />
                    <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
                    <p style={{ color: colors.textMuted }}>Generate short links instantly with our optimized service</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 rounded-xl border border-gray-800"
                    style={{ backgroundColor: colors.surface }}
                >
                    <Shield className="w-10 h-10 mb-4" style={{ color: colors.accent }} />
                    <h3 className="text-lg font-semibold mb-2">Secure & Reliable</h3>
                    <p style={{ color: colors.textMuted }}>Your links are safe and always accessible when you need them</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-6 rounded-xl border border-gray-800"
                    style={{ backgroundColor: colors.surface }}
                >
                    <BarChart3 className="w-10 h-10 mb-4" style={{ color: colors.secondary }} />
                    <h3 className="text-lg font-semibold mb-2">Track Performance</h3>
                    <p style={{ color: colors.textMuted }}>Monitor click statistics and analyze your link performance</p>
                </motion.div>
            </div>

            {/* URL Shortener Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="max-w-3xl mx-auto"
            >
                <div className="relative">
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Paste your long URL here..."
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                        className="w-full px-6 py-4 pr-32 rounded-xl border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors text-lg"
                        style={{ backgroundColor: colors.surface, color: colors.text }}
                    />
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={loading || remainingAttempts <= 0}
                        className="absolute right-2 top-2 bottom-2 px-6 rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        style={{ backgroundColor: colors.primary }}
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                            <>
                                <Link2 className="w-5 h-5" />
                                <span>Shorten</span>
                            </>
                        )}
                    </button>
                </div>

                {!isAuthenticated && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center mt-4"
                        style={{ color: colors.textMuted }}
                    >
                        {remainingAttempts > 0
                            ? `${remainingAttempts} free ${remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining`
                            : 'Please login to continue shortening URLs'
                        }
                    </motion.p>
                )}

                {/* Result Section */}
                <AnimatePresence>
                    {shortUrl && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mt-8 p-6 rounded-xl border border-gray-700"
                            style={{ backgroundColor: colors.surface }}
                        >
                            <h3 className="text-lg font-semibold mb-4">Your shortened URL is ready!</h3>

                            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                <div className="flex-1 p-4 rounded-lg border border-gray-700" style={{ backgroundColor: colors.background }}>
                                    <p className="text-sm mb-1" style={{ color: colors.textMuted }}>Short URL</p>
                                    <div className="flex items-center justify-between">
                                        <a
                                            href={shortUrl.shortUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-lg font-medium hover:underline flex items-center space-x-2"
                                            style={{ color: colors.secondary }}
                                        >
                                            <span>{shortUrl.shortUrl}</span>
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={copyToClipboard}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:opacity-90 transition-all"
                                    style={{ backgroundColor: colors.accent }}
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                                </button>

                                <button
                                    onClick={() => setShowQR(!showQR)}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:opacity-90 transition-all"
                                    style={{ backgroundColor: colors.primary }}
                                >
                                    <Share2 className="w-4 h-4" />
                                    <span>{showQR ? 'Hide' : 'Show'} QR Code</span>
                                </button>
                            </div>

                            {/* QR Code */}
                            <AnimatePresence>
                                {showQR && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-6 flex justify-center"
                                    >
                                        <div className="bg-white p-4 rounded-lg">
                                            <QRCode value={shortUrl.shortUrl} size={200} />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
}

export default HomePage;