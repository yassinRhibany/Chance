// src/data/sidebarItems.js
import { House, Lightning, GraphUp, Plus, ClockHistory, Wallet2 } from 'react-bootstrap-icons';
import { FaIndustry } from 'react-icons/fa';
import { FiBriefcase, FiUsers } from 'react-icons/fi';

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
    path: "/Admin/AdminAccountsPage",
    name: "ادارة المستخدمين",
    icon: <FiUsers  size={30} color="#97B152" className="me-0" style={{ margin: "0px 20px 0px" }} />
  },
   {
    path: "/Admin/AdminInvestmentPage",
    name: " عرض الفرص الأستثمارية",
    icon: <FiBriefcase size={30} color="#97B152" className="me-0" style={{ margin: "0px 20px 0px" }} />
  },
  {
    path: "/Admin/AdminFactories",
    name: "عرض  جميع المصانع",
    icon: <FaIndustry size={30} color="#97B152" className="me-0" style={{ margin: "0px 20px 0px" }} />
  },
 
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