export interface DirectoryEntry {
  id: string
  name: string
  category: 'sidaap_office' | 'rehabilitation' | 'mental_health' | 'counseling' | 'emergency' | 'ngo'
  state: string
  lga: string
  city: string
  address: string
  phone: string
  secondaryPhone?: string
  email?: string
  website?: string
  hours: string
  services: string[]
  isVerified: boolean
  is24_7: boolean
  description: string
}

export const DIRECTORY_ENTRIES: DirectoryEntry[] = [
  {
    id: 'sidaap-hq-wuse',
    name: 'SIDAAP National Secretariat (Abuja HQ)',
    category: 'sidaap_office',
    state: 'Abuja (FCT)',
    lga: 'Municipal Area Council (AMAC)',
    city: 'Wuse, Abuja',
    address: 'Suite B22, 3rd Floor Sahzam Plaza, Plot 10 Alexandra Crescent, 26 First Avenue Wuse II',
    phone: '0806 343 0562',
    secondaryPhone: '0802 853 1259',
    email: 'smartinitiativedaap@gmail.com',
    hours: 'Mon - Fri: 8:00 AM - 5:00 PM (Emergency Desk 24/7)',
    services: ['National Coordination', 'Crisis Intervention', 'Counseling Referral', 'Training & Certification', 'NDLEA Liaison'],
    isVerified: true,
    is24_7: true,
    description: 'The national operational headquarters for the Smart Initiative for Drug Abuse Awareness and Prevention, coordinating all 36 state chapters, strategic partnerships, and certified training.'
  },
  {
    id: 'sidaap-kubwa-desk',
    name: 'SIDAAP Operations & Training Liaison Desk',
    category: 'sidaap_office',
    state: 'Abuja (FCT)',
    lga: 'Bwari',
    city: 'Kubwa, Abuja',
    address: 'Plot 9, Nguzu Edda Close, Kubwa',
    phone: '0806 343 0562',
    secondaryPhone: '0703 092 4398',
    email: 'smartinitiativedaap@gmail.com',
    hours: 'Mon - Sat: 9:00 AM - 6:00 PM',
    services: ['Chartered Institute Training', 'Youth Mentorship', 'Community Sensitization', 'Parent Counseling'],
    isVerified: true,
    is24_7: false,
    description: 'Field office and community training hub handling school visits, local sensitization programs, and Chartered Institute of Drug Prevention activities.'
  },
  {
    id: 'ndlea-national-helpline',
    name: 'NDLEA National Drug Demand Reduction Helpline',
    category: 'emergency',
    state: 'Abuja (FCT)',
    lga: 'Municipal Area Council (AMAC)',
    city: 'Garki, Abuja',
    address: 'National Drug Law Enforcement Agency Headquarters, Abuja',
    phone: '0800 102 0304',
    secondaryPhone: '0806 343 0562',
    hours: '24 Hours / 7 Days',
    services: ['Toll-free Drug Crisis Support', 'Addiction Triage', 'Referrals to Accredited Rehabs'],
    isVerified: true,
    is24_7: true,
    description: 'Federal toll-free drug crisis call center providing immediate telephone counseling, crisis de-escalation, and referral to state treatment centers.'
  },
  {
    id: 'sidaap-lagos-state-desk',
    name: 'SIDAAP Lagos State Coordinating Desk',
    category: 'sidaap_office',
    state: 'Lagos',
    lga: 'Ikeja',
    city: 'Ikeja, Lagos',
    address: 'Plot 14, Commercial Avenue, Ikeja Central',
    phone: '0802 853 1259',
    secondaryPhone: '0806 343 0562',
    email: 'lagos@sidaap.org',
    hours: 'Mon - Fri: 8:30 AM - 5:30 PM',
    services: ['Secondary School Programs', 'Local Government Outreach', 'Rehab Referrals', 'Youth Sports Program'],
    isVerified: true,
    is24_7: true,
    description: 'Coordinates Lagos State secondary school outreaches, football academy scouting, and community anti-drug rallies across all 20 LGAs.'
  },
  {
    id: 'fnph-yaba',
    name: 'Federal Neuro-Psychiatric Hospital (Yaba Left)',
    category: 'mental_health',
    state: 'Lagos',
    lga: 'Lagos Mainland',
    city: 'Yaba, Lagos',
    address: '8 Harvey Road, Yaba, Lagos State',
    phone: '01 893 2341',
    secondaryPhone: '0803 300 0000',
    hours: '24 Hours / 7 Days (Emergency & Inpatient)',
    services: ['Inpatient Detoxification', 'Psychiatric Evaluation', 'Addiction Psychiatry', 'Rehabilitation Center'],
    isVerified: true,
    is24_7: true,
    description: 'Nigeria’s premier national psychiatric hospital with an accredited Drug Abuse Treatment and Rehabilitation Unit (DATR) for intensive medical detox and psychological recovery.'
  },
  {
    id: 'cadam-lagos',
    name: 'Christ Against Drug Abuse Ministry (CADAM) Rehab Center',
    category: 'rehabilitation',
    state: 'Lagos',
    lga: 'Epe',
    city: 'Epe, Lagos State',
    address: 'Araga Community, Epe Expressway, Lagos',
    phone: '0803 300 4882',
    hours: 'Daily: 8:00 AM - 6:00 PM',
    services: ['Long-term Residential Rehab', 'Vocational Skill Acquisition', 'Spiritual Guidance', 'Family Therapy'],
    isVerified: true,
    is24_7: true,
    description: 'Long-term 12-month residential recovery facility offering medical care, vocational empowerment, and reintegration for male and female recovering substance users.'
  },
  {
    id: 'fnph-uselu',
    name: 'Federal Neuro-Psychiatric Hospital, Uselu',
    category: 'mental_health',
    state: 'Edo',
    lga: 'Egor',
    city: 'Benin City',
    address: 'Uselu-Lagos Road, Uselu, Benin City, Edo State',
    phone: '052 600 491',
    hours: '24 Hours / 7 Days',
    services: ['Substance Detoxification', 'Clinical Psychology', 'Outpatient Follow-up', 'Emergency Crisis Ward'],
    isVerified: true,
    is24_7: true,
    description: 'Federal tertiary facility providing comprehensive substance abuse diagnosis, pharmacological stabilization, and community mental health interventions in the South-South region.'
  },
  {
    id: 'sidaap-delta-outreach',
    name: 'SIDAAP Delta State Outreach & Sports Chapter',
    category: 'sidaap_office',
    state: 'Delta',
    lga: 'Warri South',
    city: 'Warri / Ughelli',
    address: 'Effurun-Sapele Road, Warri Urban Centre, Delta State',
    phone: '0806 343 0562',
    hours: 'Mon - Fri: 8:00 AM - 5:00 PM',
    services: ['Football Academy Trials', 'School Awareness', 'Anti-Meth (Mkpuru Mmiri) Campaigns', 'Community Counseling'],
    isVerified: true,
    is24_7: false,
    description: 'Grassroots center driving aggressive youth sports engagements and community anti-drug rallies across Delta State.'
  },
  {
    id: 'fnph-kware',
    name: 'Federal Neuro-Psychiatric Hospital, Kware',
    category: 'mental_health',
    state: 'Sokoto',
    lga: 'Kware',
    city: 'Kware, Sokoto',
    address: 'Kware Road, Sokoto State',
    phone: '060 231 000',
    hours: '24 Hours / 7 Days',
    services: ['Substance Abuse Treatment', 'Mental Health Counseling', 'Inpatient Recovery Care'],
    isVerified: true,
    is24_7: true,
    description: 'Key referral psychiatric facility for northwestern Nigeria, handling Tramadol and syrup addiction cases with dedicated clinical staff.'
  },
  {
    id: 'sidaap-kano-desk',
    name: 'SIDAAP Kano State Chapter',
    category: 'sidaap_office',
    state: 'Kano',
    lga: 'Kano Municipal',
    city: 'Kano City',
    address: 'Bompai Road, Kano Municipal, Kano State',
    phone: '0802 853 1259',
    hours: 'Mon - Fri: 8:30 AM - 5:00 PM',
    services: ['Hausa Language Drug Awareness', 'Community Leader Engagements', 'School Clubs', 'Family Support'],
    isVerified: true,
    is24_7: false,
    description: 'Conducts culturally-grounded drug prevention programs and school rallies targeting syrup, prescription opiate, and solvent abuse across Kano State.'
  },
  {
    id: 'fnph-barnawa',
    name: 'Federal Neuro-Psychiatric Hospital, Barnawa',
    category: 'mental_health',
    state: 'Kaduna',
    lga: 'Kaduna South',
    city: 'Kaduna',
    address: 'Barnawa, Kaduna South, Kaduna State',
    phone: '062 230 456',
    hours: '24 Hours / 7 Days',
    services: ['Addiction Detoxification', 'Behavioral Therapy', 'Psychiatric Care', 'Substance Rehabilitation'],
    isVerified: true,
    is24_7: true,
    description: 'Major clinical center for northern Nigeria providing evidence-based detoxification and rehabilitation for patients battling substance dependency.'
  },
  {
    id: 'fnph-enugu',
    name: 'Federal Neuropsychiatric Hospital, New Haven',
    category: 'mental_health',
    state: 'Enugu',
    lga: 'Enugu North',
    city: 'Enugu',
    address: 'Chime Avenue, New Haven, Enugu State',
    phone: '042 258 741',
    hours: '24 Hours / 7 Days',
    services: ['Meth/Mkpuru Mmiri Rehabilitation', 'Psychological Evaluation', 'Outpatient Recovery Programs'],
    isVerified: true,
    is24_7: true,
    description: 'Premier mental health hospital in the South East actively treating crystalline methamphetamine (Mkpuru Mmiri) cases with psychiatric and psychotherapy support.'
  },
  {
    id: 'sidaap-rivers-desk',
    name: 'SIDAAP Rivers State Desk & Community Center',
    category: 'sidaap_office',
    state: 'Rivers',
    lga: 'Port Harcourt',
    city: 'Port Harcourt',
    address: 'Aba Road, Port Harcourt, Rivers State',
    phone: '0806 343 0562',
    hours: 'Mon - Fri: 8:00 AM - 5:00 PM',
    services: ['Campus Anti-Drug Campaigns', 'Secondary School Outreaches', 'Counseling Services', 'Rehab Referrals'],
    isVerified: true,
    is24_7: false,
    description: 'Leading grassroots mobilization in Rivers State against Colorado, synthetic opioids, and campus drug rings.'
  },
  {
    id: 'uch-ibadan-psychiatry',
    name: 'University College Hospital (UCH) Addiction Psychiatry Unit',
    category: 'rehabilitation',
    state: 'Oyo',
    lga: 'Ibadan North',
    city: 'Ibadan',
    address: 'Queen Elizabeth Road, Oritamefa, Ibadan, Oyo State',
    phone: '02 241 0088',
    hours: '24 Hours / 7 Days',
    services: ['Tertiary Medical Detox', 'Cognitive Behavioral Therapy', 'Family Support Counseling', 'Relapse Prevention'],
    isVerified: true,
    is24_7: true,
    description: 'Renowned academic medical institution providing world-class psychiatric, pharmacological, and psychological rehabilitation for substance use disorders.'
  }
]
