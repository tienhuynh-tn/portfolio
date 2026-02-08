import type { ComponentType } from 'react'
import {
  ChatCircleText,
  Files,
  GraduationCap,
  HouseLine,
  LightningSlash,
  MedalMilitary,
  Pulse,
  SuitcaseSimple,
  UserCircle,
  type IconProps,
} from '@phosphor-icons/react'

type NavIcon = ComponentType<IconProps>

export const NAV_ITEMS = [
  {
    id: 'home',
    label: 'Home',
    Icon: HouseLine as NavIcon,
  },
  {
    id: 'about',
    label: 'About me',
    Icon: UserCircle as NavIcon,
  },
  {
    id: 'skills',
    label: 'Skills',
    Icon: LightningSlash as NavIcon,
  },
  {
    id: 'projects',
    label: 'Projects',
    Icon: Files as NavIcon,
  },
  {
    id: 'experience',
    label: 'Experience',
    Icon: SuitcaseSimple as NavIcon,
  },
  {
    id: 'education',
    label: 'Education',
    Icon: GraduationCap as NavIcon,
  },
  {
    id: 'certifications',
    label: 'Certifications',
    Icon: MedalMilitary as NavIcon,
  },
  {
    id: 'activity',
    label: 'Activity',
    Icon: Pulse as NavIcon,
  },
  {
    id: 'contact',
    label: 'Contact',
    Icon: ChatCircleText as NavIcon,
  },
] as const

export type NavItemId = (typeof NAV_ITEMS)[number]['id']
