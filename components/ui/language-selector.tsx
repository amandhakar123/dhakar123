"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage, supportedLanguages } from "@/lib/language-context"
import { Globe, Check } from "lucide-react"

interface LanguageSelectorProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  showFlag?: boolean
  showName?: boolean
}

export function LanguageSelector({ 
  variant = "outline", 
  size = "sm", 
  showFlag = true,
  showName = true 
}: LanguageSelectorProps) {
  const { currentLanguage, setLanguage } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Globe className="h-4 w-4" />
          {showFlag && currentLanguage.flag}
          {showName && (
            <span className="hidden sm:inline">
              {currentLanguage.nativeName}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {supportedLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => setLanguage(language)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span>{language.flag}</span>
              <span>{language.nativeName}</span>
              <span className="text-muted-foreground text-sm">({language.name})</span>
            </div>
            {currentLanguage.code === language.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
