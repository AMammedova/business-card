export interface SiteLink {
  url: string; 
}

export interface SubCategory {
  name: string; 
  url: string; 
  businessCardLogoResponseDtos: SiteLink[]; 
}

export interface CompanyResponseDto {
  name: string; 
  slogan: string;
  email: string;
  location: string;
  phoneNumber: string;
  startDate: string; 
  businessCardSubCategoryResponseDto: SubCategory[];
}

export interface Phone {
  id: number;
  phoneNumber: string;
  isPrimary: boolean;
}

export interface Email {
  id: number;
  email: string;
  isPrimary: boolean;
}

export interface Employee {
  id: number;
  pictureUrl: string;
  name: string;
  surname: string;
  phones: Phone[];
  emails: Email[];
  position: string;
  businessCardCompanyResponseDto: CompanyResponseDto[];
}
