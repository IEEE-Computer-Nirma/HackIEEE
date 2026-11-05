import { NextResponse } from "next/server";
import { renderRegistrationEmail } from "@/services/templates/registration-confirmation";

export async function GET() {
  const { html } = renderRegistrationEmail({
    name: "Priyansh Patel",
    email: "priyanshpatel9506@gmail.com",
    registrationId: "HI27-PP-3K34",
    college: "Nirma University, Ahmedabad",
    degree: "B.Tech",
    branch: "Computer Science and Engineering",
    yearOfStudy: "Third Year",
    isIeeeMember: true,
    ieeeMembershipNumber: "99887766",
    track: "AI & Machine Learning",
  });

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
