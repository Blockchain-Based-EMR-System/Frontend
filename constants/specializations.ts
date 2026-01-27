export const SPECIALIZATIONS = {
    CARDIOLOGY: {
        en: 'Cardiology',
        ar: 'أمراض القلب',
    },
    DERMATOLOGY: {
        en: 'Dermatology',
        ar: 'الأمراض الجلدية',
    },
    ENDOCRINOLOGY: {
        en: 'Endocrinology',
        ar: 'الغدد الصماء',
    },
    GASTROENTEROLOGY: {
        en: 'Gastroenterology',
        ar: 'الجهاز الهضمي',
    },
    GENERAL_PRACTICE: {
        en: 'General Practice',
        ar: 'الطب العام',
    },
    GYNECOLOGY: {
        en: 'Gynecology',
        ar: 'أمراض النساء',
    },
    HEMATOLOGY: {
        en: 'Hematology',
        ar: 'أمراض الدم',
    },
    INTERNAL_MEDICINE: {
        en: 'Internal Medicine',
        ar: 'الباطنية',
    },
    NEPHROLOGY: {
        en: 'Nephrology',
        ar: 'أمراض الكلى',
    },
    NEUROLOGY: {
        en: 'Neurology',
        ar: 'الأمراض العصبية',
    },
    NEUROSURGERY: {
        en: 'Neurosurgery',
        ar: 'جراحة المخ والأعصاب',
    },
    OBSTETRICS: {
        en: 'Obstetrics',
        ar: 'التوليد',
    },
    ONCOLOGY: {
        en: 'Oncology',
        ar: 'الأورام',
    },
    OPHTHALMOLOGY: {
        en: 'Ophthalmology',
        ar: 'طب العيون',
    },
    ORTHOPEDICS: {
        en: 'Orthopedics',
        ar: 'جراحة العظام',
    },
    OTOLARYNGOLOGY: {
        en: 'Otolaryngology (ENT)',
        ar: 'الأنف والأذن والحنجرة',
    },
    PEDIATRICS: {
        en: 'Pediatrics',
        ar: 'طب الأطفال',
    },
    PSYCHIATRY: {
        en: 'Psychiatry',
        ar: 'الطب النفسي',
    },
    PULMONOLOGY: {
        en: 'Pulmonology',
        ar: 'أمراض الصدر',
    },
    RADIOLOGY: {
        en: 'Radiology',
        ar: 'الأشعة',
    },
    RHEUMATOLOGY: {
        en: 'Rheumatology',
        ar: 'أمراض الروماتيزم',
    },
    SURGERY: {
        en: 'General Surgery',
        ar: 'الجراحة العامة',
    },
    UROLOGY: {
        en: 'Urology',
        ar: 'المسالك البولية',
    },
    ANESTHESIOLOGY: {
        en: 'Anesthesiology',
        ar: 'التخدير',
    },
    EMERGENCY_MEDICINE: {
        en: 'Emergency Medicine',
        ar: 'طب الطوارئ',
    },
    FAMILY_MEDICINE: {
        en: 'Family Medicine',
        ar: 'طب الأسرة',
    },
    PATHOLOGY: {
        en: 'Pathology',
        ar: 'علم الأمراض',
    },
    PHYSICAL_THERAPY: {
        en: 'Physical Therapy',
        ar: 'العلاج الطبيعي',
    },
    PLASTIC_SURGERY: {
        en: 'Plastic Surgery',
        ar: 'جراحة التجميل',
    },
    SPORTS_MEDICINE: {
        en: 'Sports Medicine',
        ar: 'طب الرياضة',
    },
} as const;

export type SpecializationKey = keyof typeof SPECIALIZATIONS;

export const VALID_SPECIALIZATION_KEYS = Object.keys(SPECIALIZATIONS) as SpecializationKey[];

export const VALID_SPECIALIZATIONS_EN = Object.values(SPECIALIZATIONS).map(spec => spec.en);

export type SpecializationEnglishValue = (typeof SPECIALIZATIONS)[keyof typeof SPECIALIZATIONS]['en'];

export const VALID_SPECIALIZATIONS_AR = Object.values(SPECIALIZATIONS).map(spec => spec.ar);

export type SpecializationArabicValue = (typeof SPECIALIZATIONS)[keyof typeof SPECIALIZATIONS]['ar'];

export const getSpecialization = (key: SpecializationKey) => {
    return SPECIALIZATIONS[key];
};

export const isValidSpecialization = (value: string): boolean => {
    return VALID_SPECIALIZATION_KEYS.includes(value as SpecializationKey);
};

export const getSpecializationKey = (value: string): SpecializationKey | null => {
    const entry = Object.entries(SPECIALIZATIONS).find(
        ([_, spec]) => spec.en === value || spec.ar === value
    );
    return entry ? (entry[0] as SpecializationKey) : null;
};
