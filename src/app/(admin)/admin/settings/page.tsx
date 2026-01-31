"use client";

import { useSettingsStore } from "@/lib/store/useSettingsStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Save } from "lucide-react";

export default function SettingsPage() {
    const { storeName, storeEmail, currency, notificationsEnabled, updateSettings } = useSettingsStore();
    const [localName, setLocalName] = useState(storeName);
    const [localEmail, setLocalEmail] = useState(storeEmail);
    const [localCurrency, setLocalCurrency] = useState(currency);
    const [localNotifications, setLocalNotifications] = useState(notificationsEnabled);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
        // Sync local state with store on mount (in case rehydrated late, though usually immediate)
        setLocalName(storeName);
        setLocalEmail(storeEmail);
        setLocalCurrency(currency);
        setLocalNotifications(notificationsEnabled);
    }, [storeName, storeEmail, currency, notificationsEnabled]); // Re-sync if store updates from elsewhere

    if (!isMounted) return null;

    const handleSave = () => {
        updateSettings({
            storeName: localName,
            storeEmail: localEmail,
            currency: localCurrency,
            notificationsEnabled: localNotifications
        });
        toast.success("Settings saved successfully");
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your store configuration.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 max-w-2xl">
                <Card className="border-none shadow-sm ring-1 ring-slate-200">
                    <CardHeader>
                        <CardTitle>General Settings</CardTitle>
                        <CardDescription>Basic store information visible to customers.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="storeName">Store Name</Label>
                            <Input
                                id="storeName"
                                value={localName}
                                onChange={(e) => setLocalName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="storeEmail">Contact Email</Label>
                            <Input
                                id="storeEmail"
                                type="email"
                                value={localEmail}
                                onChange={(e) => setLocalEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <Input
                                id="currency"
                                value={localCurrency}
                                onChange={(e) => setLocalCurrency(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm ring-1 ring-slate-200">
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>Manage how you receive alerts.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Email Notifications</Label>
                                <p className="text-sm text-slate-500">Receive emails about new orders.</p>
                            </div>
                            <Switch
                                checked={localNotifications}
                                onCheckedChange={setLocalNotifications}
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button onClick={handleSave} variant="premium-dark" className="px-8 gap-2">
                        <Save size={16} /> Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
}
