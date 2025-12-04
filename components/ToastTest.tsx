"use client"

import { Button } from "@/components/ui/button"
import toast from 'react-hot-toast'

export function ToastTest() {
    return (
        <div className="fixed bottom-4 left-4 z-50 flex gap-2">
            <Button
                onClick={() => toast.success('Success test!')}
                className="bg-green-600 hover:bg-green-700"
            >
                Test Success
            </Button>
            <Button
                onClick={() => toast.error('Error test!')}
                className="bg-red-600 hover:bg-red-700"
            >
                Test Error
            </Button>
        </div>
    )
}
