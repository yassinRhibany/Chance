import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="container text-center mt-5">
      <h1 style={{ color: '#dc3545' }}>403 - غير مصرح بالوصول</h1>
      <p>ليس لديك الصلاحيات الكافية للوصول إلى هذه الصفحة</p>
      <Link to="/" className="btn btn-primary">
        العودة للصفحة الرئيسية
      </Link>
    </div>
  );
};
export default Unauthorized;