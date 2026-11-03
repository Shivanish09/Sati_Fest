import { EventItem } from '../types.ts';

export const FESTIVAL_DETAILS = {
  name: 'Sati-Fest',
  fullTitle: 'Sati-Fest 2026',
  institution: 'Samrat Ashok Technological Institute (SATI), Vidisha',
  tagline: 'Annual Technical & Cultural Festival · Est. 1960',
  theme: 'Technological Innovation & Cultural Synergy',
  dates: 'February 12 & 13, 2026',
  campus: '85-Acre Historic Campus, Civil Lines',
  city: 'Vidisha, Madhya Pradesh - 464001',
  venue: 'Samrat Ashok Technological Institute Campus, Vidisha (M.P.)',
  contactEmail: 'fest@example.edu',
  instituteEmail: 'director@satiengg.in',
  helpline: '+91 (07592) 250121 / +91 98765 43210',
  coordinator: 'Student Technical Council & Samrat Utsav Committee',
  establishedYear: '1960',
  alumniNote: 'Proud Alma Mater of Nobel Peace Laureate Kailash Satyarthi',
};

export const SAMPLE_EVENTS: EventItem[] = [
  {
    id: 'code-sprint',
    title: 'Code Sprint (Coding Club SATI)',
    category: 'Technical',
    date: '12 Feb 2026',
    dateShort: '12 Feb',
    time: '12 Feb, 10:00 AM',
    timeSlot: '10:00 AM',
    startIso: '2026-02-12T10:00:00+05:30',
    endIso: '2026-02-12T13:00:00+05:30',
    duration: '3 Hours (10:00 AM - 1:00 PM)',
    venue: 'Central Computer Center (Lab 2)',
    contactEmail: 'fest@example.edu',
    description: 'High-velocity algorithmic problem-solving sprint hosted by Coding Club SATI covering orbital mechanics calculations, memory optimizations, and space telemetry.',
    longDescription: 'Organized by Coding Club SATI at the Central Computer Center (Lab 2), Code Sprint tests raw algorithmic competence, dynamic programming speed, and packet routing optimization under mission-critical time limits. Open to all engineering students across Madhya Pradesh and national institutes.',
    teamSize: '1 - 2 Members',
    capacity: 60,
    registeredCount: 42,
    rules: [
      'Allowed languages: C++, Python, Java, Rust, TypeScript',
      'No AI code assistants or external online query tools permitted',
      'Strict automated test case judge (runtime complexity and memory usage)',
      'Bring your college ID card; SATI Lab 2 systems provided with compilers'
    ],
    coordinators: [
      { name: 'Aarav Patel', role: 'Coding Club SATI President' },
      { name: 'Dr. Sanjay Sharma', role: 'CSE Faculty Convener' }
    ],
    isOverlappingWith: ['cosmic-hackathon']
  },
  {
    id: 'cosmic-hackathon',
    title: 'Engineers 2030: Orbital Hackathon',
    category: 'Technical',
    date: '12 Feb 2026',
    dateShort: '12 Feb',
    time: '12 Feb, 10:00 AM',
    timeSlot: '10:00 AM',
    startIso: '2026-02-12T10:00:00+05:30',
    endIso: '2026-02-12T16:00:00+05:30',
    duration: '6 Hours (10:00 AM - 4:00 PM)',
    venue: 'Kailash Satyarthi Auditorium',
    contactEmail: 'hackathon@example.edu',
    description: 'National 6-hour rapid product prototyping sprint at Kailash Satyarthi Auditorium solving real-world aerospace, telemetry, and IoT challenges.',
    longDescription: 'Named in honour of SATI alumnus and Nobel Laureate Kailash Satyarthi, this flagship hackathon challenges student teams to engineer prototypes spanning earth-observation telemetry, satellite communication protocols, and sustainable hardware interfaces.',
    teamSize: '2 - 4 Members',
    capacity: 80,
    registeredCount: 58,
    rules: [
      'Fresh codebases only; development starts strictly at 10:00 AM',
      'Open-source frameworks and public APIs permitted with proper disclosure',
      'Final round includes a 3-minute working live demo before the expert jury',
      'Evaluation criteria: technical depth, viability, UI clarity, and social impact'
    ],
    coordinators: [
      { name: 'Devendra Meena', role: 'Vishva-Tech Student Lead' },
      { name: 'Prof. K. K. Sharma', role: 'Incubation Head, SATI' }
    ],
    isOverlappingWith: ['code-sprint']
  },
  {
    id: 'starlight-symphony',
    title: 'Samrat Rock: Battle of the Bands',
    category: 'Cultural',
    date: '12 Feb 2026',
    dateShort: '12 Feb',
    time: '12 Feb, 05:00 PM',
    timeSlot: '05:00 PM',
    startIso: '2026-02-12T17:00:00+05:30',
    endIso: '2026-02-12T21:00:00+05:30',
    duration: '4 Hours (05:00 PM - 9:00 PM)',
    venue: 'Open Air Amphitheatre & Grounds',
    contactEmail: 'cultural@example.edu',
    description: 'High-voltage intercollegiate musical clash on the SATI main festival stage featuring cosmic rock, Hindi fusion, and classical melodies.',
    longDescription: 'As dusk settles over the 85-acre SATI Vidisha campus, musical contingents from engineering colleges nationwide battle for the Samrat Trophy with energetic riffs, vocal dynamics, and cosmic tribute compositions.',
    teamSize: '3 - 8 Members',
    capacity: 150,
    registeredCount: 96,
    rules: [
      'Performance duration: 20 minutes live set + 10 minutes sound check',
      'Drum kit, monitors, and stage sound engineering provided by SATI',
      'Bands must feature at least one original composition or themed rendition',
      'Foul language or offensive lyrics lead to immediate disqualification'
    ],
    coordinators: [
      { name: 'Pooja Tiwari', role: 'Samrat Utsav Music Secretary' },
      { name: 'Er. Rakesh Verma', role: 'Cultural Advisor' }
    ],
    isOverlappingWith: []
  },
  {
    id: 'astrophotography-workshop',
    title: 'DeepTech Astrophotography & AI Workshop',
    category: 'Workshop',
    date: '12 Feb 2026',
    dateShort: '12 Feb',
    time: '12 Feb, 02:00 PM',
    timeSlot: '02:00 PM',
    startIso: '2026-02-12T14:00:00+05:30',
    endIso: '2026-02-12T17:00:00+05:30',
    duration: '3 Hours (02:00 PM - 5:00 PM)',
    venue: 'Smart Seminar Hall, ECE Block',
    contactEmail: 'workshop@example.edu',
    description: 'Master sensor calibration, deep-sky telescope imaging, and AI image enhancement with astronomical researchers and SATI faculty.',
    longDescription: 'Hosted in the air-conditioned Smart Seminar Complex, participants explore optical telescope alignment, planetary image stacking using open-source astronomy libraries, and neural network de-noising models.',
    teamSize: 'Individual',
    capacity: 40,
    registeredCount: 38,
    rules: [
      'Digital telescopes and workstations provided during the masterclass',
      'Personal laptops welcome with Python/OpenCV pre-installed',
      'Official SATI Certificate of Mastery awarded upon practical submission'
    ],
    coordinators: [
      { name: 'Dr. Ashish Jain', role: 'Faculty Specialist' },
      { name: 'Simran Khan', role: 'Student Coordinator' }
    ],
    isOverlappingWith: []
  },
  {
    id: 'rover-robotics',
    title: 'Pragyan Lunar Rover Challenge',
    category: 'Technical',
    date: '13 Feb 2026',
    dateShort: '13 Feb',
    time: '13 Feb, 10:00 AM',
    timeSlot: '10:00 AM',
    startIso: '2026-02-13T10:00:00+05:30',
    endIso: '2026-02-13T13:30:00+05:30',
    duration: '3.5 Hours (10:00 AM - 1:30 PM)',
    venue: 'Central Workshop & Fabrication Bay',
    contactEmail: 'robotics@example.edu',
    description: 'Autonomous and wireless telemetry rovers navigate custom gravel terrains, obstacle pits, and mineral sample collection stations.',
    longDescription: 'SATI Vidisha’s historic Central Workshop transforms into a rugged Martian testing ground. Student robotics teams demonstrate chassis suspension, wireless control range, and LiDAR obstacle evasion.',
    teamSize: '2 - 4 Members',
    capacity: 50,
    registeredCount: 34,
    rules: [
      'Chassis footprint must not exceed 45cm x 45cm x 40cm',
      'Maximum battery voltage capped at 24V DC (safety inspect required)',
      'Points awarded for obstacle traversal speed and precision sample grip',
      'Dedicated SATI technical pit crew provided for last-minute soldering'
    ],
    coordinators: [
      { name: 'Rohan Deshmukh', role: 'Robotics Club Lead' },
      { name: 'Prof. V. K. Jain', role: 'Mechanical Dept Convener' }
    ],
    isOverlappingWith: ['celestial-dance']
  },
  {
    id: 'celestial-dance',
    title: 'Samrat Nrityanjali: Cosmic Dance Showcase',
    category: 'Cultural',
    date: '13 Feb 2026',
    dateShort: '13 Feb',
    time: '13 Feb, 10:00 AM',
    timeSlot: '10:00 AM',
    startIso: '2026-02-13T10:00:00+05:30',
    endIso: '2026-02-13T13:30:00+05:30',
    duration: '3.5 Hours (10:00 AM - 1:30 PM)',
    venue: 'Main Campus Auditorium (Stage 1)',
    contactEmail: 'dance@example.edu',
    description: 'Thematic group dance festival blending classical Bharatnatyam/Kathak with space mythology and modern synchronized choreography.',
    longDescription: 'The crown jewel of Samrat Utsav, hosted in SATI’s premier indoor auditorium. Teams showcase breathtaking synchronized storytelling, LED illumination props, and stellar theatrical expressions.',
    teamSize: '6 - 12 Members',
    capacity: 120,
    registeredCount: 78,
    rules: [
      'Performance duration: 8 to 12 minutes per contingent',
      'Submit high-fidelity audio track at the registration desk 1 hour prior',
      'Thematic coherence with the festival motif contributes 35% of marks',
      'No hazardous materials or open flames allowed on stage'
    ],
    coordinators: [
      { name: 'Ananya Saxena', role: 'Samrat Utsav Cultural Lead' },
      { name: 'Prof. Neeta Sharma', role: 'Faculty Coordinator' }
    ],
    isOverlappingWith: ['rover-robotics']
  },
  {
    id: 'nebula-esports',
    title: 'SATI Gaming Arena: Nebula Esports',
    category: 'Gaming',
    date: '13 Feb 2026',
    dateShort: '13 Feb',
    time: '13 Feb, 02:00 PM',
    timeSlot: '02:00 PM',
    startIso: '2026-02-13T14:00:00+05:30',
    endIso: '2026-02-13T18:00:00+05:30',
    duration: '4 Hours (02:00 PM - 6:00 PM)',
    venue: 'IT & Computing Block (Lab 4)',
    contactEmail: 'gaming@example.edu',
    description: 'Double-elimination inter-collegiate LAN championship featuring tactical shooters and Rocket League with live auditorium stream.',
    longDescription: 'Conducted in SATI IT Block Lab 4 on high-speed gigabit LAN infrastructure. Top collegiate gaming squads battle through brackets with professional student shoutcasters and titan-screen spectator feeds.',
    teamSize: '5 Members',
    capacity: 64,
    registeredCount: 60,
    rules: [
      'Official competitive esports tournament regulations apply',
      'Players may bring personal gaming mice, mechanical keyboards, and headsets',
      'Zero-tolerance policy for unsportsmanlike conduct or third-party exploits',
      'Team captains must report for check-in 20 minutes prior to match schedule'
    ],
    coordinators: [
      { name: 'Harshit Gupta', role: 'SATI Esports Convener' },
      { name: 'Nikhil Shrivastava', role: 'Network Administrator' }
    ],
    isOverlappingWith: ['cosmic-trivia']
  },
  {
    id: 'cosmic-trivia',
    title: 'M. Visvesvaraya Memorial Space Quiz',
    category: 'Cultural',
    date: '13 Feb 2026',
    dateShort: '13 Feb',
    time: '13 Feb, 02:00 PM',
    timeSlot: '02:00 PM',
    startIso: '2026-02-13T14:00:00+05:30',
    endIso: '2026-02-13T16:30:00+05:30',
    duration: '2.5 Hours (02:00 PM - 4:30 PM)',
    venue: 'Civil Engineering Seminar Hall',
    contactEmail: 'fest@example.edu',
    description: 'Intellectual buzzer showdown celebrating Indian space research (ISRO), global aerospace chronicles, and science-fiction pop culture.',
    longDescription: 'Named after Sir M. Visvesvaraya, this lively quiz challenges two-person teams across preliminary written screenings and thrilling buzzer rounds covering orbital science, Chandrayaan/Aditya-L1 missions, and astrophysics history.',
    teamSize: '2 Members',
    capacity: 70,
    registeredCount: 46,
    rules: [
      'Written prelims (25 questions) followed by top-6 team buzzer finals',
      'Negative marks for hasty buzzers in the rapid-fire orbital round',
      'No smartphones or smartwatches allowed once the question round begins',
      'Quizmaster decision is final and binding'
    ],
    coordinators: [
      { name: 'Dr. R. C. Sharma', role: 'Quizmaster & Professor' },
      { name: 'Aditya Chouhan', role: 'Literary Society Secretary' }
    ],
    isOverlappingWith: ['nebula-esports']
  }
];

export const FESTIVAL_SCHEDULE_DAYS = [
  {
    dayLabel: 'Day 1',
    dateFormatted: 'Friday, 12 February 2026',
    dateShort: '12 Feb' as const,
    focus: 'Inauguration at Kailash Satyarthi Hall, Code Sprint in Lab 2 & Samrat Rock Night'
  },
  {
    dayLabel: 'Day 2',
    dateFormatted: 'Saturday, 13 February 2026',
    dateShort: '13 Feb' as const,
    focus: 'Pragyan Rover Challenge at Central Workshop, Esports in Lab 4 & Grand Valedictory'
  }
];
