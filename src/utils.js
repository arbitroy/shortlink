// Color palette from the PDF
export const colors = {
    primary: '#33658A',
    secondary: '#86BBD8',
    accent: '#758E4F',
    warning: '#F6AE2D',
    danger: '#F26419',
    background: '#1a1a1a',
    surface: '#2a2a2a',
    text: '#ffffff',
    textMuted: '#a0a0a0'
};

// API Service placeholder
export const api = {
    // Shorten URL - expects { url: string }
    shortenUrl: async (longUrl) => {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Expected response: { shortUrl: string, shortCode: string, createdAt: string }
        return {
            shortUrl: `https://short.link/${Math.random().toString(36).substr(2, 6)}`,
            shortCode: Math.random().toString(36).substr(2, 6),
            createdAt: new Date().toISOString(),
            originalUrl: longUrl
        };
    },

    // Get user's URL history - expects authentication token
    getUrlHistory: async () => {
        await new Promise(resolve => setTimeout(resolve, 800));

        // Expected response: { urls: Array<{ shortUrl, originalUrl, createdAt, clicks }> }
        return {
            urls: [
                {
                    shortUrl: 'https://short.link/abc123',
                    originalUrl: 'https://example.com/very-long-url-here',
                    createdAt: new Date(Date.now() - 86400000).toISOString(),
                    clicks: 42
                },
                {
                    shortUrl: 'https://short.link/def456',
                    originalUrl: 'https://another-example.com/another-long-url',
                    createdAt: new Date(Date.now() - 172800000).toISOString(),
                    clicks: 17
                }
            ]
        };
    },

    // Login - expects { email: string, password: string }
    login: async (credentials) => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Expected response: { token: string, user: { email, name } }
        return {
            token: 'mock-jwt-token',
            user: {
                email: credentials.email,
                name: 'John Doe'
            }
        };
    },

    // Register - expects { email: string, password: string, name: string }
    register: async (userData) => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Expected response: { token: string, user: { email, name } }
        return {
            token: 'mock-jwt-token',
            user: {
                email: userData.email,
                name: userData.name
            }
        };
    }
};

// Storage utilities
export const storage = {
    getAttempts: () => {
        const data = localStorage.getItem('urlShortenerAttempts');
        return data ? JSON.parse(data) : { count: 0, resetTime: Date.now() + 86400000 };
    },

    incrementAttempts: () => {
        const attempts = storage.getAttempts();
        const now = Date.now();

        if (now > attempts.resetTime) {
            // Reset after 24 hours
            const newAttempts = { count: 1, resetTime: now + 86400000 };
            localStorage.setItem('urlShortenerAttempts', JSON.stringify(newAttempts));
            return newAttempts;
        }

        attempts.count += 1;
        localStorage.setItem('urlShortenerAttempts', JSON.stringify(attempts));
        return attempts;
    },

    getUser: () => {
        const data = localStorage.getItem('urlShortenerUser');
        return data ? JSON.parse(data) : null;
    },

    setUser: (user) => {
        localStorage.setItem('urlShortenerUser', JSON.stringify(user));
    },

    clearUser: () => {
        localStorage.removeItem('urlShortenerUser');
    }
};

// Export as default object for compatibility
export default { colors, api, storage };