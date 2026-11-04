import { NextRequest, NextResponse } from "next/server";
import { INITIAL_UNIVERSITIES, University } from "@/app/data/universities";
import fs from "node:fs";
import path from "node:path";

// In-memory + file-persisted custom universities
const CUSTOM_UNIV_FILE = path.join(process.cwd(), ".data", "custom-universities.json");

function getCustomUniversities(): University[] {
  try {
    if (fs.existsSync(CUSTOM_UNIV_FILE)) {
      const data = fs.readFileSync(CUSTOM_UNIV_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Failed to read custom universities:", err);
  }
  return [];
}

function saveCustomUniversity(univ: University) {
  try {
    const dir = path.dirname(CUSTOM_UNIV_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const current = getCustomUniversities();
    // Check duplicate
    const exists = current.some(
      (u) => u.name.toLowerCase().trim() === univ.name.toLowerCase().trim()
    );
    if (!exists) {
      current.push(univ);
      fs.writeFileSync(CUSTOM_UNIV_FILE, JSON.stringify(current, null, 2), "utf-8");
    }
  } catch (err) {
    console.error("Failed to save custom university:", err);
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase().trim() || "";

  const all = [...INITIAL_UNIVERSITIES, ...getCustomUniversities()];

  if (!q) {
    // Return top 15 default / popular recommendations
    return NextResponse.json({
      success: true,
      universities: all.slice(0, 12),
    });
  }

  // Filter with fuzzy match: check name, city, state, and aliases
  const matched = all.filter((u) => {
    if (u.name.toLowerCase().includes(q)) return true;
    if (u.city && u.city.toLowerCase().includes(q)) return true;
    if (u.state && u.state.toLowerCase().includes(q)) return true;
    if (u.aliases?.some((a) => a.toLowerCase().includes(q))) return true;
    return false;
  });

  // Sort: exact starts-with first
  matched.sort((a, b) => {
    const aStarts = a.name.toLowerCase().startsWith(q) || a.aliases?.some(al => al.toLowerCase().startsWith(q));
    const bStarts = b.name.toLowerCase().startsWith(q) || b.aliases?.some(al => al.toLowerCase().startsWith(q));
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return 0;
  });

  return NextResponse.json({
    success: true,
    universities: matched.slice(0, 15),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = body.name?.trim();

    if (!name || name.length < 2) {
      return NextResponse.json(
        { success: false, error: "University name is required" },
        { status: 400 }
      );
    }

    const all = [...INITIAL_UNIVERSITIES, ...getCustomUniversities()];
    const existing = all.find(
      (u) => u.name.toLowerCase() === name.toLowerCase()
    );

    if (existing) {
      return NextResponse.json({
        success: true,
        university: existing,
        message: "University already exists in recommendations",
      });
    }

    const newUniv: University = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name,
      country: body.country || "India",
      city: body.city || undefined,
      state: body.state || undefined,
      isVerified: false,
    };

    saveCustomUniversity(newUniv);

    return NextResponse.json({
      success: true,
      university: newUniv,
      message: "University added to pending recommendations",
    });
  } catch (err) {
    console.error("Error creating university:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
