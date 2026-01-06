export const registerServiceWorker = async () => {
    // Só registra service worker em produção
    if (import.meta.env.DEV) {
        console.log('Service Worker desabilitado em desenvolvimento');
        return;
    }

    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/',
            });

            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            if (confirm('Nova versão disponível! Deseja atualizar?')) {
                                window.location.reload();
                            }
                        }
                    });
                }
            });

            return registration;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }
};
