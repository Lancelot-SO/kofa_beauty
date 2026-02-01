
"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignOutButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function SignOutButton({ className, ...props }: SignOutButtonProps) {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    return (
        <button onClick={handleLogout} className={cn("", className)} {...props}>
            <LogOut size={18} />
            Sign Out
        </button>
    );
}
