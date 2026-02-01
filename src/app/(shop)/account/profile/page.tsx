
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/account/ProfileForm";

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-playfair font-bold mb-2">My Profile</h1>
                <p className="text-gray-500">Manage your personal information.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100">
                <div className="mb-8">
                    <h2 className="font-playfair font-bold text-lg mb-1">Personal Details</h2>
                    <p className="text-sm text-gray-500">Update your name used for orders.</p>
                </div>

                <ProfileForm 
                    initialData={{
                        first_name: profile?.first_name || "",
                        last_name: profile?.last_name || "",
                    }} 
                    userId={user!.id}
                />
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 opacity-75">
                <div className="mb-4">
                     <h2 className="font-playfair font-bold text-lg mb-1">Login Details</h2>
                     <p className="text-sm text-gray-500">Your email address cannot be changed.</p>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                    <div className="p-3 bg-white border border-gray-200 rounded-md text-gray-600 font-medium">
                        {user?.email}
                    </div>
                </div>
            </div>
        </div>
    );
}
