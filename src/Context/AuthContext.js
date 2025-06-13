import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // دالة لتحويل رقم الدور إلى وصف
  const getRoleName = (roleNumber) => {
    switch(roleNumber) {
      case 0: return 'admin';
      case 1: return 'investor';
      case 2: return 'factory_owner';
      default: return null;
    }
  };

  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // دالة معدلة لتخزين بيانات المستخدم
  const updateUser = (userData) => {
    if (userData) {
      const userWithRole = {
        ...userData,
        role: userData.role, // نحتفظ بالقيمة الرقمية
        roleName: getRoleName(userData.role) // نضيف وصف نصي للدور
      };
      sessionStorage.setItem('user', JSON.stringify(userWithRole));
      setUser(userWithRole);
    } else {
      sessionStorage.removeItem('user');
      setUser(null);
    }
  };

  const value = {
    user,
    setUser: updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 0, // التحقق بالقيمة الرقمية
    isInvestor: user?.role === 1,
    isFactoryOwner: user?.role === 2,
    getRoleName // تصدير الدالة للاستخدام في المكونات الأخرى
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);



































































// import { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   // استعادة بيانات المستخدم من sessionStorage عند التحميل
//   const [user, setUser] = useState(() => {
//     const storedUser = sessionStorage.getItem('user');
//     return storedUser ? JSON.parse(storedUser) : null;
//   });

//   // دالة معدلة لتخزين بيانات المستخدم
//   const updateUser = (userData) => {
//     if (userData) {
//       sessionStorage.setItem('user', JSON.stringify(userData));
//       if (userData.token) {
//         sessionStorage.setItem('token', userData.token);
//       }
//     } else {
//       sessionStorage.removeItem('user');
//       sessionStorage.removeItem('token');
//     }
//     setUser(userData);
//   };

//   const value = {
//     user,
//     setUser: updateUser, // استخدام الدالة المعدلة
//     isAuthenticated: !!user,
//     isAdmin: user?.role === 'admin',
//     isInvestor: user?.role === 'investor',
//     isFactoryOwner: user?.role === 'factory_owner'
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);






































// import { createContext, useContext, useState } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
  
//   // تصدير setUser كجزء من القيمة
//   const value = {
//     user,
//     setUser, // أضفنا هذه السطر
//     isAuthenticated: !!user,
//     isAdmin: user?.role === 'admin',
//     isInvestor: user?.role === 'investor',
//     isFactoryOwner: user?.role === 'factory_owner'
//   };

//   return (
//     <AuthContext.Provider value={value}> {/* صححنا هنا من {{value}} إلى value */}
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);