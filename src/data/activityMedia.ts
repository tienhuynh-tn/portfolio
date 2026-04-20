import gdgCloudCoreTeamCover from '../assets/activities/gdg-cloud-core-team/cover.jpg'
import gdgCloudCoreTeam1 from '../assets/activities/gdg-cloud-core-team/1.jpeg'
import gdgCloudCoreTeam2 from '../assets/activities/gdg-cloud-core-team/2.jpeg'
import gdgCloudCoreTeam3 from '../assets/activities/gdg-cloud-core-team/3.jpeg'
import gdgCloudCoreTeam4 from '../assets/activities/gdg-cloud-core-team/4.jpeg'
import gdgCloudCoreTeam5 from '../assets/activities/gdg-cloud-core-team/5.jpeg'
import gdgCloudCoreTeam6 from '../assets/activities/gdg-cloud-core-team/6.jpeg'
import gdgCloudCoreTeam7 from '../assets/activities/gdg-cloud-core-team/7.jpeg'
import gdgCloudCoreTeam8 from '../assets/activities/gdg-cloud-core-team/8.jpeg'
import gdgCloudCoreTeam9 from '../assets/activities/gdg-cloud-core-team/9.jpg'
import gdgCloudCoreTeam10 from '../assets/activities/gdg-cloud-core-team/10.jpg'

import gdgSeaSummitCover from '../assets/activities/gdg-sea-summit-2025/cover.jpg'
import gdgSeaSummit1 from '../assets/activities/gdg-sea-summit-2025/1.jpg'
import gdgSeaSummit2 from '../assets/activities/gdg-sea-summit-2025/2.jpg'
import gdgSeaSummit3 from '../assets/activities/gdg-sea-summit-2025/3.jpg'
import gdgSeaSummit4 from '../assets/activities/gdg-sea-summit-2025/4.jpg'
import gdgSeaSummit5 from '../assets/activities/gdg-sea-summit-2025/5.jpg'
import gdgSeaSummit6 from '../assets/activities/gdg-sea-summit-2025/6.jpg'
import gdgSeaSummit7 from '../assets/activities/gdg-sea-summit-2025/7.jpg'
import gdgSeaSummit8 from '../assets/activities/gdg-sea-summit-2025/8.jpg'
import gdgSeaSummit9 from '../assets/activities/gdg-sea-summit-2025/9.jpg'
import gdgSeaSummit10 from '../assets/activities/gdg-sea-summit-2025/10.jpg'
import gdgSeaSummit11 from '../assets/activities/gdg-sea-summit-2025/11.jpg'
import gdgSeaSummit12 from '../assets/activities/gdg-sea-summit-2025/12.jpg'
import gdgSeaSummit13 from '../assets/activities/gdg-sea-summit-2025/13.jpg'
import gdgSeaSummit14 from '../assets/activities/gdg-sea-summit-2025/14.jpg'
import gdgSeaSummit15 from '../assets/activities/gdg-sea-summit-2025/15.jpg'
import gdgSeaSummit16 from '../assets/activities/gdg-sea-summit-2025/16.jpg'
import gdgSeaSummit17 from '../assets/activities/gdg-sea-summit-2025/17.jpg'
import gdgSeaSummit18 from '../assets/activities/gdg-sea-summit-2025/18.jpg'
import gdgSeaSummit19 from '../assets/activities/gdg-sea-summit-2025/19.jpg'

import sheCodesHackathonCover from '../assets/activities/shecodes-hackathon-2023/cover.jpg'
import sheCodesHackathon1 from '../assets/activities/shecodes-hackathon-2023/1.png'
import sheCodesHackathon2 from '../assets/activities/shecodes-hackathon-2023/2.jpg'
import sheCodesHackathon3 from '../assets/activities/shecodes-hackathon-2023/3.jpg'
import sheCodesHackathon4 from '../assets/activities/shecodes-hackathon-2023/4.jpg'
import sheCodesHackathon5 from '../assets/activities/shecodes-hackathon-2023/5.jpg'
import sheCodesHackathon6 from '../assets/activities/shecodes-hackathon-2023/6.jpg'

import sitiGroupCover from '../assets/activities/siti-group/cover.jpg'
import sitiGroup2 from '../assets/activities/siti-group/2.jpg'
import sitiGroup3 from '../assets/activities/siti-group/3.jpg'
import sitiGroup4 from '../assets/activities/siti-group/4.jpg'
import sitiGroup5 from '../assets/activities/siti-group/5.jpg'
import sitiGroup6 from '../assets/activities/siti-group/6.jpg'
import sitiGroup7 from '../assets/activities/siti-group/7.jpg'
import sitiGroup8 from '../assets/activities/siti-group/8.jpg'
import sitiGroup9 from '../assets/activities/siti-group/9.jpg'
import sitiGroup10 from '../assets/activities/siti-group/10.jpg'
import sitiGroup11 from '../assets/activities/siti-group/11.jpg'
import sitiGroup12 from '../assets/activities/siti-group/12.jpg'
import sitiGroup13 from '../assets/activities/siti-group/13.png'
import sitiGroup14 from '../assets/activities/siti-group/14.jpg'
import sitiGroup15 from '../assets/activities/siti-group/15.jpg'
import sitiGroup16 from '../assets/activities/siti-group/16.jpg'

type ActivityMedia = {
  image?: string
  images: string[]
}

const emptyActivityMedia: ActivityMedia = {
  image: undefined,
  images: [],
}

const activityMediaBySlug: Record<string, ActivityMedia> = {
  'gdg-cloud-core-team': {
    image: gdgCloudCoreTeamCover,
    images: [
      gdgCloudCoreTeamCover,
      gdgCloudCoreTeam1,
      gdgCloudCoreTeam2,
      gdgCloudCoreTeam3,
      gdgCloudCoreTeam4,
      gdgCloudCoreTeam5,
      gdgCloudCoreTeam6,
      gdgCloudCoreTeam7,
      gdgCloudCoreTeam8,
      gdgCloudCoreTeam9,
      gdgCloudCoreTeam10,
    ],
  },
  'gdg-sea-summit-2025': {
    image: gdgSeaSummitCover,
    images: [
      gdgSeaSummitCover,
      gdgSeaSummit1,
      gdgSeaSummit2,
      gdgSeaSummit3,
      gdgSeaSummit4,
      gdgSeaSummit5,
      gdgSeaSummit6,
      gdgSeaSummit7,
      gdgSeaSummit8,
      gdgSeaSummit9,
      gdgSeaSummit10,
      gdgSeaSummit11,
      gdgSeaSummit12,
      gdgSeaSummit13,
      gdgSeaSummit14,
      gdgSeaSummit15,
      gdgSeaSummit16,
      gdgSeaSummit17,
      gdgSeaSummit18,
      gdgSeaSummit19,
    ],
  },
  'shecodes-hackathon-2023': {
    image: sheCodesHackathonCover,
    images: [
      sheCodesHackathonCover,
      sheCodesHackathon1,
      sheCodesHackathon2,
      sheCodesHackathon3,
      sheCodesHackathon4,
      sheCodesHackathon5,
      sheCodesHackathon6,
    ],
  },
  'sitigroup-human-resources-logistics-journey': {
    image: sitiGroupCover,
    images: [
      sitiGroupCover,
      sitiGroup2,
      sitiGroup3,
      sitiGroup4,
      sitiGroup5,
      sitiGroup6,
      sitiGroup7,
      sitiGroup8,
      sitiGroup9,
      sitiGroup10,
      sitiGroup11,
      sitiGroup12,
      sitiGroup13,
      sitiGroup14,
      sitiGroup15,
      sitiGroup16,
    ],
  },
}

export function getActivityMedia(slug: string): ActivityMedia {
  return activityMediaBySlug[slug] ?? emptyActivityMedia
}
