import { eventType } from "./eventType";
import { mainServiceType } from "./serviceMainType";
import { servicesInternalOnePage } from "./serviceInternalOneType";
import { servicesInternalTwoPage } from "./serviceInternalTwoType";
import { servicesInternalThreePage } from "./serviceInternalThreeType";
import { servicesInternalFourPage } from "./serviceInternalFourType";
import { servicesInternalFivePage } from "./serviceInternalFiveType";
import { servicesInternalSixPage } from "./serviceInternalSixType";
import { aboutPage } from "./aboutUsType";
import { faqSection } from "./faqType";
import { projectPage } from "./projectType";
import { projectInternalPageOne } from "./projectInternalOne";
import { projectInternalPageTwo } from "./projectInternalTwo";

export const schema = {
  types: [
    eventType,
    aboutPage,
    mainServiceType,
    servicesInternalOnePage,
    servicesInternalTwoPage,
    servicesInternalThreePage,
    servicesInternalFourPage,
    servicesInternalFivePage,
    servicesInternalSixPage,
    faqSection,
    projectPage,
    projectInternalPageOne,
    projectInternalPageTwo,
  ],
};
