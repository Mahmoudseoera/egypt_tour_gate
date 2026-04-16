// ─── About Page API Types ─────────────────────────────────────────────────────
// Endpoint: GET https://www.egypttoursgate.com/api/v1/about-us?locale=en
// Completely independent from homeTypes — do NOT import anything from homeTypes.

export interface AboutSectionData {
  about_sub_title: string;
  about_title: string;
  about_desc: string;
  about_img: string;
  about_img_title: string;
  about_img_alt: string;
  about_link: string;
  about_date: string;
  about_title2: string;
}

export interface WhyChooseBox {
  img?: string;
  why_choose_box_1_title?: string;
  why_choose_box_1_desc?: string;
  why_choose_box_2_title?: string;
  why_choose_box_2_desc?: string;
  why_choose_box_3_title?: string;
  why_choose_box_3_desc?: string;
  why_choose_box_4_title?: string;
  why_choose_box_4_desc?: string;
  why_choose_box_5_title?: string;
  why_choose_box_5_desc?: string;
  why_choose_box_6_title?: string;
  why_choose_box_6_desc?: string;
}

export interface WhyChooseSectionData {
  title: string;
  description: string;
  why_choose: {
    section1: WhyChooseBox;
    section2: WhyChooseBox;
    section3: WhyChooseBox;
    section4: WhyChooseBox;
    section5: WhyChooseBox;
    section6: WhyChooseBox;
  };
}

/** Shape of `data.sections` returned by the about-us endpoint */
export interface AboutPageSections {
  about_section: AboutSectionData;
  why_choose_section: WhyChooseSectionData;
}

/** Full API response envelope */
export interface AboutApiResponse {
  success: boolean;
  data: {
    sections: AboutPageSections;
  };
  message: string;
}
