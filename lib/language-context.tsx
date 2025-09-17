"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

export const supportedLanguages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🔸' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🔹' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🔶' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🔺' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🔻' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🔷' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🔸' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🔹' },
]

interface Translations {
  [key: string]: {
    [key: string]: string
  }
}

const translations: Translations = {
  en: {
    // Common
    'welcome': 'Welcome',
    'home': 'Home',
    'profile': 'Profile',
    'settings': 'Settings',
    'games': 'Games',
    'lessons': 'Lessons',
    'dashboard': 'Dashboard',
    'logout': 'Logout',
    'save': 'Save',
    'cancel': 'Cancel',
    'edit': 'Edit',
    'delete': 'Delete',
    'back': 'Back',
    'next': 'Next',
    'previous': 'Previous',
    'loading': 'Loading...',
    'error': 'Error',
    'success': 'Success',
    
    // Home page
    'hero.title': 'Educational Games Store',
    'hero.subtitle': 'Enhance learning through interactive games and challenges',
    'platform.title': 'Welcome to EduGamers',
    'platform.subtitle': 'Choose your role to access the platform',
    'role.student': 'Student',
    'role.teacher': 'Teacher',
    'role.government': 'Government',
    'role.student.desc': 'Play games, track progress, submit assignments',
    'role.teacher.desc': 'Manage students, create assignments, view analytics',
    'role.government.desc': 'View regional data, track implementation, manage policies',
    'explore.games': 'Explore Games',
    'get.started': 'Get Started',
    'solar.status': 'Solar Powered - Active',
    
    // Profile page
    'profile.title': 'My Profile',
    'profile.edit': 'Edit Profile',
    'profile.save': 'Save Changes',
    'profile.name': 'Full Name',
    'profile.email': 'Email',
    'profile.phone': 'Phone',
    'profile.grade': 'Grade/Class',
    'profile.school': 'School',
    'profile.bio': 'Bio',
    'profile.avatar': 'Profile Picture',
    'profile.upload': 'Upload Photo',
    'profile.stats': 'Statistics',
    'profile.achievements': 'Achievements',
    'profile.subjects': 'Subject Progress',
    'profile.level': 'Level',
    'profile.xp': 'XP',
    'profile.streak': 'Streak',
    'profile.lessons': 'Lessons Completed',
    
    // Games
    'games.play': 'Play Now',
    'games.score': 'Score',
    'games.time': 'Time',
    'games.level': 'Level',
    'games.difficulty': 'Difficulty',
    
    // Language
    'language.select': 'Select Language',
    'language.change': 'Change Language',
  },
  hi: {
    // Common
    'welcome': 'स्वागत',
    'home': 'मुख्य पृष्ठ',
    'profile': 'प्रोफ़ाइल',
    'settings': 'सेटिंग्स',
    'games': 'खेल',
    'lessons': 'पाठ',
    'dashboard': 'डैशबोर्ड',
    'logout': 'लॉग आउट',
    'save': 'सेव करें',
    'cancel': 'रद्द करें',
    'edit': 'संपादित करें',
    'delete': 'हटाएं',
    'back': 'वापस',
    'next': 'अगला',
    'previous': 'पिछला',
    'loading': 'लोड हो रहा है...',
    'error': 'त्रुटि',
    'success': 'सफलता',
    
    // Home page
    'hero.title': 'शैक्षणिक खेल स्टोर',
    'hero.subtitle': 'इंटरैक्टिव गेम्स और चुनौतियों के माध्यम से सीखने को बढ़ावा दें',
    'platform.title': 'EduGamers में आपका स्वागत है',
    'platform.subtitle': 'प्लेटफॉर्म तक पहुंचने के लिए अपनी भूमिका चुनें',
    'role.student': 'छात्र',
    'role.teacher': 'शिक्षक',
    'role.government': 'सरकार',
    'role.student.desc': 'खेल खेलें, प्रगति ट्रैक करें, असाइनमेंट जमा करें',
    'role.teacher.desc': 'छात्रों का प्रबंधन करें, असाइनमेंट बनाएं, विश्लेषण देखें',
    'role.government.desc': 'क्षेत्रीय डेटा देखें, कार्यान्वयन ट्रैक करें, नीतियों का प्रबंधन करें',
    'explore.games': 'गेम्स एक्सप्लोर करें',
    'get.started': 'शुरुआत करें',
    'solar.status': 'सौर ऊर्जा संचालित - सक्रिय',
    
    // Profile page
    'profile.title': 'मेरी प्रोफ़ाइल',
    'profile.edit': 'प्रोफ़ाइल संपादित करें',
    'profile.save': 'परिवर्तन सेव करें',
    'profile.name': 'पूरा नाम',
    'profile.email': 'ईमेल',
    'profile.phone': 'फोन',
    'profile.grade': 'ग्रेड/कक्षा',
    'profile.school': 'स्कूल',
    'profile.bio': 'परिचय',
    'profile.avatar': 'प्रोफ़ाइल तस्वीर',
    'profile.upload': 'फोटो अपलोड करें',
    'profile.stats': 'आंकड़े',
    'profile.achievements': 'उपलब्धियां',
    'profile.subjects': 'विषय प्रगति',
    'profile.level': 'स्तर',
    'profile.xp': 'XP',
    'profile.streak': 'स्ट्रीक',
    'profile.lessons': 'पूर्ण पाठ',
    
    // Games
    'games.play': 'अभी खेलें',
    'games.score': 'स्कोर',
    'games.time': 'समय',
    'games.level': 'स्तर',
    'games.difficulty': 'कठिनाई',
    
    // Language
    'language.select': 'भाषा चुनें',
    'language.change': 'भाषा बदलें',
  },
  or: {
    // Common
    'welcome': 'ସ୍ୱାଗତ',
    'home': 'ମୁଖ୍ୟ ପୃଷ୍ଠା',
    'profile': 'ପ୍ରୋଫାଇଲ୍',
    'settings': 'ସେଟିଂ',
    'games': 'ଖେଳ',
    'lessons': 'ପାଠ',
    'dashboard': 'ଡ୍ୟାସବୋର୍ଡ',
    'logout': 'ଲଗ୍ ଆଉଟ୍',
    'save': 'ସେଭ୍ କରନ୍ତୁ',
    'cancel': 'ବାତିଲ୍ କରନ୍ତୁ',
    'edit': 'ସଂପାଦନା କରନ୍ତୁ',
    'delete': 'ଡିଲିଟ୍ କରନ୍ତୁ',
    'back': 'ପଛକୁ',
    'next': 'ପରବର୍ତ୍ତୀ',
    'previous': 'ପୂର୍ବବର୍ତ୍ତୀ',
    'loading': 'ଲୋଡ଼ିଙ୍ଗ...',
    'error': 'ତ୍ରୁଟି',
    'success': 'ସଫଳତା',
    
    // Home page
    'hero.title': 'ଶିକ୍ଷାଗତ ଖେଳ ଷ୍ଟୋର୍',
    'hero.subtitle': 'ଇଣ୍ଟରାକ୍ଟିଭ୍ ଗେମ୍ ଏବଂ ଚ୍ୟାଲେଞ୍ଜ ମାଧ୍ୟମରେ ଶିକ୍ଷାକୁ ବୃଦ୍ଧି କରନ୍ତୁ',
    'platform.title': 'EduGamers ରେ ଆପଣଙ୍କୁ ସ୍ୱାଗତ',
    'platform.subtitle': 'ପ୍ଲାଟଫର୍ମ ଆକ୍ସେସ୍ କରିବାକୁ ଆପଣଙ୍କର ଭୂମିକା ବାଛନ୍ତୁ',
    'role.student': 'ଛାତ୍ର',
    'role.teacher': 'ଶିକ୍ଷକ',
    'role.government': 'ସରକାର',
    'role.student.desc': 'ଖେଳ ଖେଳନ୍ତୁ, ପ୍ରଗତି ଟ୍ରାକ୍ କରନ୍ତୁ, ଆସାଇନମେଣ୍ଟ ଜମା କରନ୍ତୁ',
    'role.teacher.desc': 'ଛାତ୍ରମାନଙ୍କୁ ପରିଚାଳନା କରନ୍ତୁ, ଆସାଇନମେଣ୍ଟ ତିଆରି କରନ୍ତୁ, ବିଶ୍ଳେଷଣ ଦେଖନ୍ତୁ',
    'role.government.desc': 'ଆଞ୍ଚଳିକ ତଥ୍ୟ ଦେଖନ୍ତୁ, କାର୍ଯ୍ୟକାରିତା ଟ୍ରାକ୍ କରନ୍ତୁ, ନୀତି ପରିଚାଳନା କରନ୍ତୁ',
    'explore.games': 'ଗେମ୍ସ ଏକ୍ସପ୍ଲୋର୍ କରନ୍ତୁ',
    'get.started': 'ଆରମ୍ଭ କରନ୍ତୁ',
    'solar.status': 'ସୌର ଶକ୍ତି ଚାଳିତ - ସକ୍ରିୟ',
    
    // Profile page
    'profile.title': 'ମୋର ପ୍ରୋଫାଇଲ୍',
    'profile.edit': 'ପ୍ରୋଫାଇଲ୍ ସଂପାଦନା କରନ୍ତୁ',
    'profile.save': 'ପରିବର୍ତ୍ତନ ସେଭ୍ କରନ୍ତୁ',
    'profile.name': 'ପୂର୍ଣ୍ଣ ନାମ',
    'profile.email': 'ଇମେଲ୍',
    'profile.phone': 'ଫୋନ୍',
    'profile.grade': 'ଗ୍ରେଡ୍/କ୍ଲାସ୍',
    'profile.school': 'ବିଦ୍ୟାଳୟ',
    'profile.bio': 'ପରିଚୟ',
    'profile.avatar': 'ପ୍ରୋଫାଇଲ୍ ଫଟୋ',
    'profile.upload': 'ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ',
    'profile.stats': 'ପରିସଂଖ୍ୟାନ',
    'profile.achievements': 'ସଫଳତା',
    'profile.subjects': 'ବିଷୟ ପ୍ରଗତି',
    'profile.level': 'ସ୍ତର',
    'profile.xp': 'XP',
    'profile.streak': 'ଷ୍ଟ୍ରିକ୍',
    'profile.lessons': 'ସମ୍ପୂର୍ଣ୍ଣ ପାଠ',
    
    // Games
    'games.play': 'ବର୍ତ୍ତମାନ ଖେଳନ୍ତୁ',
    'games.score': 'ସ୍କୋର୍',
    'games.time': 'ସମୟ',
    'games.level': 'ସ୍ତର',
    'games.difficulty': 'କଠିନତା',
    
    // Language
    'language.select': 'ଭାଷା ବାଛନ୍ତୁ',
    'language.change': 'ଭାଷା ବଦଳାନ୍ତୁ',
  },
}

interface LanguageContextType {
  currentLanguage: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(supportedLanguages[0])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Load saved language from localStorage only on client side
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('selectedLanguage')
      if (savedLanguage) {
        const language = supportedLanguages.find(lang => lang.code === savedLanguage)
        if (language) {
          setCurrentLanguage(language)
        }
      }
    }
    setIsInitialized(true)
  }, [])

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language)
    // Only save to localStorage if we're on the client side
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedLanguage', language.code)
    }
  }

  const t = (key: string): string => {
    const languageTranslations = translations[currentLanguage.code]
    return languageTranslations?.[key] || translations.en[key] || key
  }

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
