export interface Logo {
    url: string;
  }
  
 export interface Site {
    url: string;
  }
  
 export interface CompanyResponseDto {
    name: string;
    slogan: string;
    info: string;
    location: string;
    logoResponseDto: Logo[];
    siteResponseDto: Site[];
  }
  
 export interface Employee {
    pictureUrl: string;
    name: string;
    surname: string;
    position: string;
    phoneNumber: string;
    mail: string;
    companyResponseDto: CompanyResponseDto[];
  }