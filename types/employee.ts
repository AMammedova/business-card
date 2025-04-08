

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

export interface Employee {
  id: number;
  pictureUrl: string;
  name: string;
  surname: string;
  phoneNumber: string;
  mail: string;
  position: string;
  businessCardCompanyResponseDto: CompanyResponseDto[];
}
