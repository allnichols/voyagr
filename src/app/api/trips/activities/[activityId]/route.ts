import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { ApiError, handleApiError } from "@/lib/api-errors";
import { auth } from "@/app/api/auth/[...nextauth]/auth";

export async function GET({ params }: { params: Promise<{ id: string }> }) {
    
    try {
        const session = await auth();
        const resolvedParams = await params;
        
        if(!resolvedParams.id) {
            throw new ApiError("No ID provided", "NO_ID_PROVIDED", 400);
        }

        const activityId = Number(resolvedParams.id);

        const activity = await prisma.tripActivity.findUnique({
            where: { 
                id: activityId,   
                userId: Number(session?.user.id)
            },
            
        });
    } catch (error) {
        
    }
}