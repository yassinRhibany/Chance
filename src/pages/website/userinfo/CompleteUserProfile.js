// import React, { useState, useEffect } from 'react';
// import { Container, Card, Row, Col, Spinner, Alert, Button, Form } from 'react-bootstrap';
// import axios from 'axios';
// import { useAuth } from '../../../Context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// const ProfilePage = () => {
//   const { user, getToken, logout } = useAuth();
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     password_confirmation: ''
//   });
//   const navigate = useNavigate();

//   // ألوان التصميم
//   const primaryColor = '#2A2C33';
//   const cardBackground = '#3A3D46';
//   const accentColor = '#FEDA6A';
//   const textColor = '#E0E1E6';
//   const mutedText = '#A0A2AA';

//   // جلب بيانات الملف الشخصي
//   const fetchProfile = async () => {
//     try {
//       setLoading(true);
//       setError('');
      
//       const token = getToken();
//       if (!token) {
//         logout();
//         navigate('/login');
//         return;
//       }

//       const response = await axios.get('http://127.0.0.1:8000/api/User/showProfile', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       const userData = response.data.user || response.data;
//       setProfile(userData);
//       setFormData({
//         name: userData.name,
//         email: userData.email,
//         password: '',
//         password_confirmation: ''
//       });
//     } catch (err) {
//       console.error('Error fetching profile:', err);
//       setError(err.response?.data?.message || 'حدث خطأ في جلب بيانات الملف الشخصي');
//       if (err.response?.status === 401) {
//         logout();
//         navigate('/login');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   // معالجة تغيير الحقول
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   // تحديث الملف الشخصي
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       setError('');

//       const token = getToken();
//       if (!token) {
//         logout();
//         navigate('/login');
//         return;
//       }

//       const dataToSend = {
//         name: formData.name,
//         email: formData.email,
//         _method: 'PUT'
//       };

//       if (formData.password) {
//         if (formData.password !== formData.password_confirmation) {
//           throw new Error('كلمة المرور غير متطابقة');
//         }
//         dataToSend.password = formData.password;
//         dataToSend.password_confirmation = formData.password_confirmation;
//       }

//       await axios.post('http://127.0.0.1:8000/api/User/updateProfile', dataToSend, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       setEditMode(false);
//       fetchProfile();
//       setError('');
//     } catch (err) {
//       console.error('Update error:', err);
//       setError(err.response?.data?.message || 'حدث خطأ أثناء تحديث البيانات');
//       if (err.response?.status === 401) {
//         logout();
//         navigate('/login');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && !profile) {
//     return (
//       <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
//         <Spinner animation="border" variant="warning" />
//       </Container>
//     );
//   }

//   if (error && !profile) {
//     return (
//       <Container className="py-5">
//         <Alert variant="danger">
//           {error}
//           <Button variant="link" onClick={() => navigate('/login')}>تسجيل الدخول</Button>
//         </Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container className="py-5" style={{ backgroundColor: primaryColor, minHeight: '100vh', color: textColor }}>
//       <Row className="justify-content-center">
//         <Col lg={8}>
//           <Card style={{ backgroundColor: cardBackground, border: 'none' }}>
//             <Card.Body>
//               <div className="d-flex justify-content-between align-items-center mb-4">
//                 <h2 style={{ color: accentColor }}>الملف الشخصي</h2>
//                 <Button 
//                   variant={editMode ? 'outline-secondary' : 'warning'} 
//                   onClick={() => setEditMode(!editMode)}
//                   style={{ color: editMode ? textColor : '#000' }}
//                 >
//                   {editMode ? 'إلغاء' : 'تعديل'}
//                 </Button>
//               </div>

//               {error && <Alert variant="danger">{error}</Alert>}

//               <Row>
//                 <Col md={4} className="text-center mb-4">
//                   <div 
//                     style={{
//                       width: '150px',
//                       height: '150px',
//                       borderRadius: '50%',
//                       backgroundColor: accentColor,
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       margin: '0 auto',
//                       fontSize: '4rem',
//                       color: primaryColor,
//                       fontWeight: 'bold'
//                     }}
//                   >
//                     {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
//                   </div>
//                   <h4 className="mt-3" style={{ color: accentColor }}>{profile?.name}</h4>
//                   <p style={{ color: mutedText }}>{profile?.email}</p>
//                   <p style={{ color: mutedText }}>الدور: {user?.roleName}</p>
//                 </Col>

//                 <Col md={8}>
//                   {editMode ? (
//                     <Form onSubmit={handleSubmit}>
//                       <Form.Group className="mb-3">
//                         <Form.Label style={{ color: textColor }}>الاسم الكامل</Form.Label>
//                         <Form.Control
//                           type="text"
//                           name="name"
//                           value={formData.name}
//                           onChange={handleInputChange}
//                           style={{ backgroundColor: primaryColor, color: textColor, borderColor: mutedText }}
//                         />
//                       </Form.Group>

//                       <Form.Group className="mb-3">
//                         <Form.Label style={{ color: textColor }}>البريد الإلكتروني</Form.Label>
//                         <Form.Control
//                           type="email"
//                           name="email"
//                           value={formData.email}
//                           onChange={handleInputChange}
//                           style={{ backgroundColor: primaryColor, color: textColor, borderColor: mutedText }}
//                         />
//                       </Form.Group>

//                       <Form.Group className="mb-3">
//                         <Form.Label style={{ color: textColor }}>كلمة المرور الجديدة</Form.Label>
//                         <Form.Control
//                           type="password"
//                           name="password"
//                           value={formData.password}
//                           onChange={handleInputChange}
//                           placeholder="اتركه فارغاً إذا لم ترغب في التغيير"
//                           style={{ backgroundColor: primaryColor, color: textColor, borderColor: mutedText }}
//                         />
//                       </Form.Group>

//                       <Form.Group className="mb-3">
//                         <Form.Label style={{ color: textColor }}>تأكيد كلمة المرور</Form.Label>
//                         <Form.Control
//                           type="password"
//                           name="password_confirmation"
//                           value={formData.password_confirmation}
//                           onChange={handleInputChange}
//                           style={{ backgroundColor: primaryColor, color: textColor, borderColor: mutedText }}
//                         />
//                       </Form.Group>

//                       <div className="d-flex justify-content-between">
//                         <Button 
//                           variant="warning" 
//                           type="submit" 
//                           disabled={loading}
//                         >
//                           {loading ? <Spinner size="sm" /> : 'حفظ التغييرات'}
//                         </Button>
//                         <Button 
//                           variant="outline-danger" 
//                           onClick={() => {
//                             logout();
//                             navigate('/login');
//                           }}
//                         >
//                           تسجيل الخروج
//                         </Button>
//                       </div>
//                     </Form>
//                   ) : (
//                     <div>
//                       <div className="mb-4">
//                         <h5 style={{ color: accentColor }}>معلومات الحساب</h5>
//                         <hr style={{ backgroundColor: mutedText }} />
//                         <p><strong style={{ color: mutedText }}>الاسم:</strong> {profile?.name}</p>
//                         <p><strong style={{ color: mutedText }}>البريد الإلكتروني:</strong> {profile?.email}</p>
//                         <p><strong style={{ color: mutedText }}>الدور:</strong> {user?.roleName}</p>
//                         <p><strong style={{ color: mutedText }}>تاريخ التسجيل:</strong> {new Date(profile?.created_at).toLocaleDateString()}</p>
//                       </div>

//                       <div>
//                         <h5 style={{ color: accentColor }}>النشاط</h5>
//                         <hr style={{ backgroundColor: mutedText }} />
//                         <p><strong style={{ color: mutedText }}>آخر تسجيل دخول:</strong> {profile?.last_login ? new Date(profile.last_login).toLocaleString() : 'غير معروف'}</p>
//                       </div>
//                     </div>
//                   )}
//                 </Col>
//               </Row>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default ProfilePage;