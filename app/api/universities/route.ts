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

// Fallback online search via free Indian university directory
async function fetchOnlineUniversities(query: string): Promise<University[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200); // 1.2-second fast safety timeout
    const res = await fetch(
      `https://universities.hipolabs.com/search?country=India&name=${encodeURIComponent(query)}`,
      {
        signal: controller.signal,
        next: { revalidate: 86400 }, // Cache in Next.js data cache for 24 hours
      }
    );
    clearTimeout(timeout);
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.slice(0, 8).map((item: { name: string; "state-province"?: string }, idx: number) => ({
      id: `online-${idx}-${item.name.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 30)}`,
      name: item.name,
      country: "India",
      state: item["state-province"] || undefined,
      isVerified: true,
    }));
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase().trim() || "";

  const rawAll = [...INITIAL_UNIVERSITIES, ...getCustomUniversities()];
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();
  const all: University[] = [];
  for (const u of rawAll) {
    const idKey = (u.id || "").toLowerCase().trim();
    const nameKey = (u.name || "").toLowerCase().trim();
    if (!seenIds.has(idKey) && !seenNames.has(nameKey)) {
      if (idKey) seenIds.add(idKey);
      if (nameKey) seenNames.add(nameKey);
      all.push(u);
    }
  }

  if (!q) {
    // Return complete catalog upfront so clients can cache and search instantly at 0ms latency
    return NextResponse.json(
      {
        success: true,
        universities: all,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      }
    );
  }

  // 1. Filter local curated list with fuzzy match
  const matched = all.filter((u) => {
    if (u.name.toLowerCase().includes(q)) return true;
    if (u.city && u.city.toLowerCase().includes(q)) return true;
    if (u.state && u.state.toLowerCase().includes(q)) return true;
    if (u.aliases?.some((a) => a.toLowerCase().includes(q))) return true;
    return false;
  });

  // 2. If fewer than 5 local matches and search query is at least 2 chars, fetch from online API fallback
  if (matched.length < 5 && q.length >= 2) {
    const onlineMatches = await fetchOnlineUniversities(q);
    const existingIds = new Set(matched.map((m) => (m.id || "").toLowerCase().trim()));
    const existingNames = new Set(matched.map((m) => m.name.toLowerCase().trim()));

    for (const online of onlineMatches) {
      const idKey = (online.id || "").toLowerCase().trim();
      const nameKey = online.name.toLowerCase().trim();
      if (!existingIds.has(idKey) && !existingNames.has(nameKey)) {
        matched.push(online);
        if (idKey) existingIds.add(idKey);
        existingNames.add(nameKey);
      }
    }
  }

  // Sort: exact starts-with first
  matched.sort((a, b) => {
    const aStarts = a.name.toLowerCase().startsWith(q) || a.aliases?.some((al) => al.toLowerCase().startsWith(q));
    const bStarts = b.name.toLowerCase().startsWith(q) || b.aliases?.some((al) => al.toLowerCase().startsWith(q));
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return 0;
  });

  return NextResponse.json(
    {
      success: true,
      universities: matched.slice(0, 15),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
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
