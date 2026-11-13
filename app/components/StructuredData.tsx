export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://hack.ieeenirma.org/#website",
        "url": "https://hack.ieeenirma.org",
        "name": "HackIEEE 2027",
        "alternateName": ["HackIEEE", "hack.ieeenirma.org"],
        "description":
          "Official portal for HackIEEE 2027, India's premier national-level 48-hour online hackathon hosted by IEEE Computer Society at Nirma University, supported by KIRO.",
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
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Sarkhej - Gandhinagar Highway, Gota",
          "addressLocality": "Ahmedabad",
          "addressRegion": "Gujarat",
          "postalCode": "382481",
          "addressCountry": "IN",
        },
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
        "@type": "Event",
        "@id": "https://hack.ieeenirma.org/#event",
        "name": "HackIEEE 2027 — National-Level 48-Hour Online Hackathon",
        "alternateName": [
          "HackIEEE National Hackathon",
          "HackIEEE 2027",
          "IEEE Nirma National Hackathon",
        ],
        "description":
          "HackIEEE 2027 is India's premier national 48-hour online hackathon organised by IEEE Computer Society Nirma University. Bringing together top collegiate developers and innovators across India to build and ship production-grade solutions.",
        "keywords": [
          "National-Level Hackathon",
          "Hackathon India",
          "48-Hour Online Hackathon",
          "Online Hackathon India",
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
        "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
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
          "@type": "VirtualLocation",
          "url": "https://hack.ieeenirma.org",
        },
        "organizer": {
          "@type": "Organization",
          "name": "IEEE Computer Society Student Branch Chapter, Nirma University",
          "url": "https://hack.ieeenirma.org",
        },
        "performer": {
          "@type": "Organization",
          "name": "IEEE Computer Society Student Branch Chapter, Nirma University",
          "url": "https://hack.ieeenirma.org",
        },
        "sponsor": [
          {
            "@type": "Organization",
            "name": "KIRO",
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
          "description": "Free registration for all national applicants. Participants receive live virtual mentorship, technical workshops, and project evaluation support during the 48-hour online hackathon sprint.",
        },
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
            "name": "What is HackIEEE 2027 and what makes it a national-level hackathon?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "HackIEEE 2027 is a national-level 48-hour online hackathon organised by the IEEE Computer Society Student Branch Chapter at Nirma University, supported by KIRO. It draws top collegiate developers, designers, and problem solvers from engineering institutes across India to compete, prototype, and build solutions.",
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
            "name": "How and where is the HackIEEE 48-hour hackathon held?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "HackIEEE 2026-27 is conducted 100% online as a 48-hour online hackathon on January 2–4, 2027, hosted by the IEEE Computer Society Student Branch Chapter at Nirma University, Ahmedabad, Gujarat, India.",
            },
          },
          {
            "@type": "Question",
            "name": "Is registration free, and what support is provided to participants?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text":
                "Yes, registration for HackIEEE 2027 is completely free of charge. All registered participants receive live virtual mentorship, technical workshops, digital participation certificates, and project evaluation support throughout the 48-hour online hackathon sprint.",
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
