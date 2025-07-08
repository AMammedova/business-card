"use client"
import type React from "react"
import { useCallback, useState, useMemo, useEffect } from "react"
import Image from "next/image"
import type { Employee } from "@/types/employee"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { useTranslations } from "next-intl"
import { downloadVCardFromBackend } from "@/utils/vcard"
import { toast } from "react-toastify"
import { MapPin, Phone, Mail, MessageCircle, Download, Share2, ExternalLink} from "lucide-react"

type MapAppId = "google" | "waze" | "bolt" | "apple"

interface MapAppConfig {
  id: MapAppId
  label: string
  icon: string
}

// Determine icon from site URL
const getSiteIcon = (url: string): string => {
  if (url.includes("instagram")) return "instagram.svg"
  if (url.includes("facebook")) return "facebook.png"
  if (url.includes("linkedin")) return "linkedin.png"
  if (url.includes("tiktok")) return "tiktok.svg"
  return "web.svg"
}

const handleShare = async (t: (key: string) => string) => {
  try {
    if (navigator.share) {
      await navigator.share({
        url: window.location.href,
      })
    } else {
      toast.error(t("sharingNotSupported"))
    }
  } catch (error) {
    console.error("Error sharing:", error)
  }
}

const parseLocation = (locationStr: string) => {
  const [address, latSeg, lonSeg] = locationStr.split(" / ")
  return {
    address,
    latitude: Number.parseFloat(latSeg?.replace(/[^0-9.-]/g, "")),
    longitude: Number.parseFloat(lonSeg?.replace(/[^0-9.-]/g, "")),
  }
}

// Futuristic Modal Components
const FuturisticWhatsAppModal: React.FC<{
  phones: { phoneNumber: string; isPrimary: boolean }[]
  onSelect: (phoneNumber: string) => void
  onClose: () => void
}> = ({ phones, onSelect, onClose }) => {
  const t = useTranslations("Landing")
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-50">
      <div className="relative max-w-md w-full mx-4">
        {/* Neon glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl animate-pulse"></div>

        <div className="relative bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Frosted glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5"></div>

          {/* Neon accent lines */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>

          <div className="relative z-10 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">{t("whatsAppTitle")}</h3>
              </div>
            </div>

            {/* Phone list */}
            <div className="space-y-4 mb-8">
              {phones.map((phone, index) => (
                <button
                  key={index}
                  onClick={() => onSelect(phone.phoneNumber)}
                  className={`w-full p-4 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 group ${
                    phone.isPrimary
                      ? "bg-green-500/10 border-green-400/30 hover:bg-green-500/20"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-white text-lg">{phone.phoneNumber}</span>
                    {phone.isPrimary && (
                      <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-black text-xs px-3 py-1 rounded-full font-semibold">
                        {t("primary")}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Cancel button */}
            <button
              onClick={onClose}
              className="w-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 text-white font-semibold py-4 rounded-2xl transition-all duration-300 hover:scale-105"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const FuturisticMapModal: React.FC<{
  apps: MapAppConfig[]
  onSelect: (appId: MapAppId) => void
  loadingApp?: MapAppId
  onClose: () => void
  address: string
}> = ({ apps, onSelect, loadingApp, onClose }) => {
  const t = useTranslations("Landing")
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-50">
      <div className="relative max-w-md w-full mx-4">
        {/* Neon glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl animate-pulse"></div>

        <div className="relative bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Frosted glass overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5"></div>

          {/* Neon accent lines */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>

          <div className="relative z-10 p-8">
            <h3 className="text-2xl font-bold text-white text-center mb-8">{t("modalTitle")}</h3>

            <div className="grid grid-cols-2 gap-12 mb-8">
              {apps?.map((app) => (
                <button
                  key={app?.id}
                  onClick={() => onSelect(app?.id)}
                  disabled={loadingApp === app?.id}
                  className="flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:scale-105 transition-all duration-300 disabled:opacity-50 group"
                >
                  {loadingApp === app?.id ? (
                    <div className="w-12 h-12 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white/20 border-t-cyan-400 rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <>
                      <Image
                        src={app?.icon || "/placeholder.svg"}
                        alt={app?.label}
                        width={48}
                        height={48}
                        className="rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300"
                      />
                      <span className="text-white font-medium text-sm">{app?.label}</span>
                    </>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 text-white font-semibold py-4 rounded-2xl transition-all duration-300 hover:scale-105"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Futuristic Business Card Component
const DigitalBusinessCard: React.FC<{ employee: Employee }> = ({ employee }) => {
  const t = useTranslations("Landing")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false)
  const [loadingApp, setLoadingApp] = useState<MapAppId | undefined>(undefined)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const isMobile = useMemo(() => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent), [])
  const isIOS = useMemo(() => /iPhone|iPad|iPod/i.test(navigator.userAgent), [])

  // Mouse tracking for dynamic effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

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
          ]
        : []),
    ],
    [isMobile, isIOS],
  )

  const openMap = useCallback(
    (app: MapAppId) => {
      const company = employee?.businessCardCompanyResponseDto[0]
      const locationData = company?.location ? parseLocation(company?.location) : null
      if (!locationData) {
        toast.error(t("noCoordinates"))
        return
      }
      const { latitude, longitude } = locationData
      setLoadingApp(app)
      const done = () => setLoadingApp(undefined)
      switch (app) {
        case "google":
          window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, "_blank")
          done()
          break
        case "waze":
          if (isMobile) {
            const wazeUrlApp = `waze://?ll=${latitude},${longitude}&navigate=yes`
            const wazeUrlWeb = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`
            setTimeout(() => {
              window.open(wazeUrlWeb, "_blank")
              done()
            }, 2000)
            window.location.href = wazeUrlApp
          } else {
            window.open(`https://www.waze.com/ul?ll=${latitude},${longitude}&navigate=yes`, "_blank")
          }
          done()
          break
        default:
          done()
      }
    },
    [employee, isMobile, isIOS],
  )

  const handleWhatsAppSelect = (phoneNumber: string) => {
    const whatsappUrl = `https://wa.me/${phoneNumber}`
    window.open(whatsappUrl, "_blank")
    setIsWhatsAppModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0">
        {/* Glowing orbs */}
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x * 0.5}%`,
            top: `${mousePosition.y * 0.3}%`,
          }}
        ></div>
        <div
          className="absolute w-90 h-80 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"
          style={{
            right: `${(100 - mousePosition.x) * 0.4}%`,
            bottom: `${(100 - mousePosition.y) * 0.3}%`,
          }}
        ></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 h-full">
            {[...Array(144)].map((_, i) => (
              <div key={i} className="border border-white/10"></div>
            ))}
          </div>
        </div>

        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/60 rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-0 md:p-4">
        <div className="w-full max-w-4xl">
          {/* Main Card Container */}
          <div className="relative">
            {/* Outer glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 md:rounded-[2rem] blur-xl animate-pulse"></div>

            {/* Main glass card */}
            <div className="relative bg-black/20 backdrop-blur-2xl border border-white/10 md:rounded-[2rem] shadow-2xl overflow-hidden">
              {/* Frosted glass overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5"></div>

              {/* Top neon accent line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>

              {/* Header Section */}
              <div className="relative p-2 border-b border-white/5">
                {/* Action buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => handleShare(t)}
                    className="w-12 h-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
                  >
                    <Share2 className="w-5 h-5 text-white/70 group-hover:text-cyan-400 transition-colors" />
                  </button>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-2">
                    <LanguageSwitcher />
                  </div>
                </div>

                {/* Company branding */}
              </div>

              {/* Main Content */}
              <div className="p-8">
                <div className="grid lg:grid-cols-3 md:gap-24">
                  {/* Left Column - Profile */}
                  <div className="lg:col-span-1 space-y-6">
                    {/* Profile Image */}
                    <div className="relative">
                      {/* <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-purple-500/20 to-pink-500/30 rounded-3xl blur-lg animate-pulse"></div> */}
                      <div className="relative w-[18rem] h-64 mx-auto">
                          {/* Modern rectangular frame */}
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 via-purple-400/20 to-pink-400/30 rounded-3xl p-[2px]">
                            <div className="w-full h-full bg-black/80 rounded-3xl overflow-hidden">
                              <img
                                src={employee?.pictureUrl || "/defaultman2.png"}
                                alt={t("profileAlt")}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                              />
                            </div>
                          </div>
                          {/* Corner highlights */}
                          <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-cyan-400/60 rounded-tl-xl"></div>
                          <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-purple-400/60 rounded-tr-xl"></div>
                          <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-purple-400/60 rounded-bl-xl"></div>
                          <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-pink-400/60 rounded-br-xl"></div>
                        </div>
                    </div>

                  </div>

                  {/* Right Column - Info */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Name and Title */}
                    <div className="text-center lg:text-left">
                      <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
                        {employee?.name} <span className="text-cyan-400">{employee?.surname}</span>
                      </h1>
                      <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/10 rounded-2xl">
                        {/* <Star className="w-5 h-5 text-yellow-400" /> */}
                        <span className="text-white font-semibold text-lg">{employee?.position}</span>
                        {/* <Zap className="w-5 h-5 text-cyan-400" /> */}
                      </div>
                    </div>

                    {/* Contact Grid */}
                    <div className="grid gap-4">
                      {/* Phone Numbers */}
                      {employee?.phones && employee.phones.length > 0 && (
                        <div className="space-y-3">
                          {employee.phones
                            .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))
                            .map((phone, index) => (
                              <div key={index} className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                                <a
                                  href={`tel:+${phone.phoneNumber}`}
                                  className="relative flex items-center gap-4 p-4 bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-black/30 transition-all duration-300 hover:scale-105 group"
                                >
                                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                                    <Phone className="w-6 h-6 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-white/50 text-sm font-mono uppercase tracking-wider">Phone</p>
                                    <p className="text-white font-mono text-lg">{phone.phoneNumber}</p>
                                  </div>
                                  {phone.isPrimary && (
                                    <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-black text-xs px-3 py-1 rounded-full font-semibold">
                                      PRIMARY
                                    </span>
                                  )}
                                  <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                                </a>
                              </div>
                            ))}
                        </div>
                      )}

                      {/* Email Addresses */}
                      {employee?.emails && employee.emails.length > 0 && (
                        <div className="space-y-3">
                          {employee.emails
                            .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))
                            .map((email, index) => (
                              <div key={index} className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                                <a
                                  href={`mailto:${email.email}`}
                                  className="relative flex items-center gap-4 p-4 bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-black/30 transition-all duration-300 hover:scale-105 group"
                                >
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                                    <Mail className="w-6 h-6 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-white/50 text-sm font-mono uppercase tracking-wider">Email</p>
                                    <p className="text-white font-mono text-lg">{email.email}</p>
                                  </div>
                                  {email.isPrimary && (
                                    <span className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                                      PRIMARY
                                    </span>
                                  )}
                                  <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                                </a>
                              </div>
                            ))}
                        </div>
                      )}

                      {/* WhatsApp */}
                      {employee?.phones && employee.phones.length > 0 && (
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                          <button
                            onClick={() => setIsWhatsAppModalOpen(true)}
                            className="relative w-full flex items-center gap-4 p-4 bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-black/30 transition-all duration-300 hover:scale-105 group"
                          >
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                              <MessageCircle className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-white/50 text-sm font-mono uppercase tracking-wider">WhatsApp</p>
                              <p className="text-white font-mono text-lg">{t("whatsApp")}</p>
                            </div>
                            <ExternalLink className="w-5 h-5 text-white/50 group-hover:text-cyan-400 transition-colors" />
                            <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <button
                        onClick={() => downloadVCardFromBackend(employee?.id, t("success"), t("error"))}
                        className="flex-1 flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105"
                      >
                        <Download className="w-5 h-5" />
                        {t("saveToContacts")}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Company Section */}
                {employee?.businessCardCompanyResponseDto && employee.businessCardCompanyResponseDto.length > 0 && (
                  <div className="mt-12 space-y-8">
                    {employee.businessCardCompanyResponseDto.map((company, companyIndex) => (
                      <div key={companyIndex} className="space-y-6">
                        {/* Company Header */}
                        <div className="text-center">
                          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-6"></div>
                          <h2 className="text-3xl font-bold text-white mb-2">{company.name}</h2>
                          <p className="text-white/70 font-mono">{company.slogan}</p>
                        </div>

                        {/* Sub Categories */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          {company.businessCardSubCategoryResponseDto?.map((subcategory, subIndex) => (
                            <div key={subIndex} className="relative group">
                              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                              <div className="relative bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-black/30 transition-all duration-300 hover:scale-105 group">
                                <img
                                  src={subcategory?.url || "/placeholder.svg"}
                                  alt={subcategory?.name}
                                  className="h-16 w-full object-contain mb-4 opacity-80 group-hover:opacity-100 transition-opacity"
                                />
                                <div className="flex gap-2 justify-center">
                                  {subcategory?.businessCardLogoResponseDtos?.map((site, siteIndex) => (
                                    <a
                                      key={siteIndex}
                                      href={site?.url?.replace("https://tend.grandmart.az:6007/Site/", "")}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:scale-110 hover:bg-white/20 transition-all duration-300"
                                    >
                                      <Image
                                        src={`/${getSiteIcon(site.url)}`}
                                        alt={t("siteIconAlt")}
                                        width={16}
                                        height={16}
                                      />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Location */}
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                          <button
                            onClick={() => setIsModalOpen(true)}
                            className="relative w-full flex items-center gap-4 p-4 bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-black/30 transition-all duration-300 hover:scale-105 group"
                          >
                            <div className="relative w-12 h-12 flex items-center justify-center">
                              <div className="absolute inset-0 bg-red-500/20 rounded-xl animate-ping"></div>
                              <div className="relative w-10 h-10 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25">
                                <MapPin className="w-5 h-5 text-white" />
                              </div>
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-white/50 text-sm font-mono uppercase tracking-wider">Location</p>
                              <p className="text-white font-mono text-lg">{company.location}</p>
                            </div>
                            <ExternalLink className="w-5 h-5 text-white/50 group-hover:text-cyan-400 transition-colors" />
                            <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom neon accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <FuturisticMapModal
          apps={availableApps}
          loadingApp={loadingApp}
          onSelect={openMap}
          onClose={() => setIsModalOpen(false)}
          address={employee?.businessCardCompanyResponseDto[0]?.location}
        />
      )}

      {isWhatsAppModalOpen && employee?.phones && (
        <FuturisticWhatsAppModal
          phones={employee.phones}
          onSelect={handleWhatsAppSelect}
          onClose={() => setIsWhatsAppModalOpen(false)}
        />
      )}

      <style jsx>{`
        @keyframes float-particle {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg); 
            opacity: 0.3;
          }
          25% { 
            transform: translateY(-10px) translateX(5px) rotate(90deg); 
            opacity: 0.7;
          }
          50% { 
            transform: translateY(-5px) translateX(-5px) rotate(180deg); 
            opacity: 1;
          }
          75% { 
            transform: translateY(-15px) translateX(3px) rotate(270deg); 
            opacity: 0.5;
          }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-float-particle {
          animation: float-particle 12s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default DigitalBusinessCard
