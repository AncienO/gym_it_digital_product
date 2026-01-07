import { CalendlyEmbed } from "@/components/CalendlyEmbed";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Consultation | gym-it",
    description: "Book a consultation to discuss your fitness journey.",
};

export default function ConsultationPage() {
    return (
        <div className="min-h-screen py-20 bg-black">
            <div className="container px-4 mx-auto">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-white mb-4">Book a Consultation</h1>
                        <p className="text-zinc-400 max-w-2xl mx-auto">
                            Ready to take your fitness to the next level? Schedule a 1-on-1 consultation
                            to discuss your goals and how we can help you achieve them.
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50">
                        <CalendlyEmbed url="https://calendly.com/gym-it-digital/consultation" />
                    </div>
                </div>
            </div>
        </div>
    )
}
