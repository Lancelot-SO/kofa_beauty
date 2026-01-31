import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
    storeName: string;
    storeEmail: string;
    currency: string;
    notificationsEnabled: boolean;
    darkMode: boolean;
    updateSettings: (settings: Partial<SettingsState>) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            storeName: "Kofa Beauty",
            storeEmail: "admin@kofabeauty.com",
            currency: "GHS",
            notificationsEnabled: true,
            darkMode: false,
            updateSettings: (settings) => set((state) => ({ ...state, ...settings })),
        }),
        {
            name: 'settings-storage',
        }
    )
);
