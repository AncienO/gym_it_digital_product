import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Use | gym-it",
    description: "Terms and conditions for using gym-it digital products and services.",
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black text-zinc-300 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Terms of <span className="text-emerald-500">Use</span>
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Please read these terms carefully before using our services. By accessing or using gym-it, you agree to be bound by these terms.
                    </p>
                </div>

                {/* Content Sections */}
                <div className="space-y-8 bg-zinc-900/30 p-8 rounded-2xl border border-zinc-800/50 backdrop-blur-sm">

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
                        <p className="leading-relaxed">
                            By accessing and using this website and purchasing our digital products, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">2. Digital Products & Licensing</h2>
                        <p className="leading-relaxed">
                            All products available for purchase on gym-it are digital content. Upon purchase, you are granted a non-exclusive, non-transferable license to use the products for personal, non-commercial use. You may not redistribute, resell, lease, license, sub-license or offer our resources to any third party.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">3. Payments & Refunds</h2>
                        <p className="leading-relaxed">
                            All payments are processed securely through our payment provider (Paystack). Due to the nature of digital products, all sales are final and non-refundable once the download link has been provided, unless the file is technically defective.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">4. Intellectual Property</h2>
                        <p className="leading-relaxed">
                            The content, organization, graphics, design, compilation, magnetic translation, digital conversion and other matters related to the Site are protected under applicable copyrights, trademarks and other proprietary (including but not limited to intellectual property) rights. The copying, redistribution, use or publication by you of any such matters or any part of the Site is strictly prohibited.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">5. Modifications to Terms</h2>
                        <p className="leading-relaxed">
                            We reserve the right to change these terms at any time. Your continued use of the site after any such changes constitutes your acceptance of the new Terms of Use.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">6. Contact Information</h2>
                        <p className="leading-relaxed">
                            If you have any questions about these Terms, please contact us at:{" "}
                            <a href="mailto:gym.it.digital@gmail.com" className="text-emerald-500 hover:text-emerald-400 transition-colors">
                                gym.it.digital@gmail.com
                            </a>
                        </p>
                    </section>

                </div>

                <div className="text-center text-sm text-zinc-500">
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
            </div>
        </div>
    );
}
