import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { baseURL, LOGIN } from '../Api/Api';
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/loadscreen/Loading'
import Message from '../components/messag.js/message'
import { useSidebar } from '../Context/SidebarContext';
function LoginFormCustom() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [loadscreen, setloadscreen] = useState(false)
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [coler, setcoler] = useState('');

  // sidparTagel
  const { setIsSidebarOpen } = useSidebar();

  // استيراد setUser من الـ Context
  const { user, setUser } = useAuth();

  // console.log(useAuth)
  const primaryDark = '#393F4D';
  const accent = '#FEDA6A';
  const lightText = '#D4D4DC';


  // في ملف Login.js
useEffect(() => {
  if (user) {
    switch(user.role) {
      case 'admin': navigate('/admin/dashboard'); break;
      case 'investor': navigate('/investor/investment'); break;
      case 'factoryOwner': navigate('/factory/registration'); break;
      default: navigate('/');
    }
  }
}, [user]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    // console.log(form);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setloadscreen(true);
    try {
      let res = await axios.post(`${baseURL}/${LOGIN}`, form);
      setloadscreen(false);

      // تخزين بيانات المستخدم والتوكن
      const userData = {
        id: res.data.user.id,
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role,
        token: res.data.token,
      };

      setUser(userData); // سيتم التخزين تلقائياً عبر updateUser
      console.log(userData)
      setSuccessMessage('تم تسجيل الدخول بنجاح!');
      setcoler('#198754');
      setShowSuccess(true);

      // فتح السايدبار قبل الانتقال
      setIsSidebarOpen(true); // هذه السطر الجديد

      setTimeout(() => {
        navigate('/', { state: { openSidebar: true } });
      }, 3000);
      
    } catch (err) {
      setloadscreen(false);
      setSuccessMessage('خطا في تسجيل الدخول');
      setcoler('#DC3545');
      setShowSuccess(true);
      console.error('خطأ في تسجيل الدخول:', err);
    }
  }




  //   async function handleSubmit(e) {
  //     e.preventDefault();
  //     setloadscreen(true)
  //     try {

  //       let res = await axios.post(`${baseURL}/${LOGIN}`, form);
  //       setloadscreen(false)

  //       console.log('تم تسجيل الدخول بنجاح!')
  //       // عرض رسالة النجاح
  //       setSuccessMessage('تم تسجيل الدخول بنجاح!');
  //       setcoler('#198754');
  //       setShowSuccess(true);

  //       // console.log(res);
  //       // استخدام setUser لتحديث حالة المستخدم
  //       setUser({
  //         id: res.data.user.id,
  //         name: res.data.user.name,
  //         email: res.data.user.email,
  //         role: res.data.user.role,
  //         token: res.data.token,
  //       });



  //       setTimeout(() => {
  //          Navigate('/');
  //       }, 3000);

  //      onclick= {toggleSidebar}
  // // setIsSidebarOpen(true)
  //       // console.log(user)
  //       // التوجيه حسب الدور
  //       // switch(res.data.user.role) {
  //       //   case 'admin':
  //       //     Navigate('/admin/dashboard');
  //       //     break;
  //       //   case 'investor':
  //       //     Navigate('/investor/dashboard');
  //       //     break;
  //       //   case 'factory_owner':
  //       //     Navigate('/factory/dashboard');
  //       //     break;
  //       //   default:
  //       //     Navigate('/');
  //       // }
  //     } catch (err) {
  //       setloadscreen(false);
  //       setSuccessMessage('خطا في تسجيل الدخول');
  //       setcoler('#DC3545');
  //       setShowSuccess(true);
  //       console.error('خطأ في تسجيل الدخول:', err);

  //     }
  //   }

  return (
    <>
      {loadscreen ? <Loading /> : (
        <>
          {/* نضع مكون الرسالة خارج الـ Container الرئيسي */}
          {showSuccess && (
            <div style={{
              position: 'fixed',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9999,
              width: '100%',
              maxWidth: '600px',
              padding: '0 15px'
            }}>
              <Message
                coler={coler}
                show={showSuccess}
                message={successMessage}
                onClose={() => setShowSuccess(false)}
              />
            </div>
          )}

          <Container className="mt-5 text-end" dir="rtl" style={{
            backgroundColor: primaryDark,
            color: lightText,
            padding: '20px',
            borderRadius: '12px',
            maxWidth: '600px'
          }}>
            <Row className="justify-content-center">
              <Col md={6}>
                <h2 className="text-center mb-4" style={{ color: accent }}>تسجيل الدخول</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label style={{ color: lightText }}>البريد الإلكتروني</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="أدخل البريد الإلكتروني"
                      value={form.email}
                      onChange={handleChange}
                      required
                      style={{
                        backgroundColor: '#ffff',
                        // color: lightText, 
                        borderColor: '#555'
                      }}
                    />

                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Label style={{ color: lightText }}>كلمة المرور</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="أدخل كلمة المرور"
                      value={form.password}
                      onChange={handleChange}
                      required
                      style={{
                        backgroundColor: '#ffff',
                        // color: lightText, 
                        borderColor: '#555'
                      }}
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100"
                    style={{
                      backgroundColor: accent,
                      borderColor: accent,
                      color: primaryDark,
                      marginBottom: '15px'
                    }}
                  >
                    تسجيل الدخول
                  </Button>

                  <div className="text-center" style={{ color: lightText }}>
                    <a href="/forgot-password" style={{ color: accent }}>
                      نسيت كلمة المرور؟
                    </a>
                  </div>
                </Form>
                <div className="mt-4 text-center" style={{ color: lightText }}>
                  ليس لديك حساب؟{' '}
                  <a href="/register" style={{ color: accent }}>
                    إنشاء حساب جديد
                  </a>
                </div>
              </Col>
            </Row>
          </Container>
        </>
      )}
    </>
  );
}

export default LoginFormCustom;