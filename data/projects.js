export const projects = [
  {
    title: "Logspack Marketplace",
    tags: ["React", "Laravel", "API", "UI", "Payment"],

    media: {
      type: "image",
      src: "/media/logspack-dashboard.jpg",
    },

    problem:
      "Buyers and sellers of digital accounts relied on unsafe social media deals. No escrow system, poor trust, and no structured marketplace.",
    solution:
      "Designed and built a full marketplace platform with Laravel backend and React frontend. Implemented ad posting system, real-time chat, escrow-style order flow, and crypto payment gateway integration.",
    result:
      "First MVP supported 300+ listings with secure transactions. Reduced scam reports drastically and provided structured dispute resolution.",
  },

  {
    title: "Smart Energy Meter Firmware",
    tags: ["Arduino", "Embedded", "C", "Firmware"],

    media: {
      type: "video",
      src: "/media/energy-meter-demo.mp4",
      thumbnail: "/media/energy-meter-thumb.jpg",
    },

    problem:
      "Local energy monitoring devices gave inaccurate readings and wasted power due to inefficient sampling algorithms.",
    solution:
      "Developed firmware using interrupt-driven sampling, voltage/current calibration, and EEPROM logging. Added serial debugging interface for diagnostics.",
    result:
      "Improved measurement accuracy to ±2%, reduced power consumption by 28%, and enabled real-time usage tracking.",
  },

  {
    title: "DeVine Meditation App",
    tags: ["React", "UI", "API", "Design"],

    media: {
      type: "image",
      src: "/media/devine-app.jpg",
    },

    problem:
      "Faith-based meditation content was scattered with no community interaction or donation channel.",
    solution:
      "Built a mobile-first web app with Bible reading, community posts, profile system, and donation integration using Paystack.",
    result:
      "Clean user experience increased daily engagement and provided a structured platform for spiritual content.",
  },

  {
    title: "Wippay Crypto Gateway",
    tags: ["Node.js", "API", "Security", "Backend"],

    media: {
      type: "video",
      src: "/media/wippay-integration.mp4",
      thumbnail: "/media/wippay-thumb.jpg",
    },

    problem:
      "Small businesses lacked an easy way to accept cryptocurrency without complex blockchain knowledge.",
    solution:
      "Created a Node.js service that generates dynamic wallet addresses, verifies transactions via webhooks, and exposes a simple REST API for merchants.",
    result:
      "Merchants could integrate crypto payments in under 10 minutes with automatic confirmation and callbacks.",
  },

  {
    title: "Portfolio Design System",
    tags: ["React", "UI", "UX", "Design"],

    media: {
      type: "image",
      src: "/media/design-system.jpg",
    },

    problem:
      "Personal projects used inconsistent components and styling with no reusable design language.",
    solution:
      "Designed a glassmorphism component library with animations, magnetic buttons, and responsive layouts using React and CSS variables.",
    result:
      "Development speed increased with reusable components and a unified visual identity.",
  },

  {
    title: "Coop Ride (Uber Clone)",
    tags: ["React", "Node.js", "API", "Fullstack"],

    media: {
      type: "video",
      src: "/media/coop-ride-demo.mp4",
      thumbnail: "/media/coop-thumb.jpg",
    },

    problem:
      "Local transport services needed affordable ride-hailing without expensive foreign platforms.",
    solution:
      "Built rider, driver, and admin apps with real-time location updates, trip matching algorithm, and wallet payments.",
    result:
      "Prototype supported live ride requests with scalable architecture for future mobile apps.",
  },

  {
    title: "Arduino Access Control",
    tags: ["Arduino", "Embedded", "Hardware"],

    media: {
      type: "image",
      src: "/media/access-control.jpg",
    },

    problem:
      "Campus labs relied on manual key management leading to security issues.",
    solution:
      "Built RFID-based door system with Arduino, relay control, and logging via serial to web dashboard.",
    result: "Automated access control with user logs and time restrictions.",
  },

  {
    title: "REST API Boilerplate",
    tags: ["Node.js", "API", "Backend"],

    media: {
      type: "image",
      src: "/media/api-boilerplate.jpg",
    },

    problem:
      "Every new project required rewriting authentication and validation from scratch.",
    solution:
      "Created a starter template with JWT auth, role permissions, request validation, and testing setup.",
    result: "Reduced new project setup time from days to under 1 hour.",
  },

  {
    title: "Freelance Barber UI",
    tags: ["UI", "UX", "Design"],

    media: {
      type: "image",
      src: "/media/barber-ui.jpg",
    },

    problem:
      "Independent barbers struggled to present services and manage bookings online.",
    solution:
      "Designed onboarding flow, service selection screens, and booking UI with clean micro-interactions.",
    result:
      "Prototype validated with real barbers and prepared for React implementation.",
  },

  {
    title: "Microcontroller Timer Lab",
    tags: ["Embedded", "C", "Arduino"],

    media: {
      type: "video",
      src: "/media/timer-lab.mp4",
      thumbnail: "/media/timer-thumb.jpg",
    },

    problem:
      "Learning platform lacked practical experiments for understanding interrupts and timers.",
    solution:
      "Built a series of experiments controlling LEDs and sensors using hardware timers instead of delay functions.",
    result:
      "Deepened understanding of real-time constraints and efficient firmware design.",
  },
];
