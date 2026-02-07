import {
  Building2,
  Car,
  Wrench,
  Briefcase,
  AlertTriangle,
  Users,
  Landmark,
  FileText,
  Scale,
  ShoppingBag,
  Shield,
  PhoneCall,
  FileSearch,
  MapPin,
  Calculator,
  FileCheck,
  UserCheck,
  Target,
  MapPinned,
  Smartphone,
  Home,
  Factory,
  LucideIcon,
} from "lucide-react";

// Map icon names (strings) to actual Lucide icon components
export const iconMap: Record<string, LucideIcon> = {
  Building2,
  Car,
  Wrench,
  Briefcase,
  AlertTriangle,
  Users,
  Landmark,
  FileText,
  Scale,
  ShoppingBag,
  Shield,
  PhoneCall,
  FileSearch,
  MapPin,
  Calculator,
  FileCheck,
  UserCheck,
  Target,
  MapPinned,
  Smartphone,
  Home,
  Factory,
};

// Get icon component by name with fallback
export const getIcon = (iconName: string): LucideIcon => {
  return iconMap[iconName] || FileText;
};

// List of available icons for admin panel selects
export const availableIcons = Object.keys(iconMap);
