import { axiosApi } from "./axios";

// Homepage Types
export interface HomepageImage {
    url: string;
    alt?: string;
}

export interface Slide {
    image: HomepageImage;
    order: number;
}

export interface TrustIcon {
    image: HomepageImage;
    number: string;
    name: string;
    order: number;
}

export interface ServiceBox {
    url: string;
    image: HomepageImage;
    title: string;
    order: number;
}

export interface TechnologyImage {
    image: HomepageImage;
    order: number;
}

export interface ProcessStep {
    title: string;
    description: string;
    image: HomepageImage;
    order: number;
}

export interface FounderSlide {
    title: string;
    description: string;
    descriptionTwo?: string;
    name: string;
    achievements?: string;
    partnerLabel?: string;
    partner?: string;
    image: HomepageImage;
    order: number;
}

export interface Homepage {
    _id: string;
    // Hero Slider
    sliderTitle?: string;
    slides: Slide[];
    // Trust Icons Section
    trustIconsHeading?: string;
    trustIcons: TrustIcon[];
    // Services Section
    serviceHeading?: string;
    serviceBoxes: ServiceBox[];
    serviceCta?: string;
    // Technology Section
    technologyHeading?: string;
    technologyImages: TechnologyImage[];
    // Working Process Section
    workingProcessHeading?: string;
    workingProcessSubHeading?: string;
    processSteps: ProcessStep[];
    // Text Slider/Marquee
    sliderImage?: HomepageImage;
    sliderTexts: string[];
    // About Section
    aboutLightHeading?: string;
    aboutUsHeading?: string;
    aboutRightHeading?: string;
    aboutParagraph?: string;
    aboutCtaButton?: string;
    aboutImages: HomepageImage[];
    aboutVideo?: { url: string };
    peopleText?: string;
    founderSlides: FounderSlide[];
    // Contact Section
    contactImage?: HomepageImage;
    contactTitle?: string;
    contactButton?: string;
    // SEO
    seoTitle?: string;
    seoDescription?: string;
    // Timestamps
    createdAt: string;
    updatedAt: string;
}

export interface HomepageResponse {
    success: boolean;
    data: Homepage;
}

export interface UpdateHomepageData {
    sliderTitle?: string;
    slides?: Slide[];
    trustIconsHeading?: string;
    trustIcons?: TrustIcon[];
    serviceHeading?: string;
    serviceBoxes?: ServiceBox[];
    serviceCta?: string;
    technologyHeading?: string;
    technologyImages?: TechnologyImage[];
    workingProcessHeading?: string;
    workingProcessSubHeading?: string;
    processSteps?: ProcessStep[];
    sliderImage?: HomepageImage;
    sliderTexts?: string[];
    aboutLightHeading?: string;
    aboutUsHeading?: string;
    aboutRightHeading?: string;
    aboutParagraph?: string;
    aboutCtaButton?: string;
    aboutImages?: HomepageImage[];
    aboutVideo?: { url: string };
    peopleText?: string;
    founderSlides?: FounderSlide[];
    contactImage?: HomepageImage;
    contactTitle?: string;
    contactButton?: string;
    seoTitle?: string;
    seoDescription?: string;
}

// Homepage API Functions
export const getHomepage = async (): Promise<HomepageResponse> => {
    const response = await axiosApi.get<HomepageResponse>("/admin/homepage");
    return response.data;
};

export const updateHomepage = async (
    data: UpdateHomepageData
): Promise<HomepageResponse> => {
    const response = await axiosApi.put<HomepageResponse>(
        "/admin/homepage",
        data
    );
    return response.data;
};
