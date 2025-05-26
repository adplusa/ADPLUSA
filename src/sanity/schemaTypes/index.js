import { eventType } from "./eventType";
import { serviceType } from "./serviceTwoType";
import { aboutPage } from "./aboutUsType";
import { faqSection } from "./faqType";
import { projectPage } from "./projectType";
import { servicesPage } from "./serviceType";
import { projectInternalPageOne } from "./projectInternalOne";
import { projectInternalPageTwo } from "./projectInternalTwo";

export const schema = {
  types: [
    eventType,
    aboutPage,
    serviceType,
    faqSection,
    projectPage,
    projectInternalPageOne,
    projectInternalPageTwo,
    servicesPage,
  ],
};
