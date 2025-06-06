"use client";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";

export default function NotFound() {
    return (
        <div className="flex-col flex-center h-screen w-screen">
            <Image
                src='/images/logo.svg'
                alt={`${APP_NAME} logo`}
                width={48}
                height={48}
                priority
            />
            <div className='p-6 w-1/3 rounded-lg shadow-md text-center'>
                <h1 className='text-3xl font-bold mb-4'>Not Found</h1>
                <p className='text-destructive'>Could not find requested page</p>
                <Button
                    variant='outline' className='mt-4 ml-2'
                    onClick={() => (window.location.href = '/')}
                >
                    Back To Home
                </Button>
            </div>
        </div>
    );
}
