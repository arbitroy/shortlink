import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import FuzzyText from './FuzzyText';
import { colors } from './utils';

// 404 Not Found Page Component
function NotFoundPage({ onGoHome }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4"
        >
            <div className="text-center">
                <div className="mb-8 flex justify-center">
                    <FuzzyText
                        baseIntensity={0.2}
                        hoverIntensity={0.8}
                        enableHover={true}
                        fontSize="clamp(4rem, 15vw, 12rem)"
                        color={colors.danger}
                    >
                        404
                    </FuzzyText>
                </div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl md:text-4xl font-bold mb-4"
                >
                    Page Not Found
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg mb-8"
                    style={{ color: colors.textMuted }}
                >
                    The link you're looking for doesn't exist or has been removed.
                </motion.p>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={onGoHome}
                    className="px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all inline-flex items-center space-x-2"
                    style={{ backgroundColor: colors.primary }}
                >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                    <span>Back to Home</span>
                </motion.button>
            </div>
        </motion.div>
    );
}

export default NotFoundPage;