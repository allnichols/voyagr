import { NextResponse } from "next/server";

export class ApiError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode: number = 500,
    ) {
        super(message);
    }
}

export function handleApiError(error: unknown): NextResponse {
    if(error instanceof ApiError) {
        return NextResponse.json(
            { error: error.message, code: error.code },
            { status: error.statusCode }
        )
    }

    console.error("Unexpected error:", error)
    return NextResponse.json(
        { error: "Internal server error", code: "INTERNAL_ERROR"},
        { status: 500 }
    )
}