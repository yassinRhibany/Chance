// src/data/sidebarItems.js
import { House, Lightning, GraphUp, Plus, ClockHistory, Wallet2 } from 'react-bootstrap-icons';

// العناصر المشتركة بين جميع المستخدمين
const commonItems = [
  {
    path: "/",
    name: "الصفحة الرئيسية",
    icon: <House size={30} color="#97B152" className="me-0" style={{ margin: "0px 20px 0px" }} />
  },
  {
    path: "/about",
    name: "حول المنصة",
    icon: null
  },
  {
    path: "/contact",
    name: "اتصل بنا",
    icon: null
  }
];

// عناصر المدير
const adminItems = [
  {
    path: "/admin/dashboard",
    name: "لوحة التحكم",
    icon: <GraphUp size={30} color="#97B152" className="me-0" style={{ margin: "0px 20px 0px" }} />
  },
  {
    path: "/admin/users",
    name: "إدارة المستخدمين",
    icon: null
  }
];

// عناصر المستثمر
const investorItems = [
  {
    path: "/investor/investment",
    name: "فرص استثمارية",
    icon: <Lightning size={30} color="#97B152" className="me-0" style={{ margin: "0px 20px 0px" }} />
  },
  {
    path: "/investor/record",
    name: "سجل الاستثمار",
    icon: <GraphUp size={30} color="#97B152" className="me-0" style={{ margin: "0px 20px 0px" }} />
  },
  {
    path: "/investor/wallet",
    name: "المحفظة الإلكترونية",
    icon: <Wallet2 size={30} color="#97B152" className="me-0" style={{ margin: "0px 20px 0px" }} />
  },
  {
    path: "/investor/transactions",
    name: "السجل المالي",
    icon: <ClockHistory size={30} color="#97B152" className="me-0" style={{ margin: "0px 20px 0px" }} />
  }
];

// عناصر صاحب المصنع
const factoryOwnerItems = [
  // {
  //   path: "/factory/profile",
  //   name: "الملف الشخصي",
  //   icon: null
  // },
  {
    path: "/factory/wallet",
    name: "المحفظة الإلكترونية",
    icon: <Wallet2 size={30} color="#97B152" className="me-0" style={{ margin: "0px 20px 0px" }} />
  },
  {
    path: "/factory/registration",
    name: "إضافة مصنع",
    icon: <Plus size={30} color="#97B152" className="me-0" style={{ margin: "0px 20px 0px" }} />
  }
  
];

export const getSidebarItems = (role) => {
  let items = [...commonItems];
  
  switch(role) {
    case 0: items.push(...adminItems); break;
    case 1: items.push(...investorItems); break;
    case 2: items.push(...factoryOwnerItems); break;
    default: break;
  }
  
  return items;
};