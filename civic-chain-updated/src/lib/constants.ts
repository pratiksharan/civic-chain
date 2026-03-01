// src/lib/constants.ts
import type { DeptInfo, EscalationLevel, PastComplaint } from '@/types';

export const DEPT_MAP: Record<string, DeptInfo> = {
  garbage: {
    dept: 'Solid Waste Management', sla: 48, level: 'Local', icon: 'SWM',
    portal: 'https://bbmpsahaaya.karnataka.gov.in', deepLink: 'https://bbmpsahaaya.karnataka.gov.in', hasDeepLink: true,
    email: 'swm@bbmp.gov.in', phone: '080-22660000', category: 'Garbage Collection',
    difficulty: { label: 'Medium', steps: 6, mins: '4–7' },
    intelligence: {
      avgResponse: '3.2 days', rtiAvgResponse: '28 days', rtiFee: '₹10', appealDeadline: '30 days from RTI response',
      rejectionReasons: ['Incomplete address', 'No ward number', 'Missing duration'],
      rtiRejectionReasons: ['Vague information sought', 'No applicant address', 'Missing fee'],
      requiredDocs: ['Location photo (optional)', 'Ward number', 'Duration of issue'],
    },
    guide: [
      { step: 'Open BBMP Sahaaya portal', tip: 'Go to bbmpsahaaya.karnataka.gov.in — the official BBMP citizen grievance portal.' },
      { step: "Click 'Lodge Complaint' or 'New Complaint'", tip: 'Look for the complaint registration button on the homepage.' },
      { step: 'Select Category: Solid Waste Management', tip: "Choose 'Garbage' or 'Solid Waste' from the category dropdown." },
      { step: 'Paste complaint into the Description field', tip: 'Include ward number, exact location, and duration of the issue.' },
      { step: 'Enter your Ward number and location', tip: 'This is critical. Without it, the complaint may be rejected.' },
      { step: 'Upload evidence photo (optional)', tip: 'A photo significantly improves resolution speed.' },
      { step: 'Submit and note your Complaint ID', tip: 'Save this. You will need it for escalation and RTI.' },
    ],
  },
  pothole: {
    dept: 'Roads & Infrastructure', sla: 72, level: 'Local', icon: 'RDS',
    portal: 'https://bbmpsahaaya.karnataka.gov.in', deepLink: 'https://bbmpsahaaya.karnataka.gov.in', hasDeepLink: true,
    email: 'roads@bbmp.gov.in', phone: '080-22221188', category: 'Pothole / Road Damage',
    difficulty: { label: 'Medium', steps: 6, mins: '5–8' },
    intelligence: {
      avgResponse: '5.8 days', rtiAvgResponse: '25 days', rtiFee: '₹10', appealDeadline: '30 days from RTI response',
      rejectionReasons: ['No GPS coordinates', 'Vague location', 'No road name'],
      rtiRejectionReasons: ['Wrong public authority', 'Fee not paid', 'Subject not clear'],
      requiredDocs: ['Road name', 'Nearest landmark', 'Photo of pothole'],
    },
    guide: [
      { step: 'Open BBMP Sahaaya portal', tip: 'Go to bbmpsahaaya.karnataka.gov.in — the official BBMP grievance portal.' },
      { step: "Click 'Lodge Complaint' or 'New Complaint'", tip: 'Register or log in with your mobile number first.' },
      { step: 'Select Category: Roads & Infrastructure', tip: "Choose 'Roads' or 'Pothole' from the category list." },
      { step: 'Paste your complaint with road details', tip: 'Include road name, nearest landmark, and duration of the issue.' },
      { step: 'Upload a photo', tip: 'Road damage photos significantly speed up resolution.' },
      { step: 'Submit and save Complaint ID', tip: 'Screenshot the confirmation page as backup.' },
    ],
  },
  water: {
    dept: 'Water Supply (BWSSB)', sla: 24, level: 'Local', icon: 'H2O',
    portal: 'https://bwssb.gov.in', deepLink: 'https://bwssb.gov.in/bwssb_content/complaint_registration.php', hasDeepLink: true,
    email: 'helpdesk@bwssb.gov.in', phone: '1916', category: 'Water Supply Disruption',
    difficulty: { label: 'Easy', steps: 5, mins: '3–5' },
    intelligence: {
      avgResponse: '1.9 days', rtiAvgResponse: '22 days', rtiFee: '₹10', appealDeadline: '30 days from RTI response',
      rejectionReasons: ['No RR number', 'Incorrect zone'],
      rtiRejectionReasons: ['No RR number provided', 'Wrong department'],
      requiredDocs: ['BWSSB RR number (on bill)', 'Ward / Zone number'],
    },
    guide: [
      { step: 'Open the BWSSB complaint registration page', tip: 'Go to bwssb.gov.in → Customer Services → Register Complaint, or use the direct link above.' },
      { step: 'Select your Zone from dropdown', tip: 'Find your zone on your BWSSB bill or consumer card.' },
      { step: 'Enter RR Number', tip: 'Your BWSSB consumer number, printed on the water bill top-right corner.' },
      { step: 'Choose Category: Water Supply', tip: 'Then select sub-type: No Water / Low Pressure / Contamination.' },
      { step: 'Paste complaint and submit', tip: 'Note the Complaint ID shown after submission.' },
    ],
  },
  electricity: {
    dept: 'Power & Electricity (BESCOM)', sla: 12, level: 'Local', icon: 'PWR',
    portal: 'https://bescom.karnataka.gov.in', deepLink: 'https://bescom.karnataka.gov.in/new-page/CONSUMER%20COMPLAINTS/en', hasDeepLink: true,
    email: 'cmd@bescom.org', phone: '1912', category: 'Power Outage / Electrical Issue',
    difficulty: { label: 'Easy', steps: 4, mins: '2–4' },
    intelligence: {
      avgResponse: '1.1 days', rtiAvgResponse: '20 days', rtiFee: '₹10', appealDeadline: '30 days from RTI response',
      rejectionReasons: ['No HT/LT number', 'No meter number'],
      rtiRejectionReasons: ['Meter number missing', 'Wrong BESCOM division'],
      requiredDocs: ['BESCOM meter number (on bill)', 'Transformer ID if known'],
    },
    guide: [
      { step: 'Call 1912 for fastest response', tip: "BESCOM's 24-hour helpline is the quickest channel for outages. Give your meter number and address." },
      { step: 'Or open the BESCOM Karnataka portal', tip: 'Go to bescom.karnataka.gov.in → Consumer Services → Consumer Complaints.' },
      { step: 'Enter your Meter Number', tip: 'Printed on your BESCOM electricity bill, top section.' },
      { step: 'Select issue type and submit', tip: 'Save your complaint number for follow-up and RTI if needed.' },
    ],
  },
  streetlight: {
    dept: 'Electrical Division', sla: 48, level: 'Local', icon: 'ELC',
    portal: 'https://bbmpsahaaya.karnataka.gov.in', deepLink: 'https://bbmpsahaaya.karnataka.gov.in', hasDeepLink: true,
    email: 'elec@bbmp.gov.in', phone: '080-22222222', category: 'Street Light Non-Functional',
    difficulty: { label: 'Easy', steps: 5, mins: '3–5' },
    intelligence: {
      avgResponse: '2.8 days', rtiAvgResponse: '26 days', rtiFee: '₹10', appealDeadline: '30 days from RTI response',
      rejectionReasons: ['No pole number', 'Vague location'],
      rtiRejectionReasons: ['Pole number not specified', 'Location ambiguous'],
      requiredDocs: ['Pole number (on the pole)', 'Street name', 'Ward number'],
    },
    guide: [
      { step: 'Open BBMP Sahaaya portal', tip: 'Go to bbmpsahaaya.karnataka.gov.in — the official BBMP grievance portal.' },
      { step: 'Register or log in with your mobile number', tip: 'OTP-based login. Keep your phone handy.' },
      { step: 'Select Category: Street Light / Electrical', tip: "Choose 'Electrical' or 'Street Lighting' from the department list." },
      { step: 'Note the pole number and paste complaint', tip: 'The pole number is a small sticker on the light pole. Include street name and ward number.' },
      { step: 'Submit and note Complaint ID', tip: 'Portal sends an SMS confirmation in most cases.' },
    ],
  },
  sewage: {
    dept: 'Sewerage & Drainage', sla: 36, level: 'Local', icon: 'DRN',
    portal: 'https://bwssb.gov.in', deepLink: 'https://bwssb.gov.in/bwssb_content/complaint_registration.php', hasDeepLink: true,
    email: 'sewerage@bwssb.gov.in', phone: '1916', category: 'Sewage / Drainage Overflow',
    difficulty: { label: 'Medium', steps: 5, mins: '4–6' },
    intelligence: {
      avgResponse: '3.5 days', rtiAvgResponse: '28 days', rtiFee: '₹10', appealDeadline: '30 days from RTI response',
      rejectionReasons: ['No zone / ward info', 'Manhole ID missing'],
      rtiRejectionReasons: ['Zone not specified', 'Ward number missing'],
      requiredDocs: ['Location details', 'Photo of blockage', 'Ward number'],
    },
    guide: [
      { step: 'Open BWSSB complaint registration page', tip: 'Go to bwssb.gov.in → Customer Services → Register Complaint.' },
      { step: 'Select Zone', tip: 'From your BWSSB consumer bill or check on bwssb.gov.in.' },
      { step: 'Choose Category: Sewerage / Drainage', tip: 'Sub-type: Overflow, Blockage, or Open Manhole.' },
      { step: 'Describe location precisely', tip: 'Include street name, landmark, and ward number.' },
      { step: 'Upload photo if possible', tip: 'Health-risk issues with photos are escalated faster.' },
    ],
  },
  noise: {
    dept: 'Environmental Compliance', sla: 24, level: 'State', icon: 'ENV',
    portal: 'https://kspcb.karnataka.gov.in', deepLink: 'https://kspcb.karnataka.gov.in/page/Online%20Complaint/en', hasDeepLink: true,
    email: 'pco@kspcb.gov.in', phone: '080-25589112', category: 'Noise Pollution',
    difficulty: { label: 'Hard', steps: 7, mins: '8–12' },
    intelligence: {
      avgResponse: '6.4 days', rtiAvgResponse: '30 days', rtiFee: '₹10', appealDeadline: '30 days from RTI response',
      rejectionReasons: ['Outside jurisdiction', 'No decibel reading', 'No time/date of incident'],
      rtiRejectionReasons: ['State jurisdiction issues', 'Incomplete incident details'],
      requiredDocs: ['Date and time of noise', 'Source of noise', 'Location', 'Audio recording (if possible)'],
    },
    guide: [
      { step: 'Open KSPCB Karnataka portal', tip: 'Go to kspcb.karnataka.gov.in — State Pollution Control Board handles noise complaints.' },
      { step: 'Register or log in', tip: 'KSPCB requires account registration first with email and mobile.' },
      { step: 'Select Category: Noise Pollution', tip: "Under 'Online Complaint' → 'Environmental Complaints'." },
      { step: 'Document time, date, and source', tip: 'Include a recording or photo evidence if available.' },
      { step: 'Enter exact location', tip: 'Include nearby landmark and GPS coordinates if possible.' },
      { step: 'Attach evidence', tip: 'Audio/video evidence significantly strengthens the complaint.' },
      { step: 'Submit and save Complaint ID', tip: 'KSPCB responses can take 5–7 days.' },
    ],
  },
  encroachment: {
    dept: 'Urban Planning (BDA)', sla: 168, level: 'Local', icon: 'UPL',
    portal: 'https://bbmpsahaaya.karnataka.gov.in', deepLink: 'https://bbmpsahaaya.karnataka.gov.in', hasDeepLink: true,
    email: 'tp@bbmp.gov.in', phone: '080-22975019', category: 'Encroachment / Illegal Construction',
    difficulty: { label: 'Hard', steps: 7, mins: '10–15' },
    intelligence: {
      avgResponse: '9.2 days', rtiAvgResponse: '30 days', rtiFee: '₹10', appealDeadline: '30 days from RTI response',
      rejectionReasons: ['No survey number', 'Jurisdiction mismatch', 'Insufficient evidence'],
      rtiRejectionReasons: ['Survey number missing', 'Jurisdiction unclear'],
      requiredDocs: ['Survey number (if known)', 'Photo of encroachment', 'Location details', 'Duration'],
    },
    guide: [
      { step: 'Open BBMP Sahaaya portal', tip: 'Go to bbmpsahaaya.karnataka.gov.in — Town Planning division handles encroachment.' },
      { step: 'Register or log in with your mobile number', tip: 'OTP-based login required.' },
      { step: 'Select Category: Town Planning / Encroachment', tip: 'BBMP → Town Planning → Enforcement / Encroachment.' },
      { step: 'Note the survey / khata number if available', tip: 'Available from municipal records. Not always mandatory.' },
      { step: 'Paste your complaint with location details', tip: 'Include dimensions of encroachment if possible.' },
      { step: 'Attach photos', tip: 'Multiple angle photos from different dates strengthens the case.' },
      { step: 'Submit and note Complaint ID', tip: 'These complaints often require physical inspection and may take longer.' },
    ],
  },
  health: {
    dept: 'Public Health', sla: 48, level: 'Local', icon: 'PHC',
    portal: 'https://bbmpsahaaya.karnataka.gov.in', deepLink: 'https://bbmpsahaaya.karnataka.gov.in/complaints/new', hasDeepLink: true,
    email: 'health@bbmp.gov.in', phone: '104', category: 'Public Health Hazard',
    difficulty: { label: 'Easy', steps: 5, mins: '3–5' },
    intelligence: {
      avgResponse: '2.4 days', rtiAvgResponse: '24 days', rtiFee: '₹10', appealDeadline: '30 days from RTI response',
      rejectionReasons: ['Vague description', 'No location'],
      rtiRejectionReasons: ['Hazard not specified', 'No date of occurrence'],
      requiredDocs: ['Location', 'Nature of hazard', 'Photo'],
    },
    guide: [
      { step: 'Call 104 for urgent health hazards', tip: 'Immediate response available for serious public health risks. Fastest option.' },
      { step: 'Or open BBMP Sahaaya portal for formal complaint', tip: 'Go to bbmpsahaaya.karnataka.gov.in for non-urgent formal complaints.' },
      { step: 'Select Category: Health / Public Health', tip: 'BBMP → Health & Family Welfare department.' },
      { step: 'Describe the hazard specifically', tip: 'Include type of hazard, location, and number of affected people.' },
      { step: 'Submit and note Complaint ID', tip: 'Health complaints receive faster processing than most categories.' },
    ],
  },
  general: {
    dept: 'General Administration', sla: 72, level: 'Local', icon: 'GEN',
    portal: 'https://pgportal.gov.in', deepLink: 'https://pgportal.gov.in/Registration', hasDeepLink: true,
    email: 'pgportal@gov.in', phone: '1800-111-555', category: 'General Civic Issue',
    difficulty: { label: 'Medium', steps: 6, mins: '5–8' },
    intelligence: {
      avgResponse: '5.1 days', rtiAvgResponse: '30 days', rtiFee: '₹10', appealDeadline: '30 days from RTI response',
      rejectionReasons: ['Wrong department selected', 'Incomplete details'],
      rtiRejectionReasons: ['Wrong ministry selected', 'Incomplete details'],
      requiredDocs: ['Issue description', 'Location', 'Duration'],
    },
    guide: [
      { step: 'Open the CPGRAMS / PG Portal', tip: 'Central government grievance portal — works for most issues.' },
      { step: 'Register or log in with mobile number', tip: 'OTP-based authentication.' },
      { step: 'Select Ministry / Department', tip: 'Choose the closest department for your issue type.' },
      { step: 'Enter issue description', tip: 'Be specific: location, duration, and impact.' },
      { step: 'Attach supporting documents', tip: 'Optional but helpful.' },
      { step: 'Submit and note Grievance ID', tip: 'You can track status at pgportal.gov.in.' },
    ],
  },
};

export const ESC_CHAIN: EscalationLevel[] = [
  {
    level: 1, title: 'Ward Officer', timeframe: '3–5 working days', trigger: 'Initial complaint', note: 'First point of contact for all civic issues',
    contact: { phone: '080-22221111', email: 'wardofficer@bbmp.gov.in', portal: 'https://bbmpsahaaya.karnataka.gov.in', address: 'BBMP Ward Office — check your ward number at bbmp.gov.in', howTo: 'Visit your ward office directly or submit via the BBMP Sahaaya portal at bbmpsahaaya.karnataka.gov.in.' },
  },
  {
    level: 2, title: 'Zonal Officer', timeframe: '7 working days', trigger: 'No response after SLA breach', note: 'Oversees multiple ward officers',
    contact: { phone: '080-22975000', email: 'zonalofficer@bbmp.gov.in', portal: 'https://bbmpsahaaya.karnataka.gov.in', address: 'BBMP Zonal Office — 5 zones: East, West, South, Mahadevapura, Dasarahalli.', howTo: 'Send a formal letter or email to the Zonal Commissioner with your complaint reference number.' },
  },
  {
    level: 3, title: 'Municipal Commissioner', timeframe: '14 working days', trigger: 'Repeat non-resolution', note: 'Head of the municipal body',
    contact: { phone: '080-22660000', email: 'commissioner@bbmp.gov.in', portal: 'https://bbmp.gov.in', address: 'BBMP Head Office, N.R. Square, Bengaluru – 560 002', howTo: 'Write directly to the BBMP Commissioner via registered post or email. Include all prior escalation references.' },
  },
  {
    level: 4, title: 'State Department Secretary', timeframe: '21 working days', trigger: 'Commissioner non-response', note: 'State-level escalation',
    contact: { phone: '080-22253333', email: 'urd@karnataka.gov.in', portal: 'https://sevasindhu.karnataka.gov.in', address: 'Urban Development Dept, Vidhana Soudha, Bengaluru – 560 001', howTo: 'File a grievance through Seva Sindhu (sevasindhu.karnataka.gov.in).' },
  },
  {
    level: 5, title: 'RTI / Lokayukta', timeframe: '30 days (statutory)', trigger: 'All channels exhausted', note: 'Legal mechanism',
    contact: { phone: '080-22100060', email: 'lkta-karna@nic.in', portal: 'https://lokayukta.karnataka.gov.in', address: 'Karnataka Lokayukta, M.S. Building, Dr. Ambedkar Veedhi, Bengaluru – 560 001', howTo: 'File a written complaint with the Karnataka Lokayukta. Bring all complaint IDs and evidence.' },
  },
];

export const DUMMY_COMPLAINTS: PastComplaint[] = [
  { id: 'BBMP-2026-081442', title: 'Garbage pile on Church Street', desc: 'Uncollected garbage near primary school for 6 days.', type: 'garbage', date: '2026-02-01', status: 'In Progress', daysElapsed: 28, sla: 2 },
  { id: 'BWSSB-2026-044321', title: 'Water supply disruption in HSR Layout', desc: 'No water supply in Ward 7 for 3 consecutive days.', type: 'water', date: '2026-01-14', status: 'Resolved', daysElapsed: 4, sla: 1 },
  { id: 'BBMP-2026-033198', title: 'Pothole on Indiranagar 100ft Road', desc: 'Large pothole causing vehicle damage and accidents.', type: 'pothole', date: '2026-01-05', status: 'Overdue', daysElapsed: 54, sla: 3 },
  { id: 'BESCOM-2026-011847', title: 'Power outage in Koramangala Block 5', desc: 'No electricity supply since yesterday evening.', type: 'electricity', date: '2025-12-28', status: 'Resolved', daysElapsed: 1, sla: 0.5 },
];

export const NAV_ITEMS = [
  { id: 'dashboard',  icon: '⊞', label: 'Dashboard' },
  { id: 'submit',     icon: '✎', label: 'Submit Issue' },
  { id: 'routing',    icon: '→', label: 'Routing Result',  locked: true },
  { id: 'escalation', icon: '△', label: 'Enforcement',     locked: true },
  { id: 'rti',        icon: '§', label: 'RTI Assistant',   locked: true },
  { id: 'settings',   icon: '⚙', label: 'Settings' },
] as const;
