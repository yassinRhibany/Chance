import { Outlet } from 'react-router-dom';
import { ProtectedLayout } from './ProtectedLayout';

export const FactoryLayout = () => (
  <ProtectedLayout allowedRoles={[2]}>
    <div>
      {/* محتوى خاص بصاحب المصنع */}
      <Outlet />
    </div>
  </ProtectedLayout>
);