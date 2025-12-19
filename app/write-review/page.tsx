import { submitReview } from "./action"
import { TestimonialForm } from "../admin/(dashboard)/testimonials/_components/TestimonialForm"

export default function WriteReviewPage() {
    return (
        <div className="container mx-auto px-4 py-20 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-2xl space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                        Share your story and <span className="text-emerald-500">leave a review</span>
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Inspire others with your fitness journey.
                    </p>
                </div>

                <TestimonialForm
                    action={submitReview}
                    submitLabel="Submit Review"
                    resourceName="Review"
                    placeholders={{
                        username: "",
                        text: ""
                    }}
                />
            </div>
        </div>
    )
}
