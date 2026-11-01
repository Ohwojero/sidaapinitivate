export interface CredentialDocument {
  id: string
  title: string
  shortTitle: string
  issuingBody: string
  registrationNumber: string
  taxId?: string
  dateIssued: string
  category: 'incorporation' | 'trademark' | 'compliance' | 'subsidiary'
  status: 'Registered' | 'Accepted' | 'Certified'
  signatory: string
  summary: string
  details: {
    applicantName: string
    address?: string
    trustees?: string[]
    class?: string
    lawAct?: string
    notes: string
  }
}

export const CREDENTIAL_DOCUMENTS: CredentialDocument[] = [
  {
    id: 'cac-sidaap-ngo',
    title: 'Certificate of Incorporation — SIDAAP NGO',
    shortTitle: 'CAC NGO Incorporation',
    issuingBody: 'Corporate Affairs Commission (CAC), Federal Republic of Nigeria',
    registrationNumber: 'RN: 8390984',
    taxId: '33050849-0001',
    dateIssued: '07 April, 2025',
    category: 'incorporation',
    status: 'Registered',
    signatory: 'Hussaini Ishaq Magaji SAN (Registrar-General)',
    summary: 'Official incorporation of Smart Initiative for Drug Abuse Awareness and Prevention as a recognised corporate body and registered non-governmental trust.',
    details: {
      applicantName: 'SMART INITIATIVE FOR DRUG ABUSE AWARENESS AND PREVENTION',
      address: 'Suite B22, 3rd Floor Sahzam Plaza, Plot 10 Alexandra Crescent, 26 First Avenue Wuse, Abuja',
      trustees: [
        'Friday Chalele',
        'Doris Bode',
        'Steve Ahans',
        'Praise Ohwojero Efe',
        'Anthony Odianosen Donald',
        'Prosper Ohwojero'
      ],
      lawAct: 'Companies and Allied Matters Act 2020',
      notes: 'Certifies that the trustees and organization are empowered to operate nationwide across Nigeria in drug abuse prevention, rehabilitation, education, and community advocacy.'
    }
  },
  {
    id: 'tm-sidaap-brand',
    title: 'Trademark Acceptance Letter — SIDAAP Brand & Emblem',
    shortTitle: 'SIDAAP Trademark Acceptance',
    issuingBody: 'Federal Ministry of Industry, Trade and Investment (Commercial Law Department)',
    registrationNumber: 'File No: NG/TM/O/2026/452112',
    dateIssued: '03 August, 2026',
    category: 'trademark',
    status: 'Accepted',
    signatory: 'Banire Kittikaa (Examining Officer)',
    summary: 'Governmental trademark acceptance granting intellectual property rights for the SIDAAP name, visual identity, and institutional programs.',
    details: {
      applicantName: 'SMART INITIATIVE FOR DRUG ABUSE AWARENESS AND PREVENTION',
      address: 'Suite B22, 3rd Floor Sahzam Plaza, Plot 10 Alexandra Crescent, 26 First Avenue Wuse, Abuja',
      class: 'Class 41 (Education; providing of training; entertainment; sporting and cultural activities)',
      notes: 'Payment ID: 161482464668. Protects the institutional brand, educational materials, school awareness kits, and nationwide outreach assets.'
    }
  },
  {
    id: 'tm-chartered-institute',
    title: 'Trademark Acceptance — Chartered Institute of Drug Prevention & Crime Reduction',
    shortTitle: 'Chartered Institute Trademark',
    issuingBody: 'Federal Ministry of Industry, Trade and Investment (Commercial Law Department)',
    registrationNumber: 'File No: NG/TM/O/2026/472454',
    dateIssued: '29 September, 2026',
    category: 'trademark',
    status: 'Accepted',
    signatory: 'Banire Kittikaa (Examining Officer)',
    summary: 'Protection and recognition of the Chartered Institute for professional drug prevention training, counselor certification, and crime reduction research.',
    details: {
      applicantName: 'SMART INITIATIVE FOR DRUG ABUSE AWARENESS AND PREVENTION',
      address: 'Plot 9, Nguzu Edda Close, Kubwa, Abuja, FCT',
      class: 'Class 41 (Education; providing of training; entertainment; sporting and cultural activities)',
      notes: 'Payment ID: 341516528268. Contact lines: 08063430562, 08028531259, 07030924398.'
    }
  },
  {
    id: 'scuml-compliance',
    title: 'SCUML Certificate of Registration — Financial Integrity',
    shortTitle: 'SCUML / EFCC Clearance',
    issuingBody: 'Special Control Unit Against Money Laundering (SCUML) / EFCC',
    registrationNumber: 'RN: SC 151423666',
    dateIssued: '19 August, 2025',
    category: 'compliance',
    status: 'Certified',
    signatory: 'Director, SCUML',
    summary: 'Statutory compliance verification certifying full compliance under Section 17(2)(a) of the Money Laundering (Prevention and Prohibition) Act, 2022.',
    details: {
      applicantName: 'SMART INITIATIVE FOR DRUG ABUSE AWARENESS AND PREVENTION',
      lawAct: 'Section 17(2)(a) Money Laundering (Prevention and Prohibition) Act 2022',
      notes: 'Barcode verification: 996251514190823666. Validates financial integrity for public grants, donations, and international development collaborations.'
    }
  },
  {
    id: 'cac-football-academy',
    title: 'Certificate of Incorporation — SIDAAP Football Academy Ltd',
    shortTitle: 'SIDAAP Football Academy Ltd',
    issuingBody: 'Corporate Affairs Commission (CAC), Federal Republic of Nigeria',
    registrationNumber: 'RC: 9864105',
    taxId: '2623795716189',
    dateIssued: '16 September, 2026',
    category: 'subsidiary',
    status: 'Registered',
    signatory: 'Hussaini Ishaq Magaji SAN (Registrar-General)',
    summary: 'Corporate entity dedicated to talent development, youth sports academies, and keeping vulnerable young Nigerians actively engaged away from drug addiction.',
    details: {
      applicantName: 'SIDAAP FOOTBALL ACADEMY LTD',
      lawAct: 'Companies and Allied Matters Act 2020 (Private Company Limited by Shares)',
      notes: 'Developing Today\'s Talent for Tomorrow\'s Leaders. Official kit featuring #7 Prosper Ohwojero and civic prevention badges.'
    }
  },
  {
    id: 'cac-sports-academy',
    title: 'Certificate of Incorporation — SIDAAP Sports Academy Ltd',
    shortTitle: 'SIDAAP Sports Academy Ltd',
    issuingBody: 'Corporate Affairs Commission (CAC), Federal Republic of Nigeria',
    registrationNumber: 'RC: 9865400',
    taxId: '2623795716189',
    dateIssued: '16 September, 2026',
    category: 'subsidiary',
    status: 'Registered',
    signatory: 'Hussaini Ishaq Magaji SAN (Registrar-General)',
    summary: 'Corporate affiliate providing sports recreation, youth mentorship, athletic camps, and community tournaments as non-pharmacological addiction prevention.',
    details: {
      applicantName: 'SIDAAP SPORTS ACADEMY LTD',
      lawAct: 'Companies and Allied Matters Act 2020 (Private Company Limited by Shares)',
      notes: 'Works directly with secondary schools, local government councils, and grassroots sports coaches across Nigerian communities.'
    }
  }
]
