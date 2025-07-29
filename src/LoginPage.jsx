import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { api, colors } from './utils';

// Login Page Component
function LoginPage({ onLogin, loading }) {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isRegister) {
            // Handle registration
            api.register(formData).then(() => onLogin(formData));
        } else {
            onLogin(formData);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-md mx-auto px-4 py-16"
        >
            <div className="p-8 rounded-xl border border-gray-800" style={{ backgroundColor: colors.surface }}>
                <h2 className="text-3xl font-bold text-center mb-8">
                    {isRegister ? 'Create Account' : 'Welcome Back'}
                </h2>

                <div className="space-y-6">
                    {isRegister && (
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: colors.textMuted }}>
                                Name
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
                                style={{ backgroundColor: colors.background, color: colors.text }}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.textMuted }}>
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
                            style={{ backgroundColor: colors.background, color: colors.text }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.textMuted }}>
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
                            style={{ backgroundColor: colors.background, color: colors.text }}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full py-3 rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        style={{ backgroundColor: colors.primary }}
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                            <>
                                <LogIn className="w-5 h-5" />
                                <span>{isRegister ? 'Sign Up' : 'Sign In'}</span>
                            </>
                        )}
                    </button>
                </div>

                <p className="text-center mt-6" style={{ color: colors.textMuted }}>
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="font-medium hover:underline"
                        style={{ color: colors.secondary }}
                    >
                        {isRegister ? 'Sign In' : 'Sign Up'}
                    </button>
                </p>
            </div>
        </motion.div>
    );
}

export default LoginPage;