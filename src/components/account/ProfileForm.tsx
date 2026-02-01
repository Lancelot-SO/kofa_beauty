
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const profileSchema = z.object({
    first_name: z.string().min(2, "First name must be at least 2 characters"),
    last_name: z.string().min(2, "Last name must be at least 2 characters"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
    initialData: {
        first_name: string;
        last_name: string;
    };
    userId: string;
}

export function ProfileForm({ initialData, userId }: ProfileFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: initialData,
    });

    const onSubmit = async (data: ProfileFormValues) => {
        setIsLoading(true);

        try {
            const { error } = await supabase
                .from("profiles")
                .update({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    full_name: `${data.first_name} ${data.last_name}`,
                })
                .eq("id", userId);

            if (error) throw error;

            toast.success("Profile updated successfully");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                        id="first_name"
                        {...register("first_name")}
                        placeholder="Enter your first name"
                    />
                    {errors.first_name && (
                        <p className="text-sm text-red-500">{errors.first_name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                        id="last_name"
                        {...register("last_name")}
                        placeholder="Enter your last name"
                    />
                    {errors.last_name && (
                        <p className="text-sm text-red-500">{errors.last_name.message}</p>
                    )}
                </div>
            </div>

            <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-black hover:bg-zinc-800 text-white"
            >
                {isLoading ? "Saving..." : "Save Changes"}
            </Button>
        </form>
    );
}
