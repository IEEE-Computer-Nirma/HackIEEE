export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://hack.ieeenirma.org/#website",
        "url": "https://hack.ieeenirma.org",
        "name": "HackIEEE 2026-27",
        "alternateName": ["HackIEEE", "HackIEEE 2026", "hack.ieeenirma.org"],
        "description":
          "Official portal for HackIEEE 2026-27, India's premier national-level 48-hour offline hackathon hosted by IEEE Computer Society at Nirma University in collaboration with Kiro.",
        "inLanguage": "en-US",
        "publisher": {
          "@id": "https://hack.ieeenirma.org/#organization",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://hack.ieeenirma.org/#organization",
        "name": "IEEE Computer Society Student Branch Chapter, Nirma University",
        "alternateName": ["IEEE CS Nirma", "IEEE CS SBNU", "HackIEEE Organizers"],
        "url": "https://hack.ieeenirma.org",
        "logo": "https://hack.ieeenirma.org/organisers/ieee-cs-nirma.svg",
        "sameAs": [
          "https://ieee-computer-nirma.github.io/",
          "https://www.linkedin.com/company/ieee-computer-nirma-university/",
          "https://www.instagram.com/ieee.cs.sbnu/",
          "https://github.com/IEEE-Computer-Nirma",
        ],
        "parentOrganization": {
          "@type": "Organization",
          "name": "IEEE Computer Society",
          "url": "https://www.computer.org",
        },
        "knowsAbout": [
          "Hackathons",
          "Software Engineering",
          "Artificial Intelligence",
          "Cloud Computing",
          "Open Source Development",
          "Web3",
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "deep@computer.org",
          "telephone": "+919265641668",
          "contactType": "hackathon support & partnerships",
          "areaServed": "IN",
          "availableLanguage": ["English", "Hindi", "Gujarati"],
        },
      },
      {
        "@type": ["Event", "Hackathon"],
        "@id": "https://hack.ieeenirma.org/#event",
        "name": "HackIEEE 2026-27 — National-Level Offline Hackathon",
        "alternateName": [
          "HackIEEE National Hackathon",
          "HackIEEE 2026",
          "HackIEEE 2027",
          "IEEE Nirma National Hackathon",
        ],
        "description":
          "HackIEEE 2026-27 is India's premier national 48-hour offline hackathon organised by IEEE Computer Society Nirma University. Bringing together top collegiate developers and innovators across India to build and ship production-grade solutions.",
        "keywords": [
          "National-Level Hackathon",
          "Hackathon India",
          "48-Hour Offline Hackathon",
          "48-Hour Hackathon",
          "IEEE Hackathon",
          "All-India Coding Competition",
          "Nirma University Hackathon",
          "Ahmedabad Hackathon",
          "Student Hackathon 2027",
        ],
        "image": ["https://hack.ieeenirma.org/OG-Tag.png"],
        "startDate": "2027-01-02T09:00:00+05:30",
        "endDate": "2027-01-04T18:00:00+05:30",
        "duration": "P3D",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "typicalAgeRange": "18-25",
        "audience": {
          "@type": "Audience",
          "audienceType": "Developers, Engineering Students, Designers, Tech Innovators",
          "geographicArea": {
            "@type": "Country",
            "name": "India",
          },
        },
        "spatialCoverage": {
          "@type": "Place",
          "name": "India",
          "geo": {
            "@type": "GeoShape",
            "addressCountry": "IN",
          },
        },
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
        "sponsor": [
          {
            "@type": "Organization",
            "name": "Kiro",
            "url": "https://kiro.dev",
          },
        ],
        "offers": {
          "@type": "Offer",
          "url": "https://hack.ieeenirma.org",
          "price": "0",
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
          "validFrom": "2026-11-15T00:00:00+05:30",
          "description": "Free registration for all national applicants. Selected finalists receive mentorship, hacking space, meals, and overnight accommodation support during the 48-hour sprint.",
        },
        "subEvent": [
          {
            "@type": "Event",
            "name": "Phase 0: National Registrations Open",
            "startDate": "2026-11-15T00:00:00+05:30",
            "endDate": "2026-12-19T23:59:59+05:30",
            "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
            "description": "Team registration and proposal submission phase open to students and developers nationwide.",
          },
          {
            "@type": "Event",
            "name": "Phase 1: Problem Statement & Track Declaration",
            "startDate": "2026-12-20T10:00:00+05:30",
            "endDate": "2026-12-20T18:00:00+05:30",
            "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
            "description": "Official challenge tracks and problem statements unveiled. Shortlisted finalist teams announced.",
          },
          {
            "@type": "Event",
            "name": "Phase 2: 48-Hour Offline Grand Finale at Nirma University",
            "startDate": "2027-01-02T09:00:00+05:30",
            "endDate": "2027-01-04T18:00:00+05:30",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "description": "48-hour continuous in-person hacking marathon, project pitching, mentor reviews, and grand award ceremony.",
          },
        ],
        "about": [
          { "@type": "Thing", "name": "Hackathon" },
          { "@type": "Thing", "name": "Software Prototyping" },
          { "@type": "Thing", "name": "Artificial Intelligence & Machine Learning" },
          { "@type": "Thing", "name": "Web3 & Decentralized Technologies" },
          { "@type": "Thing", "name": "Hardware & IoT" },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://hack.ieeenirma.org/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is HackIEEE 2026-27 and what makes it a national-level hackathon?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "HackIEEE 2026-27 is a national-level 48-hour offline hackathon organised by the IEEE Computer Society Student Branch Chapter at Nirma University in collaboration with Kiro. It draws top collegiate developers, designers, and problem solvers from engineering institutes across India to compete, prototype, and build solutions.",
            },
          },
          {
            "@type": "Question",
            "name": "What is the team size and eligibility criteria for this hackathon?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "HackIEEE is open to all university students and developers across India and globally. Teams can consist of 1 to 4 members. Inter-college teams are welcome.",
            },
          },
          {
            "@type": "Question",
            "name": "Where is the HackIEEE grand finale held?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "The 48-hour grand finale is held offline on the campus of Nirma University, located on the Sarkhej - Gandhinagar Highway, Ahmedabad, Gujarat (PIN: 382481), India, on January 2–4, 2027.",
            },
          },
          {
            "@type": "Question",
            "name": "Is registration free, and what is provided to shortlisted finalists?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Yes, registration for HackIEEE 2026-27 is completely free of charge. Shortlisted finalist teams attending the offline finale are provided with venue access, high-speed internet, meals, refreshments, mentorship, and overnight hacking facilities.",
            },
          },
          {
            "@type": "Question",
            "name": "When will the hackathon challenge tracks be declared?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Challenge tracks and problem statements will be officially unveiled on December 20, 2026. Prior to this date, challenge details remain sealed inside the vault.",
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
