"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Reveal } from "@/components/ui/Reveal";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";

export function ContactForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send message');
            }

            toast.success("Message sent successfully! We'll get back to you soon.");
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 md:p-10 rounded-2xl border border-gray-100 shadow-sm">
            <Reveal>
                <div className="mb-8">
                    <h3 className="font-playfair font-bold text-2xl mb-2">Send us a Message</h3>
                    <p className="text-gray-500 text-sm">Fill out the form below and we will get back to you shortly.</p>
                </div>
            </Reveal>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Reveal delay={0.1}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs uppercase tracking-widest font-bold">Full Name</Label>
                            <Input 
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your name"
                                className="rounded-none border-gray-200 focus:border-black h-12 bg-gray-50/50"
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs uppercase tracking-widest font-bold">Email Address</Label>
                            <Input 
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                className="rounded-none border-gray-200 focus:border-black h-12 bg-gray-50/50"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject" className="text-xs uppercase tracking-widest font-bold">Subject</Label>
                            <Input 
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="How can we help?"
                                className="rounded-none border-gray-200 focus:border-black h-12 bg-gray-50/50"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-xs uppercase tracking-widest font-bold">Message</Label>
                            <Textarea 
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Tell us more..."
                                className="rounded-none border-gray-200 focus:border-black min-h-[150px] bg-gray-50/50 resize-none p-4"
                                required
                            />
                        </div>
                    </div>
                </Reveal>

                <Reveal delay={0.2}>
                    <Button 
                        type="submit" 
                        className="w-full bg-black hover:bg-zinc-800 text-white h-12 text-xs font-bold uppercase tracking-widest gap-2"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                        {isLoading ? "Sending..." : "Send Message"}
                    </Button>
                </Reveal>
            </form>
        </div>
    );
}
