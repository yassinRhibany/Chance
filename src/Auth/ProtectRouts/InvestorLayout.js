import { Outlet } from 'react-router-dom';
import { ProtectedLayout } from './ProtectedLayout';

export const InvestorLayout = () => (
  <ProtectedLayout allowedRoles={[1]}>
    <div>
      {/* محتوى خاص بالمستثمر */}
      <Outlet />
    </div>
  </ProtectedLayout>
);