import { Outlet } from 'react-router-dom';
import { ProtectedLayout } from './ProtectedLayout';

export const AdminLayout = () => (
  <ProtectedLayout allowedRoles={[0]}>
    <div>
      {/* محتوى خاص بالمدير */}
      <Outlet />
    </div>
  </ProtectedLayout>
);