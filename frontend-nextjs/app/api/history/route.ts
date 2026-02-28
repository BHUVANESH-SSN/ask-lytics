import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET: Fetch the current user's query history
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await db.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const url = new URL(req.url);
        const limitStr = url.searchParams.get("limit");
        const pageStr = url.searchParams.get("page");

        const limit = limitStr ? parseInt(limitStr) : 50; // Default limit
        const page = pageStr ? parseInt(pageStr) : 1;
        const skip = (page - 1) * limit;

        const [history, total] = await Promise.all([
            db.queryHistory.findMany({
                where: { userId: user.id },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: skip
            }),
            db.queryHistory.count({
                where: { userId: user.id }
            })
        ]);

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            history,
            pagination: { total, page, limit, totalPages }
        });
    } catch (error) {
        console.error("Error fetching query history:", error);
        return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
    }
}

// POST: Save a new query to history
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await db.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const body = await req.json();
        const { promptText, generatedSQL } = body;

        if (!promptText || !generatedSQL) {
            return NextResponse.json({ error: "promptText and generatedSQL are required" }, { status: 400 });
        }

        const newHistory = await db.queryHistory.create({
            data: {
                userId: user.id,
                promptText,
                generatedSQL
            }
        });

        return NextResponse.json({ success: true, history: newHistory });
    } catch (error) {
        console.error("Error saving query history:", error);
        return NextResponse.json({ error: "Failed to save history" }, { status: 500 });
    }
}
