"use client";

import React, { useCallback, useState, useMemo } from "react";
import Image from "next/image";
import { Employee } from "@/types/employee";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslations } from "next-intl";
import { downloadVCardFromBackend } from "@/utils/vcard";
import { toast } from "react-toastify";

type MapAppId = "google" | "waze" | "bolt" | "apple";

interface MapAppConfig {
  id: MapAppId;
  label: string;
  icon: string;
}

// Determine icon from site URL
const getSiteIcon = (url: string): string => {
  if (url.includes("instagram")) return "instagram.svg";
  if (url.includes("facebook")) return "facebook.png";
  if (url.includes("linkedin")) return "linkedin.png";
  if (url.includes("tiktok")) return "tiktok.svg";
  return "web.svg";
};
const handleShare = async () => {
  try {
    if (navigator.share) {
      await navigator.share({
        url: window.location.href,
      });
    } else {
      alert("Sharing not supported on this browser.");
    }
  } catch (error) {
    console.error("Error sharing:", error);
  }
};



// Parse stored location string into address and coords
const parseLocation = (locationStr: string) => {
  const [address, latSeg, lonSeg] = locationStr.split(" / ");
  return {
    address,
    latitude: parseFloat(latSeg.replace(/[^0-9.-]/g, "")),
    longitude: parseFloat(lonSeg.replace(/[^0-9.-]/g, "")),
  };
};

// Modal for choosing map app
const MapModal: React.FC<{
  apps: MapAppConfig[];
  onSelect: (appId: MapAppId) => void;
  loadingApp?: MapAppId;
  onClose: () => void;
  address: string;
}> = ({ apps, onSelect, loadingApp, onClose }) => {
  const t = useTranslations("Landing");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-80 shadow-lg p-6 text-center">
        <h3 className="mb-4 text-base font-medium text-gray-800">
          {t("modalTitle")}
        </h3>
        <div className="flex justify-around mb-4">
          {apps.map((app) => (
            <button
              key={app.id}
              onClick={() => onSelect(app.id)}
              disabled={loadingApp === app.id}
              className="flex flex-col items-center hover:scale-105 transition disabled:opacity-50"
            >
              {loadingApp === app.id ? (
                <div className="w-12 h-12 flex items-center justify-center">
                  <svg
                    className="animate-spin h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    />
                  </svg>
                </div>
              ) : (
                <>
                  <Image
                    src={app.icon}
                    alt={app.label}
                    width={48}
                    height={48}
                    className="rounded-md"
                  />
                  <span className="mt-1 text-xs text-gray-700">
                    {app.label}
                  </span>
                </>
              )}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full border-t border-gray-200 pt-2 text-sm text-gray-700 hover:text-gray-500"
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
};

// Main component
const DigitalBusinessCard: React.FC<{ employee: Employee }> = ({
  employee,
}) => {
  const t = useTranslations("Landing");
  const company = employee.businessCardCompanyResponseDto[0];
  const locationData = useMemo(
    () => (company?.location ? parseLocation(company.location) : null),
    [company]
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingApp, setLoadingApp] = useState<MapAppId | undefined>(undefined);

  const isMobile = useMemo(
    () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
    []
  );
  const isIOS = useMemo(
    () => /iPhone|iPad|iPod/i.test(navigator.userAgent),
    []
  );

  const availableApps: MapAppConfig[] = useMemo(
    () => [
      {
        id: "google" as MapAppId,
        label: t("googleMaps"),
        icon: "/google-map.png",
      },
      ...(isMobile
        ? [
            {
              id: "waze" as MapAppId,
              label: t("waze"),
              icon: "/waze-icon.png",
            },
            {
              id: "bolt" as MapAppId,
              label: t("bolt"),
              icon: "/bolt-icon.png",
            },
          ]
        : []),
      // ...(isIOS
      //   ? [
      //       {
      //         id: "apple" as MapAppId,
      //         label: t("appleMaps"),
      //         icon: "/apple-map.png",
      //       },
      //     ]
      //   : []),
    ],
    [isMobile, isIOS]
  );

  const openMap = useCallback(
    (app: MapAppId) => {
      if (!locationData) {
        toast.error(t("noCoordinates"));
        return;
      }

      const { latitude, longitude } = locationData;
      console.log("Opening map:", app, latitude, longitude);
      setLoadingApp(app);

      const done = () => setLoadingApp(undefined);

      switch (app) {
        case "google":
          window.open(
            `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
            "_blank"
          );
          done();
          break;

        case "apple":
          if (isIOS) {
            window.open(
              `http://maps.apple.com/?ll=${latitude},${longitude}`,
              "_blank"
            );
          } else {
            toast.info(t("appleOnly"));
          }
          done();
          break;

        case "waze":
          if (isMobile) {
            window.location.href = `waze://?ll=${latitude},${longitude}&navigate=yes`;
          } else {
            window.open(
              `https://www.waze.com/ul?ll=${latitude},${longitude}&navigate=yes`,
              "_blank"
            );
          }
          done();
          break;

        case "bolt":
          if (!locationData) {
            toast.error(t("noCoordinates"));
            done();
            break;
          }

          setLoadingApp("bolt");

          try {
            // Destination coordinates from locationData
            const {
              latitude: destLat,
              longitude: destLng,
              address: destAddress,
            } = locationData;

            // Detect device type
            const isAndroid = /Android/i.test(navigator.userAgent);
            const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

            // Create appropriate deep link based on platform
            let boltUrl = "";

            if (isAndroid) {
              // Android deep link format
              boltUrl = `intent://ride?destination_lat=${destLat}&destination_lng=${destLng}&destination_address=${encodeURIComponent(
                destAddress
              )}#Intent;scheme=bolt;package=ee.mtakso.client;end;`;
            } else if (isIOS) {
              // iOS deep link format
              boltUrl = `bolt://ride?destination_lat=${destLat}&destination_lng=${destLng}&destination_address=${encodeURIComponent(
                destAddress
              )}`;
            } else {
              // Web fallback
              boltUrl = `https://bolt.eu`;
            }

            console.log("Opening Bolt with destination:", {
              destLat,
              destLng,
              boltUrl,
            });

            // Try to open Bolt app
            window.location.href = boltUrl;

            // Fallback to web version after delay
            setTimeout(() => {
              // If window location didn't change, we're still here, so app didn't open
              window.open("https://bolt.eu", "_blank");
              done();
            }, 2500);
          } catch (error) {
            console.error("Error opening Bolt:", error);
            toast.error(t("errorOpeningApp") || "Error opening Bolt app");
            done();
          }
          break;

        default:
          done();
      }
    },
    [locationData, isMobile, isIOS]
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-white relative overflow-hidden">
      <div className="w-full max-w-2xl mx-auto z-10 transition-all duration-500 ">
        <div
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
          style={{
            backgroundImage: "url('/QrPage.svg')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            zIndex: 0,
          }}
        >
          {/* Header */}
          <div className="relative h-52 overflow-hidden">
            <div
              className="absolute top-4 left-4 cursor-pointer"
              onClick={handleShare}
            >
              <Image src="/share.svg" alt="Share" width={32} height={32} />
            </div>
            <div className="absolute top-4 right-4 z-10">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Profile */}
          <div className="flex flex-col items-center -mt-32 px-2 lg:px-8">
            <div className="relative w-48 h-48 group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#EF2831] to-[#EC3237] animate-spin-slow opacity-70"></div>
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl transform transition-all duration-300 hover:scale-105">
                <img
                  src={employee.pictureUrl || "/defaultman2.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="mt-6 text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
                {employee.name} {employee.surname}
              </h2>
              <p className="text-lg text-gray-600 font-medium">
                {employee.position}
              </p>
            </div>

            <button
              onClick={() =>
                downloadVCardFromBackend(employee.id, t("success"), t("error"))
              }
              className="mt-6 py-3.5 px-10 bg-gradient-to-r from-[#FFF200] to-[#FFD100] text-black rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
              </svg>
              {t("saveToContacts")}
            </button>

            {/* Contact Buttons */}
            <div className="mt-6 w-full space-y-3">
              <a
                href={`https://wa.me/${employee.phoneNumber.replace(
                  /\D/g,
                  ""
                )}`}
                className="flex items-center py-3 px-5 bg-white shadow-md rounded-xl border border-gray-100 hover:bg-gray-50 transition-all duration-300 gap-3 transform hover:translate-x-1 group"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg">
                  <Image
                    src="/whatsup.png"
                    alt="WhatsApp"
                    width={20}
                    height={20}
                  />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-gray-900">
                  {t("textViaWhatsApp")}
                </span>
              </a>

              <a
                href={`tel:+${employee.phoneNumber}`}
                className="flex items-center py-3 px-5 bg-white shadow-md rounded-xl border border-gray-100 hover:bg-gray-50 transition-all duration-300 gap-3 transform hover:translate-x-1 group"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg">
                  <Image src="/call.png" alt="Phone" width={20} height={20} />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-gray-900">
                  {employee.phoneNumber}
                </span>
              </a>

              <a
                href={`mailto:${employee.mail}`}
                className="flex items-center py-3 px-5 bg-white shadow-md rounded-xl border border-gray-100 hover:bg-gray-50 transition-all duration-300 gap-3 transform hover:translate-x-1 group"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg">
                  <Image src="/mail.png" alt="Email" width={20} height={20} />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-gray-900">
                  {employee.mail}
                </span>
              </a>
            </div>

            {/* Company Section */}
            <div className="mt-8 w-full pt-6">
              <h2 className="text-3xl font-bold text-gray-800 text-center">
                {company?.name}
              </h2>
              <p className="text-center text-sm text-gray-500 mt-1">
                {company?.slogan}
              </p>

              {/* Sub Categories */}
              <div className="mt-8 grid grid-cols-2 gap-6">
                {company?.businessCardSubCategoryResponseDto.map(
                  (subcategory, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <img
                        src={subcategory?.url}
                        alt={subcategory?.name}
                        className="h-20 w-40 object-cover"
                      />
                      {/* <h3 className="text-md font-semibold text-gray-700 mt-3 text-center">
          {subcategory.name}
        </h3> */}
                      <div className="flex gap-2 mt-2">
                        {subcategory?.businessCardLogoResponseDtos.map(
                          (site, idx) => (
                            <a
                              key={idx}
                              href={site.url.replace(
                                "https://tend.grandmart.az:6007/Site/",
                                ""
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shadow-md hover:scale-110 hover:shadow-lg"
                            >
                              <Image
                                src={`/${getSiteIcon(site.url)}`}
                                alt="Site Icon"
                                width={20}
                                height={20}
                              />
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>

              <div
                onClick={() => setIsModalOpen(true)}
                className="text-center text-sm font-medium p-4 cursor-pointer flex items-center gap-2 justify-center mt-8"
              >
                <Image
                  src="/Location.svg"
                  alt="Location"
                  width={20}
                  height={20}
                />
                <span>{locationData?.address}</span>{" "}
                {/* YALNIZ address göstəririk */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && locationData && (
        <MapModal
          apps={availableApps}
          loadingApp={loadingApp}
          onSelect={openMap}
          onClose={() => setIsModalOpen(false)}
          address={locationData.address}
        />
      )}
    </div>
  );
};

export default DigitalBusinessCard;
