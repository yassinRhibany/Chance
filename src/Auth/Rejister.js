import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { baseURL, REGISTER } from '../Api/Api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Message from '../components/messag.js/message'
import { useSidebar } from '../Context/SidebarContext';
import Loading from '../components/loadscreen/Loading'
function SignUpFormCustom() {
  const [form, SetForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "1" // القيمة الافتراضية
  });
  const navigate = useNavigate()
  const primaryDark = '#393F4D';
  const accent = '#FEDA6A';
  const lightText = '#D4D4DC';
  const { setIsSidebarOpen } = useSidebar();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [coler, setcoler] = useState('');
  const [loadscreen, setloadscreen] = useState(false)


  function handelChange(e) {
    SetForm({ ...form, [e.target.name]: e.target.value }); 
    
    console.log(form);
  }

  async function handelSubmit(e) {
    e.preventDefault();
    try {
      await axios.post(`http://127.0.0.1:8000/api/register`, form);
      console.log("success");
      // setIsSidebarOpen(true);
      setSuccessMessage('تم تسجيل انشاء الحساب بنجاح!');
      setcoler('#198754');
      setShowSuccess(true);
console.log(form)
      setTimeout(() => {
        navigate('/login', { state: { openSidebar: true } });
      }, 3000);

    } catch (err) {
      setloadscreen(false);
      setSuccessMessage('خطا في انشاء الحساب');
      setcoler('#DC3545');
      setShowSuccess(true);
      console.error('خطا في انشاء الحساب:', err);
    }
  }

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
          <Container className="mt-5 text-end" dir="rtl" style={{ backgroundColor: primaryDark, color: lightText, padding: '20px', borderRadius: '12px' }}>
            <Row className="justify-content-center">
              <Col md={6}>
                <h2 className="text-center mb-4" style={{ color: accent }}>إنشاء حساب</h2>
                <Form onSubmit={handelSubmit}>
                  {/* الحقول الأخرى كما هي */}
                  <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label style={{ color: lightText }}>اسم المستخدم</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="أدخل اسم المستخدم"
                      value={form.name}
                      onChange={handelChange}
                      required
                      style={{
                        backgroundColor: '#ffff',
                        //  color: lightText,
                        borderColor: '#555'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label style={{ color: lightText }}>البريد الإلكتروني</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="أدخل البريد الإلكتروني"
                      value={form.email}
                      onChange={handelChange}
                      required
                      style={{
                        backgroundColor: '#ffff',
                        // color: lightText,
                        borderColor: '#555'
                      }}
                    />
                    <Form.Text style={{ color: "red" }}>
                      لن نشارك بريدك الإلكتروني مع أي شخص آخر.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label style={{ color: lightText }}>كلمة المرور</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="أدخل كلمة المرور"
                      value={form.password}
                      onChange={handelChange}
                      required
                      style={{
                        backgroundColor: '#ffff',
                        //  color: lightText, 
                        borderColor: '#555'
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                    <Form.Label style={{ color: lightText }}>تأكيد كلمة المرور</Form.Label>
                    <Form.Control
                      type="password"
                      name="password_confirmation"
                      placeholder="أعد إدخال كلمة المرور"
                      onChange={handelChange}
                      value={form.password_confirmation}

                      required
                      style={{
                        backgroundColor: '#ffff',
                        //  color: lightText, 
                        borderColor: '#555'
                      }}
                    />
                  </Form.Group>

                  {/* حقل نوع الحساب في الأسفل */}
                  <Form.Group className="mb-4" controlId="formUserType">
                    <Form.Label style={{ color: lightText }}>نوع الحساب</Form.Label>
                    <Form.Select
                      name="role"
                      value={form.role}
                      onChange={handelChange}
                      required
                      style={{ backgroundColor: '#ffff', color: lightText, borderColor: '#555' }}
                    >
                      <option value="1">مستثمر</option>
                      <option value="2">صاحب عقار</option>
                    </Form.Select>
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100" style={{ backgroundColor: accent, borderColor: accent, color: primaryDark }}>
                    إنشاء حساب
                  </Button>
                </Form>
                <div className="mt-3 text-center" style={{ color: lightText }}>
                  لديك حساب بالفعل؟ <a href="/login" style={{ color: accent }}>تسجيل الدخول</a>
                </div>
              </Col>
            </Row>
          </Container>
        </>
      )}
    </>
  );
}

export default SignUpFormCustom;