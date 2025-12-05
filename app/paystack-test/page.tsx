"use client"

import { useEffect, useState } from "react"

export default function PaystackTest() {
    const [status, setStatus] = useState<{
        scriptLoaded: boolean
        publicKeyAvailable: boolean
        publicKey: string | undefined
    }>({
        scriptLoaded: false,
        publicKeyAvailable: false,
        publicKey: undefined
    })

    useEffect(() => {
        // Check if PaystackPop is loaded
        const scriptLoaded = typeof (window as any).PaystackPop !== 'undefined'
        const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
        const publicKeyAvailable = !!publicKey

        setStatus({
            scriptLoaded,
            publicKeyAvailable,
            publicKey: publicKey ? `${publicKey.substring(0, 10)}...` : undefined
        })
    }, [])

    return (
        <div className="min-h-screen bg-black p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Paystack Integration Status</h1>

                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-zinc-300">Paystack Script Loaded:</span>
                        <span className={`font-semibold ${status.scriptLoaded ? 'text-green-400' : 'text-red-400'}`}>
                            {status.scriptLoaded ? '✓ Yes' : '✗ No'}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-zinc-300">Public Key Available:</span>
                        <span className={`font-semibold ${status.publicKeyAvailable ? 'text-green-400' : 'text-red-400'}`}>
                            {status.publicKeyAvailable ? '✓ Yes' : '✗ No'}
                        </span>
                    </div>

                    {status.publicKey && (
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-300">Public Key:</span>
                            <span className="font-mono text-sm text-emerald-400">{status.publicKey}</span>
                        </div>
                    )}
                </div>

                {status.scriptLoaded && status.publicKeyAvailable ? (
                    <div className="mt-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
                        <p className="text-green-400">✓ Paystack is correctly configured and ready to use!</p>
                    </div>
                ) : (
                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg space-y-2">
                        <p className="text-red-400 font-semibold">⚠ Issues detected:</p>
                        <ul className="text-red-300 text-sm space-y-1 ml-4">
                            {!status.scriptLoaded && (
                                <li>• Paystack inline script not loaded from CDN</li>
                            )}
                            {!status.publicKeyAvailable && (
                                <li>• NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY environment variable not set</li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}
