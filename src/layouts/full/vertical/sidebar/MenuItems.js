import { uniqueId } from 'lodash';

import {
  IconAward,
  IconBoxMultiple,
  IconPoint,
  IconAlertCircle,
  IconNotes,
  IconCalendar,
  IconMail,
  IconTicket,
  IconEdit,
  IconCurrencyDollar,
  IconApps,
  IconFileDescription,
  IconFileDots,
  IconFiles,
  IconBan,
  IconStar,
  IconMoodSmile,
  IconBorderAll,
  IconBorderHorizontal,
  IconBorderInner,
  IconBorderVertical,
  IconBorderTop,
  IconUserCircle,
  IconPackage,
  IconMessage2,
  IconBasket,
  IconChartLine,
  IconChartArcs,
  IconChartCandle,
  IconChartArea,
  IconChartDots,
  IconChartDonut3,
  IconChartRadar,
  IconLogin,
  IconUserPlus,
  IconRotate,
  IconBox,
  IconShoppingCart,
  IconAperture,
  IconLayout,
  IconSettings,
  IconHelp,
  IconZoomCode,
  IconBoxAlignBottom,
  IconBoxAlignLeft,
  IconBorderStyle2,
  IconAppWindow,
  IconNotebook,
  IconFileCheck,
  IconChartHistogram,
  IconChartPie2,
  IconChartScatter,
  IconChartPpf,
  IconChartArcs3,
  IconListTree,
} from '@tabler/icons-react';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Menu',
  },

  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconAperture,
    href: '/dashboards/modern',

    chipColor: 'secondary',
  },
 
  



 
  {
    id: uniqueId(),
    title: 'Incidents',
    icon: IconBasket,
    href: '/apps/ecommerce/',
    children: [
      
     
      {
        id: uniqueId(),
        title: 'Liste',
        icon: IconPoint,
        href: '/apps/Incident/list',
      },
      
      {
        id: uniqueId(),
        title: 'Ajouter',
        icon: IconPoint,
        href: '/apps/Incident/add',
      },
    ],
  },
   
  {
    id: uniqueId(),
    title: 'Schools',
    icon: IconBasket,
    href: '/apps/ecommerce/',
    children: [
      
     
      {
        id: uniqueId(),
        title: 'Liste',
        icon: IconPoint,
        href: '/apps/ecommerce/eco-product-list',
      },
      
      {
        id: uniqueId(),
        title: 'Ajouter',
        icon: IconPoint,
        href: '/apps/ecommerce/add-product',
      },
      {
        id: uniqueId(),
        title: 'Categorie',
        icon: IconPoint,
        href: '/apps/ecommerce/edit-product',
      },
      {
        id: uniqueId(),
        title: 'Region',
        icon: IconPoint,
        href: '/apps/ecommerce/edit-product',
      },
      {
        id: uniqueId(),
        title: 'Modifier',
        icon: IconPoint,
        href: '/apps/ecommerce/edit-product',
      },
    ],
  },
  
  {
    id: uniqueId(),
    title: 'Users',
    icon: IconUserCircle,
    href: '/user-profile',
    children: [
      {
        id: uniqueId(),
        title: 'Liste',
        icon: IconPoint,
        href: '/user-profile',
      }
    ],
  },
 
  {
    id: uniqueId(),
    title: 'Incidents par dates',
    icon: IconCalendar,
    href: '/apps/calendar',
  },
  {
    id: uniqueId(),
    title: 'Rapport',
    icon: IconTicket,
    href: '/apps/tickets',
  },


  {
    id: uniqueId(),
    title: 'Parametres utilisateurs',
    icon: IconUserCircle,
    href: '/pages/account-settings',
  },

];

export default Menuitems;
