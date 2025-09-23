import { useEffect, useState } from 'react';

export function useEmbedOrigin(): string | null {
    const [origin, setOrigin] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        setOrigin(window.location.origin);
    }, []);

    return origin;
}
