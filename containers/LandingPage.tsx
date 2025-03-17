"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getEmployeeById } from "./services/employeeService";

interface Logo {
  url: string;
}

interface Site {
  url: string;
}

interface CompanyResponseDto {
  name: string;
  slogan: string;
  logoResponseDto: Logo[];
  siteResponseDto: Site[];
}

interface Employee {
  pictureUrl: string;
  name: string;
  surname: string;
  position: string;
  phoneNumber: string;
  mail: string;
  companyResponseDto: CompanyResponseDto[];
}

const getSiteIcon = (url: string) => {
  if (url.includes("instagram")) return "instagram.png";
  if (url.includes("facebook")) return "facebook.png";
  if (url.includes("linkedin")) return "linkedin.png";
  return "website.png";
};

const DigitalBusinessCard = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getEmployeeById(9);
      setEmployee(data);
      setTimeout(() => setIsLoaded(true), 300);
    };
    fetchData();
  }, []);

  if (!employee) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-orange-50">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const company = employee.companyResponseDto[0];

  return (
    <div className="flex justify-center items-center min-h-screen bg-white relative overflow-hidden ">
      {/* Creative background with animated shapes */}
      <div className="absolute inset-0 overflow-hidden hidden md:block">
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full opacity-10 transform -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500 rounded-full opacity-10 transform translate-x-16 translate-y-24"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-500 rounded-full opacity-10"></div>
          <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-green-500 rounded-full opacity-10"></div>

          {/* Pattern overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
              backgroundSize: "60px 60px",
              backgroundRepeat: "repeat",
              zIndex: 0,
            }}
          ></div>
        </div>
      </div>

      <div
        className={`w-full max-w-xl mx-auto z-10 transition-all duration-500 p-2 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header section with orange accent */}
          <div className="relative h-52 bg-[#EC3237] overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "url('/back5.jpg')",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                zIndex: 0,
              }}
            ></div>
          </div>

          {/* Profile picture positioned to overlap the header */}
          <div className="flex flex-col items-center -mt-32 px-8">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl transform transition-all duration-300 hover:scale-105 hover:border-[#EC3237]">
              <img
                src={employee.pictureUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="mt-4 text-2xl font-bold text-gray-800 tracking-tight text-center">
              {employee.name} {employee.surname}
            </h2>
            <p className="mt-1 text-gray-600 text-center">
              {employee.position}, {company.name}
            </p>

            <button className="mt-4 py-3 px-8 bg-[#EC3237] hover:bg-[#EC3237]/90 text-white rounded-full transition-all duration-300 shadow-lg transform hover:-translate-y-1 font-medium">
              Save to Contacts
            </button>

            <div className="mt-6 w-full space-y-3">
              <a
                href={`https://wa.me/${employee.phoneNumber}`}
                className="flex items-center py-3 px-5 bg-white shadow-md rounded-xl border border-gray-100 hover:bg-gray-50 transition-all duration-300 gap-3 transform hover:translate-x-1 group"
              >
                <div className="w-10 h-10  rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                  <Image
                    src="/whatsUP.png"
                    alt="WhatsApp"
                    width={20}
                    height={20}
                  />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-gray-900">
                  Text via WhatsApp
                </span>
              </a>
              <a
                href={`tel:+${employee.phoneNumber}`}
                className="flex items-center py-3 px-5 bg-white shadow-md rounded-xl border border-gray-100 hover:bg-gray-50 transition-all duration-300 gap-3 transform hover:translate-x-1 group"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                  <Image src="/call.png" alt="Phone" width={20} height={20} />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-gray-900">
                  +{employee.phoneNumber}
                </span>
              </a>
              <a
                href={`mailto:${employee.mail}`}
                className="flex items-center py-3 px-5 bg-white shadow-md rounded-xl border border-gray-100 hover:bg-gray-50 transition-all duration-300 gap-3 transform hover:translate-x-1 group"
              >
                <div className="w-10 h-10  rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                  <Image src="/mail.png" alt="Email" width={20} height={20} />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-gray-900">
                  {employee.mail}
                </span>
              </a>
            </div>

            {/* Company section */}
            <div className="mt-8 w-full pt-6 border-t border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 text-center">
                {company.name}
              </h2>
              <p className="text-center text-sm text-gray-500 mt-1">
                {company.slogan}
              </p>

              <p className="text-center text-xs text-gray-500 mt-4 mb-2">
                Social media and sites
              </p>
              <div className="flex justify-center items-center gap-4 mb-6">
                {company.siteResponseDto.map((site, index) => (
                  <a
                    key={index}
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white rounded-full shadow-md transform transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-gray-50"
                  >
                    <Image
                      src={`/${getSiteIcon(site.url)}`}
                      alt="Site Icon"
                      width={28}
                      height={28}
                    />
                  </a>
                ))}
              </div>
              <div className="mt-4 flex justify-center items-center gap-4 p-4 ">
                {company.logoResponseDto.map((logo, index) => (
                  <div
                    key={index}
                    className="p-2 bg-white rounded-full shadow-md transform transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  >
                    <img
                      src={logo.url}
                      alt="Company Logo"
                      className="h-16 w-16 object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalBusinessCard;
