export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://hack.ieeenirma.org/#website",
        "url": "https://hack.ieeenirma.org",
        "name": "HackIEEE 2026-27",
        "description":
          "Official website for HackIEEE 2026-27, the flagship 48-hour national offline hackathon hosted by IEEE Computer Society at Nirma University.",
        "inLanguage": "en-US",
        "publisher": {
          "@id": "https://hack.ieeenirma.org/#organization",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://hack.ieeenirma.org/#organization",
        "name": "IEEE Computer Society Student Branch Chapter, Nirma University",
        "alternateName": ["IEEE CS Nirma", "IEEE CS SBNU"],
        "url": "https://hack.ieeenirma.org",
        "logo": "https://hack.ieeenirma.org/organisers/ieee-cs-nirma.svg",
        "sameAs": [
          "https://www.linkedin.com/company/ieee-computer-nirma-university/",
          "https://www.instagram.com/ieee.cs.sbnu/",
          "https://github.com/IEEE-Computer-Nirma",
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "deep@computer.org",
          "telephone": "+919265641668",
          "contactType": "organizer support",
        },
      },
      {
        "@type": "Event",
        "@id": "https://hack.ieeenirma.org/#event",
        "name": "HackIEEE 2026-27",
        "description":
          "A 48-hour national hackathon and grand offline finale hosted at Nirma University. Teams of up to 4 innovate, build, and ship considered software and hardware products.",
        "image": ["https://hack.ieeenirma.org/OG-Tag.png"],
        "startDate": "2027-01-02T09:00:00+05:30",
        "endDate": "2027-01-04T18:00:00+05:30",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "location": {
          "@type": "Place",
          "name": "Nirma University",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Sarkhej - Gandhinagar Highway, Gota",
            "addressLocality": "Ahmedabad",
            "addressRegion": "Gujarat",
            "postalCode": "382481",
            "addressCountry": "IN",
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 23.1287,
            "longitude": 72.5447,
          },
        },
        "organizer": {
          "@id": "https://hack.ieeenirma.org/#organization",
        },
        "offers": {
          "@type": "Offer",
          "url": "https://hack.ieeenirma.org",
          "price": "0",
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
          "validFrom": "2026-11-15T00:00:00+05:30",
        },
        "performer": {
          "@type": "Organization",
          "name": "IEEE Computer Society Student Branch Chapter, Nirma University",
        },
      },
      {
        "@type": "FAQPage",
        "@id": "https://hack.ieeenirma.org/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is HackIEEE 2026-27?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "HackIEEE 2026-27 is the inaugural flagship national hackathon organised by the IEEE Computer Society Student Branch Chapter at Nirma University in collaboration with Kiro. It invites developers and students globally to build working prototypes within 48 hours.",
            },
          },
          {
            "@type": "Question",
            "name": "What is the team size for HackIEEE?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Teams can comprise 1 to 4 members. You can register individually and form teams before the registration deadline.",
            },
          },
          {
            "@type": "Question",
            "name": "When and where is HackIEEE happening?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Registrations open on November 15, 2026. Problem statements and tracks are declared on December 20, 2026. The 36-hour offline grand finale takes place on January 2–4, 2027 at Nirma University, Ahmedabad, Gujarat, India.",
            },
          },
          {
            "@type": "Question",
            "name": "Is there a registration fee to participate in HackIEEE?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "No, participation in HackIEEE 2026-27 is completely free of charge for all accepted teams.",
            },
          },
          {
            "@type": "Question",
            "name": "When will the challenge tracks and problem statements be announced?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Problem statements and challenge tracks will be unveiled officially on December 20, 2026 during Phase 1.",
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
