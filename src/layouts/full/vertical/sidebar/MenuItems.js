import { uniqueId } from 'lodash';

import {
  IconPoint,
  IconCalendar,
  IconTicket,
  IconList,
  IconUserCircle,
  IconLayoutDashboard,
  IconSchool,
  IconChartBar,
  IconAccessible,
  IconCirclePlus,
  IconCategory,
  IconBrandGoogleMaps,
  IconEdit,
  IconSettings2
} from '@tabler/icons-react';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Menu',
  },

  {
    id: uniqueId(),
    title: 'Tableau de bord',
    icon: IconLayoutDashboard,
    href: '/dashboards',

    chipColor: 'secondary',
  },
  {
    id: uniqueId(),
    title: 'Incidents',
    icon: IconAccessible,
    href: '/apps/ecommerce/',
    children: [
      
     
      {
        id: uniqueId(),
        title: 'Liste',
        icon: IconList,
        href: '/apps/Incident/list',
      },
      
      {
        id: uniqueId(),
        title: 'Ajouter',
        icon: IconCirclePlus,
        href: '/apps/Incident/add',
      },
    ],
  },
   
  {
    id: uniqueId(),
    title: 'Ecoles',
    icon: IconSchool,
    href: '/apps/ecommerce/',
    children: [
      
     
      {
        id: uniqueId(),
        title: 'Liste',
        icon: IconList,
        href: '/apps/ecommerce/eco-product-list',
      },
      
      {
        id: uniqueId(),
        title: 'Ajouter',
        icon: IconCirclePlus,
        href: '/apps/ecommerce/add-product',
      },
      {
        id: uniqueId(),
        title: 'Categorie',
        icon: IconCategory,
        href: '/apps/ecommerce/edit-product',
      },
      {
        id: uniqueId(),
        title: 'Region',
        icon: IconBrandGoogleMaps,
        href: '/apps/ecommerce/edit-product',
      },
      {
        id: uniqueId(),
        title: 'Modifier',
        icon: IconEdit,
        href: '/apps/ecommerce/edit-product',
      },
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
    title: 'Rapports',
    icon: IconChartBar,
    href: '/apps/tickets',
  },
 {
    id: uniqueId(),
    title: 'Utilisateurs',
    icon: IconUserCircle,
    href: '/user-profile',
    children: [
      {
        id: uniqueId(),
        title: 'Liste',
        icon: IconList,
        href: '/user-profile',
      },
      {
    id: uniqueId(),
    title: 'Parametres utilisateurs',
    icon: IconSettings2,
    href: '/pages/account-settings',
  },
    ],
  },

  

];

export default Menuitems;
